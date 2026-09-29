import { Circle, MessageSquare, ScreenShare, SmilePlus, Users } from "lucide-react";
import { LeaveMenu } from "@/components/room/LeaveMenu";
import { MediaIconButton } from "@/components/room/MediaIconButton";
import { ToolbarButton } from "@/components/room/ToolbarButton";

interface MeetingToolbarProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isHost: boolean;
  participantCount: number;
  participantsOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleParticipants: () => void;
  onLeave: () => void;
  onEndForAll: () => void;
}

export function MeetingToolbar({
  isMuted,
  isVideoOn,
  isHost,
  participantCount,
  participantsOpen,
  onToggleMute,
  onToggleVideo,
  onToggleParticipants,
  onLeave,
  onEndForAll,
}: MeetingToolbarProps) {
  return (
    <footer className="flex h-16 shrink-0 items-center gap-2 bg-room-bar px-2 sm:px-4">
      <div className="flex items-center">
        <MediaIconButton kind="audio" enabled={!isMuted} onToggle={onToggleMute} />
        <MediaIconButton kind="video" enabled={isVideoOn} onToggle={onToggleVideo} />
      </div>

      <div className="flex flex-1 items-center justify-center overflow-x-auto">
        <ToolbarButton
          label="Participants"
          icon={Users}
          badge={participantCount}
          active={participantsOpen}
          onClick={onToggleParticipants}
        />
        <ToolbarButton label="Chat" icon={MessageSquare} disabled className="hidden sm:flex" />
        <ToolbarButton label="Share Screen" icon={ScreenShare} disabled className="hidden sm:flex" />
        <ToolbarButton label="Record" icon={Circle} disabled className="hidden md:flex" />
        <ToolbarButton label="Reactions" icon={SmilePlus} disabled className="hidden md:flex" />
      </div>

      <LeaveMenu isHost={isHost} onLeave={onLeave} onEndForAll={onEndForAll} />
    </footer>
  );
}
