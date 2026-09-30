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
    <div className="relative pr-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        data-testid="leave-meeting"
        className="h-8 rounded-lg bg-zoom-red px-3.5 text-[13px] font-semibold text-white outline-none transition-colors hover:bg-zoom-red-dark focus-visible:ring-2 focus-visible:ring-white/60 sm:h-9 sm:px-4 sm:text-sm"
      >
        {isHost ? "End" : "Leave"}
      </button>

      {open && (
        <div
          className="absolute bottom-full right-0 z-40 mb-3 w-[min(16rem,calc(100vw-1rem))] animate-fade-in space-y-2 rounded-xl bg-room-panel p-3 shadow-2xl"
          role="menu"
          aria-label={isHost ? "End meeting" : "Leave meeting"}
        >
          {isHost && (
            <button
              type="button"
              role="menuitem"
              onClick={onEndForAll}
              data-testid="end-for-all"
              className="h-10 w-full rounded-lg bg-zoom-red text-sm font-semibold text-white hover:bg-zoom-red-dark"
            >
              End meeting for all
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={onLeave}
            data-testid="leave-confirm"
            className={`h-10 w-full rounded-lg text-sm font-semibold text-white ${
              isHost ? "bg-room-hover hover:bg-[#3d3d3d]" : "bg-zoom-red hover:bg-zoom-red-dark"
            }`}
          >
            Leave meeting
          </button>
        </div>
      )}
    </div>
  );
}
