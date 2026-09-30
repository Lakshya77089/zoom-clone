"use client";

import { Switch } from "@/components/ui/Switch";
import { usePreferences } from "@/hooks/usePreferences";

export function MeetingPreferences() {
  const { preferences, updatePreferences } = usePreferences();

  return (
    <section className="rounded-2xl border border-line bg-white" aria-labelledby="meeting-settings-heading" data-testid="meeting-preferences">
      <h2 id="meeting-settings-heading" className="border-b border-line px-5 py-3.5 text-[15px] font-semibold">
        Meeting
      </h2>
      <div className="divide-y divide-line px-5">
        <Switch
          id="pref-join-muted"
          label="Mute my microphone when joining a meeting"
          description="You can unmute any time from the meeting toolbar."
          checked={preferences.joinMuted}
          onChange={(joinMuted) => updatePreferences({ joinMuted })}
        />
        <Switch
          id="pref-join-video-off"
          label="Turn off my video when joining a meeting"
          description="Applies to the join dialog and the pre-join screen."
          checked={preferences.joinVideoOff}
          onChange={(joinVideoOff) => updatePreferences({ joinVideoOff })}
        />
        <Switch
          id="pref-show-invite"
          label="Show invite details when starting a new meeting"
          description="Opens the meeting ID and invite link so you can share them right away."
          checked={preferences.showInviteOnStart}
          onChange={(showInviteOnStart) => updatePreferences({ showInviteOnStart })}
        />
      </div>
    </section>
  );
}
