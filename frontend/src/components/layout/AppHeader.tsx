"use client";

import Link from "next/link";
import { Bell, ChevronLeft, ChevronRight, Clock3, Search } from "lucide-react";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { SearchBox } from "@/components/layout/SearchBox";
import { ZoomLogo } from "@/components/ui/ZoomLogo";
import { ROUTES } from "@/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const historyButton = "flex h-6 w-6 items-center justify-center rounded-md";

export function AppHeader() {
  const user = useCurrentUser();

  return (
    <header className="z-40 h-16 shrink-0 bg-white">
      <div className="flex h-full items-center gap-3 pl-4 pr-4">
        <Link href={ROUTES.home} className="flex shrink-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zoom-blue" aria-label="Zoom Workplace home">
          <ZoomLogo />
          <span className="ml-3 hidden h-6 border-l border-line pl-3 text-[22px] font-semibold leading-6 text-ink sm:inline">Workplace</span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 md:flex">
          <div className="hidden items-center lg:flex" aria-hidden>
            <span className={`${historyButton} text-ink-disabled`}>
              <ChevronLeft size={16} />
            </span>
            <span className={`${historyButton} text-ink-disabled`}>
              <ChevronRight size={16} />
            </span>
            <span className={`${historyButton} text-[#2a2b2d]`}>
              <Clock3 size={14} />
            </span>
          </div>
          <div className="w-full max-w-[411px]">
            <SearchBox />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
          <Link href={ROUTES.meetings} aria-label="Search meetings" className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-canvas md:hidden">
            <Search size={16} />
          </Link>
          <span aria-hidden title="Activity Center" className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft">
            <Bell size={16} />
          </span>
          <ProfileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
