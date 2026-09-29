"use client";

import { useClock } from "@/hooks/useClock";
import { formatLongDate, formatTime } from "@/lib/format";

export function ClockCard() {
  const now = useClock();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0b5cff] via-[#3d7bff] to-[#7aa6ff] px-6 py-8 text-white sm:py-10">
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/10" />
      <p className="relative text-4xl font-bold tracking-tight sm:text-5xl" suppressHydrationWarning>
        {now ? formatTime(now) : " "}
      </p>
      <p className="relative mt-2 text-base text-white/90">{now ? formatLongDate(now) : " "}</p>
    </div>
  );
}
