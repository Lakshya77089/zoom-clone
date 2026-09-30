"use client";

import { useClock } from "@/hooks/useClock";
import { formatLongDate, formatTime } from "@/lib/format";

export function ClockCard() {
  const now = useClock();

  return (
    <div className="relative overflow-hidden bg-zoom-blue px-5 py-6 text-white sm:py-7">
      <svg className="pointer-events-none absolute -right-6 -top-10 h-44 w-44 text-white/10" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="50" fill="currentColor" />
      </svg>
      <svg className="pointer-events-none absolute -bottom-16 right-28 h-36 w-36 text-white/[0.07]" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="50" fill="currentColor" />
      </svg>
      <p className="relative text-[40px] font-semibold leading-none tracking-tight" data-testid="clock-time" suppressHydrationWarning>
        {now ? formatTime(now) : " "}
      </p>
      <p className="relative mt-2 text-sm text-white/85">{now ? formatLongDate(now) : " "}</p>
    </div>
  );
}
