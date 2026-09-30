"use client";

import { Check, Mic, MicOff, UserPlus, Video, VideoOff, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { Participant } from "@/types";

interface ParticipantsPanelProps {
  participants: Participant[];
  selfId: number;
  isHost: boolean;
  inviteLink: string;
  onClose: () => void;
  onMuteAll: () => void;
  onRemove: (participant: Participant) => void;
}

function describe(participant: Participant, isSelf: boolean): string {
  const tags = [participant.role === "host" ? "Host" : null, isSelf ? "me" : null].filter(Boolean);
  return tags.length ? `(${tags.join(", ")})` : "";
}

export function ParticipantsPanel({
  participants,
  selfId,
  isHost,
  inviteLink,
  onClose,
  onMuteAll,
  onRemove,
}: ParticipantsPanelProps) {
  const { copied, copy } = useCopyToClipboard();
  const sorted = [...participants].sort((a, b) => {
    const rank = (p: Participant) => (p.id === selfId ? 0 : p.role === "host" ? 1 : 2);
    return rank(a) - rank(b);
  });

  return (
    <aside
      className="absolute inset-0 z-20 flex animate-fade-in flex-col bg-white text-ink sm:static sm:w-80 sm:shrink-0 sm:border-l sm:border-black/20"
      aria-label="Participants"
      data-testid="participants-panel"
    >
      <div className="flex h-12 items-center justify-between border-b border-line px-4">
        <h2 className="text-sm font-semibold">Participants ({participants.length})</h2>
        <button type="button" onClick={onClose} aria-label="Close participants" className="rounded p-1 text-ink-muted hover:bg-canvas">
          <X size={18} />
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto py-1">
        {sorted.map((participant) => {
          const isSelf = participant.id === selfId;
          return (
            <li key={participant.id} className="group flex items-center gap-3 px-4 py-2 hover:bg-hover" data-testid="participant-row">
              <Avatar name={participant.display_name} size="sm" />
              <p className="min-w-0 flex-1 truncate text-sm">
                <span className="font-medium">{participant.display_name}</span>{" "}
                <span className="text-ink-muted">{describe(participant, isSelf)}</span>
              </p>
              {isHost && !isSelf && (
                <button
                  type="button"
                  onClick={() => onRemove(participant)}
                  data-testid="remove-participant"
                  aria-label={`Remove ${participant.display_name}`}
                  className="rounded-md border border-line px-2 py-0.5 text-xs font-semibold text-zoom-red hover:bg-zoom-red/5 focus:block sm:hidden sm:group-hover:block"
                >
                  Remove
                </button>
              )}
              {participant.is_muted ? (
                <MicOff size={16} className="text-zoom-red" aria-label="Muted" />
              ) : (
                <Mic size={16} className="text-ink-muted" aria-label="Unmuted" />
              )}
              {participant.is_video_on ? (
                <Video size={16} className="text-ink-muted" aria-label="Video on" />
              ) : (
                <VideoOff size={16} className="text-zoom-red" aria-label="Video off" />
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2 border-t border-line p-3">
        <button
          type="button"
          onClick={() => copy(inviteLink)}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-outline text-sm font-semibold hover:bg-hover"
        >
          {copied ? <Check size={16} /> : <UserPlus size={16} />}
          {copied ? "Link copied" : "Invite"}
        </button>
        {isHost && (
          <button
            type="button"
            onClick={onMuteAll}
            data-testid="mute-all"
            className="h-9 flex-1 rounded-[10px] border border-outline text-sm font-semibold hover:bg-hover"
          >
            Mute All
          </button>
        )}
      </div>
    </aside>
  );
}
