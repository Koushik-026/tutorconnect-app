import Link from "next/link";

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export function Logo({ compact = false, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="TutorConnect Home"
      className={`inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
    >
      <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--tc-primary)] to-[var(--tc-teal)] shadow-sm shadow-[var(--tc-primary)]/25">
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-4.5 w-4.5 text-white" fill="none">
          <path d="M5 11.5 16 6l11 5.5L16 17 5 11.5Z" fill="currentColor" />
          <path d="M9 15.5V21c0 2.4 3.1 4.5 7 4.5s7-2.1 7-4.5v-5.5L16 19l-7-3.5Z" fill="currentColor" opacity="0.88" />
          <path d="M27 12v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="27" cy="21" r="1.5" fill="currentColor" />
        </svg>
      </span>
      {!compact && (
        <span className="font-[family-name:var(--font-manrope)] text-[1.18rem] font-extrabold tracking-tight text-[var(--tc-text-primary)]">
          Tutor<span className="text-[var(--tc-primary)]">Connect</span>
        </span>
      )}
    </Link>
  );
}
