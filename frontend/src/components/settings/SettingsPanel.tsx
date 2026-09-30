"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AccountSolidIcon, AudioSolidIcon, ChatSolidIcon, CloseIcon, GeneralSolidIcon, VideoSolidIcon, type IconComponent } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Switch } from "@/components/ui/Switch";
import { ROUTES } from "@/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePreferences } from "@/hooks/usePreferences";

type SectionId = "general" | "audio" | "video" | "profile";

interface NavEntry {
  id: SectionId | null;
  label: string;
  icon: IconComponent;
  tint: string;
}

const NAV: NavEntry[] = [
  { id: "general", label: "General", icon: GeneralSolidIcon, tint: "bg-[#0e71eb]" },
  { id: "audio", label: "Audio", icon: AudioSolidIcon, tint: "bg-[#82c786]" },
  { id: "video", label: "Video", icon: VideoSolidIcon, tint: "bg-[#82c786]" },
  { id: null, label: "Chat", icon: ChatSolidIcon, tint: "bg-[#70c3a0]" },
  { id: "profile", label: "My account", icon: AccountSolidIcon, tint: "bg-[#5b8def]" },
];

function Section({ id, title, children, testId }: { id: SectionId; title: string; children: ReactNode; testId?: string }) {
  return (
    <section id={id} data-section={id} aria-labelledby={`${id}-heading`} data-testid={testId} className="scroll-mt-4 pb-8">
      <h2 id={`${id}-heading`} className="text-base font-bold leading-5 text-black">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function SettingsPanel() {
  const user = useCurrentUser();
  const { preferences, updatePreferences } = usePreferences();
  const [active, setActive] = useState<SectionId>("general");
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) router.push(ROUTES.home);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const jump = (id: SectionId) => {
    setActive(id);
    const container = scrollRef.current;
    const target = container?.querySelector<HTMLElement>(`[data-section="${id}"]`);
    if (container && target) container.scrollTo({ top: target.offsetTop - container.offsetTop - 16, behavior: "smooth" });
  };

  useEffect(() => {
    if (window.location.hash !== "#profile") return;
    const frame = requestAnimationFrame(() => jump("profile"));
    return () => cancelAnimationFrame(frame);
  }, []);

  const onScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const sections = [...container.querySelectorAll<HTMLElement>("[data-section]")];
    const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 4;
    const current = atBottom
      ? sections[sections.length - 1]
      : sections.filter((section) => section.offsetTop - container.offsetTop - 40 <= container.scrollTop).pop();
    if (current) setActive(current.dataset.section as SectionId);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white sm:inset-x-auto sm:bottom-[35px] sm:left-1/2 sm:top-[35px] sm:w-[min(820px,calc(100vw-32px))] sm:-translate-x-1/2 sm:rounded sm:shadow-[0_2px_16px_rgba(0,0,0,0.1)]"
      data-testid="settings-page"
    >
      <div className="flex h-[46px] shrink-0 items-center justify-between border-b-[0.8px] border-line-soft pl-[22px] pr-4">
        <h1 id="settings-title" className="text-xl font-normal leading-5 text-black">Settings</h1>
        <Link href={ROUTES.home} aria-label="Close settings" className="flex h-6 w-6 items-center justify-center rounded text-[#222230] hover:bg-state-hover">
          <CloseIcon size={16} />
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <nav aria-label="Settings sections" className="shrink-0 border-b-[0.8px] border-line-soft p-2 sm:w-[166px] sm:border-b-0 sm:border-r-[0.8px] sm:px-[15px] sm:pt-[22px]">
          <ul className="flex gap-1 overflow-x-auto sm:flex-col sm:gap-3 sm:overflow-visible">
            {NAV.map(({ id, label, icon: Icon, tint }) => {
              const selected = id !== null && id === active;
              return (
                <li key={label} className="shrink-0">
                  <button
                    type="button"
                    disabled={id === null}
                    onClick={() => id && jump(id)}
                    aria-current={selected || undefined}
                    className={`flex h-8 w-full items-center gap-2 whitespace-nowrap rounded-xl px-3 text-base leading-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zoom-blue disabled:cursor-not-allowed sm:w-[134px] ${
                      selected ? "bg-zoom-tile text-white" : "text-[#131619] hover:bg-state-hover disabled:hover:bg-transparent"
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${selected ? "" : tint}`}>
                      <Icon size={13} className="text-white" />
                    </span>
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div ref={scrollRef} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto px-5 pt-6 sm:px-8 sm:pt-7">
          <Section id="general" title="Meetings">
            <Switch
              id="pref-show-invite"
              label="Show invite details when starting a new meeting"
              description="Opens the meeting ID and invite link so you can share them right away."
              checked={preferences.showInviteOnStart}
              onChange={(showInviteOnStart) => updatePreferences({ showInviteOnStart })}
            />
          </Section>

          <Section id="audio" title="Audio">
            <Switch
              id="pref-join-muted"
              label="Mute my microphone when joining a meeting"
              description="You can unmute any time from the meeting toolbar."
              checked={preferences.joinMuted}
              onChange={(joinMuted) => updatePreferences({ joinMuted })}
            />
          </Section>

          <Section id="video" title="Video">
            <Switch
              id="pref-join-video-off"
              label="Turn off my video when joining a meeting"
              description="Applies to the join dialog and the pre-join screen."
              checked={preferences.joinVideoOff}
              onChange={(joinVideoOff) => updatePreferences({ joinVideoOff })}
            />
          </Section>

          <Section id="profile" title="My account" testId="profile-section">
            <div className="flex items-center gap-4 pt-2">
              {user ? (
                <Avatar name={user.name} color={user.avatar_color} size="lg" square />
              ) : (
                <span className="block h-16 w-16 animate-pulse rounded-lg bg-line" />
              )}
              <div className="min-w-0">
                <p className="truncate text-base font-bold leading-5 text-ink">{user?.name ?? " "}</p>
                <p className="mt-1 truncate text-sm leading-[18px] text-ink-soft">{user?.email ?? " "}</p>
                <span className="mt-2 inline-block rounded-md bg-canvas px-2 py-0.5 text-xs leading-4 text-ink-soft">Basic</span>
              </div>
            </div>
            <dl className="mt-6 grid max-w-[480px] grid-cols-[120px_minmax(0,1fr)] gap-y-3 text-sm leading-[18px]">
              <dt className="text-ink-muted">Display name</dt>
              <dd className="break-words text-[#2a2b2d]">{user?.name}</dd>
              <dt className="text-ink-muted">Email</dt>
              <dd className="break-words text-[#2a2b2d]">{user?.email}</dd>
              <dt className="text-ink-muted">Account type</dt>
              <dd className="text-[#2a2b2d]">Basic</dd>
              <dt className="text-ink-muted">User ID</dt>
              <dd className="text-[#2a2b2d]">{user?.id}</dd>
            </dl>
            <p className="mt-6 text-xs leading-[18px] text-ink-muted">
              This demo always signs you in as the default seeded user. Account editing is not available.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
