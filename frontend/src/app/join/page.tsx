import { Suspense } from "react";
import { JoinByIdView } from "@/components/join/JoinByIdView";
import { MinimalHeader } from "@/components/layout/MinimalHeader";

export default function JoinPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <MinimalHeader />
      <Suspense>
        <JoinByIdView />
      </Suspense>
    </div>
  );
}
