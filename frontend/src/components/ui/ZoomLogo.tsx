interface ZoomLogoProps {
  className?: string;
}

export function ZoomLogo({ className = "" }: ZoomLogoProps) {
  return (
    <span className={`select-none text-[26px] font-bold leading-none tracking-[-0.04em] text-zoom-blue ${className}`}>zoom</span>
  );
}
