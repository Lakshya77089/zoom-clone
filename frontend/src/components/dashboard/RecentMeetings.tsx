"use client";

import { History } from "lucide-react";
import { CalendarCard, MeetingListSkeleton, RecentMeetingList } from "@/components/meetings/MeetingLists";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/constants";
import type { Meeting } from "@/types";

interface RecentMeetingsProps {
  meetings: Meeting[];
  loading: boolean;
  startingCode: string | null;
  onRejoin: (meeting: Meeting) => void;
}

export function RecentMeetings({ meetings, loading, startingCode, onRejoin }: RecentMeetingsProps) {
  return (
    <CalendarCard title="Recent meetings" headingId="recent-heading" viewAllHref={`${ROUTES.meetings}?tab=previous`} testId="recent-meetings">
      {loading ? (
        <MeetingListSkeleton rows={2} />
      ) : meetings.length === 0 ? (
        <EmptyState icon={History} title="No recent meetings." testId="recent-empty" />
      ) : (
        <RecentMeetingList meetings={meetings} startingCode={startingCode} onStart={onRejoin} />
      )}
    </CalendarCard>
  );
}
