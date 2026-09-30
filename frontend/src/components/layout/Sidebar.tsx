"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SETTINGS_NAV_ITEM, type NavItem } from "@/constants";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function RailLink({ item, active }: { item: NavItem; active: boolean }) {
  const { label, href, icon: Icon } = item;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group flex w-full flex-col items-center gap-1 py-1.5 text-[11px] font-medium outline-none ${
        active ? "text-zoom-blue" : "text-ink-muted hover:text-ink"
      }`}
    >
      <span
        className={`flex h-9 w-11 items-center justify-center rounded-xl transition-colors group-focus-visible:ring-2 group-focus-visible:ring-zoom-blue ${
          active ? "bg-zoom-blue-light" : "group-hover:bg-hover"
        }`}
      >
        <Icon size={20} strokeWidth={active ? 2.25 : 1.9} />
      </span>
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[72px] shrink-0 flex-col items-center border-r border-line bg-white py-3 md:flex"
    >
      <div className="flex w-full flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <RailLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </div>
      <div className="mt-auto w-full">
        <RailLink item={SETTINGS_NAV_ITEM} active={isActive(pathname, SETTINGS_NAV_ITEM.href)} />
      </div>
    </nav>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      data-testid="mobile-tab-bar"
    >
      {[...NAV_ITEMS, SETTINGS_NAV_ITEM].map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
              active ? "text-zoom-blue" : "text-ink-muted"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.25 : 1.9} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
