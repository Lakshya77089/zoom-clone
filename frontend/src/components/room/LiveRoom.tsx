"use client";

import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { EncryptionShieldIcon, GalleryIcon } from "@/components/icons";
import { MeetingInfo } from "@/components/room/MeetingInfo";
import { MeetingToolbar } from "@/components/room/MeetingToolbar";
import { ParticipantsPanel } from "@/components/room/ParticipantsPanel";
import { RemoteAudio } from "@/components/room/RemoteAudio";
import { VideoGrid } from "@/components/room/VideoGrid";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { ROUTES } from "@/constants";
import { useCopyWithToast } from "@/hooks/useCopyWithToast";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { usePeerMesh } from "@/hooks/usePeerMesh";
import { api } from "@/lib/api";
import { buildInvitation } from "@/lib/format";
import { clearParticipantId } from "@/lib/participantSession";
import type { Participant, RoomState } from "@/types";
import { unavailableClass } from "@/components/ui/unavailable";

interface LiveRoomProps {
  code: string;
  state: RoomState;
  setState: Dispatch<SetStateAction<RoomState | null>>;
  refresh: () => Promise<void>;
  showInviteOnLoad: boolean;
}

type MediaChanges = Partial<Pick<Participant, "is_muted" | "is_video_on">>;

function patchSelf(state: RoomState, changes: MediaChanges): RoomState {
  const me = { ...state.me, ...changes };
  return {
    ...state,
    me,
    participants: state.participants.map((p) => (p.id === me.id ? me : p)),
  };
}

export function LiveRoom({ code, state, setState, refresh, showInviteOnLoad }: LiveRoomProps) {
  const router = useRouter();
  const toast = useToast();
  const copy = useCopyWithToast();
  const { meeting, me, participants } = state;
  const isHost = me.role === "host";
  const [panelOpen, setPanelOpen] = useState(false);
  const [removing, setRemoving] = useState<Participant | null>(null);
  const { stream, error: mediaError } = useLocalMedia({ audioEnabled: !me.is_muted, videoEnabled: me.is_video_on });
  const mesh = usePeerMesh(
    code,
    me.id,
    participants.map((p) => p.id),
    stream,
  );

  const run = useCallback(
    async (action: () => Promise<unknown>, success?: string) => {
      try {
        await action();
        if (success) toast(success);
      } catch (err) {
        toast(err instanceof Error ? err.message : "Something went wrong.", "error");
      } finally {
        await refresh();
      }
    },
    [refresh, toast],
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
      router.push(ROUTES.home);
    }
  };

  const muteAll = () => void run(() => api.muteAll(code, me.id), "All participants have been muted");

  const confirmRemove = () => {
    if (!removing) return;
    const target = removing;
    setRemoving(null);
    void run(() => api.removeParticipant(code, target.id, me.id), `${target.display_name} was removed`);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-room text-white" data-testid="meeting-room" data-meeting-code={code}>
      <header className="relative z-30 flex h-10 shrink-0 items-center gap-2 px-2 sm:px-3">
        <MeetingInfo meeting={meeting} defaultOpen={showInviteOnLoad} />
        <p className="min-w-0 flex-1 truncate text-xs font-semibold text-white/90" data-testid="room-title">
          {meeting.title}
        </p>
        <EncryptionShieldIcon size={18} aria-hidden />
        <span aria-hidden className={`flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-white/90 ${unavailableClass}`}>
          <GalleryIcon size={12} />
          View
        </span>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <main className="min-h-0 min-w-0 flex-1">
          <VideoGrid participants={participants} selfId={me.id} localStream={stream} mesh={mesh} />
          {participants
            .filter((p) => p.id !== me.id && mesh.streams.has(p.id))
            .map((p) => (
              <RemoteAudio key={p.id} participantId={p.id} stream={mesh.streams.get(p.id)!} />
            ))}
        </main>

        {panelOpen && (
          <ParticipantsPanel
            participants={participants}
            selfId={me.id}
            isHost={isHost}
            inviteLink={meeting.invite_link}
            onClose={() => setPanelOpen(false)}
            onMuteAll={muteAll}
            onRemove={setRemoving}
          />
        )}

        {mediaError && (
          <div
            role="status"
            className="pointer-events-none absolute left-1/2 top-2 z-20 max-w-[90%] -translate-x-1/2 rounded-lg bg-black/75 px-4 py-2 text-center text-[13px]"
          >
            {mediaError}
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
        onCopyLink={() => void copy(meeting.invite_link, "Invite link copied")}
        onCopyInvitation={() => void copy(buildInvitation(meeting), "Invitation copied to clipboard")}
        onCopyMeetingId={() => void copy(meeting.meeting_code, "Meeting ID copied")}
        onMuteAll={muteAll}
        onLeave={() => void exit(() => api.leaveMeeting(code, me.id))}
        onEndForAll={() => void exit(() => api.endMeeting(code, me.id))}
      />

      {removing && (
        <ConfirmDialog
          title="Remove participant?"
          message={`${removing.display_name} will be removed from this meeting.`}
          confirmLabel="Remove"
          onConfirm={confirmRemove}
          onCancel={() => setRemoving(null)}
        />
      )}
    </div>
  );
}
