import { AppShell } from "@/components/layout/AppShell";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="h-full sm:px-6 sm:pb-6 sm:pt-[52px]">
        <SettingsPanel />
      </div>
    </AppShell>
  );
}
