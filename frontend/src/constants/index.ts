import { House, MessagesSquare, Settings, SquareUserRound, Video, type LucideIcon } from "lucide-react";

export const ROUTES = {
  home: "/",
  meetings: "/meetings",
  settings: "/settings",
  join: "/join",
  prejoin: (code: string) => `/j/${code}`,
  room: (code: string) => `/wc/${code}`,
} as const;

export interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: ROUTES.home, icon: House },
  { label: "Chat", icon: MessagesSquare },
  { label: "Meetings", href: ROUTES.meetings, icon: Video },
  { label: "Contacts", icon: SquareUserRound },
];

export const SETTINGS_NAV_ITEM: NavItem = { label: "Settings", href: ROUTES.settings, icon: Settings };

export const TOAST_DURATION_MS = 3000;
export const ROOM_POLL_INTERVAL_MS = 2000;
export const MAX_DISPLAY_NAME_LENGTH = 100;
export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MIN_DURATION_MINUTES = 15;
export const DURATION_HOUR_OPTIONS = Array.from({ length: 25 }, (_, hour) => hour);
export const DURATION_MINUTE_OPTIONS = [0, 15, 30, 45];

export const MESSAGES = {
  meetingIdRequired: "Please enter a meeting ID or invite link.",
  meetingIdInvalid: "This meeting ID is not valid. Meeting IDs are 9 to 11 digits.",
  meetingNotFound: "Invalid meeting ID. Please check and try again.",
  displayNameRequired: "Please enter your name.",
  genericError: "Something went wrong. Please try again.",
} as const;
