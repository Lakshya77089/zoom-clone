"use client";

import { useEffect, useState } from "react";

interface LocalMediaOptions {
  audioEnabled: boolean;
  videoEnabled: boolean;
}

const UNAVAILABLE_MESSAGE = "Camera and microphone are unavailable. Check your browser permissions.";

const CONSTRAINT_FALLBACKS: MediaStreamConstraints[] = [
  { video: true, audio: true },
  { audio: true },
  { video: true },
];

async function requestMedia(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error(UNAVAILABLE_MESSAGE);
  for (const constraints of CONSTRAINT_FALLBACKS) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch {}
  }
  throw new Error(UNAVAILABLE_MESSAGE);
}

export function useLocalMedia({ audioEnabled, videoEnabled }: LocalMediaOptions) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let acquired: MediaStream | null = null;

    requestMedia()
      .then((media) => {
        acquired = media;
        if (active) setStream(media);
        else media.getTracks().forEach((track) => track.stop());
      })
      .catch(() => {
        if (active) setError(UNAVAILABLE_MESSAGE);
      });

    return () => {
      active = false;
      acquired?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    stream?.getAudioTracks().forEach((track) => (track.enabled = audioEnabled));
  }, [stream, audioEnabled]);

  useEffect(() => {
    stream?.getVideoTracks().forEach((track) => (track.enabled = videoEnabled));
  }, [stream, videoEnabled]);

  return { stream, error };
}
