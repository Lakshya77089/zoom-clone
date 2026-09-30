"use client";

import { AppShell } from "@/components/layout/AppShell";
import { MeetingPreferences } from "@/components/settings/MeetingPreferences";
import { ProfileCard } from "@/components/settings/ProfileCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function SettingsPage() {
  const user = useCurrentUser();

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[760px] space-y-6 px-4 py-6 sm:px-6 lg:py-8" data-testid="settings-page">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <ProfileCard user={user} />
        <MeetingPreferences />
      </div>
    </AppShell>
  );
}
