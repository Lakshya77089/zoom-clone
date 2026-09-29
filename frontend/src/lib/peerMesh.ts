import { api } from "@/lib/api";
import type { Signal, SignalKind } from "@/types";

const SIGNAL_POLL_MS = 700;
const CONNECT_TIMEOUT_MS = 20_000;
const RECONNECT_DELAY_MS = 1_000;
const MEDIA_KINDS = ["audio", "video"] as const;

export type PeerStatus = "connecting" | "connected" | "failed";

export interface MeshState {
  streams: Map<number, MediaStream>;
  statuses: Map<number, PeerStatus>;
}

interface Peer {
  pc: RTCPeerConnection;
  stream: MediaStream;
  pendingCandidates: RTCIceCandidateInit[];
}

export class PeerMesh {
  private peers = new Map<number, Peer>();
  private wanted = new Set<number>();
  private connected = new Set<number>();
  private failures = new Map<number, number>();
  private greeted = false;
  private localStream: MediaStream | null = null;
  private cursor = 0;
  private pollTimer: number | undefined;
  private stopped = false;

  constructor(
    private readonly code: string,
    private readonly selfId: number,
    private readonly configuration: RTCConfiguration,
    private readonly onChange: (state: MeshState) => void,
  ) {}

  start(): void {
    void this.poll();
  }

  stop(): void {
    this.stopped = true;
    window.clearTimeout(this.pollTimer);
    for (const id of [...this.peers.keys()]) this.closePeer(id);
  }

  setLocalStream(stream: MediaStream | null): void {
    this.localStream = stream;
    for (const { pc } of this.peers.values()) this.attachLocalTracks(pc);
  }

  setParticipants(ids: number[]): void {
    this.wanted = new Set(ids.filter((id) => id !== this.selfId));
    let changed = false;
    for (const id of [...this.peers.keys()]) {
      if (!this.wanted.has(id)) {
        this.closePeer(id);
        this.failures.delete(id);
        changed = true;
      }
    }
    if (changed) this.emit();

    for (const id of this.wanted) {
      if (this.isCaller(id) && !this.peers.has(id)) void this.call(id);
    }

    if (!this.greeted) {
      this.greeted = true;
      for (const id of this.wanted) {
        if (!this.isCaller(id)) void this.send(id, "hello").catch(() => undefined);
      }
    }
  }

  private isCaller(peerId: number): boolean {
    return this.selfId > peerId;
  }

  private async poll(): Promise<void> {
    try {
      const signals = await api.receiveSignals(this.code, this.selfId, this.cursor);
      for (const signal of signals) {
        if (this.stopped) return;
        this.cursor = signal.id;
        await this.handle(signal).catch(() => undefined);
      }
    } catch {}
    if (!this.stopped) this.pollTimer = window.setTimeout(() => void this.poll(), SIGNAL_POLL_MS);
  }

  private async handle(signal: Signal): Promise<void> {
    const peerId = signal.sender_id;
    if (signal.kind === "hello" || signal.kind === "offer") this.wanted.add(peerId);

    if (signal.kind === "hello") {
      if (this.isCaller(peerId)) {
        this.closePeer(peerId);
        await this.call(peerId);
      }
      return;
    }

    if (signal.kind === "offer") {
      this.abandon(peerId);
      const { pc } = this.createPeer(peerId);
      this.emit();
      await pc.setRemoteDescription(signal.payload as unknown as RTCSessionDescriptionInit);
      this.attachLocalTracks(pc);
      await pc.setLocalDescription(await pc.createAnswer());
      await this.send(peerId, "answer", pc.localDescription?.toJSON());
      await this.flushCandidates(peerId);
      return;
    }

    const peer = this.peers.get(peerId);
    if (!peer) return;

    if (signal.kind === "answer") {
      if (peer.pc.signalingState !== "have-local-offer") return;
      await peer.pc.setRemoteDescription(signal.payload as unknown as RTCSessionDescriptionInit);
      await this.flushCandidates(peerId);
      return;
    }

    const candidate = signal.payload as RTCIceCandidateInit;
    if (peer.pc.remoteDescription) await peer.pc.addIceCandidate(candidate).catch(() => undefined);
    else peer.pendingCandidates.push(candidate);
  }

  private async call(peerId: number): Promise<void> {
    const { pc } = this.createPeer(peerId);
    this.emit();
    for (const kind of MEDIA_KINDS) pc.addTransceiver(kind, { direction: "sendrecv" });
    this.attachLocalTracks(pc);
    await pc.setLocalDescription(await pc.createOffer());
    await this.send(peerId, "offer", pc.localDescription?.toJSON()).catch(() => undefined);

    window.setTimeout(() => {
      if (this.stopped || this.peers.get(peerId)?.pc !== pc || pc.connectionState === "connected") return;
      this.abandon(peerId);
      this.emit();
      if (this.wanted.has(peerId)) void this.call(peerId);
    }, CONNECT_TIMEOUT_MS);
  }

  private createPeer(peerId: number): Peer {
    const pc = new RTCPeerConnection(this.configuration);
    const peer: Peer = { pc, stream: new MediaStream(), pendingCandidates: [] };
    this.peers.set(peerId, peer);

    pc.onicecandidate = (event) => {
      if (event.candidate) void this.send(peerId, "candidate", event.candidate.toJSON()).catch(() => undefined);
    };

    pc.ontrack = (event) => {
      if (this.peers.get(peerId) !== peer) return;
      const others = peer.stream.getTracks().filter((track) => track.kind !== event.track.kind);
      peer.stream = new MediaStream([...others, event.track]);
      this.emit();
    };

    pc.onconnectionstatechange = () => {
      if (this.peers.get(peerId) !== peer) return;
      if (pc.connectionState === "connected") {
        this.connected.add(peerId);
        this.failures.delete(peerId);
        this.emit();
        return;
      }
      if (pc.connectionState === "disconnected") {
        this.connected.delete(peerId);
        this.emit();
        return;
      }
      if (pc.connectionState !== "failed") return;
      this.abandon(peerId);
      this.emit();
      if (this.isCaller(peerId)) {
        window.setTimeout(() => {
          if (!this.stopped && this.wanted.has(peerId) && !this.peers.has(peerId)) void this.call(peerId);
        }, RECONNECT_DELAY_MS);
      }
    };

    return peer;
  }

  private attachLocalTracks(pc: RTCPeerConnection): void {
    if (pc.signalingState === "closed") return;
    for (const transceiver of pc.getTransceivers()) {
      const kind = transceiver.receiver.track.kind;
      const track = this.localStream?.getTracks().find((t) => t.kind === kind) ?? null;
      if (transceiver.sender.track !== track) void transceiver.sender.replaceTrack(track).catch(() => undefined);
      if (transceiver.direction !== "sendrecv") transceiver.direction = "sendrecv";
    }
  }

  private async flushCandidates(peerId: number): Promise<void> {
    const peer = this.peers.get(peerId);
    if (!peer) return;
    const queued = peer.pendingCandidates.splice(0);
    for (const candidate of queued) await peer.pc.addIceCandidate(candidate).catch(() => undefined);
  }

  private abandon(peerId: number): void {
    if (this.peers.has(peerId) && !this.connected.has(peerId)) {
      this.failures.set(peerId, (this.failures.get(peerId) ?? 0) + 1);
    }
    this.closePeer(peerId);
  }

  private closePeer(peerId: number): void {
    const peer = this.peers.get(peerId);
    this.connected.delete(peerId);
    if (!peer) return;
    this.peers.delete(peerId);
    peer.pc.onicecandidate = null;
    peer.pc.ontrack = null;
    peer.pc.onconnectionstatechange = null;
    peer.pc.close();
  }

  private status(peerId: number): PeerStatus {
    if (this.connected.has(peerId)) return "connected";
    return (this.failures.get(peerId) ?? 0) > 0 ? "failed" : "connecting";
  }

  private send(peerId: number, kind: SignalKind, payload: object = {}) {
    return api.sendSignal(this.code, this.selfId, peerId, kind, payload);
  }

  private emit(): void {
    const streams = new Map<number, MediaStream>();
    const statuses = new Map<number, PeerStatus>();
    for (const id of this.wanted) {
      const peer = this.peers.get(id);
      if (peer) streams.set(id, peer.stream);
      statuses.set(id, this.status(id));
    }
    this.onChange({ streams, statuses });
  }
}
