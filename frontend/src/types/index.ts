export type MeetingType = "instant" | "scheduled";
export type MeetingStatus = "scheduled" | "live" | "ended";
export type ParticipantRole = "host" | "attendee";
export type ParticipantStatus = "active" | "left" | "removed";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_color: string;
}

export interface Meeting {
  id: number;
  meeting_code: string;
  title: string;
  description: string | null;
  meeting_type: MeetingType;
  status: MeetingStatus;
  scheduled_start: string | null;
  scheduled_end: string | null;
  duration_minutes: number | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  participant_count: number;
  host: User;
  invite_link: string;
}

export interface Participant {
  id: number;
  meeting_id: number;
  display_name: string;
  role: ParticipantRole;
  status: ParticipantStatus;
  is_muted: boolean;
  is_video_on: boolean;
  joined_at: string;
  left_at: string | null;
}

export interface MeetingSession {
  meeting: Meeting;
  participant: Participant;
}

export interface RoomState {
  meeting: Meeting;
  me: Participant;
  participants: Participant[];
}

export interface ScheduleMeetingInput {
  title: string;
  description?: string;
  start_time: string;
  duration_minutes: number;
}
