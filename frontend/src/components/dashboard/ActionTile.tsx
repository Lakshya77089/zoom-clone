import type { LucideIcon } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface ActionTileProps {
  label: string;
  icon: LucideIcon;
  tone: "orange" | "blue";
  onClick: () => void;
  busy?: boolean;
  testId?: string;
}

const tones = {
  orange: "bg-zoom-orange group-hover:bg-zoom-orange-dark group-active:bg-zoom-orange-dark",
  blue: "bg-zoom-blue group-hover:bg-zoom-blue-dark group-active:bg-zoom-blue-dark",
};

export function ActionTile({ label, icon: Icon, tone, onClick, busy, testId }: ActionTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-busy={busy || undefined}
      data-testid={testId}
      className="group flex w-[88px] flex-col items-center gap-2.5 rounded-2xl outline-none disabled:cursor-wait sm:w-24"
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-[20px] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors group-focus-visible:ring-2 group-focus-visible:ring-zoom-blue group-focus-visible:ring-offset-2 sm:h-[72px] sm:w-[72px] sm:rounded-[22px] ${tones[tone]}`}
      >
        {busy ? (
          <Spinner size={28} />
        ) : (
          <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} fill={tone === "orange" ? "currentColor" : "none"} />
        )}
      </span>
      <span className="text-[13px] font-medium text-ink">{label}</span>
    </button>
  );
}
