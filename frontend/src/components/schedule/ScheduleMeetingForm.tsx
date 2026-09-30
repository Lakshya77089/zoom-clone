"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldMessage, FormAlert, inputClasses } from "@/components/ui/field";
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
const lookAlike = "flex items-center gap-2 text-sm leading-[18px] text-ink-disabled";

function nextHalfHour(): Date {
  const date = new Date();
  date.setSeconds(0, 0);
  date.setMinutes(date.getMinutes() < 30 ? 30 : 60);
  return date;
}

function timeZoneLabel(): string {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZoneName: "shortOffset" }).formatToParts(new Date()).find((part) => part.type === "timeZoneName")
      ?.value ?? "GMT";
  return `(${offset}) ${zone.replace(/_/g, " ")}`;
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

function Row({ label, required, htmlFor, children }: { label: string; required?: boolean; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
      <label htmlFor={htmlFor} className="text-sm leading-[18px] text-ink sm:pt-1.5">
        {required && <span className="mr-1 text-xs text-[#da1639]">*</span>}
        {label}
      </label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function LookAlikeBox({ label, checked = false }: { label: string; checked?: boolean }) {
  return (
    <span className={lookAlike}>
      <input type="checkbox" disabled checked={checked} readOnly className="h-4 w-4 accent-zoom-blue" />
      {label}
    </span>
  );
}

function LookAlikeRadio({ label, name, checked = false }: { label: string; name: string; checked?: boolean }) {
  return (
    <span className={lookAlike}>
      <input type="radio" disabled checked={checked} readOnly name={name} className="h-4 w-4 accent-zoom-blue" />
      {label}
    </span>
  );
}

export function ScheduleMeetingForm({ defaultTitle, onCancel, onScheduled }: ScheduleMeetingFormProps) {
  const [initialStart] = useState(nextHalfHour);
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [date, setDate] = useState(() => toDateInputValue(initialStart));
  const [time, setTime] = useState(() => toTimeInputValue(initialStart));
  const [hours, setHours] = useState(DEFAULT_DURATION_HOURS);
  const [minutes, setMinutes] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [today] = useState(() => toDateInputValue(new Date()));
  const [timeZone] = useState(timeZoneLabel);

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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate data-testid="schedule-meeting-form">
      <Row label="Topic" required htmlFor="schedule-title">
        <input
          id="schedule-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            clear("title");
          }}
          maxLength={MAX_TITLE_LENGTH}
          autoFocus
          aria-invalid={Boolean(errors.title) || undefined}
          data-testid="schedule-title-input"
          className={`${inputClasses(Boolean(errors.title), true)} w-full max-w-[490px]`}
        />
        <FieldMessage id="schedule-title-message" error={errors.title} />
        {showDescription ? (
          <textarea
            aria-label="Description"
            rows={3}
            maxLength={MAX_DESCRIPTION_LENGTH}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter a meeting description"
            autoFocus
            data-testid="schedule-description-input"
            className={`${inputClasses(false, true)} mt-4 h-auto! w-full max-w-[490px] resize-none py-1.5`}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowDescription(true)}
            data-testid="schedule-add-description"
            className="mt-4 flex items-center gap-1 pl-5 text-sm leading-[18px] text-zoom-blue hover:underline"
          >
            <Plus size={14} />
            Add Description
          </button>
        )}
      </Row>

      <Row label="When" htmlFor="schedule-date">
        <div className="flex flex-wrap gap-2">
          <input
            id="schedule-date"
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
            className={`${inputClasses(Boolean(errors.when), true)} w-[240px] max-w-full`}
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
            className={`${inputClasses(Boolean(errors.when), true)} w-[196px] max-w-full`}
          />
        </div>
        <FieldMessage id="schedule-when-message" error={errors.when} />
      </Row>

      <Row label="Duration" htmlFor="schedule-duration-hours">
        <div className="flex items-center gap-2 text-sm text-ink-strong">
          <select
            id="schedule-duration-hours"
            aria-label="Duration hours"
            value={hours}
            onChange={(event) => {
              setHours(Number(event.target.value));
              clear("duration");
            }}
            data-testid="schedule-duration-hours"
            className={`${inputClasses(Boolean(errors.duration), true)} w-[150px] min-w-0`}
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
            className={`${inputClasses(Boolean(errors.duration), true)} w-[150px] min-w-0`}
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
      </Row>

      <Row label="Time Zone">
        <select disabled aria-label="Time zone" className={`${inputClasses(false, true)} w-full max-w-[490px]`}>
          <option>{timeZone}</option>
        </select>
        <div className="mt-4">
          <LookAlikeBox label="Recurring meeting" />
        </div>
      </Row>

      <Row label="Meeting ID">
        <div className="flex flex-wrap gap-x-8 gap-y-2 sm:pt-1.5">
          <LookAlikeRadio name="schedule-id" label="Generate Automatically" checked />
          <LookAlikeRadio name="schedule-id" label="Personal Meeting ID" />
        </div>
      </Row>

      <Row label="Security">
        <div className="space-y-3 sm:pt-1.5">
          <LookAlikeBox label="Passcode" checked />
          <LookAlikeBox label="Waiting Room" />
        </div>
      </Row>

      <Row label="Video">
        <div className="grid grid-cols-[88px_auto_auto] items-center justify-start gap-x-6 gap-y-3 text-sm text-ink-strong sm:pt-1.5">
          Host
          <LookAlikeRadio name="schedule-host-video" label="on" />
          <LookAlikeRadio name="schedule-host-video" label="off" checked />
          Participant
          <LookAlikeRadio name="schedule-participant-video" label="on" />
          <LookAlikeRadio name="schedule-participant-video" label="off" checked />
        </div>
      </Row>

      <Row label="Calendar">
        <div className="flex flex-wrap gap-x-6 gap-y-2 sm:pt-1.5">
          <LookAlikeRadio name="schedule-calendar" label="Outlook" />
          <LookAlikeRadio name="schedule-calendar" label="Google Calendar" />
          <LookAlikeRadio name="schedule-calendar" label="Other Calendars" checked />
        </div>
      </Row>

      {formError && <FormAlert>{formError}</FormAlert>}

      <div className="flex gap-2 border-t-[0.8px] border-line pt-6">
        <Button type="submit" loading={submitting} data-testid="schedule-submit">
          {submitting ? "Saving..." : "Save"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
