import { VideoTile } from "@/components/room/VideoTile";
import type { RemoteStreams } from "@/lib/peerMesh";
import type { Participant } from "@/types";

interface VideoGridProps {
  participants: Participant[];
  selfId: number;
  localStream: MediaStream | null;
  remoteStreams: RemoteStreams;
}

function gridClass(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  if (count <= 4) return "grid-cols-2";
  if (count <= 9) return "grid-cols-2 md:grid-cols-3";
  return "grid-cols-3 md:grid-cols-4";
}

export function VideoGrid({ participants, selfId, localStream, remoteStreams }: VideoGridProps) {
  const ordered = [...participants].sort((a, b) => Number(b.id === selfId) - Number(a.id === selfId));

  return (
    <div className={`grid h-full auto-rows-fr gap-2 p-2 sm:p-3 ${gridClass(ordered.length)}`}>
      {ordered.map((participant) => {
        const isSelf = participant.id === selfId;
        return (
          <VideoTile
            key={participant.id}
            participant={participant}
            isSelf={isSelf}
            stream={isSelf ? localStream : (remoteStreams.get(participant.id) ?? null)}
          />
        );
      })}
    </div>
  );
}
