import { MicOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
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
      className="relative flex aspect-video w-[min(100cqw,calc(100cqh*16/9))] items-center justify-center overflow-hidden rounded-xl bg-room-tile"
      data-testid="video-tile"
      data-participant-id={participant.id}
      data-muted={participant.is_muted}
      data-video={participant.is_video_on}
    >
      {showVideo ? (
        <StreamVideo stream={stream} mirrored={isSelf} />
      ) : (
        <Avatar name={participant.display_name} size="lg" />
      )}
      <div className="absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-xs text-white">
        {participant.is_muted && <MicOff size={12} className="shrink-0 text-zoom-red" aria-label="Muted" />}
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
