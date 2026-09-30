"use client";

import { useClock } from "@/hooks/useClock";
import { formatLongDate, formatTime } from "@/lib/format";

export function ClockCard() {
  const now = useClock();

  return (
    <div className="text-center">
      <p className="text-[40px] font-semibold leading-10 text-ink-strong" data-testid="clock-time" suppressHydrationWarning>
        {now ? formatTime(now) : " "}
      </p>
      <p className="mt-2 text-base leading-5 text-ink-faint" data-testid="clock-date" suppressHydrationWarning>
        {now ? formatLongDate(now) : " "}
      </p>
    </div>
  );
}
