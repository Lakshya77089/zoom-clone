const MIN_CODE_LENGTH = 9;
const MAX_CODE_LENGTH = 11;

export function formatMeetingCode(code: string): string {
  if (code.length === 11) return `${code.slice(0, 3)} ${code.slice(3, 7)} ${code.slice(7)}`;
  if (code.length === 10) return `${code.slice(0, 3)} ${code.slice(3, 6)} ${code.slice(6)}`;
  return code;
}

export function parseMeetingInput(input: string): string | null {
  const trimmed = input.trim();
  const fromLink = trimmed.match(/\/j\/(\d+)/);
  const digits = (fromLink ? fromLink[1] : trimmed).replace(/\D/g, "");
  if (digits.length < MIN_CODE_LENGTH || digits.length > MAX_CODE_LENGTH) return null;
  return digits;
}
