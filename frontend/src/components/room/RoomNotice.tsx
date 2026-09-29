import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

interface RoomNoticeProps {
  title: string;
  message?: string;
}

export function RoomNotice({ title, message }: RoomNoticeProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-room px-6 text-center text-white">
      <h1 className="text-xl font-bold sm:text-2xl" data-testid="room-notice">
        {title}
      </h1>
      {message && <p className="mt-2 max-w-md text-sm text-white/70">{message}</p>}
      <Link href="/" className={`mt-8 ${buttonClasses()}`}>
        Return to home
      </Link>
    </div>
  );
}
