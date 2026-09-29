"use client";

import { LiveRoom } from "@/components/room/LiveRoom";
import { RoomNotice } from "@/components/room/RoomNotice";
import { useRoomState } from "@/hooks/useRoomState";

interface MeetingRoomProps {
  code: string;
  participantId: number;
}

export function MeetingRoom({ code, participantId }: MeetingRoomProps) {
  const { state, setState, error, refresh } = useRoomState(code, participantId);

  if (error) return <RoomNotice title={error} />;

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-room text-sm text-white/70">Connecting...</div>
    );
  }

  if (state.me.status === "removed") {
    return <RoomNotice title="You have been removed from this meeting" message="The host removed you from the meeting." />;
  }

  if (state.meeting.status === "ended") {
    return <RoomNotice title="This meeting has been ended by host" />;
  }

  if (state.me.status === "left") {
    return <RoomNotice title="You have left the meeting" />;
  }

  return <LiveRoom code={code} state={state} setState={setState} refresh={refresh} />;
}
