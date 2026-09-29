"use client";

import { History, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDayLabel, formatDuration, formatTime, minutesBetween } from "@/lib/format";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface RecentMeetingsProps {
  meetings: Meeting[];
  loading: boolean;
  startingCode: string | null;
  onRejoin: (meeting: Meeting) => void;
}

function RecentMeetingRow({ meeting, onRejoin, starting }: { meeting: Meeting; onRejoin: (m: Meeting) => void; starting: boolean }) {
  const startedAt = meeting.started_at ?? meeting.created_at;
  const isLive = meeting.status === "live";
  const duration = meeting.ended_at ? formatDuration(minutesBetween(startedAt, meeting.ended_at)) : null;

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-6" data-testid="recent-meeting">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zoom-blue-light text-zoom-blue">
        <Video size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{meeting.title}</p>
        <p className="text-xs text-ink-muted">
          {formatDayLabel(startedAt)}, {formatTime(startedAt)}
          <span className="mx-1.5">·</span>
          Meeting ID: {formatMeetingCode(meeting.meeting_code)}
        </p>
      </div>
      <div className="flex basis-full items-center gap-4 pl-14 text-xs text-ink-muted sm:basis-auto sm:pl-0">
        <span className="flex items-center gap-1">
          <Users size={14} />
          {meeting.participant_count}
        </span>
        {duration && <span className="sm:w-20 sm:text-right">{duration}</span>}
        {isLive && (
          <Button size="sm" onClick={() => onRejoin(meeting)} disabled={starting}>
            {starting ? "Joining..." : "Rejoin"}
          </Button>
        )}
      </div>
    </li>
  );
}

export function RecentMeetings({ meetings, loading, startingCode, onRejoin }: RecentMeetingsProps) {
  return (
    <section className="rounded-2xl border border-line bg-white shadow-sm" aria-labelledby="recent-heading">
      <div className="flex items-center gap-2 border-b border-line px-4 py-4 sm:px-6">
        <History size={18} className="text-ink-muted" />
        <h2 id="recent-heading" className="text-base font-bold">
          Recent meetings
        </h2>
      </div>
      {loading ? (
        <div className="space-y-3 p-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-canvas" />
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-ink-muted">No recent meetings</p>
      ) : (
        <ul className="divide-y divide-line">
          {meetings.map((meeting) => (
            <RecentMeetingRow
              key={meeting.id}
              meeting={meeting}
              onRejoin={onRejoin}
              starting={startingCode === meeting.meeting_code}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
