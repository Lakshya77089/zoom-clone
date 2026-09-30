"use client";

import { MoreIcon } from "@/components/icons";
import { Menu, type MenuItem } from "@/components/ui/Menu";

interface MeetingMoreMenuProps {
  title: string;
  items: MenuItem[];
}

export function MeetingMoreMenu({ title, items }: MeetingMoreMenuProps) {
  return (
    <Menu
      label={`More options for ${title}`}
      items={items}
      renderTrigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={`More options for ${title}`}
          aria-haspopup="menu"
          aria-expanded={open}
          data-testid="meeting-more-button"
          className={`flex h-8 w-8 items-center justify-center rounded-md text-ink-soft outline-none transition-colors hover:bg-state-hover hover:text-ink active:bg-state-press focus-visible:ring-2 focus-visible:ring-zoom-blue ${
            open ? "bg-line/70 text-ink" : ""
          }`}
        >
          <MoreIcon size={16} />
        </button>
      )}
    />
  );
}
