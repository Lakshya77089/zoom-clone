"use client";

import { useEffect, useRef } from "react";

interface RemoteAudioProps {
  stream: MediaStream;
  participantId: number;
}

export function RemoteAudio({ stream, participantId }: RemoteAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.srcObject = stream;

    const resume = () => void audio.play().catch(() => undefined);
    audio.play().catch(() => document.addEventListener("pointerdown", resume, { once: true }));
    return () => document.removeEventListener("pointerdown", resume);
  }, [stream]);

  return <audio ref={audioRef} autoPlay data-testid={`remote-audio-${participantId}`} />;
}
