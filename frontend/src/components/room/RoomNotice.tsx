import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { ROUTES } from "@/constants";

interface RoomNoticeProps {
  title: string;
  message?: string;
}

export function RoomNotice({ title, message }: RoomNoticeProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-room px-6 text-center text-white">
      <h1 className="text-xl font-semibold sm:text-2xl" data-testid="room-notice">
        {title}
      </h1>
      {message && <p className="mt-2 max-w-md text-sm text-white/70">{message}</p>}
      <Link href={ROUTES.home} className={`mt-8 ${buttonClasses()}`} data-testid="return-home">
        Return to home
      </Link>
    </div>
  );
}
