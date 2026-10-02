import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { tutors, tuitionPackages } from "@/lib/data";
import {
  IconStar,
  IconShieldCheck,
  IconMapPin,
  IconVideo,
  IconHomeTuition,
  IconArrowRight,
  IconCheck,
  IconArrowLeft,
} from "@/components/ui/icons";

interface TutorProfilePageProps {
  params: Promise<{ id: string }>;
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

export default async function TutorProfilePage({
  params,
}: TutorProfilePageProps) {
  const { id } = await params;
  const tutor = tutors.find((t) => t.id === id);

  if (!tutor) {
    notFound();
  }

  const offersOnline = tutor.modes.includes("online");
  const offersHome = tutor.modes.includes("home");

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE]">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-24 lg:pb-16">
        {/* Breadcrumb / Back Link */}
        <div className="border-b border-[#E4DED4] bg-[#FFFEFB] py-3.5">
          <div className="container-shell flex items-center justify-between">
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#676B64] hover:text-[#232520] transition-colors"
            >
              <IconArrowLeft size={14} />
              <span>Back to all tutors</span>
            </Link>

            <span className="text-xs font-semibold text-[#989C94]">
              Educator Dossier &bull; {tutor.name}
            </span>
          </div>
        </div>

        <div className="container-shell mt-8">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Full Editorial Dossier */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Header Card: Identity & Primary Attributes */}
              <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                  <div className="flex items-start gap-4 sm:gap-5">
                    {tutor.profileImage ? (
                      <div
                        role="img"
                        aria-label={`${tutor.name} profile`}
                        className="h-20 w-20 shrink-0 rounded-2xl border border-[#E4DED4] bg-cover bg-center shadow-xs"
                        style={{ backgroundImage: `url('${tutor.profileImage}')` }}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#66518A] via-[#554173] to-[#4F7867] text-2xl font-extrabold text-white shadow-xs"
                      >
                        {getInitials(tutor.name)}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520] sm:text-3xl">
                          {tutor.name}
                        </h1>
                        <span title="Verified Profile" className="text-[#2E7D5B]">
                          <IconShieldCheck size={20} />
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-[#66518A]">
                        {tutor.headline}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#676B64]">
                        <span className="flex items-center gap-1">
                          <IconMapPin size={13} className="text-[#989C94]" />
                          <span>{tutor.locality}, {tutor.city}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="font-bold text-[#232520]">{tutor.experienceYears}y teaching</span>
                        <span>&bull;</span>
                        <span>{tutor.languages.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t border-[#ECE6DC] pt-3 sm:border-0 sm:pt-0">
                    <div className="flex items-center gap-1.5 rounded-xl bg-[#FDF4E5] px-3 py-1.5 text-sm font-extrabold text-[#965C12] border border-[#C27A1B]/30">
                      <IconStar size={16} className="text-[#C27A1B]" />
                      <span>{tutor.rating.toFixed(1)}</span>
                      <span className="text-[#965C12]/70 text-xs">({tutor.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Badges for Modes & Location */}
                <div className="mt-6 flex flex-wrap items-center gap-2 pt-5 border-t border-[#ECE6DC]">
                  {offersOnline && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFEAF8] px-3 py-1 text-xs font-bold text-[#4E3C70] border border-[#66518A]/20">
                      <IconVideo size={14} />
                      <span>Online Tuition Available</span>
                    </span>
                  )}
                  {offersHome && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F0EA] px-3 py-1 text-xs font-bold text-[#3E6153] border border-[#4F7867]/20">
                      <IconHomeTuition size={14} />
                      <span>Home Tuition (Within {tutor.travelRadiusKm} km)</span>
                    </span>
                  )}
                  {tutor.verification.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1 rounded-full bg-[#ECE6DC] px-2.5 py-1 text-xs font-bold text-[#4D504A]"
                    >
                      <IconCheck size={12} className="text-[#2E7D5B]" />
                      <span>{v}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Teaching Methodology & Bio */}
              <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 sm:p-8 shadow-xs">
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520]">
                  Teaching Approach &amp; Bio
                </h2>
                <div className="mt-3.5 space-y-3 text-sm leading-relaxed text-[#676B64]">
                  <p>{tutor.bio}</p>
                  <p>
                    Classes are structured around active questioning, direct handwritten practice, and concept mastery rather than mechanical rote drills. Parents receive regular updates on student confidence and syllabus pacing.
                  </p>
                </div>
              </div>

              {/* 3. Subjects, Classes & Curriculums */}
              <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 sm:p-8 shadow-xs">
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520] mb-4">
                  Curriculum &amp; Subjects Taught
                </h2>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#989C94] block mb-2">
                      Subjects
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((s) => (
                        <span
                          key={s}
                          className="rounded-xl bg-[#F4F0FB] px-3 py-1.5 text-xs font-bold text-[#554477] border border-[#B7A5DE]/30"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#989C94] block mb-2">
                      Eligible Classes
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tutor.classes.map((c) => (
                        <span
                          key={c}
                          className="rounded-xl bg-[#ECE6DC] px-3 py-1.5 text-xs font-bold text-[#4D504A]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#989C94] block mb-2">
                      Curriculum Frameworks
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tutor.boards.map((b) => (
                        <span
                          key={b}
                          className="rounded-xl bg-[#E6F0EA] px-3 py-1.5 text-xs font-bold text-[#3E6153] border border-[#4F7867]/20"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Class Packages Overview */}
              <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520]">
                    Class Packages
                  </h2>
                  <span className="rounded-full bg-[#EFEAF8] px-2.5 py-0.5 text-xs font-bold text-[#4E3C70]">
                    45 Days Validity
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#676B64]">
                  Simple, non-recurring class packages. You only pay after your free demo.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {tuitionPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-2xl border border-[#E4DED4] bg-[#F7F4EE] p-4.5 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs font-extrabold text-[#66518A]">
                          {pkg.title}
                        </span>
                        <div className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520]">
                          {formatCurrency(pkg.price)}
                        </div>
                        <div className="text-xs text-[#676B64] font-semibold mt-0.5">
                          {pkg.numberOfClasses} classes &bull; 60m each
                        </div>
                        <p className="mt-2 text-[11px] text-[#676B64] leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E4DED4] text-[11px] font-bold text-[#2E7D5B]">
                        Valid 45 days
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking Widget (Desktop) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3E6153] bg-[#E6F0EA] px-3 py-1.5 rounded-xl border border-[#4F7867]/20">
                  <IconVideo size={14} />
                  <span>Free Online Demo</span>
                </div>

                <div className="mt-4">
                  <h3 className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-[#232520]">
                    Evaluate 1-on-1 with {tutor.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#676B64] leading-relaxed">
                    Test concept explanation and teaching chemistry in a 30-minute free online session before selecting a routine.
                  </p>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-[#232520]">
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#2E7D5B]" />
                    <span>Duration: Exactly 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#2E7D5B]" />
                    <span>Format: Interactive digital classroom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#2E7D5B]" />
                    <span>Cost: ₹0 (No credit card required)</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/demo/book?tutor=${tutor.id}`}
                    className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold shadow-sm gap-2"
                  >
                    <span>Book Free Demo Now</span>
                    <IconArrowRight size={16} />
                  </Link>
                  <p className="mt-2.5 text-center text-[11px] text-[#989C94]">
                    Takes less than 1 minute to schedule
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-[#E4DED4] bg-[#F7F4EE] p-3.5 text-xs text-[#676B64]">
                  <span className="font-bold text-[#232520]">Class Package Tuition:</span>
                  <div className="mt-1 font-bold text-[#232520] text-sm">
                    Class Packages from {formatCurrency(tutor.startingMonthlyFee)} (8 classes)
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#676B64]">
                    Select an 8, 12, or 15-class package after your demo if satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Bottom Booking Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4DED4] bg-[#FFFEFB]/95 px-4 py-3 shadow-lg backdrop-blur-md lg:hidden">
          <div className="container-shell flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#989C94]">
                Free Evaluation
              </span>
              <div className="font-[family-name:var(--font-manrope)] text-sm font-extrabold text-[#232520]">
                30-min Online Demo
              </div>
            </div>
            <Link
              href={`/demo/book?tutor=${tutor.id}`}
              className="btn btn-primary min-h-[46px] px-5 text-sm font-bold shrink-0 shadow-sm"
            >
              <span>Book Demo</span>
              <IconArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
