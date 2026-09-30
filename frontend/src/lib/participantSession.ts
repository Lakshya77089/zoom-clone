const key = (code: string) => `zoom:participant:${code}`;
const tokenKey = (participantId: number) => `zoom:participant-token:${participantId}`;

export function saveParticipant(code: string, participantId: number, token: string): void {
  sessionStorage.setItem(key(code), String(participantId));
  sessionStorage.setItem(tokenKey(participantId), token);
}

export function readParticipantToken(participantId: number): string {
  return sessionStorage.getItem(tokenKey(participantId)) ?? "";
}

export function readParticipantId(code: string): number | null {
  const value = sessionStorage.getItem(key(code));
  return value ? Number(value) : null;
}

export function clearParticipantId(code: string): void {
  const participantId = readParticipantId(code);
  if (participantId !== null) sessionStorage.removeItem(tokenKey(participantId));
  sessionStorage.removeItem(key(code));
}

const newMeetingKey = (code: string) => `zoom:new-meeting:${code}`;

export function markNewMeeting(code: string): void {
  sessionStorage.setItem(newMeetingKey(code), "1");
}

export function isNewMeeting(code: string): boolean {
  return sessionStorage.getItem(newMeetingKey(code)) === "1";
}

export function clearNewMeeting(code: string): void {
  sessionStorage.removeItem(newMeetingKey(code));
}
