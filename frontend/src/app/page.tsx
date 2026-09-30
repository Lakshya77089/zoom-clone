"use client";

import { useState } from "react";
import { ClockCard } from "@/components/dashboard/ClockCard";
import { MeetingActions } from "@/components/dashboard/MeetingActions";
import { MeetingDialogs, type ActiveDialog } from "@/components/dashboard/MeetingDialogs";
import { QuickAccess } from "@/components/dashboard/QuickAccess";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { AppShell } from "@/components/layout/AppShell";
import { FormAlert } from "@/components/ui/field";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMeetingDeletion } from "@/hooks/useMeetingDeletion";
import { useMeetingLauncher } from "@/hooks/useMeetingLauncher";

export default function HomePage() {
  const user = useCurrentUser();
  const { upcoming, recent, loading, error, refresh } = useDashboardData();
  const launcher = useMeetingLauncher(refresh);
  const deletion = useMeetingDeletion(refresh);
  const [dialog, setDialog] = useState<ActiveDialog>(null);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[632px] px-4 pb-10 pt-10 sm:pt-16" data-testid="dashboard">
        <ClockCard />

        <div className="mt-7">
          <MeetingActions
            creating={launcher.creating}
            onNewMeeting={() => void launcher.startNewMeeting()}
            onJoin={() => setDialog("join")}
            onSchedule={() => setDialog("schedule")}
          />
        </div>

        <div className="mt-6 space-y-4">
          <QuickAccess />

          {error && <FormAlert>{error}</FormAlert>}

          <UpcomingMeetings
            meetings={upcoming}
            loading={loading}
            startingCode={launcher.startingCode}
            onStart={(meeting) => void launcher.startMeeting(meeting)}
            onDelete={deletion.requestDelete}
            onRefresh={() => void refresh()}
            onSchedule={() => setDialog("schedule")}
          />

          <RecentMeetings
            meetings={recent}
            loading={loading}
            startingCode={launcher.startingCode}
            onRejoin={(meeting) => void launcher.startMeeting(meeting)}
          />
        </div>
      </div>

      <MeetingDialogs
        active={dialog}
        user={user}
        onClose={() => setDialog(null)}
        onScheduled={() => void refresh()}
        deletion={deletion}
      />
    </AppShell>
  );
}
