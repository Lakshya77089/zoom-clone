import { SpinnerIcon } from "@/components/icons";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className = "" }: SpinnerProps) {
  return <SpinnerIcon size={size} strokeWidth={1.6} className={`animate-spin ${className}`} />;
}
