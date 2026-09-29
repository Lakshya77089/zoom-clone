"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { MeetingInfo } from "@/components/room/MeetingInfo";
import { MeetingToolbar } from "@/components/room/MeetingToolbar";
import { ParticipantsPanel } from "@/components/room/ParticipantsPanel";
import { VideoGrid } from "@/components/room/VideoGrid";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { api } from "@/lib/api";
import { clearParticipantId } from "@/lib/participantSession";
import type { Participant, RoomState } from "@/types";

interface LiveRoomProps {
  code: string;
  state: RoomState;
  setState: Dispatch<SetStateAction<RoomState | null>>;
  refresh: () => Promise<void>;
}

type MediaChanges = Partial<Pick<Participant, "is_muted" | "is_video_on">>;

const TOAST_DURATION_MS = 3000;

function patchSelf(state: RoomState, changes: MediaChanges): RoomState {
  const me = { ...state.me, ...changes };
  return {
    ...state,
    me,
    participants: state.participants.map((p) => (p.id === me.id ? me : p)),
  };
}

export function LiveRoom({ code, state, setState, refresh }: LiveRoomProps) {
  const router = useRouter();
  const { meeting, me, participants } = state;
  const isHost = me.role === "host";
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { stream, error: mediaError } = useLocalMedia({ audioEnabled: !me.is_muted, videoEnabled: me.is_video_on });

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [toast]);

  const run = useCallback(
    async (action: () => Promise<unknown>, success?: string) => {
      try {
        await action();
        if (success) setToast(success);
      } catch (err) {
        setToast(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        await refresh();
      }
    },
    [refresh],
  );

  const updateSelf = (changes: MediaChanges) => {
    setState((current) => (current ? patchSelf(current, changes) : current));
    void run(() => api.updateSelf(code, me.id, changes));
  };

  const exit = async (action: () => Promise<unknown>) => {
    try {
      await action();
    } finally {
      clearParticipantId(code);
      router.push("/");
    }
  };

  const handleRemove = (participant: Participant) => {
    if (!window.confirm(`Remove ${participant.display_name} from this meeting?`)) return;
    void run(() => api.removeParticipant(code, participant.id, me.id), `${participant.display_name} was removed`);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-room text-white">
      <header className="flex h-11 shrink-0 items-center justify-between gap-3 px-3">
        <MeetingInfo meeting={meeting} />
        <p className="truncate text-sm font-bold text-white/90" data-testid="room-title">
          {meeting.title}
        </p>
        <span className="w-12" />
      </header>

      <div className="relative flex min-h-0 flex-1">
        <main className="min-h-0 min-w-0 flex-1">
          <VideoGrid participants={participants} selfId={me.id} stream={stream} />
        </main>

        {panelOpen && (
          <ParticipantsPanel
            participants={participants}
            selfId={me.id}
            isHost={isHost}
            inviteLink={meeting.invite_link}
            onClose={() => setPanelOpen(false)}
            onMuteAll={() => void run(() => api.muteAll(code, me.id), "All participants have been muted")}
            onRemove={handleRemove}
          />
        )}

        {(toast || mediaError) && (
          <div
            role="status"
            className="pointer-events-none absolute left-1/2 top-3 z-30 max-w-[90%] -translate-x-1/2 rounded-lg bg-black/80 px-4 py-2 text-center text-sm"
          >
            {toast ?? mediaError}
          </div>
        )}
      </div>

      <MeetingToolbar
        isMuted={me.is_muted}
        isVideoOn={me.is_video_on}
        isHost={isHost}
        participantCount={participants.length}
        participantsOpen={panelOpen}
        onToggleMute={() => updateSelf({ is_muted: !me.is_muted })}
        onToggleVideo={() => updateSelf({ is_video_on: !me.is_video_on })}
        onToggleParticipants={() => setPanelOpen((open) => !open)}
        onLeave={() => void exit(() => api.leaveMeeting(code, me.id))}
        onEndForAll={() => void exit(() => api.endMeeting(code, me.id))}
      />
    </div>
  );
}
