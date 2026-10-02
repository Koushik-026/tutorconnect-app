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
    <article className="group relative flex h-full flex-col justify-between rounded-3xl border border-[rgba(54,48,60,0.10)] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-1 hover:border-[#7257A5]/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
      <div>
        {/* Header: Identity + Rating */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              aria-hidden="true"
              className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#EEE7FF] text-base font-extrabold text-[#594282] shadow-2xs"
            >
              {getInitials(tutor.name)}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#20221F] group-hover:text-[#7257A5] transition-colors">
                  <Link href={`/tutors/${tutor.id}`}>{tutor.name}</Link>
                </h3>
                <span title="Verified Profile" className="text-[#5D806F]">
                  <IconShieldCheck size={16} />
                </span>
              </div>
              <p className="text-xs font-semibold text-[#6D706A]">{tutor.headline}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 rounded-full bg-[#FFFDF9] px-2.5 py-1 text-xs font-bold text-[#20221F] border border-[rgba(54,48,60,0.08)] shadow-2xs">
            <IconStar size={13} className="text-[#D4A328]" />
            <span>{tutor.rating.toFixed(1)}</span>
            <span className="text-[#969991] font-normal">({tutor.reviewCount})</span>
          </div>
        </div>

        {/* Subjects & Curriculum Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tutor.subjects.map((sub) => (
            <span
              key={sub}
              className="rounded-full bg-[#EEE7FF]/60 px-2.5 py-0.5 text-xs font-semibold text-[#594282]"
            >
              {sub}
            </span>
          ))}
          <span className="rounded-full bg-[#F4F2EC] px-2.5 py-0.5 text-xs font-medium text-[#6D706A]">
            {tutor.classes[0]} &ndash; {tutor.classes[tutor.classes.length - 1]}
          </span>
        </div>

        {/* Bio snippet */}
        <p className="mt-3.5 text-xs leading-relaxed text-[#6D706A] line-clamp-2">
          {tutor.bio}
        </p>

        {/* Modes & Location */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {offersOnline && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F0EA] px-2.5 py-0.5 font-bold text-[#3D5A4D]">
              <IconVideo size={12} />
              <span>Online Demo Available</span>
            </span>
          )}
          {offersHome && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FCE7DE] px-2.5 py-0.5 font-bold text-[#A85834]">
              <IconHomeTuition size={12} />
              <span>Home Tuition ({tutor.locality})</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer: Starting Fee & CTAs */}
      <div className="mt-6 border-t border-[rgba(54,48,60,0.08)] pt-4">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#969991]">
              Class Packages From
            </span>
            <div className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-[#20221F]">
              {formatCurrency(tutor.startingMonthlyFee)}
              <span className="text-xs font-medium text-[#6D706A]"> / 8 classes</span>
            </div>
          </div>
          <span className="rounded-full bg-[#E5F0EA] px-2 py-0.5 text-[10px] font-bold text-[#3D5A4D]">
            Free 30m Trial
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/tutors/${tutor.id}`}
            className="btn btn-outline min-h-[40px] px-3 text-xs font-bold rounded-full justify-center"
          >
            <span>View Profile</span>
          </Link>

          <Link
            href={`/demo/book?tutor=${tutor.id}`}
            className="btn btn-primary min-h-[40px] px-3 text-xs font-bold rounded-full justify-center shadow-xs"
          >
            <span>Book Demo</span>
            <IconArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
