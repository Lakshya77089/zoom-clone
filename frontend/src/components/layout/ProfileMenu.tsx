"use client";

import Link from "next/link";
import { Settings, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ROUTES } from "@/constants";
import { useDismissible } from "@/hooks/useDismissible";
import type { User } from "@/types";

interface ProfileMenuProps {
  user: User | null;
}

const links = [
  { label: "Profile", href: `${ROUTES.settings}#profile`, icon: UserRound },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
];

export function ProfileMenu({ user }: ProfileMenuProps) {
  const { open, setOpen, ref } = useDismissible();

  return (
    <div className="relative ml-1" ref={ref}>
      <button
        type="button"
        aria-label="Profile"
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid="profile-button"
        onClick={() => setOpen((value) => !value)}
        className="flex rounded-full outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-zoom-blue"
      >
        {user ? <Avatar name={user.name} color={user.avatar_color} size="sm" /> : <span className="block h-8 w-8 animate-pulse rounded-full bg-line" />}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-72 animate-fade-in overflow-hidden rounded-xl border border-line bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          role="menu"
          aria-label="Profile"
          data-testid="profile-menu"
        >
          {user && (
            <div className="flex items-center gap-3 border-b border-line p-4">
              <Avatar name={user.name} color={user.avatar_color} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-[13px] text-ink-muted">{user.email}</p>
                <span className="mt-1.5 inline-block rounded-md bg-canvas px-1.5 py-0.5 text-[11px] font-semibold text-ink-muted">
                  Basic
                </span>
              </div>
            </div>
          )}
          <div className="py-1.5">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm outline-none hover:bg-hover focus-visible:bg-hover"
              >
                <Icon size={16} className="text-ink-muted" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
