import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ToolbarButtonProps {
  label: string;
  icon?: LucideIcon;
  glyph?: ReactNode;
  onClick?: () => void;
  active?: boolean;
  badge?: number;
  testId?: string;
  expanded?: boolean;
  disabled?: boolean;
  className?: string;
}

export const toolbarItem =
  "relative flex h-14 min-w-[56px] flex-col items-center justify-center gap-1 rounded-lg px-2 text-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/60";

export function ToolbarButton({ label, icon: Icon, glyph, onClick, active, badge, testId, expanded, disabled, className = "" }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={disabled || expanded !== undefined ? undefined : active}
      aria-expanded={expanded}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      data-testid={testId}
      className={`${toolbarItem} ${disabled ? "cursor-default" : "hover:bg-white/10"} ${active ? "bg-white/10" : ""} ${className}`}
    >
      <span className="relative flex h-6 items-center">
        {glyph ?? (Icon && <Icon size={22} strokeWidth={1.75} />)}
        {badge !== undefined && <span className="absolute -right-3 -top-1 text-[11px] font-semibold leading-3">{badge}</span>}
      </span>
      <span className="whitespace-nowrap text-xs leading-4 text-white/90">{label}</span>
    </button>
  );
}
