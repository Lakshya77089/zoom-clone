"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_PREFERENCES, readPreferences, subscribePreferences, writePreferences } from "@/lib/preferences";

export function usePreferences() {
  const preferences = useSyncExternalStore(subscribePreferences, readPreferences, () => DEFAULT_PREFERENCES);
  return { preferences, updatePreferences: writePreferences };
}
