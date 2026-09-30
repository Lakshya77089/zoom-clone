import { CalendarDays, Plus, Video } from "lucide-react";
import { ActionTile } from "@/components/dashboard/ActionTile";

interface MeetingActionsProps {
  creating: boolean;
  onNewMeeting: () => void;
  onJoin: () => void;
  onSchedule: () => void;
}

export function MeetingActions({ creating, onNewMeeting, onJoin, onSchedule }: MeetingActionsProps) {
  return (
    <div className="flex justify-center gap-4 sm:gap-8" role="group" aria-label="Meeting actions">
      <ActionTile label="New meeting" icon={Video} tone="orange" onClick={onNewMeeting} busy={creating} testId="new-meeting-button" />
      <ActionTile label="Join" icon={Plus} tone="blue" onClick={onJoin} testId="join-meeting-button" />
      <ActionTile label="Schedule" icon={CalendarDays} tone="blue" onClick={onSchedule} testId="schedule-meeting-button" />
    </div>
  );
}
