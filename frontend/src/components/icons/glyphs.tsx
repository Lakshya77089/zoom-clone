import { icon } from "@/components/icons/base";

const GEAR =
  "M6.92 3.07 6.95 1.69h2.1l.03 1.38 1.64.68 1-.96 1.49 1.49-.96 1 .68 1.64 1.38.03v2.1l-1.38.03-.68 1.64.96 1-1.49 1.49-1-.96-1.64.68-.03 1.38h-2.1l-.03-1.38-1.64-.68-1 .96-1.49-1.49.96-1-.68-1.64-1.38-.03v-2.1l1.38-.03.68-1.64-.96-1 1.49-1.49 1 .96Z";

export const HomeIcon = icon(
  () => (
    <>
      <path d="M2.6 6.75 7.3 2.9a1.1 1.1 0 0 1 1.4 0l4.7 3.85v6.1a1.3 1.3 0 0 1-1.3 1.3H3.9a1.3 1.3 0 0 1-1.3-1.3Z" />
      <path d="M6.35 14.15v-3.3a1.65 1.65 0 0 1 3.3 0v3.3" />
    </>
  ),
  "HomeIcon",
);

export const ChatIcon = icon(
  () => (
    <>
      <path d="M2 3.55c0-.85.7-1.55 1.55-1.55h5.4c.85 0 1.55.7 1.55 1.55v3.1c0 .85-.7 1.55-1.55 1.55H5.7L3.9 9.6V8.2h-.35C2.7 8.2 2 7.5 2 6.65Z" />
      <path d="M12.2 5.2h.25c.85 0 1.55.7 1.55 1.55v3.1c0 .85-.7 1.55-1.55 1.55h-.35v1.4l-1.8-1.4H7.55C6.7 11.4 6 10.7 6 9.85v-.2" />
    </>
  ),
  "ChatIcon",
);

export const VideoIcon = icon(
  () => (
    <>
      <rect x="1.75" y="4" width="9.25" height="8" rx="1.9" />
      <path d="m11 7.15 2.55-1.6a.45.45 0 0 1 .7.38v4.14a.45.45 0 0 1-.7.38L11 8.85" />
    </>
  ),
  "VideoIcon",
);

export const VideoOffIcon = icon(
  () => (
    <>
      <path d="M11 9.3V5.9A1.9 1.9 0 0 0 9.1 4H6.2M3.2 4.3A1.9 1.9 0 0 0 1.75 6.15v3.95A1.9 1.9 0 0 0 3.65 12h5.45a1.9 1.9 0 0 0 1.5-.73" />
      <path d="m11 7.15 2.55-1.6a.45.45 0 0 1 .7.38v4.14a.45.45 0 0 1-.7.38L11 8.85" />
      <path d="M2 2 14 14" className="text-[#e02828]" stroke="currentColor" />
    </>
  ),
  "VideoOffIcon",
);

export const ContactsIcon = icon(
  () => (
    <>
      <rect x="2" y="2" width="12" height="12" rx="2.3" />
      <circle cx="8" cy="6.6" r="1.95" />
      <path d="M4.75 13.9c.35-1.95 1.7-3.2 3.25-3.2s2.9 1.25 3.25 3.2" />
    </>
  ),
  "ContactsIcon",
);

export const SettingsIcon = icon(
  () => (
    <>
      <path d={GEAR} />
      <circle cx="8" cy="8" r="2" />
    </>
  ),
  "SettingsIcon",
);

export const ChevronDownIcon = icon(() => <path d="M3.5 5.75 8 10.25l4.5-4.5" />, "ChevronDownIcon", 1.5);
export const ChevronUpIcon = icon(() => <path d="M3.5 10.25 8 5.75l4.5 4.5" />, "ChevronUpIcon", 1.5);
export const ChevronLeftIcon = icon(() => <path d="M10.25 2.75 5 8l5.25 5.25" />, "ChevronLeftIcon", 1.5);
export const ChevronRightIcon = icon(() => <path d="M5.75 2.75 11 8l-5.25 5.25" />, "ChevronRightIcon", 1.5);

export const HistoryIcon = icon(
  () => (
    <>
      <path d="M2.6 8a5.4 5.4 0 1 0 1.26-3.47" />
      <path d="M3.86 1.95v2.6h2.6" />
      <path d="M8 5.1V8l2 1.3" />
    </>
  ),
  "HistoryIcon",
);

export const SearchIcon = icon(
  () => (
    <>
      <circle cx="7" cy="7" r="5" />
      <path d="m10.65 10.65 3.1 3.1" />
    </>
  ),
  "SearchIcon",
);

export const BellIcon = icon(
  () => (
    <>
      <path d="M3.9 11.35V7.1a4.1 4.1 0 0 1 8.2 0v4.25l1.05 1.05H2.85Z" />
      <path d="M6.55 13.9a1.55 1.55 0 0 0 2.9 0" />
    </>
  ),
  "BellIcon",
);

export const CloseIcon = icon(() => <path d="m3.75 3.75 8.5 8.5m0-8.5-8.5 8.5" />, "CloseIcon");

export const MoreIcon = icon(
  () => (
    <g fill="currentColor" stroke="none">
      <circle cx="3.4" cy="8" r="1.15" />
      <circle cx="8" cy="8" r="1.15" />
      <circle cx="12.6" cy="8" r="1.15" />
    </g>
  ),
  "MoreIcon",
);

export const InfoIcon = icon(
  () => (
    <>
      <circle cx="8" cy="8" r="6.3" />
      <circle cx="8" cy="4.95" r=".8" fill="currentColor" stroke="none" />
      <path d="M7 7.25h1v4.25M6.85 11.5h2.3" />
    </>
  ),
  "InfoIcon",
);

export const ExternalLinkIcon = icon(
  () => (
    <>
      <path d="M7.1 2.6H4.3a1.7 1.7 0 0 0-1.7 1.7v7.4a1.7 1.7 0 0 0 1.7 1.7h7.4a1.7 1.7 0 0 0 1.7-1.7V8.9" />
      <path d="M9.6 2.6h3.8v3.8M13.4 2.6 7.9 8.1" />
    </>
  ),
  "ExternalLinkIcon",
);

export const CalendarIcon = icon(
  () => (
    <>
      <rect x="2.3" y="3.1" width="11.4" height="10.6" rx="2" />
      <path d="M2.3 6.4h11.4M5.4 1.8v2.5M10.6 1.8v2.5" />
      <circle cx="5.9" cy="9.55" r="1.05" fill="currentColor" stroke="none" />
    </>
  ),
  "CalendarIcon",
);

export const CalendarPlusIcon = icon(
  () => (
    <>
      <rect x="2.3" y="3.1" width="11.4" height="10.6" rx="2" />
      <path d="M2.3 6.4h11.4M5.4 1.8v2.5M10.6 1.8v2.5M8 8.1v3.6M6.2 9.9h3.6" />
    </>
  ),
  "CalendarPlusIcon",
);

export const CalendarCheckIcon = icon(
  () => (
    <>
      <rect x="2.3" y="3.1" width="11.4" height="10.6" rx="2" />
      <path d="M2.3 6.4h11.4M5.4 1.8v2.5M10.6 1.8v2.5M5.9 10.05l1.45 1.4 2.8-2.9" />
    </>
  ),
  "CalendarCheckIcon",
);

export const PlusIcon = icon(() => <path d="M8 3v10M3 8h10" />, "PlusIcon");

export const RefreshIcon = icon(
  () => (
    <>
      <path d="M13.4 8a5.4 5.4 0 1 1-1.6-3.85" />
      <path d="M13.5 2.5v2.55h-2.55" />
    </>
  ),
  "RefreshIcon",
);

export const CopyIcon = icon(
  () => (
    <>
      <rect x="5.35" y="5.35" width="8.4" height="8.4" rx="1.6" />
      <path d="M10.65 5.35V3.85a1.6 1.6 0 0 0-1.6-1.6h-5.2a1.6 1.6 0 0 0-1.6 1.6v5.2a1.6 1.6 0 0 0 1.6 1.6h1.5" />
    </>
  ),
  "CopyIcon",
);

export const EditIcon = icon(
  () => (
    <>
      <path d="M10.2 2.95a1.45 1.45 0 0 1 2.05 0l.8.8a1.45 1.45 0 0 1 0 2.05L6.1 12.75l-3.35.5.5-3.35Z" />
      <path d="m9.25 3.9 2.85 2.85" />
    </>
  ),
  "EditIcon",
);

export const TrashIcon = icon(
  () => (
    <>
      <path d="M2.6 4.3h10.8M6.2 4.3V3.05c0-.45.35-.8.8-.8h2c.45 0 .8.35.8.8V4.3" />
      <path d="m4 4.3.65 8.45a1.3 1.3 0 0 0 1.3 1.2h4.1a1.3 1.3 0 0 0 1.3-1.2L12 4.3M6.75 7v4.1M9.25 7v4.1" />
    </>
  ),
  "TrashIcon",
);

export const LinkIcon = icon(
  () => (
    <>
      <path d="M6.9 9.1a2.6 2.6 0 0 0 3.7 0l2.05-2.05a2.6 2.6 0 0 0-3.7-3.7l-.9.9" />
      <path d="M9.1 6.9a2.6 2.6 0 0 0-3.7 0L3.35 8.95a2.6 2.6 0 0 0 3.7 3.7l.9-.9" />
    </>
  ),
  "LinkIcon",
);

export const MailIcon = icon(
  () => (
    <>
      <rect x="1.8" y="3.2" width="12.4" height="9.6" rx="1.8" />
      <path d="M2.4 4.3 8 8.5l5.6-4.2" />
    </>
  ),
  "MailIcon",
);

export const MeetingIdIcon = icon(() => <path d="M6.4 2.5 5.2 13.5M10.8 2.5 9.6 13.5M2.9 6h10.7M2.4 10h10.7" />, "MeetingIdIcon");

export const CheckIcon = icon(() => <path d="m3.25 8.35 3.1 3.05 6.4-6.8" />, "CheckIcon");

export const AlertIcon = icon(
  () => (
    <>
      <circle cx="8" cy="8" r="6.3" />
      <path d="M8 4.7v4" />
      <circle cx="8" cy="11.1" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  "AlertIcon",
);

export const SuccessIcon = icon(
  () => (
    <>
      <circle cx="8" cy="8" r="6.3" />
      <path d="m5.35 8.2 1.85 1.8 3.45-3.65" />
    </>
  ),
  "SuccessIcon",
);

export const SpinnerIcon = icon(() => <path d="M8 1.75A6.25 6.25 0 1 1 1.75 8" />, "SpinnerIcon");

export const MicIcon = icon(
  () => (
    <>
      <rect x="5.7" y="1.7" width="4.6" height="7.7" rx="2.3" />
      <path d="M3.4 7.6a4.6 4.6 0 0 0 9.2 0M8 12.2v2.1" />
    </>
  ),
  "MicIcon",
);

export const MicOffIcon = icon(
  () => (
    <>
      <path d="M10.3 7.2V4a2.3 2.3 0 0 0-4.45-.8M5.7 5.9v1.2a2.3 2.3 0 0 0 3.45 2" />
      <path d="M12.6 7.6a4.6 4.6 0 0 1-.7 2.45M3.4 7.6a4.6 4.6 0 0 0 7.1 3.85M8 12.2v2.1" />
      <path d="M2 2 14 14" className="text-[#e02828]" stroke="currentColor" />
    </>
  ),
  "MicOffIcon",
);

export const ParticipantsIcon = icon(
  () => (
    <>
      <circle cx="6" cy="5.3" r="2.3" />
      <path d="M1.9 13.4c.3-2.45 1.95-4 4.1-4s3.8 1.55 4.1 4" />
      <path d="M10.3 3.05a2.3 2.3 0 0 1 0 4.5M11.75 9.6c1.35.45 2.2 1.75 2.35 3.8" />
    </>
  ),
  "ParticipantsIcon",
);

export const ChatBubbleIcon = icon(
  () => <path d="M2.2 4.2c0-1.1.9-2 2-2h7.6c1.1 0 2 .9 2 2v5.1c0 1.1-.9 2-2 2H7.3l-2.9 2.35V11.3h-.2c-1.1 0-2-.9-2-2Z" />,
  "ChatBubbleIcon",
);

export const ReactIcon = icon(
  () => (
    <>
      <path d="M13.9 8.3A5.9 5.9 0 1 1 7.7 2.1" />
      <path d="M5.9 9.6c.5.75 1.2 1.15 2.1 1.15s1.6-.4 2.1-1.15" />
      <circle cx="5.85" cy="6.6" r=".75" fill="currentColor" stroke="none" />
      <circle cx="10.15" cy="6.6" r=".75" fill="currentColor" stroke="none" />
      <path d="M12.3 1.6v3.6M10.5 3.4h3.6" />
    </>
  ),
  "ReactIcon",
);

export const RecordIcon = icon(
  () => (
    <>
      <circle cx="8" cy="8" r="6.2" />
      <circle cx="8" cy="8" r="2.9" fill="currentColor" stroke="none" />
    </>
  ),
  "RecordIcon",
);

export const AppsIcon = icon(
  () => (
    <>
      <rect x="2" y="2" width="5" height="5" rx="1.2" />
      <rect x="2" y="9" width="5" height="5" rx="1.2" />
      <rect x="9" y="9" width="5" height="5" rx="1.2" />
      <path d="m11.5 1.6 2.9 2.9-2.9 2.9-2.9-2.9Z" />
    </>
  ),
  "AppsIcon",
);

export const GalleryIcon = icon(
  () => (
    <>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </>
  ),
  "GalleryIcon",
);

export const PersonIcon = icon(
  () => (
    <>
      <circle cx="8" cy="5.2" r="2.6" />
      <path d="M3 13.9c.45-2.7 2.4-4.4 5-4.4s4.55 1.7 5 4.4" />
    </>
  ),
  "PersonIcon",
);
