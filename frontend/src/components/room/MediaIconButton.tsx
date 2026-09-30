import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface MediaIconButtonProps {
  kind: "audio" | "video";
  enabled: boolean;
  onToggle: () => void;
  variant?: "toolbar" | "round";
}

const labels = {
  audio: { on: "Mute", off: "Unmute" },
  video: { on: "Stop Video", off: "Start Video" },
};

export function MediaIconButton({ kind, enabled, onToggle, variant = "toolbar" }: MediaIconButtonProps) {
  const Icon = kind === "audio" ? (enabled ? Mic : MicOff) : enabled ? Video : VideoOff;
  const label = enabled ? labels[kind].on : labels[kind].off;
  const testId = kind === "audio" ? "toggle-audio" : "toggle-video";

  if (variant === "round") {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        aria-pressed={!enabled}
        title={label}
        data-testid={`prejoin-${testId}`}
        className={`flex h-12 w-12 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white ${
          enabled ? "bg-white/20 text-white backdrop-blur hover:bg-white/30" : "bg-zoom-red text-white hover:bg-zoom-red-dark"
        }`}
      >
        <Icon size={22} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={!enabled}
      data-testid={testId}
      data-state={enabled ? "on" : "off"}
      className="flex min-w-[60px] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-white outline-none transition-colors hover:bg-room-hover focus-visible:ring-2 focus-visible:ring-white/60 sm:min-w-[72px]"
    >
      <Icon size={22} className={enabled ? "" : "text-zoom-red"} />
      <span className="whitespace-nowrap text-[11px]">{label}</span>
    </button>
  );
}
