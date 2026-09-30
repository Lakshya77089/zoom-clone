import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MeetingsView } from "@/components/meetings/MeetingsView";

export default function MeetingsPage() {
  return (
    <AppShell>
      <Suspense>
        <MeetingsView />
      </Suspense>
    </AppShell>
  );
}
