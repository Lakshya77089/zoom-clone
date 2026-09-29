import type { Meeting } from "@/types";
import { formatMeetingCode } from "@/lib/meetingCode";

const LOCALE = "en-US";
const MS_PER_DAY = 86_400_000;
const MS_PER_MINUTE = 60_000;

const pad = (value: number) => String(value).padStart(2, "0");

export function formatTime(value: string | Date): string {
  return new Date(value).toLocaleTimeString(LOCALE, { hour: "numeric", minute: "2-digit" });
}

export function formatTimeRange(start: string, end: string | null): string {
  return end ? `${formatTime(start)} - ${formatTime(end)}` : formatTime(start);
}

export function formatLongDate(value: Date): string {
  return value.toLocaleDateString(LOCALE, { weekday: "long", month: "long", day: "numeric" });
}

function startOfDay(value: Date): number {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

export function formatDayLabel(value: string): string {
  const date = new Date(value);
  const diff = Math.round((startOfDay(date) - startOfDay(new Date())) / MS_PER_DAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return date.toLocaleDateString(LOCALE, { weekday: "short", month: "short", day: "numeric" });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

export function minutesBetween(start: string, end: string): number {
  return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / MS_PER_MINUTE));
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2);
  return letters.toUpperCase();
}

export function toDateInputValue(value: Date): string {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

export function toTimeInputValue(value: Date): string {
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export function buildInvitation(meeting: Meeting): string {
  const lines = [`${meeting.host.name} is inviting you to a Zoom meeting.`, "", `Topic: ${meeting.title}`];
  if (meeting.scheduled_start) {
    lines.push(`Time: ${formatDayLabel(meeting.scheduled_start)}, ${formatTime(meeting.scheduled_start)}`);
  }
  lines.push("", "Join Zoom Meeting", meeting.invite_link, "", `Meeting ID: ${formatMeetingCode(meeting.meeting_code)}`);
  return lines.join("\n");
}
