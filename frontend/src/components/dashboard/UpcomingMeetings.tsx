"use client";

import { Umbrella } from "lucide-react";
import { CalendarCard, MeetingListSkeleton, UpcomingMeetingList } from "@/components/meetings/MeetingLists";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/constants";
import type { Meeting } from "@/types";

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  loading: boolean;
  startingCode: string | null;
  onStart: (meeting: Meeting) => void;
  onDelete: (meeting: Meeting) => void;
}

export function UpcomingMeetings({ meetings, loading, startingCode, onStart, onDelete }: UpcomingMeetingsProps) {
  return (
    <CalendarCard title="Upcoming meetings" headingId="upcoming-heading" viewAllHref={ROUTES.meetings} testId="upcoming-meetings">
      {loading ? (
        <MeetingListSkeleton />
      ) : meetings.length === 0 ? (
        <EmptyState icon={Umbrella} title="No meetings scheduled." testId="upcoming-empty" />
      ) : (
        <div className="max-h-[440px] overflow-y-auto">
          <UpcomingMeetingList meetings={meetings} startingCode={startingCode} onStart={onStart} onDelete={onDelete} />
        </div>
      )}
    </CalendarCard>
  );
}
