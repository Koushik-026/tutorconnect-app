import Link from "next/link";
import type { Tutor } from "@/lib/types";
import {
  IconStar,
  IconShieldCheck,
  IconMapPin,
  IconVideo,
  IconHomeTuition,
  IconArrowRight,
} from "./ui/icons";
import { Badge } from "./ui/badge";

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
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/85 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 sm:p-6">
      <div>
        {/* Top Header: Identity + Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {tutor.profileImage ? (
              <div
                role="img"
                aria-label={`${tutor.name} photo`}
                className="h-14 w-14 shrink-0 rounded-2xl border border-slate-100 bg-cover bg-center shadow-xs"
                style={{ backgroundImage: `url('${tutor.profileImage}')` }}
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-teal-500 text-base font-extrabold text-white shadow-xs"
              >
                {getInitials(tutor.name)}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {tutor.name}
                </h3>
                {tutor.verification.length > 0 && (
                  <span title="Verified Tutor" className="text-emerald-600 shrink-0">
                    <IconShieldCheck size={16} />
                  </span>
                )}
              </div>
              <p className="truncate text-xs font-semibold text-slate-500">
                {tutor.headline}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 border border-amber-200/60">
            <IconStar size={13} className="text-amber-500" />
            <span>{tutor.rating.toFixed(1)}</span>
            <span className="text-amber-600/70 text-[10px]">({tutor.reviewCount})</span>
          </div>
        </div>

        {/* Subjects & Curriculum */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tutor.subjects.map((subject) => (
            <Badge key={subject} variant="primary" size="sm">
              {subject}
            </Badge>
          ))}
          <Badge variant="neutral" size="sm">
            {tutor.experienceYears}y exp
          </Badge>
        </div>

        {/* Target Classes & Boards */}
        <p className="mt-3 text-xs font-medium text-slate-500">
          {tutor.classes.slice(0, 3).join(", ")}
          {tutor.classes.length > 3 ? ` + ${tutor.classes.length - 3} more` : ""} &bull;{" "}
          {tutor.boards.join(", ")}
        </p>

        {/* Modes & Location */}
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            {offersOnline && (
              <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                <IconVideo size={13} />
                Online
              </span>
            )}
            {offersHome && (
              <span className="inline-flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                <IconHomeTuition size={13} />
                Home ({tutor.travelRadiusKm} km)
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-slate-400 text-[11px] truncate">
            <IconMapPin size={12} className="shrink-0" />
            {tutor.locality}, {tutor.city}
          </p>
        </div>
      </div>

      {/* Footer: Price + CTAs */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Class Packages from
            </span>
            <div className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-slate-900">
              {formatCurrency(tutor.startingMonthlyFee)}
              <span className="text-xs font-normal text-slate-500"> (8 classes)</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Free Demo Included
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/tutors/${tutor.id}`}
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            View Profile
          </Link>
          <Link
            href={`/demo/book?tutor=${tutor.id}`}
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-blue-600 px-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors gap-1"
          >
            Book Demo
            <IconArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}