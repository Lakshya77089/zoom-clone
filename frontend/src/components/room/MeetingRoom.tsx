"use client";

import { useEffect, useState } from "react";
import { LiveRoom } from "@/components/room/LiveRoom";
import { RoomNotice } from "@/components/room/RoomNotice";
import { Spinner } from "@/components/ui/Spinner";
import { useRoomState } from "@/hooks/useRoomState";
import { readPreferences } from "@/lib/preferences";
import { clearNewMeeting, isNewMeeting } from "@/lib/participantSession";

interface MeetingRoomProps {
  code: string;
  participantId: number;
}

export function MeetingRoom({ code, participantId }: MeetingRoomProps) {
  const { state, setState, error, refresh } = useRoomState(code, participantId);
  const [showInvite] = useState(() => isNewMeeting(code) && readPreferences().showInviteOnStart);

  useEffect(() => clearNewMeeting(code), [code]);

  if (error) return <RoomNotice title={error} />;

  if (!state) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-room text-sm text-white/70" data-testid="room-connecting">
        <Spinner size={28} className="text-white/80" />
        Connecting to meeting...
      </div>
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

  return <LiveRoom code={code} state={state} setState={setState} refresh={refresh} showInviteOnLoad={showInvite} />;
}
