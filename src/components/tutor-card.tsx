import Link from "next/link";
import type { Tutor } from "@/lib/types";
import {
  IconStar,
  IconShieldCheck,
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

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(55,48,40,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[#315F52]/30 hover:shadow-[0_8px_32px_rgba(55,48,40,0.05)]">
      <div>
        {/* Header: Identity + Rating */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              aria-hidden="true"
              className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#E4EEE9] text-base font-extrabold text-[#244A40] shadow-2xs"
            >
              {getInitials(tutor.name)}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#25231F] group-hover:text-[#315F52] transition-colors">
                  <Link href={`/tutors/${tutor.id}`}>{tutor.name}</Link>
                </h3>
                <span title="Verified Profile" className="text-[#315F52]">
                  <IconShieldCheck size={16} />
                </span>
              </div>
              <p className="text-xs font-semibold text-[#6F6A62]">{tutor.headline}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 rounded-full bg-[#FFF7ED] px-2.5 py-1 text-xs font-bold text-[#25231F] border border-[rgba(55,48,40,0.08)] shadow-2xs">
            <IconStar size={13} className="text-[#F1B777]" />
            <span>{tutor.rating.toFixed(1)}</span>
            <span className="text-[#9B958C] font-normal">({tutor.reviewCount})</span>
          </div>
        </div>

        {/* Subjects & Curriculum Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tutor.subjects.map((sub) => (
            <span
              key={sub}
              className="rounded-full bg-[#E4EEE9] px-2.5 py-0.5 text-xs font-semibold text-[#244A40]"
            >
              {sub}
            </span>
          ))}
          <span className="rounded-full bg-[#FFF7ED] px-2.5 py-0.5 text-xs font-medium text-[#6F6A62] border border-[rgba(55,48,40,0.08)]">
            {tutor.classes[0]} &ndash; {tutor.classes[tutor.classes.length - 1]}
          </span>
        </div>

        {/* Bio snippet */}
        <p className="mt-3.5 text-xs leading-relaxed text-[#6F6A62] line-clamp-2">
          {tutor.bio}
        </p>

        {/* Modes & Location */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {offersOnline && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E3EADD] px-2.5 py-0.5 font-bold text-[#2D4F42]">
              <IconVideo size={12} />
              <span>Online Demo Available</span>
            </span>
          )}
          {offersHome && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FBE2D8] px-2.5 py-0.5 font-bold text-[#BA5945]">
              <IconHomeTuition size={12} />
              <span>Home Tuition ({tutor.locality})</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer: Starting Fee & CTAs */}
      <div className="mt-6 border-t border-[rgba(55,48,40,0.08)] pt-4">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B958C]">
              Class Packages From
            </span>
            <div className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-[#25231F]">
              {formatCurrency(tutor.startingMonthlyFee)}
              <span className="text-xs font-medium text-[#6F6A62]"> / 8 classes</span>
            </div>
          </div>
          <span className="rounded-full bg-[#E3EADD] px-2 py-0.5 text-[10px] font-bold text-[#2D4F42]">
            Free 30m Trial
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/tutors/${tutor.id}`}
            className="btn btn-action btn-outline min-h-[42px] px-3 text-xs font-bold rounded-2xl justify-center"
          >
            <span>View Profile</span>
          </Link>

          <Link
            href={`/demo/book?tutor=${tutor.id}`}
            className="btn btn-action btn-primary min-h-[42px] px-3 text-xs font-bold rounded-2xl justify-center shadow-xs"
          >
            <span>Book Demo</span>
            <IconArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
