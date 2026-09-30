import { ChevronDown } from "lucide-react";
import { ActionTile } from "@/components/dashboard/ActionTile";
import { JoinIcon, NewMeetingIcon, ScheduleIcon } from "@/components/dashboard/TileIcons";

interface MeetingActionsProps {
  creating: boolean;
  onNewMeeting: () => void;
  onJoin: () => void;
  onSchedule: () => void;
}

export function MeetingActions({ creating, onNewMeeting, onJoin, onSchedule }: MeetingActionsProps) {
  return (
    <div className="flex justify-center gap-[clamp(28px,9vw,60px)]" role="group" aria-label="Meeting actions">
      <ActionTile
        label="New meeting"
        icon={NewMeetingIcon}
        tone="orange"
        onClick={onNewMeeting}
        busy={creating}
        testId="new-meeting-button"
        trailing={<ChevronDown size={13} className="text-ink-faint" aria-hidden />}
      />
      <ActionTile label="Join" icon={JoinIcon} tone="blue" onClick={onJoin} testId="join-meeting-button" />
      <ActionTile label="Schedule" icon={ScheduleIcon} tone="blue" onClick={onSchedule} testId="schedule-meeting-button" />
    </div>
  );
}
