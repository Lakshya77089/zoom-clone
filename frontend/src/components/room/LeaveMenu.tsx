"use client";

import { useDismissible } from "@/hooks/useDismissible";

interface LeaveMenuProps {
  isHost: boolean;
  onLeave: () => void;
  onEndForAll: () => void;
}

export function LeaveMenu({ isHost, onLeave, onEndForAll }: LeaveMenuProps) {
  const { open, setOpen, ref } = useDismissible();

  return (
    <div className="relative pr-2" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        data-testid="leave-meeting"
        className="h-8 rounded-lg bg-zoom-red px-4 text-sm font-semibold text-white outline-none transition-colors hover:bg-zoom-red-dark focus-visible:ring-2 focus-visible:ring-white/60"
      >
        {isHost ? "End" : "Leave"}
      </button>

      {open && (
        <div
          className="absolute bottom-full right-0 z-40 mb-4 w-[min(15rem,calc(100vw-1rem))] animate-fade-in space-y-2 rounded-xl bg-room-panel p-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          role="menu"
          aria-label={isHost ? "End meeting" : "Leave meeting"}
        >
          {isHost && (
            <button
              type="button"
              role="menuitem"
              onClick={onEndForAll}
              data-testid="end-for-all"
              className="h-9 w-full rounded-lg bg-zoom-red text-sm font-semibold text-white hover:bg-zoom-red-dark"
            >
              End meeting for all
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={onLeave}
            data-testid="leave-confirm"
            className={`h-9 w-full rounded-lg text-sm font-semibold text-white ${
              isHost ? "bg-[#3d3d3d] hover:bg-[#4a4a4a]" : "bg-zoom-red hover:bg-zoom-red-dark"
            }`}
          >
            Leave meeting
          </button>
        </div>
      )}
    </div>
  );
}
