import { MyNotesIcon, RecordingsIcon, SummariesIcon, type IconComponent } from "@/components/icons";
import { unavailableClass } from "@/components/ui/unavailable";

interface QuickItem {
  label: string;
  icon: IconComponent;
  chip: string;
}

const items: QuickItem[] = [
  { label: "Recordings", icon: RecordingsIcon, chip: "bg-[#fff2f5]" },
  { label: "Summaries", icon: SummariesIcon, chip: "bg-[#f4f2ff]" },
  { label: "My Notes", icon: MyNotesIcon, chip: "bg-[#f4f2ff]" },
];

export function QuickAccess() {
  return (
    <div className="grid gap-4 sm:grid-cols-3" aria-label="Quick access">
      {items.map(({ label, icon: Icon, chip }) => (
        <span
          key={label}
          aria-disabled="true"
          title={`${label} is not available in this demo`}
          className={`flex h-14 items-center gap-3 rounded-2xl border-[0.8px] border-line bg-white px-4 ${unavailableClass}`}
        >
          <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${chip}`}>
            <Icon size={16} />
          </span>
          <span className="text-sm font-semibold leading-[18px] text-ink">{label}</span>
        </span>
      ))}
    </div>
  );
}
