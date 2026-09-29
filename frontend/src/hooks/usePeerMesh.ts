"use client";

import { useEffect, useRef, useState } from "react";
import { PeerMesh, type RemoteStreams } from "@/lib/peerMesh";

export function usePeerMesh(code: string, selfId: number, participantIds: number[], localStream: MediaStream | null) {
  const [streams, setStreams] = useState<RemoteStreams>(() => new Map());
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
    const mesh = new PeerMesh(code, selfId, setStreams);
    meshRef.current = mesh;
    mesh.setLocalStream(localRef.current);
    mesh.setParticipants(idsRef.current);
    mesh.start();
    return () => {
      mesh.stop();
      meshRef.current = null;
    };
  }, [code, selfId]);

  return streams;
}
