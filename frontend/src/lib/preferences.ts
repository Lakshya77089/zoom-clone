export interface Preferences {
  joinMuted: boolean;
  joinVideoOff: boolean;
  showInviteOnStart: boolean;
  rememberedName: string;
}

const STORAGE_KEY = "zoom:preferences";
const CHANGE_EVENT = "zoom:preferences-change";

export const DEFAULT_PREFERENCES: Preferences = {
  joinMuted: false,
  joinVideoOff: false,
  showInviteOnStart: true,
  rememberedName: "",
};

let cachedRaw: string | null | undefined;
let cachedValue: Preferences = DEFAULT_PREFERENCES;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function readPreferences(): Preferences {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<Preferences>) } : DEFAULT_PREFERENCES;
  } catch {
    cachedValue = DEFAULT_PREFERENCES;
  }
  return cachedValue;
}

export function writePreferences(changes: Partial<Preferences>): void {
  const next = { ...readPreferences(), ...changes };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    cachedRaw = undefined;
    cachedValue = next;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribePreferences(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
