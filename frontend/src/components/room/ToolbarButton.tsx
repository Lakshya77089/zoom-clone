import type { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
  badge?: number;
  testId?: string;
  expanded?: boolean;
}

export function ToolbarButton({ label, icon: Icon, onClick, active, badge, testId, expanded }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={expanded === undefined ? active : undefined}
      aria-expanded={expanded}
      data-testid={testId}
      className={`relative flex min-w-[60px] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-white outline-none transition-colors hover:bg-room-hover focus-visible:ring-2 focus-visible:ring-white/60 sm:min-w-[72px] ${
        active ? "bg-room-hover" : ""
      }`}
    >
      <span className="relative">
        <Icon size={22} />
        {badge !== undefined && (
          <span className="absolute -right-3 -top-1.5 min-w-[18px] rounded-full bg-room-panel px-1 text-center text-[10px] font-semibold leading-[16px] ring-2 ring-room-bar">
            {badge}
          </span>
        )}
      </span>
      <span className="whitespace-nowrap text-[11px]">{label}</span>
    </button>
  );
}
