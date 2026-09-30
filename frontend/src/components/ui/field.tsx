import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export function inputClasses(invalid = false): string {
  return `h-10 w-full rounded-xl border bg-white px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/80 focus:ring-2 disabled:bg-canvas ${
    invalid
      ? "border-zoom-red focus:border-zoom-red focus:ring-zoom-red/15"
      : "border-line-strong hover:border-outline focus:border-zoom-blue focus:ring-zoom-blue/15"
  }`;
}

interface FieldMessageProps {
  id: string;
  error?: string | null;
  hint?: ReactNode;
}

export function FieldMessage({ id, error, hint }: FieldMessageProps) {
  if (error) {
    return (
      <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] text-zoom-red" data-testid="field-error">
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={id} className="mt-1.5 text-[13px] text-ink-muted">
        {hint}
      </p>
    );
  }
  return null;
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl bg-zoom-red/8 px-3 py-2.5 text-[13px] text-zoom-red" data-testid="form-error">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
