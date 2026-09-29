"use client";

import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { formatTimeRange } from "@/lib/format";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface UpcomingMeetingItemProps {
  meeting: Meeting;
  onStart: (meeting: Meeting) => void;
  starting: boolean;
}

export function UpcomingMeetingItem({ meeting, onStart, starting }: UpcomingMeetingItemProps) {
  const { copied, copy } = useCopyToClipboard();
  const isLive = meeting.status === "live";

  return (
    <li className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-canvas" data-testid="upcoming-meeting">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-ink-muted">
          {meeting.scheduled_start && formatTimeRange(meeting.scheduled_start, meeting.scheduled_end)}
          {isLive && <span className="ml-2 rounded bg-zoom-green/15 px-1.5 py-0.5 text-[11px] text-[#0f8a34]">In progress</span>}
        </p>
        <p className="mt-0.5 truncate font-bold text-ink">{meeting.title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">Meeting ID: {formatMeetingCode(meeting.meeting_code)}</p>
      </div>
      <button
        type="button"
        onClick={() => copy(meeting.invite_link)}
        aria-label={`Copy invite link for ${meeting.title}`}
        title={copied ? "Copied" : "Copy invite link"}
        className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-white hover:text-zoom-blue"
      >
        {copied ? <Check size={18} className="text-[#0f8a34]" /> : <Link2 size={18} />}
      </button>
      <Button size="sm" onClick={() => onStart(meeting)} disabled={starting}>
        {starting ? "Starting..." : isLive ? "Join" : "Start"}
      </Button>
    </li>
  );
}
