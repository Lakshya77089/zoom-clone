"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { RoomState } from "@/types";

const POLL_INTERVAL_MS = 2000;

function isFinished(state: RoomState | null): boolean {
  return state !== null && (state.meeting.status === "ended" || state.me.status !== "active");
}

export function useRoomState(code: string, participantId: number) {
  const [state, setState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const finished = isFinished(state);

  const refresh = useCallback(
    () =>
      api.getRoomState(code, participantId).then(
        (next) => {
          setState(next);
          setError(null);
        },
        (err: unknown) => {
          if (err instanceof ApiError && err.status === 404) setError(err.message);
        },
      ),
    [code, participantId],
  );

  useEffect(() => {
    if (finished) return;
    void refresh();
    const id = window.setInterval(refresh, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [finished, refresh]);

  return { state, setState, error, refresh };
}
