import { useId, type CSSProperties, type ReactNode } from "react";

export interface IconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export type IconComponent = (props: IconProps) => ReactNode;

interface SvgProps extends IconProps {
  viewBox: string;
  ratio?: number;
  children: ReactNode;
}

export function Svg({ size = 16, ratio = 1, viewBox, className, style, children, "aria-label": label }: SvgProps) {
  return (
    <svg
      width={Math.round(size * ratio * 100) / 100}
      height={size}
      viewBox={viewBox}
      fill="none"
      className={className}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function useIconId() {
  return `zi${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}
