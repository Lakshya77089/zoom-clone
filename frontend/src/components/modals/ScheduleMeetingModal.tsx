"use client";

import { useState, type FormEvent } from "react";
import { CalendarCheck, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { api } from "@/lib/api";
import {
  buildInvitation,
  formatDayLabel,
  formatDuration,
  formatTimeRange,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/format";
import { formatMeetingCode } from "@/lib/meetingCode";
import type { Meeting } from "@/types";

interface ScheduleMeetingModalProps {
  defaultTitle: string;
  onClose: () => void;
  onScheduled: (meeting: Meeting) => void;
}

const HOUR_OPTIONS = Array.from({ length: 25 }, (_, hour) => hour);
const MINUTE_OPTIONS = [0, 15, 30, 45];
const MIN_DURATION_MINUTES = 15;

function nextHalfHour(): Date {
  const date = new Date();
  date.setSeconds(0, 0);
  date.setMinutes(date.getMinutes() < 30 ? 30 : 60);
  return date;
}

const selectClass =
  "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-zoom-blue focus:ring-2 focus:ring-zoom-blue/20";

export function ScheduleMeetingModal({ defaultTitle, onClose, onScheduled }: ScheduleMeetingModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => toDateInputValue(nextHalfHour()));
  const [time, setTime] = useState(() => toTimeInputValue(nextHalfHour()));
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [scheduled, setScheduled] = useState<Meeting | null>(null);
  const { copied, copy } = useCopyToClipboard();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const start = new Date(`${date}T${time}`);
    const duration = hours * 60 + minutes;

    if (!title.trim()) return setError("Please enter a meeting topic.");
    if (Number.isNaN(start.getTime())) return setError("Please choose a valid date and time.");
    if (start.getTime() < Date.now() - 60_000) return setError("Meeting start time must be in the future.");
    if (duration < MIN_DURATION_MINUTES) return setError("Duration must be at least 15 minutes.");

    setSubmitting(true);
    setError(null);
    try {
      const meeting = await api.scheduleMeeting({
        title: title.trim(),
        description: description.trim() || undefined,
        start_time: start.toISOString(),
        duration_minutes: duration,
      });
      setScheduled(meeting);
      onScheduled(meeting);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to schedule the meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  if (scheduled) {
    return (
      <Modal
        title="Meeting scheduled"
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={() => copy(buildInvitation(scheduled))}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy invitation"}
            </Button>
            <Button onClick={onClose}>Done</Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zoom-green/15 text-[#0f8a34]">
            <CalendarCheck size={24} />
          </span>
          <dl className="min-w-0 space-y-3 text-sm">
            <div>
              <dt className="text-ink-muted">Topic</dt>
              <dd className="font-bold">{scheduled.title}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Time</dt>
              <dd className="font-bold">
                {scheduled.scheduled_start &&
                  `${formatDayLabel(scheduled.scheduled_start)}, ${formatTimeRange(scheduled.scheduled_start, scheduled.scheduled_end)}`}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted">Duration</dt>
              <dd className="font-bold">{formatDuration(scheduled.duration_minutes ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Meeting ID</dt>
              <dd className="font-bold">{formatMeetingCode(scheduled.meeting_code)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Invite link</dt>
              <dd className="break-all font-bold text-zoom-blue" data-testid="scheduled-invite-link">
                {scheduled.invite_link}
              </dd>
            </div>
          </dl>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Schedule meeting" onClose={onClose} widthClass="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="schedule-title"
          label="Topic"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          autoFocus
        />
        <label htmlFor="schedule-description" className="block">
          <span className="mb-1.5 block text-sm font-bold">Description (optional)</span>
          <textarea
            id="schedule-description"
            rows={3}
            maxLength={2000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a description"
            className="w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-zoom-blue focus:ring-2 focus:ring-zoom-blue/20"
          />
        </label>

        <fieldset>
          <legend className="mb-1.5 text-sm font-bold">When</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="date"
              aria-label="Date"
              value={date}
              min={toDateInputValue(new Date())}
              onChange={(event) => setDate(event.target.value)}
              className={selectClass}
            />
            <input
              type="time"
              aria-label="Time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={selectClass}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 text-sm font-bold">Duration</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <select
                aria-label="Duration hours"
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
                className={selectClass}
              >
                {HOUR_OPTIONS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              hr
            </label>
            <label className="flex items-center gap-2 text-sm">
              <select
                aria-label="Duration minutes"
                value={minutes}
                onChange={(event) => setMinutes(Number(event.target.value))}
                className={selectClass}
              >
                {MINUTE_OPTIONS.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              min
            </label>
          </div>
        </fieldset>

        <p className="rounded-lg bg-canvas px-3 py-2 text-xs text-ink-muted">
          A meeting ID and invite link will be generated automatically.
        </p>

        {error && (
          <p role="alert" className="rounded-lg bg-zoom-red/10 px-3 py-2 text-sm text-zoom-red">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
