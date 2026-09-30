"use client";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, MoreIcon } from "@/components/icons";
import { Menu, type MenuItem } from "@/components/ui/Menu";
import type { DayCursor } from "@/hooks/useDayCursor";
import { formatShortDate } from "@/lib/format";

interface DayNavigatorProps {
  cursor: DayCursor;
  menuItems: MenuItem[];
}

const roundButton =
  "flex h-6 w-6 items-center justify-center rounded-full text-ink-soft outline-none transition-colors hover:bg-canvas hover:text-ink focus-visible:ring-2 focus-visible:ring-zoom-blue disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent";

export function DayNavigator({ cursor, menuItems }: DayNavigatorProps) {
  const { selected, isToday, goToday, goPrevious, goNext } = cursor;

  return (
    <div className="flex h-11 items-center gap-2 border-b-[0.8px] border-line px-4" role="group" aria-label="Choose a day">
      <button
        type="button"
        onClick={goToday}
        aria-pressed={isToday}
        data-testid="calendar-today"
        className={`flex h-6 items-center gap-1 rounded-full border-[0.8px] px-2 text-xs leading-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zoom-blue ${
          isToday ? "border-[#98a0a9] text-ink" : "border-zoom-blue text-zoom-blue hover:bg-zoom-blue-light"
        }`}
      >
        <CalendarIcon size={12} />
        Today
      </button>
      <button type="button" onClick={goPrevious} disabled={isToday} aria-label="Previous day" data-testid="calendar-prev" className={roundButton}>
        <ChevronLeftIcon size={14} />
      </button>
      <button type="button" onClick={goNext} aria-label="Next day" data-testid="calendar-next" className={roundButton}>
        <ChevronRightIcon size={14} />
      </button>
      <span className="truncate text-xs font-semibold leading-4 text-ink" aria-live="polite" data-testid="calendar-date" suppressHydrationWarning>
        {selected ? formatShortDate(selected) : ""}
      </span>
      <div className="ml-auto">
        <Menu
          label="Calendar options"
          items={menuItems}
          widthClass="w-52"
          renderTrigger={({ open, toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Calendar options"
              aria-haspopup="menu"
              aria-expanded={open}
              data-testid="calendar-more"
              className={`${roundButton} ${open ? "bg-canvas text-ink" : ""}`}
            >
              <MoreIcon size={14} />
            </button>
          )}
        />
      </div>
    </div>
  );
}
