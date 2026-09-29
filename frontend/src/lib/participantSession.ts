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
