"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlusIcon, ExternalLinkIcon, RefreshIcon, UmbrellaIllustration } from "@/components/icons";
import { DayNavigator } from "@/components/meetings/DayNavigator";
import { CalendarCard, MeetingListSkeleton, UpcomingMeetingList } from "@/components/meetings/MeetingLists";
import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/constants";
import { useDayCursor } from "@/hooks/useDayCursor";
import { daysBetween, formatShortDate, isSameDay, startOfDay } from "@/lib/format";
import type { Meeting } from "@/types";

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  loading: boolean;
  startingCode: string | null;
  onStart: (meeting: Meeting) => void;
  onDelete: (meeting: Meeting) => void;
  onRefresh: () => void;
  onSchedule: () => void;
}

const meetingDay = (meeting: Meeting) => meeting.scheduled_start ?? meeting.created_at;

export function UpcomingMeetings({ meetings, loading, startingCode, onStart, onDelete, onRefresh, onSchedule }: UpcomingMeetingsProps) {
  const router = useRouter();
  const cursor = useDayCursor();
  const { selected } = cursor;

  const dayMeetings = useMemo(
    () => (selected ? meetings.filter((meeting) => isSameDay(meetingDay(meeting), selected)) : []),
    [meetings, selected],
  );

  const nextMeeting = useMemo(() => {
    if (!selected) return null;
    const after = startOfDay(selected).getTime();
    return (
      meetings
        .filter((meeting) => startOfDay(new Date(meetingDay(meeting))).getTime() > after)
        .sort((a, b) => new Date(meetingDay(a)).getTime() - new Date(meetingDay(b)).getTime())[0] ?? null
    );
  }, [meetings, selected]);

  const jumpToNext = () => {
    if (nextMeeting) cursor.goToOffset(daysBetween(new Date(), new Date(meetingDay(nextMeeting))));
  };

  const toolbar = (
    <DayNavigator
      cursor={cursor}
      menuItems={[
        { label: "Refresh", icon: RefreshIcon, onSelect: onRefresh, testId: "calendar-refresh" },
        { label: "Schedule a meeting", icon: CalendarPlusIcon, onSelect: onSchedule, testId: "calendar-schedule" },
        { label: "Open in Meetings", icon: ExternalLinkIcon, onSelect: () => router.push(ROUTES.meetings), testId: "calendar-open-meetings" },
      ]}
    />
  );

  return (
    <CalendarCard title="Upcoming meetings" headingId="upcoming-heading" viewAllHref={ROUTES.meetings} testId="upcoming-meetings" notice toolbar={toolbar}>
      {loading || !selected ? (
        <MeetingListSkeleton />
      ) : dayMeetings.length === 0 ? (
        <EmptyState
          illustration={UmbrellaIllustration}
          title="No meetings scheduled."
          testId="upcoming-empty"
          action={
            nextMeeting && (
              <button type="button" onClick={jumpToNext} data-testid="calendar-jump-next" className="text-sm text-zoom-blue hover:underline">
                Next meeting: {formatShortDate(new Date(meetingDay(nextMeeting)))}
              </button>
            )
          }
        />
      ) : (
        <div className="max-h-[440px] overflow-y-auto">
          <UpcomingMeetingList meetings={dayMeetings} startingCode={startingCode} onStart={onStart} onDelete={onDelete} />
        </div>
      )}
    </CalendarCard>
  );
}
