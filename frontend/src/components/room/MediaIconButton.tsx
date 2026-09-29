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

  if (variant === "round") {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        title={label}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
          enabled ? "bg-white/20 text-white hover:bg-white/30" : "bg-zoom-red text-white hover:bg-zoom-red-dark"
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
      className="flex min-w-16 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-white transition-colors hover:bg-room-hover"
    >
      <Icon size={22} className={enabled ? "" : "text-zoom-red"} />
      <span className="text-[11px]">{label}</span>
    </button>
  );
}
