"use client";

import Link from "next/link";
import { Search, Settings } from "lucide-react";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { SearchBox } from "@/components/layout/SearchBox";
import { ZoomLogo } from "@/components/ui/ZoomLogo";
import { ROUTES } from "@/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const iconButton =
  "flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-hover hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-zoom-blue";

export function AppHeader() {
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 z-40 h-14 shrink-0 border-b border-line bg-white">
      <div className="flex h-full items-center gap-3 px-4 md:px-5">
        <Link href={ROUTES.home} className="flex items-baseline gap-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zoom-blue" aria-label="Zoom Workplace home">
          <ZoomLogo />
          <span className="hidden text-[17px] font-semibold tracking-tight text-ink sm:inline">Workplace</span>
        </Link>

        <div className="mx-auto hidden w-full max-w-md md:block">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link href={ROUTES.meetings} aria-label="Search meetings" className={`${iconButton} md:hidden`}>
            <Search size={20} />
          </Link>
          <Link href={ROUTES.settings} aria-label="Settings" title="Settings" className={iconButton} data-testid="settings-button">
            <Settings size={20} />
          </Link>
          <ProfileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
