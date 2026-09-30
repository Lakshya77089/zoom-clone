import Link from "next/link";
import { ZoomLogo } from "@/components/ui/ZoomLogo";
import { ROUTES } from "@/constants";

export function MinimalHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b-[0.8px] border-line bg-white px-4 sm:px-6">
      <Link href={ROUTES.home} aria-label="Zoom Workplace home" className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zoom-blue">
        <ZoomLogo />
      </Link>
      <Link href={ROUTES.home} className="text-sm text-zoom-blue hover:underline">
        Back to home
      </Link>
    </header>
  );
}
