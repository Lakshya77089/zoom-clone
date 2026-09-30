"use client";

import { useState, type FormEvent } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldMessage, FormAlert, inputClasses } from "@/components/ui/field";
import { TextField } from "@/components/ui/TextField";
import {
  DURATION_HOUR_OPTIONS,
  DURATION_MINUTE_OPTIONS,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MESSAGES,
  MIN_DURATION_MINUTES,
} from "@/constants";
import { api } from "@/lib/api";
import { toDateInputValue, toTimeInputValue } from "@/lib/format";
import type { Meeting } from "@/types";

interface ScheduleMeetingFormProps {
  defaultTitle: string;
  onCancel: () => void;
  onScheduled: (meeting: Meeting) => void;
}

interface FieldErrors {
  title?: string;
  when?: string;
  duration?: string;
}

const START_GRACE_MS = 60_000;
const DEFAULT_DURATION_HOURS = 1;

function nextHalfHour(): Date {
  const date = new Date();
  date.setSeconds(0, 0);
  date.setMinutes(date.getMinutes() < 30 ? 30 : 60);
  return date;
}

function validate(title: string, start: Date, duration: number): FieldErrors {
  return {
    title: title.trim() ? undefined : "Please enter a meeting topic.",
    when: Number.isNaN(start.getTime())
      ? "Please choose a valid date and time."
      : start.getTime() < Date.now() - START_GRACE_MS
        ? "Meeting start time must be in the future."
        : undefined,
    duration: duration < MIN_DURATION_MINUTES ? `Duration must be at least ${MIN_DURATION_MINUTES} minutes.` : undefined,
  };
}

export function ScheduleMeetingForm({ defaultTitle, onCancel, onScheduled }: ScheduleMeetingFormProps) {
  const [initialStart] = useState(nextHalfHour);
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => toDateInputValue(initialStart));
  const [time, setTime] = useState(() => toTimeInputValue(initialStart));
  const [hours, setHours] = useState(DEFAULT_DURATION_HOURS);
  const [minutes, setMinutes] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [today] = useState(() => toDateInputValue(new Date()));

  const clear = (field: keyof FieldErrors) => setErrors((current) => ({ ...current, [field]: undefined }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const start = new Date(`${date}T${time}`);
    const duration = hours * 60 + minutes;
    const nextErrors = validate(title, start, duration);
    setErrors(nextErrors);
    setFormError(null);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      onScheduled(
        await api.scheduleMeeting({
          title: title.trim(),
          description: description.trim() || undefined,
          start_time: start.toISOString(),
          duration_minutes: duration,
        }),
      );
    } catch (error) {
      setFormError(error instanceof Error ? error.message : MESSAGES.genericError);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate data-testid="schedule-meeting-form">
      <TextField
        id="schedule-title"
        label="Topic"
        value={title}
        error={errors.title}
        onChange={(event) => {
          setTitle(event.target.value);
          clear("title");
        }}
        maxLength={MAX_TITLE_LENGTH}
        autoFocus
        data-testid="schedule-title-input"
      />

      <div>
        <label htmlFor="schedule-description" className="mb-2 block text-sm font-medium">
          Description <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="schedule-description"
          rows={3}
          maxLength={MAX_DESCRIPTION_LENGTH}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add a description"
          data-testid="schedule-description-input"
          className={`${inputClasses()} h-auto resize-none py-2.5`}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">When</legend>
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <input
            type="date"
            aria-label="Date"
            value={date}
            min={today}
            onChange={(event) => {
              setDate(event.target.value);
              clear("when");
            }}
            aria-invalid={Boolean(errors.when) || undefined}
            data-testid="schedule-date-input"
            className={`${inputClasses(Boolean(errors.when))} min-w-0 px-3`}
          />
          <input
            type="time"
            aria-label="Time"
            value={time}
            onChange={(event) => {
              setTime(event.target.value);
              clear("when");
            }}
            aria-invalid={Boolean(errors.when) || undefined}
            data-testid="schedule-time-input"
            className={`${inputClasses(Boolean(errors.when))} w-[132px] px-3`}
          />
        </div>
        <FieldMessage id="schedule-when-message" error={errors.when} />
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Duration</legend>
        <div className="flex items-center gap-3 text-sm text-ink-muted">
          <select
            aria-label="Duration hours"
            value={hours}
            onChange={(event) => {
              setHours(Number(event.target.value));
              clear("duration");
            }}
            data-testid="schedule-duration-hours"
            className={`${inputClasses(Boolean(errors.duration))} w-20 px-3`}
          >
            {DURATION_HOUR_OPTIONS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          hr
          <select
            aria-label="Duration minutes"
            value={minutes}
            onChange={(event) => {
              setMinutes(Number(event.target.value));
              clear("duration");
            }}
            data-testid="schedule-duration-minutes"
            className={`${inputClasses(Boolean(errors.duration))} w-20 px-3`}
          >
            {DURATION_MINUTE_OPTIONS.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
          min
        </div>
        <FieldMessage id="schedule-duration-message" error={errors.duration} />
      </fieldset>

      <p className="flex items-start gap-2 rounded-xl bg-canvas px-3 py-2.5 text-[13px] text-ink-muted">
        <Info size={16} className="mt-px shrink-0" />
        A meeting ID and invite link are generated automatically. Time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </p>

      {formError && <FormAlert>{formError}</FormAlert>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting} data-testid="schedule-submit">
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
