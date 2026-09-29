"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { saveParticipantId } from "@/lib/participantSession";
import type { MeetingSession } from "@/types";

export function useEnterMeeting() {
  const router = useRouter();

  return useCallback(
    ({ meeting, participant }: MeetingSession) => {
      saveParticipantId(meeting.meeting_code, participant.id);
      router.push(`/wc/${meeting.meeting_code}`);
    },
    [router],
  );
}
