"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MinimalHeader } from "@/components/layout/MinimalHeader";
import { MediaIconButton } from "@/components/room/MediaIconButton";
import { StreamVideo } from "@/components/room/StreamVideo";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/field";
import { TextField } from "@/components/ui/TextField";
import { MAX_DISPLAY_NAME_LENGTH, MESSAGES, ROUTES } from "@/constants";
import { useEnterMeeting } from "@/hooks/useEnterMeeting";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { usePreferences } from "@/hooks/usePreferences";
import { api } from "@/lib/api";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface PreJoinScreenProps {
  code: string;
}

function InvalidMeeting({ message, code }: { message: string; code: string }) {
  return (
    <main className="relative flex flex-1 flex-col items-center px-6 pt-24 text-center" data-testid="prejoin-error">
      <Link href={ROUTES.join} className="absolute left-4 top-6 flex items-center gap-0.5 text-sm text-zoom-blue hover:underline sm:left-8">
        <ChevronLeft size={18} />
        Back
      </Link>
      <h1 className="text-xl font-semibold">{message}</h1>
      <p className="mt-2 text-sm text-ink-muted">Meeting ID: {formatMeetingCode(code)}</p>
      <div className="mt-8 flex gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Try again
        </Button>
        <Link href={ROUTES.join} className="inline-flex h-10 items-center rounded-[10px] bg-zoom-blue px-4 text-sm font-semibold text-white hover:bg-zoom-blue-dark">
          Enter a different ID
        </Link>
      </div>
    </main>
  );
}

export function PreJoinScreen({ code }: PreJoinScreenProps) {
  const enterMeeting = useEnterMeeting();
  const { preferences } = usePreferences();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [audioChoice, setAudioChoice] = useState<boolean | null>(null);
  const [videoChoice, setVideoChoice] = useState<boolean | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const audioOn = audioChoice ?? !preferences.joinMuted;
  const videoOn = videoChoice ?? !preferences.joinVideoOff;
  const { stream, error: mediaError } = useLocalMedia({ audioEnabled: audioOn, videoEnabled: videoOn });

  useEffect(() => {
    let active = true;
    api
      .getMeeting(code)
      .then((result) => active && setMeeting(result))
      .catch((err: Error) => active && setLoadError(err.message));
    return () => {
      active = false;
    };
  }, [code]);

  const handleJoin = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setNameError(MESSAGES.displayNameRequired);
      return;
    }
    setJoining(true);
    setJoinError(null);
    try {
      enterMeeting(await api.joinMeeting(code, name.trim(), { is_muted: !audioOn, is_video_on: videoOn }));
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Unable to join the meeting.");
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <MinimalHeader />

      {loadError ? (
        <InvalidMeeting message={loadError} code={code} />
      ) : (
        <main className="mx-auto grid w-full max-w-5xl flex-1 content-start gap-8 px-4 py-6 sm:px-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:content-center md:gap-12 md:py-12">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-room" data-testid="prejoin-preview">
            {stream && videoOn ? (
              <StreamVideo stream={stream} mirrored />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <Avatar name={name || "Guest"} size="xl" />
                {!videoOn && <p className="text-[13px] text-white/60">Your video is off</p>}
              </div>
            )}
            {mediaError && (
              <p className="absolute left-3 right-3 top-3 rounded-lg bg-black/65 px-3 py-2 text-xs text-white">{mediaError}</p>
            )}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3">
              <MediaIconButton kind="audio" enabled={audioOn} onToggle={() => setAudioChoice(!audioOn)} variant="round" />
              <MediaIconButton kind="video" enabled={videoOn} onToggle={() => setVideoChoice(!videoOn)} variant="round" />
            </div>
          </div>

          <form onSubmit={handleJoin} className="space-y-5" noValidate data-testid="prejoin-form">
            <div>
              <p className="text-[13px] font-medium text-ink-muted">You are joining</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight" data-testid="prejoin-title">
                {meeting ? meeting.title : <span className="inline-block h-7 w-56 max-w-full animate-pulse rounded-lg bg-canvas" />}
              </h1>
              <p className="mt-1 text-sm text-ink-muted">
                Meeting ID: {formatMeetingCode(code)}
                {meeting && <> · Hosted by {meeting.host.name}</>}
              </p>
            </div>
            <TextField
              id="prejoin-name"
              label="Your name"
              placeholder="Enter your name"
              value={name}
              error={nameError}
              maxLength={MAX_DISPLAY_NAME_LENGTH}
              onChange={(event) => {
                setName(event.target.value);
                setNameError(null);
              }}
              autoFocus
              autoComplete="name"
              data-testid="display-name-input"
            />
            {joinError && <FormAlert>{joinError}</FormAlert>}
            <Button type="submit" size="lg" className="w-full" disabled={!meeting} loading={joining} data-testid="join-submit">
              {joining ? "Joining..." : "Join"}
            </Button>
            <p className="text-center text-[13px] text-ink-muted">
              {audioOn ? "Microphone on" : "Microphone off"} · {videoOn ? "Camera on" : "Camera off"}
            </p>
          </form>
        </main>
      )}
    </div>
  );
}
