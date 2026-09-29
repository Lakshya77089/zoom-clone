import type { LucideIcon } from "lucide-react";

interface ActionTileProps {
  label: string;
  icon: LucideIcon;
  tone: "orange" | "blue";
  onClick?: () => void;
  disabled?: boolean;
  busy?: boolean;
}

const tones = {
  orange: "bg-zoom-orange group-hover:bg-zoom-orange-dark",
  blue: "bg-zoom-blue group-hover:bg-zoom-blue-dark",
};

export function ActionTile({ label, icon: Icon, tone, onClick, disabled, busy }: ActionTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className="group flex flex-col items-center gap-2.5 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-[22px] text-white shadow-sm transition-colors sm:h-20 sm:w-20 sm:rounded-3xl ${tones[tone]} ${busy ? "animate-pulse" : ""}`}
      >
        <Icon className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={2} fill={tone === "orange" ? "currentColor" : "none"} />
      </span>
      <span className="text-sm font-bold text-ink">{label}</span>
    </button>
  );
}
