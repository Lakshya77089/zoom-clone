"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarPlus, History, Plus, Search, SearchX } from "lucide-react";
import { MeetingDialogs, type ActiveDialog } from "@/components/dashboard/MeetingDialogs";
import { MeetingListSkeleton, RecentMeetingList, UpcomingMeetingList } from "@/components/meetings/MeetingLists";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormAlert } from "@/components/ui/field";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMeetingDeletion } from "@/hooks/useMeetingDeletion";
import { useMeetingLauncher } from "@/hooks/useMeetingLauncher";
import type { Meeting } from "@/types";

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

  const selectTab = (next: Tab) => {
    const nextParams = new URLSearchParams(paramQuery ? { q: paramQuery } : {});
    if (next !== "upcoming") nextParams.set("tab", next);
    const search = nextParams.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  const source = tab === "upcoming" ? upcoming : recent;
  const filtered = useMemo(() => source.filter((meeting) => matches(meeting, query)), [source, query]);
  const onStart = (meeting: Meeting) => void launcher.startMeeting(meeting);

  const renderList = () => {
    if (loading) return <MeetingListSkeleton rows={4} />;
    if (filtered.length === 0) {
      if (query.trim()) {
        return <EmptyState icon={SearchX} title="No matching meetings" description={`Nothing matches "${query.trim()}".`} testId="search-empty" />;
      }
      return tab === "upcoming" ? (
        <EmptyState
          icon={CalendarPlus}
          title="No upcoming meetings"
          description="Schedule a meeting and it will appear here."
          testId="upcoming-empty"
          action={
            <Button variant="secondary" size="sm" onClick={() => setDialog("schedule")}>
              Schedule a meeting
            </Button>
          }
        />
      ) : (
        <EmptyState icon={History} title="No previous meetings" description="Meetings you have hosted will appear here." testId="recent-empty" />
      );
    }
    return tab === "upcoming" ? (
      <UpcomingMeetingList meetings={filtered} startingCode={launcher.startingCode} onStart={onStart} onDelete={deletion.requestDelete} />
    ) : (
      <RecentMeetingList meetings={filtered} startingCode={launcher.startingCode} onStart={onStart} />
    );
  };

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-6 sm:px-6 lg:py-8" data-testid="meetings-page">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Meetings</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setDialog("join")}>
            Join
          </Button>
          <Button onClick={() => setDialog("schedule")} data-testid="meetings-schedule-button">
            <Plus size={16} />
            Schedule
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <FormAlert>{error}</FormAlert>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line px-4 pt-3 sm:flex-row sm:items-end sm:justify-between sm:px-5">
          <div role="tablist" aria-label="Meeting lists" className="flex gap-5">
            {TABS.map(({ id, label }) => {
              const selected = tab === id;
              const count = id === "upcoming" ? upcoming.length : recent.length;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  data-testid={`tab-${id}`}
                  onClick={() => selectTab(id)}
                  className={`-mb-px flex h-10 items-center gap-1.5 border-b-2 text-sm font-semibold transition-colors ${
                    selected ? "border-zoom-blue text-zoom-blue" : "border-transparent text-ink-muted hover:text-ink"
                  }`}
                >
                  {label}
                  {!loading && <span className="rounded-full bg-canvas px-1.5 text-[11px] font-semibold text-ink-muted">{count}</span>}
                </button>
              );
            })}
          </div>
          <div className="relative mb-3 sm:w-64">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by topic or meeting ID"
              aria-label="Search meetings"
              data-testid="meetings-search"
              className="h-9 w-full rounded-[10px] border border-line-strong bg-white pl-9 pr-3 text-sm outline-none placeholder:text-ink-muted focus:border-zoom-blue focus:ring-2 focus:ring-zoom-blue/15"
            />
          </div>
        </div>
        <div role="tabpanel">{renderList()}</div>
      </div>

      <MeetingDialogs active={dialog} user={user} onClose={() => setDialog(null)} onScheduled={() => void refresh()} deletion={deletion} />
    </div>
  );
}
