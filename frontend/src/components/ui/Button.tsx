import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "@/components/ui/Spinner";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-zoom-blue font-medium text-white hover:bg-zoom-blue-dark active:bg-zoom-blue-dark",
  secondary: "bg-canvas text-zoom-blue hover:bg-[#e4e8eb] active:bg-line",
  danger: "bg-zoom-red text-white hover:bg-zoom-red-dark active:bg-zoom-red-dark",
  ghost: "text-zoom-blue hover:bg-zoom-blue-light",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 rounded-xl text-sm",
  md: "h-8 px-3.5 rounded-xl text-sm",
  lg: "h-10 px-5 rounded-xl text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md"): string {
  return `inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap leading-[18px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zoom-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-ink-disabled ${variants[variant]} ${sizes[size]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClasses(variant, size)} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}
