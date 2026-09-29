import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-zoom-blue text-white hover:bg-zoom-blue-dark disabled:bg-zoom-blue/40",
  secondary: "border border-line bg-white text-ink hover:bg-canvas disabled:text-ink-muted",
  danger: "bg-zoom-red text-white hover:bg-zoom-red-dark disabled:bg-zoom-red/40",
  ghost: "text-zoom-blue hover:bg-zoom-blue-light disabled:text-ink-muted",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-sm",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md"): string {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]}`;
}

export function Button({ variant = "primary", size = "md", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`${buttonClasses(variant, size)} ${className}`} {...props} />;
}
