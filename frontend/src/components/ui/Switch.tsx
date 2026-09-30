import { CheckIcon } from "@/components/icons";

interface SwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ id, label, description, checked, onChange }: SwitchProps) {
  return (
    <div className="flex items-start gap-1.5 py-1.5">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={() => onChange(!checked)}
        className={`mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded border-[0.8px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-zoom-blue/40 ${
          checked ? "border-zoom-tile bg-zoom-tile text-white" : "border-outline bg-white"
        }`}
      >
        {checked && <CheckIcon size={12} />}
      </button>
      <div className="min-w-0 pl-1.5">
        <label id={`${id}-label`} htmlFor={id} className="block cursor-pointer text-sm leading-[18px] text-[#2a2b2d]">
          {label}
        </label>
        {description && <p className="mt-1 text-xs leading-4 text-ink-muted">{description}</p>}
      </div>
    </div>
  );
}
