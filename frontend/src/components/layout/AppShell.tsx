import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="mb-1.5 mr-1.5 mt-1 min-w-0 flex-1 overflow-y-auto rounded-xl bg-white">{children}</main>
      </div>
    </div>
  );
}
