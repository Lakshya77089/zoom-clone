"use client";

import { useState } from "react";
import { useClock } from "@/hooks/useClock";
import { addDays, startOfDay } from "@/lib/format";

const MINUTE_MS = 60_000;

export function useDayCursor() {
  const now = useClock(MINUTE_MS);
  const [offset, setOffset] = useState(0);
  const today = now ? startOfDay(now) : null;

  return {
    selected: today ? addDays(today, offset) : null,
    offset,
    isToday: offset === 0,
    goToday: () => setOffset(0),
    goPrevious: () => setOffset((value) => Math.max(0, value - 1)),
    goNext: () => setOffset((value) => value + 1),
    goToOffset: (value: number) => setOffset(Math.max(0, value)),
  };
}

export type DayCursor = ReturnType<typeof useDayCursor>;
