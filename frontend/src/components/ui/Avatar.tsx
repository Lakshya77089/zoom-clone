import { initials } from "@/lib/format";

type Size = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name: string;
  color?: string;
  size?: Size;
  square?: boolean;
}

const sizes: Record<Size, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

const palette = ["#0B5CFF", "#E8710A", "#188038", "#A142F4", "#D93025", "#12A4AF", "#C5221F"];

function colorFor(name: string): string {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

export function Avatar({ name, color, size = "md", square = false }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 select-none items-center justify-center font-semibold text-white ${square ? "rounded-lg" : "rounded-full"} ${sizes[size]}`}
      style={{ backgroundColor: color ?? colorFor(name) }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
