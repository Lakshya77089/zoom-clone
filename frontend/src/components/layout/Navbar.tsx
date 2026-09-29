"use client";

import { Calendar, Home, MessageCircle, Settings, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ZoomLogo } from "@/components/ui/ZoomLogo";
import { useDismissible } from "@/hooks/useDismissible";
import type { User } from "@/types";

interface NavbarProps {
  user: User | null;
}

const tabs = [
  { label: "Home", icon: Home, active: true },
  { label: "Meetings", icon: Calendar, active: false },
  { label: "Team Chat", icon: MessageCircle, active: false },
  { label: "Contacts", icon: Users, active: false },
];

export function Navbar({ user }: NavbarProps) {
  const { open: menuOpen, setOpen: setMenuOpen, ref: menuRef } = useDismissible();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-1.5">
          <ZoomLogo />
          <span className="hidden text-lg font-bold text-ink sm:inline">Workplace</span>
        </div>

        <nav className="ml-4 hidden flex-1 items-center gap-1 md:flex" aria-label="Main">
          {tabs.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              disabled={!active}
              aria-current={active ? "page" : undefined}
              className={`flex h-14 items-center gap-2 border-b-2 px-3 text-sm font-bold transition-colors ${
                active ? "border-zoom-blue text-zoom-blue" : "cursor-not-allowed border-transparent text-ink-muted/60"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Settings"
            title="Settings"
            className="rounded-full p-2 text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <Settings size={20} />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label="Profile"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-full ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-zoom-blue"
            >
              {user ? <Avatar name={user.name} color={user.avatar_color} size="sm" /> : <span className="block h-8 w-8 rounded-full bg-line" />}
            </button>

            {menuOpen && user && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-line bg-white p-4 shadow-xl" role="menu">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} color={user.avatar_color} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{user.name}</p>
                    <p className="truncate text-sm text-ink-muted">{user.email}</p>
                  </div>
                </div>
                <span className="mt-3 inline-block rounded bg-canvas px-2 py-0.5 text-xs font-bold text-ink-muted">Basic</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
