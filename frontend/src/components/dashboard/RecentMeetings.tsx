"use client";

import { History } from "lucide-react";
import { MeetingListSkeleton, Panel, RecentMeetingList } from "@/components/meetings/MeetingLists";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Meeting } from "@/types";

interface RecentMeetingsProps {
  meetings: Meeting[];
  loading: boolean;
  startingCode: string | null;
  onRejoin: (meeting: Meeting) => void;
}

export function RecentMeetings({ meetings, loading, startingCode, onRejoin }: RecentMeetingsProps) {
  return (
    <Panel title="Recent meetings" headingId="recent-heading" testId="recent-meetings">
      <div className="border-t border-line">
        {loading ? (
          <MeetingListSkeleton rows={2} />
        ) : meetings.length === 0 ? (
          <EmptyState
            icon={History}
            title="No recent meetings"
            description="Meetings you host or join will appear here."
            testId="recent-empty"
          />
        ) : (
          <RecentMeetingList meetings={meetings} startingCode={startingCode} onStart={onRejoin} />
        )}
      </div>
    </Panel>
  );
}
