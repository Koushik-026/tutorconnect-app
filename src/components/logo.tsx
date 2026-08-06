import Link from "next/link";

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export function Logo({
  compact = false,
  className = "",
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="TutorConnect home"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 shadow-md shadow-blue-500/20">
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="h-6 w-6 text-white"
          fill="none"
        >
          <path
            d="M5 11.5 16 6l11 5.5L16 17 5 11.5Z"
            fill="currentColor"
          />

          <path
            d="M9 15.5V21c0 2.4 3.1 4.5 7 4.5s7-2.1 7-4.5v-5.5L16 19l-7-3.5Z"
            fill="currentColor"
            opacity="0.85"
          />

          <path
            d="M27 12v7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <circle
            cx="27"
            cy="21"
            r="1.5"
            fill="currentColor"
          />
        </svg>
      </span>

      {!compact && (
        <span className="font-[var(--font-manrope)] text-xl font-extrabold tracking-tight text-slate-900">
          Tutor
          <span className="text-blue-600">Connect</span>
        </span>
      )}
    </Link>
  );
}