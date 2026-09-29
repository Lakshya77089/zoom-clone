interface ZoomLogoProps {
  className?: string;
}

export function ZoomLogo({ className = "" }: ZoomLogoProps) {
  return (
    <span className={`select-none text-2xl font-black tracking-tight text-zoom-blue ${className}`}>
      zoom
    </span>
  );
}
