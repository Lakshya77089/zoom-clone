import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, id, className = "", ...props }: TextFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-bold text-ink">{label}</span>
      <input
        id={id}
        className={`h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none transition focus:border-zoom-blue focus:ring-2 focus:ring-zoom-blue/20 ${className}`}
        {...props}
      />
    </label>
  );
}
