"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormAlert } from "@/components/ui/field";
import { TextField } from "@/components/ui/TextField";
import { MAX_DISPLAY_NAME_LENGTH, MESSAGES } from "@/constants";
import { api, ApiError } from "@/lib/api";
import { parseMeetingInput } from "@/lib/meetingCode";
import type { Preferences } from "@/lib/preferences";
import type { MeetingSession } from "@/types";

interface JoinMeetingFormProps {
  defaultName: string;
  preferences: Preferences;
  onJoined: (session: MeetingSession) => void;
  onCancel: () => void;
}

interface FieldErrors {
  meeting?: string;
  name?: string;
}

const NOT_FOUND_STATUSES = new Set([404, 410]);

export function JoinMeetingForm({ defaultName, preferences, onJoined, onCancel }: JoinMeetingFormProps) {
  const [meetingInput, setMeetingInput] = useState("");
  const [name, setName] = useState(defaultName);
  const [audioOff, setAudioOff] = useState(preferences.joinMuted);
  const [videoOff, setVideoOff] = useState(preferences.joinVideoOff);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const code = parseMeetingInput(meetingInput);
    const nextErrors: FieldErrors = {
      meeting: !meetingInput.trim() ? MESSAGES.meetingIdRequired : !code ? MESSAGES.meetingIdInvalid : undefined,
      name: name.trim() ? undefined : MESSAGES.displayNameRequired,
    };
    setErrors(nextErrors);
    setFormError(null);
    if (!code || nextErrors.name) return;

    setSubmitting(true);
    try {
      onJoined(await api.joinMeeting(code, name.trim(), { is_muted: audioOff, is_video_on: !videoOff }));
    } catch (error) {
      if (error instanceof ApiError && NOT_FOUND_STATUSES.has(error.status)) {
        setErrors({ meeting: error.status === 404 ? MESSAGES.meetingNotFound : error.message });
      } else {
        setFormError(error instanceof Error ? error.message : MESSAGES.genericError);
      }
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate data-testid="join-meeting-form">
      <TextField
        id="join-meeting-id"
        label="Meeting ID or invite link"
        placeholder="Enter meeting ID or invite link"
        value={meetingInput}
        error={errors.meeting}
        onChange={(event) => {
          setMeetingInput(event.target.value);
          setErrors((current) => ({ ...current, meeting: undefined }));
        }}
        autoFocus
        autoComplete="off"
        inputMode="text"
        data-testid="meeting-id-input"
      />
      <TextField
        id="join-display-name"
        label="Your name"
        placeholder="Enter your name"
        value={name}
        error={errors.name}
        onChange={(event) => {
          setName(event.target.value);
          setErrors((current) => ({ ...current, name: undefined }));
        }}
        maxLength={MAX_DISPLAY_NAME_LENGTH}
        autoComplete="name"
        data-testid="display-name-input"
      />
      <div className="space-y-3">
        <Checkbox id="join-audio-off" label="Don't connect to audio" checked={audioOff} onChange={setAudioOff} />
        <Checkbox id="join-video-off" label="Turn off my video" checked={videoOff} onChange={setVideoOff} />
      </div>
      {formError && <FormAlert>{formError}</FormAlert>}
      <p className="text-[13px] text-ink-muted">
        By clicking &quot;Join&quot;, you agree to our <span className="text-zoom-blue">Terms of Service</span> and{" "}
        <span className="text-zoom-blue">Privacy Statement</span>.
      </p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!meetingInput.trim()} loading={submitting} data-testid="join-submit">
          {submitting ? "Joining..." : "Join"}
        </Button>
      </div>
    </form>
  );
}
