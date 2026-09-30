"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MeetingDialogs, type ActiveDialog } from "@/components/dashboard/MeetingDialogs";
import { CalendarPlusIcon, PlusIcon, RefreshIcon, SearchIcon } from "@/components/icons";
import { MeetingDetail } from "@/components/meetings/MeetingDetail";
import { MeetingListItem } from "@/components/meetings/MeetingListItem";
import { MeetingListSkeleton } from "@/components/meetings/MeetingLists";
import { FormAlert } from "@/components/ui/field";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMeetingDeletion } from "@/hooks/useMeetingDeletion";
import { useMeetingLauncher } from "@/hooks/useMeetingLauncher";
import { formatGroupLabel } from "@/lib/format";
import type { Meeting } from "@/types";
import { unavailableClass } from "@/components/ui/unavailable";

type Tab = "upcoming" | "previous";

const TABS: { id: Tab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "previous", label: "Previous" },
];

function matches(meeting: Meeting, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const looksLikeId = /^[\d\s-]+$/.test(needle);
  return meeting.title.toLowerCase().includes(needle) || (looksLikeId && meeting.meeting_code.includes(needle.replace(/\D/g, "")));
}

function groupByDay(meetings: Meeting[]): [string, Meeting[]][] {
  const groups = new Map<string, Meeting[]>();
  for (const meeting of meetings) {
    const label = formatGroupLabel(meeting.scheduled_start ?? meeting.started_at ?? meeting.created_at);
    groups.set(label, [...(groups.get(label) ?? []), meeting]);
  }
  return [...groups.entries()];
}

function ListMessage({ text, testId }: { text: string; testId: string }) {
  return (
    <p className="flex min-h-[240px] flex-1 items-center justify-center px-6 text-center text-sm leading-[14px] text-ink-faint" data-testid={testId}>
      {text}
    </p>
  );
}

const iconButton = "flex h-7 w-7 items-center justify-center rounded-md text-ink outline-none hover:bg-canvas focus-visible:ring-2 focus-visible:ring-zoom-blue";

export function MeetingsView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab: Tab = params.get("tab") === "previous" ? "previous" : "upcoming";
  const paramQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(paramQuery);
  const [syncedQuery, setSyncedQuery] = useState(paramQuery);
  if (paramQuery !== syncedQuery) {
    setSyncedQuery(paramQuery);
    setQuery(paramQuery);
  }

  const user = useCurrentUser();
  const { upcoming, recent, loading, error, refresh } = useDashboardData();
  const launcher = useMeetingLauncher(refresh);
  const deletion = useMeetingDeletion(refresh);
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const selectTab = (next: Tab) => {
    const nextParams = new URLSearchParams(paramQuery ? { q: paramQuery } : {});
    if (next !== "upcoming") nextParams.set("tab", next);
    const search = nextParams.toString();
    setSelectedCode(null);
    setShowDetail(false);
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  const variant = tab === "upcoming" ? "upcoming" : "recent";
  const source = tab === "upcoming" ? upcoming : recent;
  const filtered = useMemo(() => source.filter((meeting) => matches(meeting, query)), [source, query]);
  const selected = filtered.find((meeting) => meeting.meeting_code === selectedCode) ?? filtered[0] ?? null;

  const select = (meeting: Meeting) => {
    setSelectedCode(meeting.meeting_code);
    setShowDetail(true);
  };

  const renderList = () => {
    if (loading) return <MeetingListSkeleton rows={4} />;
    if (filtered.length === 0) {
      if (query.trim()) return <ListMessage text={`No meetings match "${query.trim()}"`} testId="search-empty" />;
      return tab === "upcoming" ? (
        <ListMessage text="No upcoming meetings" testId="upcoming-empty" />
      ) : (
        <ListMessage text="No previous meetings" testId="recent-empty" />
      );
    }
    return (
      <div className="px-4 pb-4" data-testid={tab === "upcoming" ? "upcoming-list" : "recent-list"}>
        {groupByDay(filtered).map(([day, items]) => (
          <section key={day} aria-label={day}>
            <h3 className="px-1 pb-1.5 pt-3 text-xs font-semibold leading-4 text-ink-soft">{day}</h3>
            <ul className="space-y-1">
              {items.map((meeting) => (
                <MeetingListItem
                  key={meeting.id}
                  meeting={meeting}
                  variant={variant}
                  selected={selected?.meeting_code === meeting.meeting_code}
                  onSelect={select}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-0" data-testid="meetings-page">
      <h1 className="sr-only">Meetings</h1>
      <div className={`min-h-0 w-full shrink-0 flex-col border-r-2 border-[rgba(125,125,136,0.13)] md:flex md:w-[360px] ${showDetail ? "hidden" : "flex"}`}>
        <div className="flex h-[46px] shrink-0 items-center gap-1 px-3">
          <button type="button" onClick={() => void refresh()} aria-label="Refresh meetings" className={iconButton}>
            <RefreshIcon size={13} />
          </button>
          <div role="tablist" aria-label="Meeting lists" className="flex flex-1 items-center justify-center gap-5">
            {TABS.map(({ id, label }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-testid={`tab-${id}`}
                  onClick={() => selectTab(id)}
                  className={`h-7 text-sm leading-[14px] outline-none transition-colors focus-visible:underline ${
                    active ? "font-bold text-[#131619]" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <button type="button" onClick={() => setDialog("schedule")} aria-label="Schedule a meeting" data-testid="meetings-schedule-button" className={iconButton}>
            <PlusIcon size={16} />
          </button>
        </div>

        <div className="px-4 pb-1">
          <label className="relative block">
            <SearchIcon size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4349]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by topic or meeting ID"
              aria-label="Search meetings"
              data-testid="meetings-search"
              className="h-8 w-full rounded-lg border-[0.8px] border-transparent bg-search pl-8 pr-3 text-sm text-ink outline-none placeholder:text-[#3d4349] focus:border-zoom-blue focus:bg-white"
            />
          </label>
        </div>

        {error && (
          <div className="px-4 pt-3">
            <FormAlert>{error}</FormAlert>
          </div>
        )}

        <div role="tabpanel" className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {renderList()}
        </div>

        <div className="flex h-[35px] shrink-0 items-center justify-center border-t-[0.8px] border-line">
          <span aria-disabled="true" className={`flex items-center gap-1.5 text-sm leading-[14px] text-[#0e72ed] ${unavailableClass}`}>
            <CalendarPlusIcon size={13} />
            Add a calendar
          </span>
        </div>
      </div>

      <div className={`min-h-0 min-w-0 flex-1 overflow-y-auto md:block ${showDetail ? "block" : "hidden"}`}>
        {selected ? (
          <MeetingDetail
            key={selected.meeting_code}
            meeting={selected}
            variant={variant}
            starting={launcher.startingCode === selected.meeting_code}
            onStart={(meeting) => void launcher.startMeeting(meeting)}
            onDelete={deletion.requestDelete}
            onBack={() => setShowDetail(false)}
          />
        ) : (
          !loading && <p className="flex h-full items-center justify-center text-sm text-ink-faint">Select a meeting to see its details</p>
        )}
      </div>

      <MeetingDialogs active={dialog} user={user} onClose={() => setDialog(null)} onScheduled={() => void refresh()} deletion={deletion} />
    </div>
  );
}
