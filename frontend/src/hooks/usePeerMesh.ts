"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { PeerMesh, type MeshState } from "@/lib/peerMesh";
import { FALLBACK_RTC_CONFIGURATION, toRtcConfiguration } from "@/lib/rtc";

const EMPTY_STATE: MeshState = { streams: new Map(), statuses: new Map() };

export function usePeerMesh(code: string, selfId: number, participantIds: number[], localStream: MediaStream | null) {
  const [state, setState] = useState<MeshState>(EMPTY_STATE);
  const meshRef = useRef<PeerMesh | null>(null);
  const idsRef = useRef<number[]>([]);
  const localRef = useRef<MediaStream | null>(null);
  const idsKey = participantIds.join(",");

  useEffect(() => {
    idsRef.current = idsKey ? idsKey.split(",").map(Number) : [];
    meshRef.current?.setParticipants(idsRef.current);
  }, [idsKey]);

  useEffect(() => {
    localRef.current = localStream;
    meshRef.current?.setLocalStream(localStream);
  }, [localStream]);

  useEffect(() => {
    let mesh: PeerMesh | null = null;
    let cancelled = false;

    api
      .getRtcConfig()
      .then(toRtcConfiguration, () => FALLBACK_RTC_CONFIGURATION)
      .then((configuration) => {
        if (cancelled) return;
        mesh = new PeerMesh(code, selfId, configuration, setState);
        meshRef.current = mesh;
        mesh.setLocalStream(localRef.current);
        mesh.setParticipants(idsRef.current);
        mesh.start();
      });

    return () => {
      cancelled = true;
      mesh?.stop();
      meshRef.current = null;
    };
  }, [code, selfId]);

  return state;
}
