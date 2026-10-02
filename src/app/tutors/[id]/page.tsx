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
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-24 lg:pb-20">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-[rgba(55,48,40,0.08)] bg-white py-3.5">
          <div className="container-shell flex items-center justify-between">
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition-colors"
            >
              <IconArrowLeft size={14} />
              <span>Back to all tutors</span>
            </Link>

            <span className="text-xs font-semibold text-[#9B958C]">
              Educator Profile &bull; {tutor.name}
            </span>
          </div>
        </div>

        <div className="container-shell mt-8 md:mt-12">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Left Column: Wide Editorial Dossier */}
            <div className="lg:col-span-8 space-y-10">
              {/* Identity Header */}
              <div className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div
                      aria-hidden="true"
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#E4EEE9] text-2xl font-extrabold text-[#244A40] shadow-2xs"
                    >
                      {getInitials(tutor.name)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                          {tutor.name}
                        </h1>
                        <span title="Verified Profile" className="text-[#315F52]">
                          <IconShieldCheck size={20} />
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-[#315F52]">
                        {tutor.headline}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[#6F6A62]">
                        <span className="flex items-center gap-1">
                          <IconMapPin size={13} className="text-[#9B958C]" />
                          <span>{tutor.locality}, {tutor.city}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="font-bold text-[#25231F]">{tutor.experienceYears}y teaching</span>
                        <span>&bull;</span>
                        <span>Languages: {tutor.languages.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Box */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 rounded-2xl bg-[#FFFBF5] border border-[rgba(55,48,40,0.08)] px-4 py-2.5 self-start">
                    <div className="flex items-center gap-1 text-sm font-extrabold text-[#25231F]">
                      <IconStar size={15} className="text-[#F1B777]" />
                      <span>{tutor.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-[#6F6A62]">{tutor.reviewCount} verified reviews</span>
                  </div>
                </div>

                {/* Modes availability banner */}
                <div className="mt-6 flex flex-wrap gap-2.5 border-t border-[rgba(55,48,40,0.08)] pt-5 text-xs">
                  {offersOnline && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EADD] px-3.5 py-1 font-bold text-[#244A40]">
                      <IconVideo size={13} />
                      <span>Online Tuition (30-min Free Demo Available)</span>
                    </span>
                  )}
                  {offersHome && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBE2D8] px-3.5 py-1 font-bold text-[#BA5945]">
                      <IconHomeTuition size={13} />
                      <span>Eligible Home Tuition ({tutor.locality} Radius)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Editorial Section: About & Teaching Approach */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#25231F]">
                    About the Educator
                  </h2>
                  <p className="mt-3 text-sm text-[#6F6A62] leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>

                <div className="border-t border-[rgba(55,48,40,0.08)] pt-6">
                  <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#25231F]">
                    Teaching Approach
                  </h3>
                  <p className="mt-2 text-sm text-[#6F6A62] leading-relaxed">
                    Emphasizes deep concept intuition before moving to problem-solving drills. Each session begins with a rapid recap of the previous class to ensure steady memory retention, followed by targeted exam-pattern problem breakdown and digital lesson notes when shared by the tutor.
                  </p>
                </div>

                <div className="border-t border-[rgba(55,48,40,0.08)] pt-6">
                  <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#25231F]">
                    Academic Scope &amp; Frameworks
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9B958C] block mb-2">
                        Subjects
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.subjects.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-[#E4EEE9] px-3 py-1 text-xs font-bold text-[#244A40]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9B958C] block mb-2">
                        Classes Handled
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.classes.map((c) => (
                          <span
                            key={c}
                            className="rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-semibold text-[#25231F]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9B958C] block mb-2">
                        Curriculum Boards
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.boards.map((b) => (
                          <span
                            key={b}
                            className="rounded-full bg-[#E3EADD] px-3 py-1 text-xs font-bold text-[#244A40]"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class Packages: Presented as Learning Rhythms */}
              <div className="border-t border-[rgba(55,48,40,0.08)] pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#25231F]">
                      Class Packages (Learning Rhythms)
                    </h2>
                    <p className="mt-1 text-xs text-[#6F6A62]">
                      Simple, non-recurring class packages. You only pay after your free 30-min demo if satisfied.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#E4EEE9] px-3 py-1 text-xs font-bold text-[#244A40]">
                    45 Days Validity
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {tuitionPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs font-extrabold text-[#315F52]">
                          {pkg.title}
                        </span>
                        <div className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#25231F]">
                          {formatCurrency(pkg.price)}
                        </div>
                        <div className="text-xs text-[#6F6A62] font-semibold mt-0.5">
                          {pkg.numberOfClasses} classes &bull; 60m each
                        </div>
                        <p className="mt-2 text-xs text-[#6F6A62] leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[rgba(55,48,40,0.08)] text-[11px] font-bold text-[#315F52]">
                        45-day package validity
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking Widget (Desktop) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white/95 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-md">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#244A40] bg-[#E3EADD] px-3 py-1.5 rounded-full">
                  <IconVideo size={13} />
                  <span>Free 30-Min Demo</span>
                </div>

                <div className="mt-4">
                  <h3 className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-[#25231F]">
                    Evaluate 1-on-1 with {tutor.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#6F6A62] leading-relaxed">
                    Test concept explanation and teaching chemistry in a 30-minute free online session before selecting a routine.
                  </p>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-[#25231F]">
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#315F52]" />
                    <span>Duration: Exactly 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#315F52]" />
                    <span>Format: Interactive digital classroom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#315F52]" />
                    <span>Cost: ₹0 (No card details required)</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/demo/book?tutor=${tutor.id}`}
                    className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold rounded-full shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
                  >
                    <span>Book Free Demo Now</span>
                    <IconArrowRight size={15} />
                  </Link>
                  <p className="mt-2.5 text-center text-[11px] text-[#9B958C]">
                    Takes less than 1 minute to schedule
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-4 text-xs text-[#6F6A62]">
                  <span className="font-bold text-[#25231F]">Class Packages:</span>
                  <div className="mt-1 font-bold text-[#25231F] text-sm">
                    Starting from {formatCurrency(tutor.startingMonthlyFee)} (8 classes)
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#6F6A62]">
                    Choose 8, 12, or 15 classes after your demo if satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Bottom Booking Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(55,48,40,0.10)] bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md lg:hidden">
          <div className="container-shell flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B958C]">
                Free 30-min Trial
              </span>
              <div className="font-[family-name:var(--font-manrope)] text-sm font-extrabold text-[#25231F]">
                Meet {tutor.name}
              </div>
            </div>
            <Link
              href={`/demo/book?tutor=${tutor.id}`}
              className="btn btn-primary min-h-[44px] px-5 text-xs font-bold rounded-full shrink-0 shadow-xs"
            >
              <span>Book Demo</span>
              <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
