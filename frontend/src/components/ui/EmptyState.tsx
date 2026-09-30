import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  testId?: string;
}

export function EmptyState({ icon: Icon, title, description, action, testId }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center" data-testid={testId}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zoom-blue-light text-zoom-blue">
        <Icon size={26} strokeWidth={1.75} />
      </span>
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-xs text-[13px] text-ink-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
