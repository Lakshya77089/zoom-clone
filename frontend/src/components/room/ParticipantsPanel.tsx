"use client";

import { useState } from "react";
import { CloseIcon, MicIcon, MicOffIcon, MoreIcon, SearchIcon, VideoIcon, VideoOffIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { Participant } from "@/types";
import { unavailableClass } from "@/components/ui/unavailable";

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
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const sorted = [...participants].filter((p) => p.display_name.toLowerCase().includes(needle)).sort((a, b) => {
    const rank = (p: Participant) => (p.id === selfId ? 0 : p.role === "host" ? 1 : 2);
    return rank(a) - rank(b);
  });

  return (
    <aside
      className="absolute inset-0 z-20 flex animate-fade-in flex-col bg-white text-ink sm:static sm:m-1.5 sm:w-80 sm:shrink-0 sm:rounded-xl"
      aria-label="Participants"
      data-testid="participants-panel"
    >
      <div className="relative flex h-11 shrink-0 items-center justify-center px-10">
        <h2 className="text-sm font-bold leading-[18px]">Participants ({participants.length})</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close participants"
          className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full text-ink-soft hover:bg-canvas"
        >
          <CloseIcon size={16} />
        </button>
      </div>
      <div className="px-3 pb-2">
        <label className="relative block">
          <SearchIcon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a participant"
            aria-label="Find a participant"
            className="h-8 w-full rounded-lg border-[0.8px] border-line-strong bg-white pl-8 pr-3 text-sm outline-none placeholder:text-ink-disabled focus:border-zoom-blue"
          />
        </label>
      </div>

      <ul className="flex-1 overflow-y-auto py-1">
        {sorted.map((participant) => {
          const isSelf = participant.id === selfId;
          return (
            <li key={participant.id} className="group flex items-center gap-2.5 px-4 py-1.5 hover:bg-hover" data-testid="participant-row">
              <Avatar name={participant.display_name} size="sm" square />
              <p className="min-w-0 flex-1 truncate text-sm">
                <span>{participant.display_name}</span>{" "}
                <span className="text-ink-muted">{describe(participant, isSelf)}</span>
              </p>
              {isHost && !isSelf && (
                <button
                  type="button"
                  onClick={() => onRemove(participant)}
                  data-testid="remove-participant"
                  aria-label={`Remove ${participant.display_name}`}
                  className="h-6 rounded-lg bg-canvas px-2 text-xs text-zoom-red hover:bg-[#e4e8eb] focus:block sm:hidden sm:group-hover:block"
                >
                  Remove
                </button>
              )}
              {participant.is_muted ? (
                <MicOffIcon size={16} className="text-zoom-red" aria-label="Muted" />
              ) : (
                <MicIcon size={16} className="text-ink-muted" aria-label="Unmuted" />
              )}
              {participant.is_video_on ? (
                <VideoIcon size={16} className="text-ink-muted" aria-label="Video on" />
              ) : (
                <VideoOffIcon size={16} className="text-zoom-red" aria-label="Video off" />
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end gap-2 border-t-[0.8px] border-line px-3 py-3">
        <button type="button" onClick={() => copy(inviteLink)} className="h-8 rounded-xl bg-canvas px-3.5 text-sm text-ink hover:bg-[#e4e8eb]">
          {copied ? "Link copied" : "Invite"}
        </button>
        {isHost && (
          <button type="button" onClick={onMuteAll} data-testid="mute-all" className="h-8 rounded-xl bg-canvas px-3.5 text-sm text-ink hover:bg-[#e4e8eb]">
            Mute All
          </button>
        )}
        <span aria-hidden className={`flex h-8 w-8 items-center justify-center rounded-xl bg-canvas text-ink ${unavailableClass}`}>
          <MoreIcon size={16} />
        </span>
      </div>
    </aside>
  );
}
