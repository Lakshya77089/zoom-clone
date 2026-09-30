"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ROUTES } from "@/constants";

export function SearchBox() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `${ROUTES.meetings}?q=${encodeURIComponent(trimmed)}` : ROUTES.meetings);
    inputRef.current?.blur();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="relative">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search meetings"
        aria-label="Search meetings"
        data-testid="header-search"
        className="h-9 w-full rounded-[10px] border border-transparent bg-canvas pl-9 pr-16 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted hover:border-line focus:border-zoom-blue focus:bg-white focus:ring-2 focus:ring-zoom-blue/15"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-line bg-white px-1.5 text-[11px] font-medium text-ink-muted">
        Ctrl K
      </kbd>
    </form>
  );
}
