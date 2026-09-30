import { ZoomWordmark } from "@/components/icons";

interface ZoomLogoProps {
  className?: string;
}

export function ZoomLogo({ className = "" }: ZoomLogoProps) {
  return <ZoomWordmark size={20} className={`shrink-0 select-none ${className}`} aria-label="Zoom" />;
}
