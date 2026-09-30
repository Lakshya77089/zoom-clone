"use client";

import { CalendarCheckIcon, CheckIcon, CopyIcon, LinkIcon } from "@/components/icons";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { formatDuration, formatGroupLabel, formatTimeRange } from "@/lib/format";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface ScheduledMeetingSummaryProps {
  meeting: Meeting;
}

export function ScheduledMeetingSummary({ meeting }: ScheduledMeetingSummaryProps) {
  const { copied, copy } = useCopyToClipboard();
  const rows = [
    { label: "Topic", value: meeting.title },
    {
      label: "Time",
      value: meeting.scheduled_start
        ? `${formatGroupLabel(meeting.scheduled_start)}, ${formatTimeRange(meeting.scheduled_start, meeting.scheduled_end)}`
        : "",
    },
    { label: "Duration", value: formatDuration(meeting.duration_minutes ?? 0) },
    { label: "Meeting ID", value: formatMeetingCode(meeting.meeting_code), testId: "scheduled-meeting-id" },
  ];

  return (
    <div data-testid="scheduled-summary">
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-zoom-green/10 px-4 py-3 text-sm font-medium text-zoom-green-dark">
        <CalendarCheckIcon size={20} className="shrink-0" />
        Your meeting has been scheduled and added to Upcoming.
      </div>
      <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-3 text-sm">
        {rows.map(({ label, value, testId }) => (
          <div key={label} className="contents">
            <dt className="text-ink-muted">{label}</dt>
            <dd className="min-w-0 break-words font-medium text-ink" data-testid={testId}>
              {value}
            </dd>
          </div>
        ))}
        {meeting.description && (
          <>
            <dt className="text-ink-muted">Description</dt>
            <dd className="min-w-0 whitespace-pre-line break-words text-ink">{meeting.description}</dd>
          </>
        )}
        <dt className="text-ink-muted">Invite link</dt>
        <dd className="min-w-0">
          <div className="flex items-center gap-2 rounded-xl border border-line-strong py-1.5 pl-3 pr-1.5">
            <LinkIcon size={16} className="shrink-0 text-ink-muted" />
            <span className="min-w-0 flex-1 truncate text-zoom-blue" data-testid="scheduled-invite-link" title={meeting.invite_link}>
              {meeting.invite_link}
            </span>
            <button
              type="button"
              onClick={() => void copy(meeting.invite_link)}
              aria-label="Copy invite link"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-hover hover:text-ink"
            >
              {copied ? <CheckIcon size={16} className="text-zoom-green-dark" /> : <CopyIcon size={16} />}
            </button>
          </div>
        </dd>
      </dl>
    </div>
  );
}
