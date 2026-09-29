import { MicOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { SelfVideo } from "@/components/room/SelfVideo";
import type { Participant } from "@/types";

interface VideoTileProps {
  participant: Participant;
  isSelf: boolean;
  stream: MediaStream | null;
}

export function VideoTile({ participant, isSelf, stream }: VideoTileProps) {
  const showVideo = isSelf && stream && participant.is_video_on;

  return (
    <div
      className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-lg bg-room-tile"
      data-testid="video-tile"
    >
      {showVideo ? (
        <SelfVideo stream={stream} />
      ) : (
        <Avatar name={participant.display_name} size="lg" />
      )}
      <div className="absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded bg-black/60 px-2 py-1 text-xs text-white">
        {participant.is_muted && <MicOff size={12} className="shrink-0 text-zoom-red" aria-label="Muted" />}
        <span className="truncate">{participant.display_name}</span>
      </div>
    </div>
  );
}
