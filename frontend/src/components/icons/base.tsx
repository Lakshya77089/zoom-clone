import type { CSSProperties, ReactNode } from "react";

export interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export type IconComponent = (props: IconProps) => ReactNode;

interface SvgProps extends IconProps {
  children: ReactNode;
  viewBox?: string;
}

export const ZOOM_STROKE = 1.2;

export function Svg({
  size = 16,
  className,
  strokeWidth = ZOOM_STROKE,
  style,
  children,
  viewBox = "0 0 16 16",
  "aria-label": label,
}: SvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
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

export function icon(render: (props: IconProps) => ReactNode, displayName: string, defaultStrokeWidth = ZOOM_STROKE): IconComponent {
  const Component = (props: IconProps) => (
    <Svg strokeWidth={defaultStrokeWidth} {...props}>
      {render(props)}
    </Svg>
  );
  Component.displayName = displayName;
  return Component;
}
