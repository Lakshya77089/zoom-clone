"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeftIcon, CopyIcon, EditIcon, TrashIcon } from "@/components/icons";
import { Spinner } from "@/components/ui/Spinner";
import { useCopyWithToast } from "@/hooks/useCopyWithToast";
import { buildInvitation, formatDayLabel, formatDuration, formatTime, formatTimeRange } from "@/lib/format";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";
import { unavailableClass } from "@/components/ui/unavailable";

interface MeetingDetailProps {
  meeting: Meeting;
  variant: "upcoming" | "recent";
  starting: boolean;
  onStart: (meeting: Meeting) => void;
  onDelete: (meeting: Meeting) => void;
  onBack: () => void;
}

const outline =
  "inline-flex h-8 items-center gap-1.5 rounded-lg border-[0.8px] border-line bg-white px-5 text-sm font-bold leading-5 text-[#131619] outline-none transition-colors hover:bg-canvas focus-visible:ring-2 focus-visible:ring-zoom-blue";

function whenLabel(meeting: Meeting, variant: MeetingDetailProps["variant"]): string {
  if (variant === "upcoming" && meeting.scheduled_start) {
    return `${formatDayLabel(meeting.scheduled_start)} ${formatTimeRange(meeting.scheduled_start, meeting.scheduled_end)}`;
  }
  const startedAt = meeting.started_at ?? meeting.created_at;
  return `${formatDayLabel(startedAt)}, ${formatTime(startedAt)}`;
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 text-[13px] leading-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="break-words text-ink-strong">{children}</dd>
    </div>
  );
}

export function MeetingDetail({ meeting, variant, starting, onStart, onDelete, onBack }: MeetingDetailProps) {
  const copy = useCopyWithToast();
  const [showInvitation, setShowInvitation] = useState(false);
  const isLive = meeting.status === "live";
  const canStart = variant === "upcoming" || isLive;

  return (
    <div className="px-5 pb-10 pt-6 md:px-[42px] md:pt-12" data-testid="meeting-detail">
      <button type="button" onClick={onBack} className="mb-4 flex items-center gap-0.5 text-sm text-zoom-blue md:hidden">
        <ChevronLeftIcon size={16} />
        Back
      </button>
      <h2 className="break-words text-2xl font-bold leading-[29px] text-[#39394d]">{meeting.title}</h2>
      <p className="mt-8 text-[13px] leading-4 text-ink-strong">{whenLabel(meeting, variant)}</p>

      <div className="mt-12 flex flex-wrap gap-4">
        {canStart ? (
          <button
            type="button"
            onClick={() => onStart(meeting)}
            disabled={starting}
            aria-busy={starting || undefined}
            data-testid="meeting-start-button"
            className="inline-flex h-8 items-center gap-2 rounded-lg bg-[#0e72ed] px-5 text-sm font-bold leading-5 text-white outline-none transition-colors hover:bg-zoom-blue-dark focus-visible:ring-2 focus-visible:ring-zoom-blue focus-visible:ring-offset-2 disabled:cursor-wait"
          >
            {starting && <Spinner size={14} />}
            {isLive ? "Join" : "Start"}
          </button>
        ) : (
          <span className="inline-flex h-8 items-center text-sm text-ink-muted">Ended</span>
        )}
        <button type="button" className={outline} onClick={() => void copy(buildInvitation(meeting), "Invitation copied to clipboard")}>
          <CopyIcon size={12} />
          Copy Invitation
        </button>
        {variant === "upcoming" && (
          <span aria-disabled="true" className={`${outline} ${unavailableClass}`}>
            <EditIcon size={12} />
            Edit
          </span>
        )}
        {variant === "upcoming" && !isLive && (
          <button type="button" className={outline} onClick={() => onDelete(meeting)} data-testid="detail-delete-button">
            <TrashIcon size={12} />
            Delete
          </button>
        )}
      </div>

      <dl className="mt-10 max-w-[560px] space-y-3">
        <DetailRow label="Meeting ID">{formatMeetingCode(meeting.meeting_code)}</DetailRow>
        {meeting.duration_minutes ? <DetailRow label="Duration">{formatDuration(meeting.duration_minutes)}</DetailRow> : null}
        <DetailRow label="Host">{meeting.host.name}</DetailRow>
        {meeting.description && <DetailRow label="Description">{meeting.description}</DetailRow>}
        <DetailRow label="Invite link">
          <a href={meeting.invite_link} target="_blank" rel="noreferrer" className="break-all text-zoom-blue hover:underline" data-testid="detail-invite-link">
            {meeting.invite_link}
          </a>
        </DetailRow>
      </dl>

      <button type="button" onClick={() => setShowInvitation((value) => !value)} className="mt-10 text-[13px] text-[#0e72ed] hover:underline">
        {showInvitation ? "Hide Meeting Invitation" : "Show Meeting Invitation"}
      </button>
      {showInvitation && (
        <pre className="mt-4 max-w-[560px] whitespace-pre-wrap rounded-xl bg-canvas p-4 font-sans text-[13px] leading-5 text-ink">{buildInvitation(meeting)}</pre>
      )}
    </div>
  );
}
