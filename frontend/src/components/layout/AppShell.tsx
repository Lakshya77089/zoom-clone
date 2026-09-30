import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileTabBar, Sidebar } from "@/components/layout/Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <AppHeader />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
