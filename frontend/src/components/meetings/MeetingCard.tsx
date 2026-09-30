"use client";

import { Hash, Link2, Mail, Trash2, Users, Video } from "lucide-react";
import { MeetingMoreMenu } from "@/components/meetings/MeetingMoreMenu";
import { Button } from "@/components/ui/Button";
import type { MenuItem } from "@/components/ui/Menu";
import { useCopyWithToast } from "@/hooks/useCopyWithToast";
import { buildInvitation, formatDayLabel, formatDuration, formatTime, formatTimeRange, minutesBetween } from "@/lib/format";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface MeetingCardProps {
  meeting: Meeting;
  variant: "upcoming" | "recent";
  starting: boolean;
  onStart: (meeting: Meeting) => void;
  onDelete?: (meeting: Meeting) => void;
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-zoom-green/15 px-1.5 py-px text-[11px] font-semibold text-zoom-green-dark">
      <span className="h-1.5 w-1.5 rounded-full bg-zoom-green-dark" />
      In progress
    </span>
  );
}

function recentDuration(meeting: Meeting): number | null {
  const startedAt = meeting.started_at ?? meeting.created_at;
  return meeting.ended_at ? minutesBetween(startedAt, meeting.ended_at) : null;
}

export function MeetingCard({ meeting, variant, starting, onStart, onDelete }: MeetingCardProps) {
  const copy = useCopyWithToast();
  const isLive = meeting.status === "live";
  const isUpcoming = variant === "upcoming";
  const meetingId = formatMeetingCode(meeting.meeting_code);
  const startedAt = meeting.started_at ?? meeting.created_at;
  const duration = isUpcoming ? meeting.duration_minutes : recentDuration(meeting);

  const menuItems: MenuItem[] = [
    ...(isUpcoming || isLive
      ? [
          { label: "Copy invitation", icon: Mail, onSelect: () => void copy(buildInvitation(meeting), "Invitation copied to clipboard") },
          { label: "Copy invite link", icon: Link2, onSelect: () => void copy(meeting.invite_link, "Invite link copied"), testId: "copy-invite-link" },
        ]
      : []),
    { label: "Copy meeting ID", icon: Hash, onSelect: () => void copy(meeting.meeting_code, "Meeting ID copied") },
    ...(isUpcoming && !isLive && onDelete
      ? [{ label: "Delete", icon: Trash2, danger: true, onSelect: () => onDelete(meeting), testId: "delete-meeting" }]
      : []),
  ];

  const primaryLabel = isUpcoming ? (isLive ? "Join" : "Start") : "Rejoin";
  const showPrimary = isUpcoming || isLive;

  return (
    <li
      className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-hover/70 sm:gap-4 sm:px-5"
      data-testid={isUpcoming ? "upcoming-meeting" : "recent-meeting"}
      data-meeting-code={meeting.meeting_code}
    >
      {!isUpcoming && (
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zoom-blue-light text-zoom-blue sm:flex">
          <Video size={19} />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-muted">
          {isUpcoming && meeting.scheduled_start ? (
            <span className="font-medium text-ink">{formatTimeRange(meeting.scheduled_start, meeting.scheduled_end)}</span>
          ) : (
            <span>
              {formatDayLabel(startedAt)}, {formatTime(startedAt)}
            </span>
          )}
          {isLive && <LiveBadge />}
        </p>
        <p className="mt-0.5 truncate text-[15px] font-semibold text-ink" data-testid="meeting-title">
          {meeting.title}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[13px] text-ink-muted">
          <span>Meeting ID: {meetingId}</span>
          {duration !== null && (
            <span className="whitespace-nowrap">
              <span aria-hidden>· </span>
              {formatDuration(duration)}
            </span>
          )}
          {!isUpcoming && (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <span aria-hidden>·</span>
              <Users size={13} aria-label="Participants" />
              {meeting.participant_count}
            </span>
          )}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {showPrimary ? (
          <Button size="sm" onClick={() => onStart(meeting)} loading={starting} data-testid="meeting-start-button">
            {primaryLabel}
          </Button>
        ) : (
          <span className="px-2 text-[13px] text-ink-muted">Ended</span>
        )}
        <MeetingMoreMenu title={meeting.title} items={menuItems} />
      </div>
    </li>
  );
}
