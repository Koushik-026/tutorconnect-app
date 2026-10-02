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
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#66518A]/40 hover:shadow-md hover:shadow-[#66518A]/5 sm:p-6">
      <div>
        {/* Top Header: Identity + Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {tutor.profileImage ? (
              <div
                role="img"
                aria-label={`${tutor.name} photo`}
                className="h-14 w-14 shrink-0 rounded-2xl border border-[#E4DED4] bg-cover bg-center shadow-xs"
                style={{ backgroundImage: `url('${tutor.profileImage}')` }}
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#66518A] via-[#554173] to-[#4F7867] text-base font-extrabold text-white shadow-xs"
              >
                {getInitials(tutor.name)}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520] group-hover:text-[#66518A] transition-colors">
                  {tutor.name}
                </h3>
                {tutor.verification.length > 0 && (
                  <span title="Verified Tutor Profile" className="text-[#2E7D5B] shrink-0">
                    <IconShieldCheck size={16} />
                  </span>
                )}
              </div>
              <p className="truncate text-xs font-semibold text-[#676B64]">
                {tutor.headline}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-[#FDF4E5] px-2 py-1 text-xs font-extrabold text-[#965C12] border border-[#C27A1B]/30">
            <IconStar size={13} className="text-[#C27A1B]" />
            <span>{tutor.rating.toFixed(1)}</span>
            <span className="text-[#965C12]/70 text-[10px]">({tutor.reviewCount})</span>
          </div>
        </div>

        {/* Bio Excerpt */}
        <p className="mt-3.5 line-clamp-2 text-xs leading-relaxed text-[#676B64]">
          {tutor.bio}
        </p>

        {/* Subjects & Board Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tutor.subjects.slice(0, 3).map((subject) => (
            <span
              key={subject}
              className="rounded-md bg-[#F4F0FB] px-2 py-0.5 text-[11px] font-bold text-[#554477] border border-[#B7A5DE]/25"
            >
              {subject}
            </span>
          ))}

          {tutor.boards.slice(0, 2).map((board) => (
            <span
              key={board}
              className="rounded-md bg-[#ECE6DC] px-2 py-0.5 text-[11px] font-bold text-[#4D504A]"
            >
              {board}
            </span>
          ))}
        </div>

        {/* Modes & Location */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {offersOnline && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EFEAF8] px-2.5 py-0.5 font-bold text-[#4E3C70] border border-[#66518A]/20">
              <IconVideo size={13} />
              <span>Online</span>
            </span>
          )}

          {offersHome && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F0EA] px-2.5 py-0.5 font-bold text-[#3E6153] border border-[#4F7867]/20">
              <IconHomeTuition size={13} />
              <span>Home ({tutor.travelRadiusKm} km)</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#989C94]">
            <IconMapPin size={12} />
            <span className="truncate">{tutor.locality}</span>
          </span>
        </div>
      </div>

      {/* Footer: Price + CTAs */}
      <div className="mt-5 border-t border-[#ECE6DC] pt-4">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#989C94]">
              Class Packages from
            </span>
            <div className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-[#232520]">
              {formatCurrency(tutor.startingMonthlyFee)}
              <span className="text-xs font-normal text-[#676B64]"> (8 classes)</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#2E7D5B] bg-[#E9F5EF] px-2 py-0.5 rounded-full border border-[#2E7D5B]/20">
            Free Demo Included
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/tutors/${tutor.id}`}
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3 text-xs font-bold text-[#232520] hover:bg-[#EFEAF8] hover:text-[#66518A] hover:border-[#66518A]/40 transition-colors"
          >
            View Profile
          </Link>

          <Link
            href={`/demo/book?tutor=${tutor.id}`}
            className="btn btn-primary min-h-[42px] px-3 text-xs font-bold shadow-xs gap-1"
          >
            <span>Book Demo</span>
            <IconArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
