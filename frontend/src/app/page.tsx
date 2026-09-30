"use client";

import { useState } from "react";
import { MeetingActions } from "@/components/dashboard/MeetingActions";
import { MeetingDialogs, type ActiveDialog } from "@/components/dashboard/MeetingDialogs";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
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
      <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:py-10" data-testid="dashboard">
        {error && (
          <div className="mb-6">
            <FormAlert>{error}</FormAlert>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
          <section className="flex flex-col items-center justify-center gap-8 rounded-2xl py-4 lg:items-start lg:py-0" aria-label="Start or join">
            <WelcomeHeader user={user} />
            <MeetingActions
              creating={launcher.creating}
              onNewMeeting={() => void launcher.startNewMeeting()}
              onJoin={() => setDialog("join")}
              onSchedule={() => setDialog("schedule")}
            />
          </section>

          <UpcomingMeetings
            meetings={upcoming}
            loading={loading}
            startingCode={launcher.startingCode}
            onStart={(meeting) => void launcher.startMeeting(meeting)}
            onDelete={deletion.requestDelete}
            onSchedule={() => setDialog("schedule")}
          />
        </div>

        <div className="mt-6 lg:mt-10">
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
