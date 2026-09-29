"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { MeetingRoom } from "@/components/room/MeetingRoom";
import { readParticipantId } from "@/lib/participantSession";

const subscribe = () => () => {};

export default function MeetingRoomPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const participantId = useSyncExternalStore(
    subscribe,
    () => readParticipantId(code),
    () => undefined,
  );

  useEffect(() => {
    if (participantId === null) router.replace(`/j/${code}`);
  }, [participantId, code, router]);

  if (participantId === undefined || participantId === null) return <div className="min-h-screen bg-room" />;

  return <MeetingRoom code={code} participantId={participantId} />;
}
