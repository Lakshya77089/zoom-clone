import type { ReactNode } from "react";
import type { IconComponent } from "@/components/icons";
import { Spinner } from "@/components/ui/Spinner";

interface ActionTileProps {
  label: string;
  icon: IconComponent;
  tone: "orange" | "blue";
  onClick: () => void;
  busy?: boolean;
  testId?: string;
  trailing?: ReactNode;
}

const tones = {
  orange: "bg-zoom-orange [--tile-bg:var(--color-zoom-orange)]",
  blue: "bg-zoom-tile [--tile-bg:var(--color-zoom-tile)]",
};

export function ActionTile({ label, icon: Icon, tone, onClick, busy, testId, trailing }: ActionTileProps) {
  return (
    <div className="flex w-14 flex-col items-center">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-label={label}
        aria-busy={busy || undefined}
        data-testid={testId}
        className={`flex h-14 w-14 items-center justify-center rounded-[20px] text-white outline-none transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-[0_6px_12px_rgba(0,0,0,0.16)] focus-visible:ring-2 focus-visible:ring-zoom-blue focus-visible:ring-offset-2 disabled:cursor-wait ${tones[tone]}`}
      >
        {busy ? <Spinner size={24} /> : <Icon size={28} />}
      </button>
      <span className="mt-3 flex items-center gap-1 whitespace-nowrap text-sm leading-4 text-ink-muted">
        {label}
        {trailing}
      </span>
    </div>
  );
}
