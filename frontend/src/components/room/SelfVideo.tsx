"use client";

import { useEffect, useRef } from "react";

interface SelfVideoProps {
  stream: MediaStream;
  className?: string;
}

export function SelfVideo({ stream, className = "" }: SelfVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full -scale-x-100 object-cover ${className}`} />;
}
