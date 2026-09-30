import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@/types";

interface ProfileCardProps {
  user: User | null;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const details = user
    ? [
        { label: "Display name", value: user.name },
        { label: "Email", value: user.email },
        { label: "Account type", value: "Basic" },
        { label: "User ID", value: String(user.id) },
      ]
    : [];

  return (
    <section id="profile" className="scroll-mt-20 rounded-2xl border border-line bg-white" aria-labelledby="profile-heading" data-testid="profile-section">
      <h2 id="profile-heading" className="border-b border-line px-5 py-3.5 text-[15px] font-semibold">
        Profile
      </h2>
      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start">
        {user ? (
          <Avatar name={user.name} color={user.avatar_color} size="lg" />
        ) : (
          <span className="block h-16 w-16 animate-pulse rounded-full bg-line" />
        )}
        <dl className="grid flex-1 grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          {user
            ? details.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-[13px] text-ink-muted">{label}</dt>
                  <dd className="mt-0.5 break-words font-medium">{value}</dd>
                </div>
              ))
            : [0, 1, 2, 3].map((index) => <div key={index} className="h-10 animate-pulse rounded-lg bg-canvas" />)}
        </dl>
      </div>
      <p className="border-t border-line px-5 py-3 text-[13px] text-ink-muted">
        This demo always signs you in as the default seeded user. Account editing is not available.
      </p>
    </section>
  );
}
