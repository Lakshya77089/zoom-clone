"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CaretDownIcon, ExternalLinkIcon, InfoIcon } from "@/components/icons";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { formatGroupLabel } from "@/lib/format";
import type { Meeting } from "@/types";
import { unavailableClass } from "@/components/ui/unavailable";

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
          <h3 className="sticky top-0 z-10 bg-[#f7f9fa] px-4 py-1.5 text-xs font-semibold leading-4 text-ink-soft">
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
        <div key={index} className="flex items-center gap-4 px-4 py-3">
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

interface CalendarCardProps {
  title: string;
  headingId: string;
  viewAllHref?: string;
  children: ReactNode;
  testId?: string;
  notice?: boolean;
  toolbar?: ReactNode;
}

const roundIcon = "flex h-6 w-6 items-center justify-center rounded-full text-ink-soft";

export function CalendarCard({ title, headingId, viewAllHref, children, testId, notice = false, toolbar }: CalendarCardProps) {
  return (
    <section className="overflow-hidden rounded-lg border-[0.8px] border-line-soft bg-white" aria-labelledby={headingId} data-testid={testId}>
      {notice && (
        <div className="m-2 flex items-start gap-3 rounded-xl border-[0.8px] border-[#a8ccf8] bg-[#f2f8ff] p-4 text-sm leading-[18px] text-ink">
          <InfoIcon size={20} className="shrink-0 text-[#3b90f7]" />
          <p>
            You haven&apos;t connected your calendar yet. <span className={`text-zoom-blue ${unavailableClass}`}>Connect now</span> to manage all your meetings and events in one place.
          </p>
        </div>
      )}
      <div className="relative flex h-11 items-center justify-center px-10">
        <h2 id={headingId} className={`flex items-center gap-1 text-sm font-bold leading-[18px] text-ink ${unavailableClass}`}>
          {title}
          <CaretDownIcon size={14} />
        </h2>
        {viewAllHref && (
          <Link href={viewAllHref} aria-label={`Open ${title.toLowerCase()}`} className={`${roundIcon} absolute right-4 hover:bg-canvas`}>
            <ExternalLinkIcon size={14} />
          </Link>
        )}
      </div>
      {toolbar ?? <div className="border-b-[0.8px] border-line" />}
      {children}
    </section>
  );
}
