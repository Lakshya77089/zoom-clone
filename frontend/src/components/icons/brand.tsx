import { useId } from "react";
import { Svg, type IconProps } from "@/components/icons/base";

const GRADIENT_FROM = "#3d8bfd";
const GRADIENT_TO = "#a855f7";

export function NewMeetingTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <g fill="currentColor" stroke="none">
        <rect x="1.2" y="4" width="10" height="8" rx="2" />
        <path d="m11.9 7.05 2.45-1.55a.5.5 0 0 1 .77.42v4.16a.5.5 0 0 1-.77.42L11.9 8.95Z" />
      </g>
      <path d="M2.3 14.3 13.9 2.7" stroke="var(--tile-bg)" strokeWidth="2.4" />
      <path d="M2.3 14.3 13.9 2.7" strokeWidth="1.05" />
    </Svg>
  );
}

export function JoinTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 1.4c4.6 0 6.6 2 6.6 6.6s-2 6.6-6.6 6.6-6.6-2-6.6-6.6 2-6.6 6.6-6.6Z" fill="currentColor" stroke="none" />
      <path d="M8 4.7v6.6M4.7 8h6.6" stroke="var(--tile-bg)" strokeWidth="1.25" />
    </Svg>
  );
}

export function ScheduleTileIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="1.6" y="2.7" width="12.8" height="12.1" rx="2.5" fill="currentColor" stroke="none" />
      <path d="M5.2 1.2v2.3M10.8 1.2v2.3" strokeWidth=".85" />
      <circle cx="5.2" cy="3.75" r=".6" stroke="var(--tile-bg)" strokeWidth=".7" />
      <circle cx="10.8" cy="3.75" r=".6" stroke="var(--tile-bg)" strokeWidth=".7" />
      <text
        x="8"
        y="12.55"
        textAnchor="middle"
        fontSize="7.4"
        fontWeight="600"
        fill="var(--tile-bg)"
        stroke="none"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
      >
        19
      </text>
    </Svg>
  );
}

export function RecordingsIcon(props: IconProps) {
  return (
    <Svg {...props} className={`text-[#e11d48] ${props.className ?? ""}`}>
      <circle cx="8" cy="8" r="5.9" />
      <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function SummariesIcon(props: IconProps) {
  const id = useId();
  const stroke = `url(#${id})`;
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id} x1="2" y1="2" x2="14" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor={GRADIENT_FROM} />
          <stop offset="1" stopColor={GRADIENT_TO} />
        </linearGradient>
      </defs>
      <path d="M9.3 1.9H4.6a1.6 1.6 0 0 0-1.6 1.6v9a1.6 1.6 0 0 0 1.6 1.6h6.8a1.6 1.6 0 0 0 1.6-1.6V5.6Z" stroke={stroke} />
      <path d="M9.3 1.9v2.5c0 .65.55 1.2 1.2 1.2H13" stroke={stroke} />
      <path
        d="M7.2 7.1c.25 1.15.6 1.5 1.75 1.75-1.15.25-1.5.6-1.75 1.75-.25-1.15-.6-1.5-1.75-1.75 1.15-.25 1.5-.6 1.75-1.75Z"
        fill={stroke}
        stroke={stroke}
        strokeWidth=".7"
      />
    </Svg>
  );
}

export function MyNotesIcon(props: IconProps) {
  const id = useId();
  const stroke = `url(#${id})`;
  return (
    <Svg {...props}>
      <defs>
        <linearGradient id={id} x1="2" y1="14" x2="14" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor={GRADIENT_FROM} />
          <stop offset="1" stopColor={GRADIENT_TO} />
        </linearGradient>
      </defs>
      <path d="M11.05 2.55a1.5 1.5 0 0 1 2.1 0l.3.3a1.5 1.5 0 0 1 0 2.1L7.1 11.3l-3 .75.75-3Z" stroke={stroke} />
      <path d="m10.05 3.55 2.4 2.4" stroke={stroke} />
      <path
        d="M4.1 2.1c.2.9.45 1.15 1.35 1.35-.9.2-1.15.45-1.35 1.35-.2-.9-.45-1.15-1.35-1.35.9-.2 1.15-.45 1.35-1.35Z"
        fill={stroke}
        stroke={stroke}
        strokeWidth=".6"
      />
      <path d="M2.6 13.9c.9-.55 1.4-1.05 1.9-1.9" stroke={stroke} />
    </Svg>
  );
}

export function ShareScreenIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="1.4" y="1.4" width="13.2" height="13.2" rx="3.4" fill="#1faa59" stroke="none" />
      <path d="M8 11.4V4.9M5.3 7.5 8 4.8l2.7 2.7" stroke="#fff" strokeWidth="1.45" />
    </Svg>
  );
}

export function EncryptionShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 1.3 13.3 3.2v4.2c0 3.25-2.15 5.7-5.3 7.1-3.15-1.4-5.3-3.85-5.3-7.1V3.2Z" fill="#1faa59" stroke="none" />
      <path d="m5.6 7.95 1.7 1.65 3.1-3.25" stroke="#fff" strokeWidth="1.3" />
    </Svg>
  );
}

export function GeneralSolidIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        stroke="none"
        d="M6.92 3.07 6.95 1.69h2.1l.03 1.38 1.64.68 1-.96 1.49 1.49-.96 1 .68 1.64 1.38.03v2.1l-1.38.03-.68 1.64.96 1-1.49 1.49-1-.96-1.64.68-.03 1.38h-2.1l-.03-1.38-1.64-.68-1 .96-1.49-1.49.96-1-.68-1.64-1.38-.03v-2.1l1.38-.03.68-1.64-.96-1 1.49-1.49 1 .96ZM8 10.1a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z"
      />
    </Svg>
  );
}

export function AudioSolidIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.6 9.2V8a5.4 5.4 0 0 1 10.8 0v1.2" strokeWidth="1.4" />
      <g fill="currentColor" stroke="none">
        <rect x="1.8" y="8.4" width="3.6" height="5.8" rx="1.4" />
        <rect x="10.6" y="8.4" width="3.6" height="5.8" rx="1.4" />
      </g>
    </Svg>
  );
}

export function VideoSolidIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <g fill="currentColor" stroke="none">
        <rect x="1.2" y="4" width="10" height="8" rx="2" />
        <path d="m11.9 7.05 2.45-1.55a.5.5 0 0 1 .77.42v4.16a.5.5 0 0 1-.77.42L11.9 8.95Z" />
      </g>
    </Svg>
  );
}

export function ChatSolidIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M2.2 4.2c0-1.1.9-2 2-2h7.6c1.1 0 2 .9 2 2v5.1c0 1.1-.9 2-2 2H7.3l-2.9 2.35V11.3h-.2c-1.1 0-2-.9-2-2Z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function AccountSolidIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <g fill="currentColor" stroke="none">
        <circle cx="8" cy="5" r="3" />
        <path d="M2.4 13.6c.5-3 2.8-4.9 5.6-4.9s5.1 1.9 5.6 4.9a.7.7 0 0 1-.7.8H3.1a.7.7 0 0 1-.7-.8Z" />
      </g>
    </Svg>
  );
}
