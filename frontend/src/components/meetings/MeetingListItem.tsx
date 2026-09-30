import { formatDayLabel, formatDuration, formatTime, formatTimeRange } from "@/lib/format";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface MeetingListItemProps {
  meeting: Meeting;
  variant: "upcoming" | "recent";
  selected: boolean;
  onSelect: (meeting: Meeting) => void;
}

function timeLabel(meeting: Meeting, variant: MeetingListItemProps["variant"]): string {
  if (variant === "upcoming" && meeting.scheduled_start) return formatTimeRange(meeting.scheduled_start, meeting.scheduled_end);
  const startedAt = meeting.started_at ?? meeting.created_at;
  return `${formatDayLabel(startedAt)}, ${formatTime(startedAt)}`;
}

export function MeetingListItem({ meeting, variant, selected, onSelect }: MeetingListItemProps) {
  const isLive = meeting.status === "live";
  const meta = [
    `Meeting ID: ${formatMeetingCode(meeting.meeting_code)}`,
    variant === "upcoming" && meeting.duration_minutes ? formatDuration(meeting.duration_minutes) : null,
    variant === "recent" ? (isLive ? "In progress" : "Ended") : null,
  ].filter(Boolean);

  return (
    <li data-testid={variant === "upcoming" ? "upcoming-meeting" : "recent-meeting"} data-meeting-code={meeting.meeting_code}>
      <button
        type="button"
        onClick={() => onSelect(meeting)}
        aria-current={selected || undefined}
        className={`w-full rounded-xl px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zoom-blue ${
          selected ? "bg-zoom-tile text-white" : "text-ink hover:bg-state-hover"
        }`}
      >
        <span className={`flex items-center gap-2 text-[13px] leading-4 ${selected ? "text-white/90" : "text-ink-soft"}`}>
          {timeLabel(meeting, variant)}
          {isLive && variant === "upcoming" && (
            <span className={`rounded px-1.5 text-[11px] font-semibold ${selected ? "bg-white/20" : "bg-zoom-green/15 text-zoom-green-dark"}`}>In progress</span>
          )}
        </span>
        <span className="mt-1 block truncate text-sm font-bold leading-[18px]" data-testid="meeting-title">
          {meeting.title}
        </span>
        <span className={`mt-1 block truncate text-[13px] leading-4 ${selected ? "text-white/90" : "text-ink-muted"}`}>{meta.join(" · ")}</span>
      </button>
    </li>
  );
}
