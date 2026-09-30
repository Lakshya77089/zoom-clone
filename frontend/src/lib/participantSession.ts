const key = (code: string) => `zoom:participant:${code}`;

export function saveParticipantId(code: string, participantId: number): void {
  sessionStorage.setItem(key(code), String(participantId));
}

export function readParticipantId(code: string): number | null {
  const value = sessionStorage.getItem(key(code));
  return value ? Number(value) : null;
}

export function clearParticipantId(code: string): void {
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
