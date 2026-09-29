import type {
  Meeting,
  MeetingSession,
  Participant,
  RoomState,
  ScheduleMeetingInput,
  User,
} from "@/types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  participantId?: number;
}

type MediaChanges = Partial<Pick<Participant, "is_muted" | "is_video_on">>;

function extractMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object" || !("detail" in payload)) return fallback;
  const { detail } = payload as { detail: unknown };
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

async function request<T>(path: string, { method = "GET", body, participantId }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { "X-Public-Origin": window.location.origin };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (participantId !== undefined) headers["X-Participant-Id"] = String(participantId);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Unable to reach the server. Please check your connection.");
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, extractMessage(payload, "Something went wrong. Please try again."));
  }
  return payload as T;
}

export const api = {
  getCurrentUser: () => request<User>("/users/me"),
  getUpcomingMeetings: () => request<Meeting[]>("/meetings/upcoming"),
  getRecentMeetings: () => request<Meeting[]>("/meetings/recent"),
  createInstantMeeting: () => request<MeetingSession>("/meetings/instant", { method: "POST" }),
  scheduleMeeting: (input: ScheduleMeetingInput) => request<Meeting>("/meetings", { method: "POST", body: input }),
  getMeeting: (code: string) => request<Meeting>(`/meetings/${code}`),
  startMeeting: (code: string) => request<MeetingSession>(`/meetings/${code}/start`, { method: "POST" }),
  joinMeeting: (code: string, displayName: string, media: MediaChanges = {}) =>
    request<MeetingSession>(`/meetings/${code}/join`, {
      method: "POST",
      body: { display_name: displayName, ...media },
    }),
  endMeeting: (code: string, participantId: number) =>
    request<Meeting>(`/meetings/${code}/end`, { method: "POST", participantId }),
  getRoomState: (code: string, participantId: number) =>
    request<RoomState>(`/meetings/${code}/state`, { participantId }),
  updateSelf: (code: string, participantId: number, changes: MediaChanges) =>
    request<Participant>(`/meetings/${code}/participants/${participantId}`, {
      method: "PATCH",
      body: changes,
      participantId,
    }),
  leaveMeeting: (code: string, participantId: number) =>
    request<Participant>(`/meetings/${code}/participants/${participantId}/leave`, { method: "POST", participantId }),
  muteAll: (code: string, hostId: number) =>
    request<Participant[]>(`/meetings/${code}/participants/mute-all`, { method: "POST", participantId: hostId }),
  removeParticipant: (code: string, targetId: number, hostId: number) =>
    request<Participant>(`/meetings/${code}/participants/${targetId}`, { method: "DELETE", participantId: hostId }),
};
