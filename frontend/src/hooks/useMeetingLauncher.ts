"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useEnterMeeting } from "@/hooks/useEnterMeeting";
import { api } from "@/lib/api";
import type { Meeting } from "@/types";

export function useMeetingLauncher(onFailure?: () => void) {
  const enterMeeting = useEnterMeeting();
  const toast = useToast();
  const [creating, setCreating] = useState(false);
  const [startingCode, setStartingCode] = useState<string | null>(null);

  const startNewMeeting = useCallback(async () => {
    setCreating(true);
    try {
      enterMeeting(await api.createInstantMeeting(), { isNew: true });
    } catch (error) {
      toast(error instanceof Error ? error.message : "Unable to start a new meeting.", "error");
      setCreating(false);
    }
  }, [enterMeeting, toast]);

  const startMeeting = useCallback(
    async (meeting: Meeting) => {
      setStartingCode(meeting.meeting_code);
      try {
        enterMeeting(await api.startMeeting(meeting.meeting_code));
      } catch (error) {
        toast(error instanceof Error ? error.message : "Unable to start the meeting.", "error");
        setStartingCode(null);
        onFailure?.();
      }
    },
    [enterMeeting, toast, onFailure],
  );

  return { creating, startingCode, startNewMeeting, startMeeting };
}
