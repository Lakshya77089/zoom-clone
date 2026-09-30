"use client";

import { Check, Copy, Info, ShieldCheck } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useDismissible } from "@/hooks/useDismissible";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface MeetingInfoProps {
  meeting: Meeting;
  defaultOpen?: boolean;
}

export function MeetingInfo({ meeting, defaultOpen = false }: MeetingInfoProps) {
  const { open, setOpen, ref } = useDismissible(defaultOpen);
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Meeting information"
        aria-expanded={open}
        data-testid="meeting-info-button"
        className="flex h-8 items-center gap-1.5 rounded-md px-2 text-white/90 outline-none hover:bg-room-hover focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <ShieldCheck size={18} className="text-zoom-green" />
        <Info size={16} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-40 mt-2 w-[min(22rem,calc(100vw-1rem))] animate-fade-in rounded-xl bg-white p-5 text-ink shadow-2xl"
          data-testid="meeting-info"
        >
          <h3 className="truncate text-[15px] font-semibold">{meeting.title}</h3>
          <p className="mt-0.5 text-[13px] text-ink-muted">Share these details to invite others.</p>
          <dl className="mt-4 grid grid-cols-[88px_1fr] gap-y-2.5 text-sm">
            <dt className="text-ink-muted">Meeting ID</dt>
            <dd className="font-semibold" data-testid="room-meeting-id">
              {formatMeetingCode(meeting.meeting_code)}
            </dd>
            <dt className="text-ink-muted">Host</dt>
            <dd>{meeting.host.name}</dd>
            <dt className="text-ink-muted">Invite link</dt>
            <dd className="break-all text-zoom-blue" data-testid="room-invite-link">
              {meeting.invite_link}
            </dd>
          </dl>
          <button
            type="button"
            onClick={() => void copy(meeting.invite_link)}
            className="mt-4 flex h-9 items-center gap-1.5 rounded-[10px] bg-zoom-blue px-3.5 text-sm font-semibold text-white hover:bg-zoom-blue-dark"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
