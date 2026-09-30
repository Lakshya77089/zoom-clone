interface ZoomLogoProps {
  className?: string;
}

export function ZoomLogo({ className = "" }: ZoomLogoProps) {
  return (
    <span className={`select-none text-[29px] font-extrabold leading-5 tracking-[0.06em] text-zoom-blue ${className}`}>zoom</span>
  );
}
