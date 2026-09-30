interface SwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ id, label, description, checked, onChange }: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-sm font-medium text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-[13px] text-ink-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zoom-blue focus-visible:ring-offset-2 ${
          checked ? "bg-zoom-blue" : "bg-line-strong"
        }`}
      >
        <span
          className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}
