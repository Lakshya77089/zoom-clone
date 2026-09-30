"use client";

import type { ReactNode } from "react";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { formatGroupLabel } from "@/lib/format";
import type { Meeting } from "@/types";

interface MeetingListProps {
  meetings: Meeting[];
  startingCode: string | null;
  onStart: (meeting: Meeting) => void;
}

interface UpcomingListProps extends MeetingListProps {
  onDelete: (meeting: Meeting) => void;
}

function groupByDay(meetings: Meeting[]): [string, Meeting[]][] {
  const groups = new Map<string, Meeting[]>();
  for (const meeting of meetings) {
    const label = formatGroupLabel(meeting.scheduled_start ?? meeting.created_at);
    groups.set(label, [...(groups.get(label) ?? []), meeting]);
  }
  return [...groups.entries()];
}

export function UpcomingMeetingList({ meetings, startingCode, onStart, onDelete }: UpcomingListProps) {
  return (
    <div data-testid="upcoming-list">
      {groupByDay(meetings).map(([day, items]) => (
        <section key={day} aria-label={day}>
          <h3 className="sticky top-0 z-10 border-y border-line bg-canvas px-5 py-1.5 text-xs font-semibold text-ink-muted first:border-t-0">
            {day}
          </h3>
          <ul className="divide-y divide-line">
            {items.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                variant="upcoming"
                starting={startingCode === meeting.meeting_code}
                onStart={onStart}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function RecentMeetingList({ meetings, startingCode, onStart }: MeetingListProps) {
  return (
    <ul className="divide-y divide-line" data-testid="recent-list">
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          variant="recent"
          starting={startingCode === meeting.meeting_code}
          onStart={onStart}
        />
      ))}
    </ul>
  );
}

export function MeetingListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="divide-y divide-line" aria-busy="true" aria-label="Loading meetings">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-line" />
            <div className="h-4 w-56 max-w-full animate-pulse rounded bg-line" />
            <div className="h-3 w-40 animate-pulse rounded bg-line" />
          </div>
          <div className="h-8 w-16 animate-pulse rounded-lg bg-line" />
        </div>
      ))}
    </div>
  );
}

interface PanelProps {
  title: string;
  headingId: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  testId?: string;
}

export function Panel({ title, headingId, aside, children, className = "", testId }: PanelProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-line bg-white ${className}`}
      aria-labelledby={headingId}
      data-testid={testId}
    >
      <div className="flex h-12 items-center justify-between gap-3 px-5">
        <h2 id={headingId} className="text-[15px] font-semibold text-ink">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
