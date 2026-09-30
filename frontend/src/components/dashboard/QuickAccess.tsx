import { CircleDot, FileText, PenLine, type LucideIcon } from "lucide-react";

interface QuickItem {
  label: string;
  icon: LucideIcon;
  chip: string;
  tint: string;
}

const items: QuickItem[] = [
  { label: "Recordings", icon: CircleDot, chip: "bg-[#fff2f5]", tint: "text-[#e8173d]" },
  { label: "Summaries", icon: FileText, chip: "bg-[#f4f2ff]", tint: "text-[#7b61ff]" },
  { label: "My Notes", icon: PenLine, chip: "bg-[#f4f2ff]", tint: "text-[#7b61ff]" },
];

export function QuickAccess() {
  return (
    <div className="grid gap-4 sm:grid-cols-3" aria-label="Quick access">
      {items.map(({ label, icon: Icon, chip, tint }) => (
        <span
          key={label}
          aria-disabled="true"
          title={`${label} is not available in this demo`}
          className="flex h-14 items-center gap-3 rounded-2xl border-[0.8px] border-line bg-white px-4"
        >
          <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${chip}`}>
            <Icon size={16} className={tint} strokeWidth={2} />
          </span>
          <span className="text-sm font-semibold leading-[18px] text-ink">{label}</span>
        </span>
      ))}
    </div>
  );
}
