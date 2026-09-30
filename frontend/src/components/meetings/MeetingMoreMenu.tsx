"use client";

import { MoreHorizontal } from "lucide-react";
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
          className={`flex h-8 w-8 items-center justify-center rounded-full text-ink-soft outline-none transition-colors hover:bg-line/70 hover:text-ink focus-visible:ring-2 focus-visible:ring-zoom-blue ${
            open ? "bg-line/70 text-ink" : ""
          }`}
        >
          <MoreHorizontal size={16} />
        </button>
      )}
    />
  );
}
