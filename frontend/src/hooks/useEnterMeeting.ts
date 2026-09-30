"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { markNewMeeting, saveParticipantId } from "@/lib/participantSession";
import type { MeetingSession } from "@/types";

interface EnterOptions {
  isNew?: boolean;
}

export function useEnterMeeting() {
  const router = useRouter();

  return useCallback(
    ({ meeting, participant }: MeetingSession, { isNew = false }: EnterOptions = {}) => {
      saveParticipantId(meeting.meeting_code, participant.id);
      if (isNew) markNewMeeting(meeting.meeting_code);
      router.push(ROUTES.room(meeting.meeting_code));
    },
    [router],
  );
}
