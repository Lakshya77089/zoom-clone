"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Meeting, User } from "@/types";

interface DashboardData {
  user: User | null;
  upcoming: Meeting[];
  recent: Meeting[];
}

const EMPTY: DashboardData = { user: null, upcoming: [], recent: [] };

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    () =>
      Promise.all([api.getCurrentUser(), api.getUpcomingMeetings(), api.getRecentMeetings()])
        .then(
          ([user, upcoming, recent]) => {
            setData({ user, upcoming, recent });
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
