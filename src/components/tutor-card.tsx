import Link from "next/link";
import type { Tutor } from "@/lib/types";
import {
  IconStar,
  IconVideo,
  IconHomeTuition,
  IconArrowRight,
} from "./ui/icons";

interface TutorCardProps {
  tutor: Tutor;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TutorCard({ tutor }: TutorCardProps) {
  const offersOnline = tutor.modes.includes("online");
  const offersHome = tutor.modes.includes("home");
  const isDemo = tutor.isDemoProfile || !tutor.rating || tutor.reviewCount === 0;
  const startingPrice = tutor.startingPackagePrice || tutor.startingMonthlyFee || 3200;

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-[18px] border border-[var(--tc-border)] bg-[var(--tc-surface)] p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--tc-primary)]/40 hover:shadow-md">
      <div>
        {/* Header: Identity + Rating / Demo Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--tc-soft-primary)] text-base font-extrabold text-[var(--tc-primary)] shadow-xs"
            >
              {getInitials(tutor.name)}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[var(--tc-text-primary)] group-hover:text-[var(--tc-primary)] transition-colors">
                  <Link href={`/tutors/${tutor.id}`}>{tutor.name}</Link>
                </h3>
                
              </div>
              <p className="text-xs font-semibold text-[var(--tc-text-secondary)]">{tutor.headline}</p>
            </div>
          </div>

          {/* Rating or Sample Profile Badge */}
          {isDemo ? (
            <span className="rounded-full bg-[var(--tc-surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--tc-text-secondary)] border border-[var(--tc-border)]">
              Sample profile
            </span>
          ) : tutor.rating && tutor.reviewCount > 0 ? (
            <div className="flex items-center gap-1 rounded-full bg-[var(--tc-surface-muted)] px-2.5 py-1 text-xs font-bold text-[var(--tc-text-primary)] border border-[var(--tc-border)] shadow-2xs">
              <IconStar size={13} className="text-[var(--tc-warning)]" />
              <span>{tutor.rating?.toFixed(1)}</span>
              <span className="text-[var(--tc-text-secondary)] font-normal">({tutor.reviewCount})</span>
            </div>
          ) : null}
        </div>

        {/* Subjects & Curriculum Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tutor.subjects.map((sub) => (
            <span
              key={sub}
              className="rounded-full bg-[var(--tc-soft-primary)] border border-[var(--tc-primary)]/15 px-2.5 py-0.5 text-xs font-semibold text-[var(--tc-primary)]"
            >
              {sub}
            </span>
          ))}
          <span className="rounded-full bg-[var(--tc-surface-muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--tc-text-secondary)] border border-[var(--tc-border)]">
            {tutor.classes[0]} &ndash; {tutor.classes[tutor.classes.length - 1]}
          </span>
        </div>

        {/* Bio snippet */}
        <p className="mt-3.5 text-xs leading-relaxed text-[var(--tc-text-secondary)] line-clamp-2">
          {tutor.bio}
        </p>

        {/* Modes & Location */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {offersOnline && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-teal)]/10 border border-[var(--tc-teal)]/20 px-2.5 py-0.5 font-bold text-[var(--tc-teal)]">
              <IconVideo size={12} />
              <span>Online Demo Available</span>
            </span>
          )}
          {offersHome && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-2.5 py-0.5 font-bold text-[var(--tc-text-primary)]">
              <IconHomeTuition size={12} />
              <span>Home Tuition ({tutor.locality})</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer: Starting Fee & CTAs */}
      <div className="mt-6 border-t border-[var(--tc-border)] pt-4">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--tc-text-secondary)]">
              Class Packages From
            </span>
            <div className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-[var(--tc-text-primary)]">
              {formatCurrency(startingPrice)}
              <span className="text-xs font-medium text-[var(--tc-text-secondary)]"> / 8 classes</span>
            </div>
          </div>
          <span className="rounded-full bg-[var(--tc-teal)]/10 border border-[var(--tc-teal)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--tc-teal)]">
            Free 30-Min Demo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/tutors/${tutor.id}`}
            className="btn btn-action btn-outline min-h-[40px] px-3 text-xs font-bold rounded-xl justify-center"
          >
            <span>View Profile</span>
          </Link>

          <Link
            href={`/demo/book?tutor=${tutor.id}`}
            className="btn btn-action btn-primary min-h-[40px] px-3 text-xs font-bold rounded-xl justify-center shadow-xs"
          >
            <span>Book Demo</span>
            <IconArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
