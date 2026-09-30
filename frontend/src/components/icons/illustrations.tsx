import type { ReactNode } from "react";

interface IllustrationProps {
  size?: number;
  className?: string;
}

export type IllustrationComponent = (props: IllustrationProps) => ReactNode;

export function UmbrellaIllustration({ size = 90, className }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none" className={className} aria-hidden focusable="false">
      <ellipse cx="44" cy="78" rx="40" ry="9" fill="#eef0fd" />
      <path d="M8 26 50 8l38 30C72 29 42 22 8 26Z" fill="#d9dbf8" />
      <path d="M50 8 88 38C78 32 66 28 54 26Z" fill="#e7e8fc" />
      <path d="M8 26c34-4 64 3 80 12-18-6-48-11-80-12Z" fill="#9fa3e3" />
      <path d="M49 27 38 86" stroke="#b3b6ee" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m40 60 42 2-7 8-43-2Z" fill="#dcdef9" />
      <path d="m48 60.4 6 .3-6.8 8-6-.3Zm12 .6 6 .3-6.8 8-6-.3Z" fill="#a4a8e6" />
    </svg>
  );
}

export function ClockIllustration({ size = 90, className }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none" className={className} aria-hidden focusable="false">
      <ellipse cx="45" cy="80" rx="36" ry="8" fill="#eef0fd" />
      <circle cx="45" cy="40" r="30" fill="#dfe1fb" />
      <circle cx="45" cy="40" r="23" fill="#fff" />
      <path d="M45 24v16l11 7" stroke="#a9ade9" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="45" cy="40" r="3" fill="#a9ade9" />
    </svg>
  );
}
