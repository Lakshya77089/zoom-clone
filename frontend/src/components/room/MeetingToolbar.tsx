import { AppWindow, ArrowUp, Circle, MessageCircle, SmilePlus, Users } from "lucide-react";
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

const shareGlyph = (
  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-[#1faa59]">
    <ArrowUp size={15} strokeWidth={2.75} />
  </span>
);

const recordGlyph = (
  <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.75px] border-white">
    <Circle size={9} fill="currentColor" strokeWidth={0} />
  </span>
);

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
      className="relative z-30 flex h-16 shrink-0 items-center gap-1 bg-room-bar px-1 pb-[env(safe-area-inset-bottom)] sm:px-2"
      aria-label="Meeting controls"
      data-testid="meeting-toolbar"
    >
      <div className="flex items-center">
        <MediaIconButton kind="audio" enabled={!isMuted} onToggle={onToggleMute} />
        <MediaIconButton kind="video" enabled={isVideoOn} onToggle={onToggleVideo} />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5">
        <ToolbarButton
          label="Participants"
          icon={Users}
          badge={participantCount}
          active={participantsOpen}
          onClick={onToggleParticipants}
          testId="participants-button"
        />
        <ToolbarButton label="Chat" icon={MessageCircle} disabled className="hidden md:flex" />
        <ToolbarButton label="React" icon={SmilePlus} disabled className="hidden md:flex" />
        <ToolbarButton label="Share" glyph={shareGlyph} disabled className="hidden md:flex" />
        <ToolbarButton label="Record" glyph={recordGlyph} disabled className="hidden lg:flex" />
        <ToolbarButton label="Apps" icon={AppWindow} disabled className="hidden lg:flex" />
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
