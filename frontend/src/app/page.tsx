"use client";

import { useState } from "react";
import { CalendarDays, Plus, ScreenShare, Video } from "lucide-react";
import { ActionTile } from "@/components/dashboard/ActionTile";
import { RecentMeetings } from "@/components/dashboard/RecentMeetings";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { Navbar } from "@/components/layout/Navbar";
import { JoinMeetingModal } from "@/components/modals/JoinMeetingModal";
import { ScheduleMeetingModal } from "@/components/modals/ScheduleMeetingModal";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useEnterMeeting } from "@/hooks/useEnterMeeting";
import { api } from "@/lib/api";
import type { Meeting } from "@/types";

type ActiveModal = "join" | "schedule" | null;

export default function DashboardPage() {
  const { user, upcoming, recent, loading, error, refresh } = useDashboardData();
  const enterMeeting = useEnterMeeting();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [creating, setCreating] = useState(false);
  const [startingCode, setStartingCode] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleNewMeeting = async () => {
    setCreating(true);
    setActionError(null);
    try {
      enterMeeting(await api.createInstantMeeting());
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to start a new meeting.");
      setCreating(false);
    }
  };

  const handleStart = async (meeting: Meeting) => {
    setStartingCode(meeting.meeting_code);
    setActionError(null);
    try {
      enterMeeting(await api.startMeeting(meeting.meeting_code));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to start the meeting.");
      setStartingCode(null);
      void refresh();
    }
  };

  const bannerError = actionError ?? error;

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {bannerError && (
          <div role="alert" className="mb-6 rounded-xl border border-zoom-red/30 bg-zoom-red/5 px-4 py-3 text-sm text-zoom-red">
            {bannerError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
          <section className="flex items-center justify-center rounded-2xl py-6 lg:py-0" aria-label="Meeting actions">
            <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:gap-x-16 sm:gap-y-10">
              <ActionTile label="New meeting" icon={Video} tone="orange" onClick={handleNewMeeting} busy={creating} />
              <ActionTile label="Join" icon={Plus} tone="blue" onClick={() => setActiveModal("join")} />
              <ActionTile label="Schedule" icon={CalendarDays} tone="blue" onClick={() => setActiveModal("schedule")} />
              <ActionTile label="Share screen" icon={ScreenShare} tone="blue" disabled />
            </div>
          </section>

          <UpcomingMeetings meetings={upcoming} loading={loading} startingCode={startingCode} onStart={handleStart} />
        </div>

        <div className="mt-6 lg:mt-10">
          <RecentMeetings meetings={recent} loading={loading} startingCode={startingCode} onRejoin={handleStart} />
        </div>
      </main>

      {activeModal === "join" && (
        <JoinMeetingModal defaultName={user?.name ?? ""} onClose={() => setActiveModal(null)} onJoined={enterMeeting} />
      )}
      {activeModal === "schedule" && (
        <ScheduleMeetingModal
          defaultTitle={user ? `${user.name}'s Zoom Meeting` : "My Meeting"}
          onClose={() => setActiveModal(null)}
          onScheduled={() => void refresh()}
        />
      )}
    </div>
  );
}
