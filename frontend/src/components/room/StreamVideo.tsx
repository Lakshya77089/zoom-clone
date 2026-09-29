"use client";

import { useEffect, useRef } from "react";

interface StreamVideoProps {
  stream: MediaStream;
  mirrored?: boolean;
  className?: string;
}

export function StreamVideo({ stream, mirrored = false, className = "" }: StreamVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={`h-full w-full object-cover ${mirrored ? "-scale-x-100" : ""} ${className}`}
    />
  );
}
