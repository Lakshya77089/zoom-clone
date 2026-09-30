"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SETTINGS_NAV_ITEM, type NavItem } from "@/constants";
import { unavailableClass } from "@/components/ui/unavailable";

function isActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

const itemClass =
  "flex h-14 w-[72px] flex-col items-center gap-1 rounded-lg pb-2 pt-3 text-[10px] leading-[14px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zoom-blue";

function RailItem({ item, active, testId }: { item: NavItem; active: boolean; testId?: string }) {
  const { label, href, icon: Icon } = item;
  const content = (
    <>
      <Icon size={18} strokeWidth={1.75} />
      {label}
    </>
  );

  if (!href) {
    return (
      <span aria-disabled="true" title={`${label} is not available in this demo`} className={`${itemClass} text-ink-soft ${unavailableClass}`}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-testid={testId}
      className={`${itemClass} ${active ? "bg-white text-ink" : "text-ink-soft hover:bg-white/60 hover:text-ink"}`}
    >
      {content}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex w-20 shrink-0 flex-col items-center gap-0.5 bg-canvas pb-4 pt-1" data-testid="side-rail">
      {NAV_ITEMS.map((item) => (
        <RailItem key={item.label} item={item} active={isActive(pathname, item.href)} />
      ))}
      <div className="mt-auto">
        <RailItem item={SETTINGS_NAV_ITEM} active={isActive(pathname, SETTINGS_NAV_ITEM.href)} testId="settings-button" />
      </div>
    </nav>
  );
}
