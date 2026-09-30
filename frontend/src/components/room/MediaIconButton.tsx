import {
  ChevronUpIcon,
  MicIcon,
  MicOffIcon,
  ToolbarMicIcon,
  ToolbarMicOffIcon,
  ToolbarVideoIcon,
  ToolbarVideoOffIcon,
  VideoIcon,
  VideoOffIcon,
} from "@/components/icons";

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
  const Icon = kind === "audio" ? (enabled ? MicIcon : MicOffIcon) : enabled ? VideoIcon : VideoOffIcon;
  const ToolbarIcon = kind === "audio" ? (enabled ? ToolbarMicIcon : ToolbarMicOffIcon) : enabled ? ToolbarVideoIcon : ToolbarVideoOffIcon;
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
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-canvas outline-none transition-colors hover:bg-state-hover focus-visible:ring-2 focus-visible:ring-zoom-blue ${
          enabled ? "text-ink" : "text-zoom-red"
        }`}
      >
        <Icon size={20} />
      </button>
    );
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onToggle}
        aria-label={label}
        aria-pressed={!enabled}
        data-testid={testId}
        data-state={enabled ? "on" : "off"}
        className="flex h-14 min-w-[56px] flex-col items-center justify-center gap-1 rounded-l-lg px-2 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 sm:min-w-[64px] lg:min-w-[70px]"
      >
        <span className="flex h-6 items-center">
          <ToolbarIcon size={24} />
        </span>
        <span className="whitespace-nowrap text-xs leading-4 text-white">{kind === "audio" ? "Audio" : "Video"}</span>
      </button>
      <span aria-hidden className="hidden h-14 items-start rounded-r-lg pr-1 pt-2 text-white/80 sm:flex">
        <ChevronUpIcon size={12} />
      </span>
    </div>
  );
}
