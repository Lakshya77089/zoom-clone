import { Check } from "lucide-react";

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <label htmlFor={id} className="group flex cursor-pointer items-center gap-2 text-sm leading-[18px] text-ink-strong">
      <span className="relative flex h-4 w-4 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer h-full w-full cursor-pointer appearance-none rounded border-[0.8px] border-outline bg-white transition-colors checked:border-zoom-blue checked:bg-zoom-blue focus-visible:ring-2 focus-visible:ring-zoom-blue/30 focus-visible:outline-none"
        />
        <Check size={12} strokeWidth={3} className="pointer-events-none absolute inset-0 m-auto hidden text-white peer-checked:block" />
      </span>
      {label}
    </label>
  );
}
