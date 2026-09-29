"use client";

import { CalendarX2 } from "lucide-react";
import { ClockCard } from "@/components/dashboard/ClockCard";
import { UpcomingMeetingItem } from "@/components/dashboard/UpcomingMeetingItem";
import { formatDayLabel } from "@/lib/format";
import type { Meeting } from "@/types";

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  loading: boolean;
  startingCode: string | null;
  onStart: (meeting: Meeting) => void;
}

function groupByDay(meetings: Meeting[]): [string, Meeting[]][] {
  const groups = new Map<string, Meeting[]>();
  for (const meeting of meetings) {
    const label = formatDayLabel(meeting.scheduled_start ?? meeting.created_at);
    groups.set(label, [...(groups.get(label) ?? []), meeting]);
  }
  return [...groups.entries()];
}

export function UpcomingMeetings({ meetings, loading, startingCode, onStart }: UpcomingMeetingsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm" aria-labelledby="upcoming-heading">
      <ClockCard />
      <div className="flex items-center justify-between px-6 pb-2 pt-5">
        <h2 id="upcoming-heading" className="text-base font-bold">
          Upcoming meetings
        </h2>
        <span className="text-xs font-bold text-ink-muted">{meetings.length} scheduled</span>
      </div>

      {loading ? (
        <div className="space-y-3 px-6 py-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-canvas" />
          ))}
        </div>
      ) : meetings.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-ink-muted">
          <CalendarX2 size={32} />
          <p className="text-sm">No upcoming meetings</p>
        </div>
      ) : (
        <div className="max-h-[420px] overflow-y-auto pb-2">
          {groupByDay(meetings).map(([day, items]) => (
            <div key={day}>
              <p className="bg-canvas px-6 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-muted">{day}</p>
              <ul className="divide-y divide-line">
                {items.map((meeting) => (
                  <UpcomingMeetingItem
                    key={meeting.id}
                    meeting={meeting}
                    onStart={onStart}
                    starting={startingCode === meeting.meeting_code}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
