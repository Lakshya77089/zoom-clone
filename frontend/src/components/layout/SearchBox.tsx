"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ROUTES } from "@/constants";

export function SearchBox() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

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

  const showHint = !focused && !query;

  return (
    <form role="search" onSubmit={handleSubmit} className="relative">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4349]" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Search meetings"
        data-testid="header-search"
        className="h-8 w-full rounded-lg border-[0.8px] border-transparent bg-search pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-zoom-blue focus:bg-white [&::-webkit-search-cancel-button]:hidden"
      />
      {showHint && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-sm text-[#3d4349]">
          Search <span className="text-[13px]">Ctrl+K</span>
        </span>
      )}
    </form>
  );
}
