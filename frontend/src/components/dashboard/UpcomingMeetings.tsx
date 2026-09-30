"use client";

import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { ClockCard } from "@/components/dashboard/ClockCard";
import { MeetingListSkeleton, UpcomingMeetingList } from "@/components/meetings/MeetingLists";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/constants";
import type { Meeting } from "@/types";

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  loading: boolean;
  startingCode: string | null;
  onStart: (meeting: Meeting) => void;
  onDelete: (meeting: Meeting) => void;
  onSchedule: () => void;
}

export function UpcomingMeetings({ meetings, loading, startingCode, onStart, onDelete, onSchedule }: UpcomingMeetingsProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white" aria-labelledby="upcoming-heading" data-testid="upcoming-meetings">
      <ClockCard />
      <div className="flex h-12 items-center justify-between px-5">
        <h2 id="upcoming-heading" className="text-[15px] font-semibold">
          Upcoming meetings
        </h2>
        <Link href={ROUTES.meetings} className="text-[13px] font-medium text-zoom-blue hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <MeetingListSkeleton />
      ) : meetings.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="No upcoming meetings"
          description="Scheduled meetings will show up here."
          testId="upcoming-empty"
          action={
            <Button variant="secondary" size="sm" onClick={onSchedule}>
              Schedule a meeting
            </Button>
          }
        />
      ) : (
        <div className="max-h-[440px] overflow-y-auto">
          <UpcomingMeetingList meetings={meetings} startingCode={startingCode} onStart={onStart} onDelete={onDelete} />
        </div>
      )}
    </section>
  );
}
