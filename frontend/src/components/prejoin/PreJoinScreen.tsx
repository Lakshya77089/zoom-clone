"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button, buttonClasses } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ZoomLogo } from "@/components/ui/ZoomLogo";
import { MediaIconButton } from "@/components/room/MediaIconButton";
import { SelfVideo } from "@/components/room/SelfVideo";
import { useEnterMeeting } from "@/hooks/useEnterMeeting";
import { useLocalMedia } from "@/hooks/useLocalMedia";
import { api } from "@/lib/api";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface PreJoinScreenProps {
  code: string;
}

export function PreJoinScreen({ code }: PreJoinScreenProps) {
  const enterMeeting = useEnterMeeting();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
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
    if (!name.trim()) return setJoinError("Please enter your name.");
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
    <div className="min-h-screen bg-white">
      <header className="flex h-14 items-center border-b border-line px-4 sm:px-6">
        <Link href="/">
          <ZoomLogo />
        </Link>
      </header>

      {loadError ? (
        <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
          <AlertCircle size={48} className="text-zoom-red" />
          <h1 className="mt-4 text-xl font-bold">{loadError}</h1>
          <p className="mt-2 text-sm text-ink-muted">Meeting ID: {formatMeetingCode(code)}</p>
          <Link href="/" className={`mt-6 ${buttonClasses()}`}>
            Back to home
          </Link>
        </div>
      ) : (
        <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[3fr_2fr] md:items-center md:py-16">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-room">
            {stream && videoOn ? (
              <SelfVideo stream={stream} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Avatar name={name || "Guest"} size="xl" />
              </div>
            )}
            {mediaError && (
              <p className="absolute left-3 right-3 top-3 rounded-lg bg-black/60 px-3 py-2 text-xs text-white">{mediaError}</p>
            )}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4">
              <MediaIconButton kind="audio" enabled={audioOn} onToggle={() => setAudioOn((on) => !on)} variant="round" />
              <MediaIconButton kind="video" enabled={videoOn} onToggle={() => setVideoOn((on) => !on)} variant="round" />
            </div>
          </div>

          <form onSubmit={handleJoin} className="space-y-5" noValidate>
            <div>
              <p className="text-sm text-ink-muted">You are joining</p>
              <h1 className="mt-1 text-2xl font-bold" data-testid="prejoin-title">
                {meeting ? meeting.title : <span className="inline-block h-7 w-56 animate-pulse rounded bg-canvas" />}
              </h1>
              <p className="mt-1 text-sm text-ink-muted">Meeting ID: {formatMeetingCode(code)}</p>
            </div>
            <TextField
              id="prejoin-name"
              label="Your name"
              placeholder="Enter your name"
              value={name}
              maxLength={100}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
            {joinError && (
              <p role="alert" className="rounded-lg bg-zoom-red/10 px-3 py-2 text-sm text-zoom-red">
                {joinError}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={!meeting || joining || !name.trim()}>
              {joining ? "Joining..." : "Join"}
            </Button>
          </form>
        </main>
      )}
    </div>
  );
}
