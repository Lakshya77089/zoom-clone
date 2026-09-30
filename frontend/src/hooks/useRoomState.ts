"use client";

import { useCallback, useEffect, useState } from "react";
import { ROOM_POLL_INTERVAL_MS } from "@/constants";
import { api, ApiError } from "@/lib/api";
import type { RoomState } from "@/types";

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
          if (err instanceof ApiError && (err.status === 404 || err.status === 403)) setError(err.message);
        },
      ),
    [code, participantId],
  );

  useEffect(() => {
    if (finished) return;
    void refresh();
    const id = window.setInterval(refresh, ROOM_POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [finished, refresh]);

  return { state, setState, error, refresh };
}
