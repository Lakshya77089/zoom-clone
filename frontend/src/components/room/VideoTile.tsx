import { Mic, MicOff } from "lucide-react";
import { StreamVideo } from "@/components/room/StreamVideo";
import type { PeerStatus } from "@/lib/peerMesh";
import type { Participant } from "@/types";

interface VideoTileProps {
  participant: Participant;
  isSelf: boolean;
  stream: MediaStream | null;
  status?: PeerStatus;
}

const statusLabels: Record<Exclude<PeerStatus, "connected">, string> = {
  connecting: "Connecting...",
  failed: "Can't connect. Retrying...",
};

export function VideoTile({ participant, isSelf, stream, status = "connecting" }: VideoTileProps) {
  const hasVideo = (stream?.getVideoTracks().length ?? 0) > 0;
  const isLive = isSelf || status === "connected";
  const showVideo = stream && hasVideo && participant.is_video_on && isLive;

  return (
    <div
      className="relative flex aspect-video w-[min(100cqw,calc(100cqh*16/9))] items-center justify-center overflow-hidden rounded-lg bg-room-tile [container-type:inline-size]"
      data-testid="video-tile"
      data-participant-id={participant.id}
      data-muted={participant.is_muted}
      data-video={participant.is_video_on}
    >
      {showVideo ? (
        <StreamVideo stream={stream} mirrored={isSelf} />
      ) : (
        <p className="max-w-[85%] truncate text-[clamp(16px,6cqw,40px)] font-semibold leading-tight text-white">{participant.display_name}</p>
      )}
      <div className="absolute bottom-1 left-1 flex max-w-[calc(100%-0.5rem)] items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-xs leading-4 text-white">
        {participant.is_muted ? (
          <MicOff size={12} className="shrink-0 text-zoom-red" aria-label="Muted" />
        ) : (
          <Mic size={12} className="shrink-0" aria-hidden />
        )}
        <span className="truncate">{participant.display_name}</span>
      </div>
      {!isLive && (
        <span
          className={`absolute right-2 top-2 rounded px-2 py-0.5 text-[11px] ${
            status === "failed" ? "bg-zoom-red/90 text-white" : "bg-black/60 text-white/80"
          }`}
          data-testid="peer-status"
        >
          {statusLabels[status as Exclude<PeerStatus, "connected">]}
        </span>
      )}
    </div>
  );
}
