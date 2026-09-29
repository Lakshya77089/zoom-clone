import { MicOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StreamVideo } from "@/components/room/StreamVideo";
import type { Participant } from "@/types";

interface VideoTileProps {
  participant: Participant;
  isSelf: boolean;
  stream: MediaStream | null;
}

export function VideoTile({ participant, isSelf, stream }: VideoTileProps) {
  const hasVideo = (stream?.getVideoTracks().length ?? 0) > 0;
  const showVideo = stream && hasVideo && participant.is_video_on;

  return (
    <div
      className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-lg bg-room-tile"
      data-testid="video-tile"
      data-participant-id={participant.id}
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
      {!isSelf && !stream && (
        <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[11px] text-white/80">Connecting...</span>
      )}
    </div>
  );
}
