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
  IconCalendar,
  IconClock,
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
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-24 lg:pb-16">
        {/* Breadcrumb / Back Link */}
        <div className="border-b border-slate-200/80 bg-white py-3.5">
          <div className="container-shell">
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
            >
              <IconArrowLeft size={14} />
              <span>Back to all tutors</span>
            </Link>
          </div>
        </div>

        {/* Profile Content Container */}
        <div className="container-shell py-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Main Content (8 cols) */}
            <div className="space-y-8 lg:col-span-8">
              {/* Tutor Hero Card */}
              <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4 sm:gap-5">
                    {tutor.profileImage ? (
                      <div
                        role="img"
                        aria-label={`${tutor.name} photo`}
                        className="h-20 w-20 shrink-0 rounded-2xl border border-slate-100 bg-cover bg-center shadow-xs sm:h-24 sm:w-24"
                        style={{ backgroundImage: `url('${tutor.profileImage}')` }}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-2xl font-extrabold text-white shadow-xs sm:h-24 sm:w-24"
                      >
                        {getInitials(tutor.name)}
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950 sm:text-3xl">
                          {tutor.name}
                        </h1>
                        {tutor.verification.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/70">
                            <IconShieldCheck size={14} />
                            Verified Educator
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-600 sm:text-base">
                        {tutor.headline}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70">
                          <IconStar size={14} className="text-amber-500" />
                          <span>{tutor.rating.toFixed(1)}</span>
                          <span className="text-amber-600/70">({tutor.reviewCount} reviews)</span>
                        </div>
                        <span className="text-slate-500 font-medium">
                          {tutor.experienceYears} Years Teaching Experience
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges for Modes & Location */}
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
                  {offersOnline && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      <IconVideo size={14} />
                      Online Tuition Available
                    </span>
                  )}
                  {offersHome && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
                      <IconHomeTuition size={14} />
                      Home Tuition (Within {tutor.travelRadiusKm} km)
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 ml-1">
                    <IconMapPin size={13} />
                    {tutor.locality}, {tutor.city}
                  </span>
                </div>
              </div>

              {/* About & Teaching Approach */}
              <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs sm:p-8">
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900">
                  About the Educator
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {tutor.bio}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Curriculum Covered
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {tutor.boards.join(", ")} &bull; {tutor.classes.join(", ")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Teaching Languages
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {tutor.languages.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Credentials */}
              <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs sm:p-8">
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900">
                  Verified Trust &amp; Safety
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  All TutorConnect educators undergo identity and credential screening.
                </p>

                <div className="mt-5 space-y-3">
                  {tutor.verification.map((v) => (
                    <div key={v} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                        <IconCheck size={12} />
                      </span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Availability Schedule */}
              <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs sm:p-8">
                <div className="flex items-center gap-2">
                  <IconCalendar size={18} className="text-blue-600" />
                  <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900">
                    Weekly Availability Slots
                  </h2>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Select your preferred time during demo booking or package confirmation.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {tutor.availableDays.map((day) => (
                    <div
                      key={day}
                      className="rounded-xl border border-slate-100 bg-[#f8fafc] p-3.5"
                    >
                      <span className="text-xs font-bold text-slate-900">{day}</span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tutor.availableTimes.map((time) => (
                          <span
                            key={time}
                            className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                          >
                            <IconClock size={11} className="text-slate-400" />
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tuition Packages Overview */}
              <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs sm:p-8">
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900">
                  Class Packages
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Simple, non-recurring class packages. You only pay after your free demo.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {tuitionPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-xl border border-slate-200 p-4 bg-[#fbfbfc] hover:border-blue-300 transition"
                    >
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        {pkg.numberOfClasses} Classes
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-slate-900">{pkg.title}</h3>
                      <div className="mt-2 font-[family-name:var(--font-manrope)] text-lg font-extrabold text-slate-900">
                        {formatCurrency(pkg.price)}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">{pkg.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Desktop Sticky Booking Sidebar (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <div className="rounded-xl bg-blue-50/70 p-3.5 border border-blue-100/70">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    Step 1: Free Evaluation
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-slate-900">
                      Free Online Demo
                    </span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-xs">
                      100% Free
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600">
                    30-minute interactive live class with {tutor.name}. Zero payment required.
                  </p>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>Evaluate tutor chemistry &amp; teaching pace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>Discuss student syllabus &amp; exam goals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-emerald-600 shrink-0" />
                    <span>No credit card needed &bull; Instant confirmation</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <Link
                    href={`/demo/book?tutor=${tutor.id}`}
                    className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold shadow-sm"
                  >
                    <span>Book Free Demo Now</span>
                    <IconArrowRight size={16} />
                  </Link>
                  <p className="mt-2.5 text-center text-[11px] text-slate-400">
                    Takes less than 1 minute to schedule
                  </p>
                </div>

                <div className="mt-5 rounded-xl border border-slate-100 bg-[#f8fafc] p-3.5 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Class Package Tuition:</span>
                  <div className="mt-1 font-bold text-slate-900 text-sm">
                    Class Packages from {formatCurrency(tutor.startingMonthlyFee)} (8 classes)
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Select an 8, 12, or 15-class package after your demo if satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Bottom Booking Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md lg:hidden">
          <div className="container-shell flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Free Evaluation
              </span>
              <div className="font-[family-name:var(--font-manrope)] text-sm font-extrabold text-slate-900">
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
