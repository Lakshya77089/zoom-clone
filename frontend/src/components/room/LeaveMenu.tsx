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
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="h-9 rounded-lg bg-zoom-red px-4 text-sm font-bold text-white transition-colors hover:bg-zoom-red-dark"
      >
        {isHost ? "End" : "Leave"}
      </button>

      {open && (
        <div className="absolute bottom-full right-0 z-30 mb-3 w-64 space-y-2 rounded-xl bg-room-panel p-3 shadow-2xl" role="menu">
          {isHost && (
            <button
              type="button"
              role="menuitem"
              onClick={onEndForAll}
              className="h-10 w-full rounded-lg bg-zoom-red text-sm font-bold text-white hover:bg-zoom-red-dark"
            >
              End meeting for all
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={onLeave}
            className={`h-10 w-full rounded-lg text-sm font-bold ${
              isHost ? "bg-room-hover text-white hover:bg-[#3d3d3d]" : "bg-zoom-red text-white hover:bg-zoom-red-dark"
            }`}
          >
            Leave meeting
          </button>
        </div>
      )}
    </div>
  );
}
