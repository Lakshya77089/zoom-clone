interface TileIconProps {
  className?: string;
}

export function NewMeetingIcon({ className }: TileIconProps) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <rect x="3" y="8" width="16" height="12.5" rx="3.2" fill="currentColor" />
      <path d="M20.2 12.6 25 9.6v9.3l-4.8-3z" fill="currentColor" />
      <path d="M5 23.5 23.5 5" stroke="var(--tile-bg)" strokeWidth="4" strokeLinecap="round" />
      <path d="M5 23.5 23.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function JoinIcon({ className }: TileIconProps) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <rect x="4" y="4" width="20" height="20" rx="6" fill="currentColor" />
      <path d="M14 9v10M9 14h10" stroke="var(--tile-bg)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ScheduleIcon({ className }: TileIconProps) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <rect x="4" y="6" width="20" height="18.5" rx="4.5" fill="currentColor" />
      <rect x="8.4" y="3.2" width="2.2" height="5.6" rx="1.1" fill="currentColor" stroke="var(--tile-bg)" strokeWidth="1" />
      <rect x="17.4" y="3.2" width="2.2" height="5.6" rx="1.1" fill="currentColor" stroke="var(--tile-bg)" strokeWidth="1" />
      <text x="14" y="21" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--tile-bg)" fontFamily="system-ui, sans-serif">
        19
      </text>
    </svg>
  );
}
