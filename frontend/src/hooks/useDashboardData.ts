"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Meeting } from "@/types";

interface MeetingLists {
  upcoming: Meeting[];
  recent: Meeting[];
}

const EMPTY: MeetingLists = { upcoming: [], recent: [] };

export function useDashboardData() {
  const [data, setData] = useState<MeetingLists>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    () =>
      Promise.all([api.getUpcomingMeetings(), api.getRecentMeetings()])
        .then(
          ([upcoming, recent]) => {
            setData({ upcoming, recent });
            setError(null);
          },
          (err: unknown) => setError(err instanceof Error ? err.message : "Unable to load meetings."),
        )
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...data, loading, error, refresh };
}
