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
    <div className="flex flex-col items-center px-4 pb-6 pt-4 text-center" data-testid={testId}>
      <Icon size={88} strokeWidth={0.9} className="text-[#a9a8d8]" aria-hidden />
      <p className="mt-4 text-sm leading-5 text-ink-soft">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs leading-4 text-ink-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
