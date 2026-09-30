"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useDismissible } from "@/hooks/useDismissible";

export interface MenuItem {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  danger?: boolean;
  testId?: string;
}

interface MenuProps {
  items: MenuItem[];
  renderTrigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  align?: "left" | "right" | "center";
  placement?: "top" | "bottom";
  theme?: "light" | "dark";
  label: string;
  widthClass?: string;
}

const GAP_PX = 6;
const VIEWPORT_MARGIN_PX = 8;

const themes = {
  light: {
    panel: "border border-line bg-white text-ink shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
    item: "hover:bg-hover focus-visible:bg-hover",
    danger: "text-zoom-red",
    icon: "text-ink-muted",
  },
  dark: {
    panel: "bg-room-panel text-white shadow-2xl",
    item: "hover:bg-room-hover focus-visible:bg-room-hover",
    danger: "text-[#ff6b6b]",
    icon: "text-white/70",
  },
};

function computePosition(trigger: DOMRect, menu: DOMRect, align: MenuProps["align"], placement: MenuProps["placement"]) {
  const spaceBelow = window.innerHeight - trigger.bottom;
  const openUp = placement === "top" ? trigger.top > menu.height + GAP_PX : spaceBelow < menu.height + GAP_PX && trigger.top > spaceBelow;
  const top = openUp ? trigger.top - menu.height - GAP_PX : trigger.bottom + GAP_PX;
  const preferredLeft =
    align === "left" ? trigger.left : align === "center" ? trigger.left + trigger.width / 2 - menu.width / 2 : trigger.right - menu.width;
  const maxLeft = window.innerWidth - menu.width - VIEWPORT_MARGIN_PX;
  return { top, left: Math.max(VIEWPORT_MARGIN_PX, Math.min(preferredLeft, maxLeft)) };
}

export function Menu({
  items,
  renderTrigger,
  align = "right",
  placement = "bottom",
  theme = "light",
  label,
  widthClass = "w-56",
}: MenuProps) {
  const { open, setOpen, ref } = useDismissible();
  const listRef = useRef<HTMLDivElement>(null);
  const styles = themes[theme];

  const place = useCallback(() => {
    const list = listRef.current;
    const trigger = ref.current?.firstElementChild?.getBoundingClientRect();
    if (!list || !trigger) return;
    const { top, left } = computePosition(trigger, list.getBoundingClientRect(), align, placement);
    list.style.top = `${top}px`;
    list.style.left = `${left}px`;
    list.style.visibility = "visible";
  }, [align, placement, ref]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus({ preventScroll: true });
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const entries = [...(listRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])];
    const index = entries.indexOf(document.activeElement as HTMLElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    entries[(index + step + entries.length) % entries.length]?.focus();
  };

  return (
    <div className="relative" ref={ref}>
      {renderTrigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <div
          ref={listRef}
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          style={{ top: 0, left: 0, visibility: "hidden" }}
          className={`fixed z-50 animate-fade-in rounded-xl py-1.5 ${widthClass} ${styles.panel}`}
        >
          {items.map(({ label: itemLabel, icon: Icon, onSelect, danger, testId }) => (
            <button
              key={itemLabel}
              type="button"
              role="menuitem"
              data-testid={testId}
              onClick={() => {
                setOpen(false);
                onSelect();
              }}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm outline-none transition-colors ${styles.item} ${
                danger ? styles.danger : ""
              }`}
            >
              {Icon && <Icon size={16} className={danger ? "" : styles.icon} />}
              {itemLabel}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
