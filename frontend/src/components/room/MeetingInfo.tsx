"use client";

import { Check, Copy, Info, ShieldCheck } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useDismissible } from "@/hooks/useDismissible";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface MeetingInfoProps {
  meeting: Meeting;
}

export function MeetingInfo({ meeting }: MeetingInfoProps) {
  const { open, setOpen, ref } = useDismissible();
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Meeting information"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-white/90 hover:bg-room-hover"
      >
        <ShieldCheck size={18} className="text-zoom-green" />
        <Info size={16} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl bg-white p-5 text-ink shadow-2xl">
          <h3 className="truncate text-base font-bold">{meeting.title}</h3>
          <dl className="mt-4 grid grid-cols-[6rem_1fr] gap-y-2.5 text-sm">
            <dt className="text-ink-muted">Meeting ID</dt>
            <dd className="font-bold" data-testid="room-meeting-id">
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
            onClick={() => copy(meeting.invite_link)}
            className="mt-4 flex items-center gap-1.5 text-sm font-bold text-zoom-blue hover:underline"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
