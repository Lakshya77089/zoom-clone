import type { InputHTMLAttributes, ReactNode } from "react";
import { FieldMessage, inputClasses } from "@/components/ui/field";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
  hint?: ReactNode;
}

export function TextField({ label, id, error, hint, className = "", ...props }: TextFieldProps) {
  const messageId = `${id}-message`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={`${inputClasses(Boolean(error))} ${className}`}
        {...props}
      />
      <FieldMessage id={messageId} error={error} hint={hint} />
    </div>
  );
}
