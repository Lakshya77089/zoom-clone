"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/field";
import { TextField } from "@/components/ui/TextField";
import { MESSAGES, ROUTES } from "@/constants";
import { api, ApiError } from "@/lib/api";
import { parseMeetingInput } from "@/lib/meetingCode";

export function JoinByIdView() {
  const router = useRouter();
  const params = useSearchParams();
  const [meetingInput, setMeetingInput] = useState(params.get("id") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const code = parseMeetingInput(meetingInput);
    setFormError(null);
    if (!code) {
      setError(meetingInput.trim() ? MESSAGES.meetingIdInvalid : MESSAGES.meetingIdRequired);
      return;
    }
    setChecking(true);
    try {
      await api.getMeeting(code);
      router.push(ROUTES.prejoin(code));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setError(MESSAGES.meetingNotFound);
      else if (err instanceof ApiError && err.status === 410) setError(err.message);
      else setFormError(err instanceof Error ? err.message : MESSAGES.genericError);
      setChecking(false);
    }
  };

  return (
    <main className="flex flex-1 justify-center px-4 pb-16 pt-16 sm:pt-24">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[360px] space-y-5" data-testid="join-page-form">
        <h1 className="pb-3 text-center text-2xl font-semibold tracking-tight">Join Meeting</h1>
        <TextField
          id="join-page-meeting-id"
          label="Meeting ID or Personal Link Name"
          value={meetingInput}
          error={error}
          onChange={(event) => {
            setMeetingInput(event.target.value);
            setError(null);
          }}
          autoFocus
          autoComplete="off"
          data-testid="meeting-id-input"
        />
        <p className="text-[13px] text-ink">
          By clicking &quot;Join&quot;, you agree to our <span className="text-zoom-blue">Terms of Service</span> and{" "}
          <span className="text-zoom-blue">Privacy Statement</span>
        </p>
        {formError && <FormAlert>{formError}</FormAlert>}
        <Button type="submit" className="w-full" disabled={!meetingInput.trim()} loading={checking} data-testid="join-submit">
          Join
        </Button>
      </form>
    </main>
  );
}
