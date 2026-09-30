"use client";

import { useClock } from "@/hooks/useClock";
import type { User } from "@/types";

const MINUTE_MS = 60_000;

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeHeader({ user }: { user: User | null }) {
  const now = useClock(MINUTE_MS);
  const firstName = user?.name.split(" ")[0];

  return (
    <div className="text-center lg:text-left">
      <h1 className="text-2xl font-semibold tracking-tight text-ink" data-testid="welcome-heading" suppressHydrationWarning>
        {now ? greetingFor(now.getHours()) : "Welcome"}
        {firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">Start an instant meeting, join one, or schedule for later.</p>
    </div>
  );
}
