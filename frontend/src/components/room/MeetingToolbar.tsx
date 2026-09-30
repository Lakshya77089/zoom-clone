import { Users } from "lucide-react";
import { LeaveMenu } from "@/components/room/LeaveMenu";
import { MediaIconButton } from "@/components/room/MediaIconButton";
import { MoreMenu } from "@/components/room/MoreMenu";
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
  onCopyLink: () => void;
  onCopyInvitation: () => void;
  onCopyMeetingId: () => void;
  onMuteAll: () => void;
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
  onCopyLink,
  onCopyInvitation,
  onCopyMeetingId,
  onMuteAll,
  onLeave,
  onEndForAll,
}: MeetingToolbarProps) {
  return (
    <footer
      className="relative z-30 flex h-16 shrink-0 items-center gap-1 bg-room-bar px-1.5 pb-[env(safe-area-inset-bottom)] sm:px-3"
      aria-label="Meeting controls"
      data-testid="meeting-toolbar"
    >
      <div className="flex items-center">
        <MediaIconButton kind="audio" enabled={!isMuted} onToggle={onToggleMute} />
        <MediaIconButton kind="video" enabled={isVideoOn} onToggle={onToggleVideo} />
      </div>

      <div className="flex flex-1 items-center justify-center gap-1">
        <ToolbarButton
          label="Participants"
          icon={Users}
          badge={participantCount}
          active={participantsOpen}
          onClick={onToggleParticipants}
          testId="participants-button"
        />
        <MoreMenu
          isHost={isHost}
          onCopyLink={onCopyLink}
          onCopyInvitation={onCopyInvitation}
          onCopyMeetingId={onCopyMeetingId}
          onMuteAll={onMuteAll}
        />
      </div>

      <LeaveMenu isHost={isHost} onLeave={onLeave} onEndForAll={onEndForAll} />
    </footer>
  );
}
