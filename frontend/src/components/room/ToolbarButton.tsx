import type { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  badge?: number;
  className?: string;
}

export function ToolbarButton({ label, icon: Icon, onClick, disabled, active, badge, className = "" }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={`relative flex min-w-16 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-white transition-colors hover:bg-room-hover disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent ${
        active ? "bg-room-hover" : ""
      } ${className}`}
    >
      <Icon size={22} />
      {badge !== undefined && (
        <span className="absolute right-3 top-0.5 min-w-4 rounded-full bg-room-panel px-1 text-[10px] font-bold leading-4">{badge}</span>
      )}
      <span className="whitespace-nowrap text-[11px]">{label}</span>
    </button>
  );
}
