"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { api } from "@/lib/api";
import { parseMeetingInput } from "@/lib/meetingCode";
import type { MeetingSession } from "@/types";

interface JoinMeetingModalProps {
  defaultName: string;
  onClose: () => void;
  onJoined: (session: MeetingSession) => void;
}

export function JoinMeetingModal({ defaultName, onClose, onJoined }: JoinMeetingModalProps) {
  const [meetingInput, setMeetingInput] = useState("");
  const [name, setName] = useState(defaultName);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = meetingInput.trim().length > 0 && name.trim().length > 0 && !submitting;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const code = parseMeetingInput(meetingInput);
    if (!code) {
      setError("Please enter a valid meeting ID or invite link.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      onJoined(await api.joinMeeting(code, name.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to join the meeting.");
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Join meeting" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="join-meeting-id"
          label="Meeting ID or invite link"
          placeholder="Enter meeting ID or invite link"
          value={meetingInput}
          onChange={(event) => setMeetingInput(event.target.value)}
          autoFocus
          autoComplete="off"
        />
        <TextField
          id="join-display-name"
          label="Your name"
          placeholder="Enter your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={100}
        />
        {error && (
          <p role="alert" className="rounded-lg bg-zoom-red/10 px-3 py-2 text-sm text-zoom-red">
            {error}
          </p>
        )}
        <p className="text-xs text-ink-muted">
          By clicking &quot;Join&quot;, you agree to our Terms of Service and Privacy Statement.
        </p>
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {submitting ? "Joining..." : "Join"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
