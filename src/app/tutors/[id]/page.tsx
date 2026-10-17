import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { tuitionPackages } from "@/lib/data";
import { getTutorBySlug } from "@/lib/services/workflow";
import {
  IconStar,
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
  const tutor = await getTutorBySlug(id);

  if (!tutor) {
    notFound();
  }

  const offersOnline = tutor.modes.includes("online");
  const offersHome = tutor.modes.includes("home");

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] text-[var(--tc-text-primary)] transition-colors">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-24 lg:pb-20">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-[var(--tc-border)] bg-[var(--tc-surface)] py-3.5 transition-colors">
          <div className="container-shell flex items-center justify-between">
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition-colors"
            >
              <IconArrowLeft size={14} />
              <span>Back to all tutors</span>
            </Link>

            <span className="text-xs font-semibold text-[var(--tc-text-secondary)]">
              Educator Profile &bull; {tutor.name}
            </span>
          </div>
        </div>

        <div className="container-shell mt-8 md:mt-12">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Left Column: Wide Editorial Dossier */}
            <div className="lg:col-span-8 space-y-10">
              {/* Identity Header */}
              <div className="rounded-[18px] border border-[var(--tc-border)] bg-[var(--tc-surface)] p-7 sm:p-9 shadow-xs transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div
                      aria-hidden="true"
                      className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--tc-soft-primary)] text-xl sm:text-2xl font-extrabold text-[var(--tc-primary)] shadow-2xs"
                    >
                      {getInitials(tutor.name)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[var(--tc-text-primary)]">
                          {tutor.name}
                        </h1>
                        
                      </div>
                      <p className="mt-1 text-sm font-semibold text-[var(--tc-primary)]">
                        {tutor.headline}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[var(--tc-text-secondary)]">
                        <span className="flex items-center gap-1">
                          <IconMapPin size={13} className="text-[var(--tc-text-secondary)]" />
                          <span>{tutor.locality}, {tutor.city}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="font-bold text-[var(--tc-text-primary)]">{tutor.experienceYears}y teaching</span>
                        <span>&bull;</span>
                        <span>Languages: {tutor.languages.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating or Sample Profile Badge */}
                  {tutor.isDemoProfile ? (
                    <div className="rounded-xl bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-3.5 py-2 self-start">
                      <span className="text-xs font-semibold text-[var(--tc-text-secondary)]">Sample profile</span>
                    </div>
                  ) : tutor.rating && tutor.reviewCount > 0 ? (
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 rounded-xl bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-3.5 py-2 self-start">
                      <div className="flex items-center gap-1 text-sm font-extrabold text-[var(--tc-text-primary)]">
                        <IconStar size={15} className="text-[var(--tc-warning)]" />
                        <span>{tutor.rating?.toFixed(1)}</span>
                      </div>
                      <span className="text-[11px] text-[var(--tc-text-secondary)]">{tutor.reviewCount} reviews</span>
                    </div>
                  ) : null}
                </div>

                {/* Modes availability banner */}
                <div className="mt-6 flex flex-wrap gap-2.5 border-t border-[var(--tc-border)] pt-5 text-xs">
                  {offersOnline && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-teal)]/10 border border-[var(--tc-teal)]/20 px-3.5 py-1 font-bold text-[var(--tc-teal)]">
                      <IconVideo size={13} />
                      <span>Online Tuition (30-min Free Demo Available)</span>
                    </span>
                  )}
                  {offersHome && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-3.5 py-1 font-bold text-[var(--tc-text-primary)]">
                      <IconHomeTuition size={13} />
                      <span>Home Tuition &bull; Availability confirmed during scheduling</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Editorial Section: About & Teaching Approach */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[var(--tc-text-primary)]">
                    About the Educator
                  </h2>
                  <p className="mt-3 text-sm text-[var(--tc-text-secondary)] leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>

                <div className="border-t border-[var(--tc-border)] pt-6">
                  <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[var(--tc-text-primary)]">
                    Teaching Approach
                  </h3>
                  <p className="mt-2 text-sm text-[var(--tc-text-secondary)] leading-relaxed">
                    Emphasizes concept clarity before moving to problem-solving drills. Each session begins with a rapid recap of the previous class to ensure steady memory retention, followed by targeted exam-pattern problem breakdown and digital lesson notes when shared by the tutor.
                  </p>
                </div>

                <div className="border-t border-[var(--tc-border)] pt-6">
                  <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[var(--tc-text-primary)]">
                    Academic Scope &amp; Frameworks
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--tc-text-secondary)] block mb-2">
                        Subjects
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.subjects.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-[var(--tc-soft-primary)] border border-[var(--tc-primary)]/15 px-3 py-1 text-xs font-bold text-[var(--tc-primary)]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--tc-text-secondary)] block mb-2">
                        Classes Handled
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.classes.map((c) => (
                          <span
                            key={c}
                            className="rounded-full bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-3 py-1 text-xs font-semibold text-[var(--tc-text-primary)]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--tc-text-secondary)] block mb-2">
                        Curriculum Boards
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tutor.boards.map((b) => (
                          <span
                            key={b}
                            className="rounded-full bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-3 py-1 text-xs font-bold text-[var(--tc-text-primary)]"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class Packages */}
              <div className="border-t border-[var(--tc-border)] pt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[var(--tc-text-primary)]">
                      Class Packages (Learning Rhythms)
                    </h2>
                    <p className="mt-1 text-xs text-[var(--tc-text-secondary)]">
                      Simple, non-recurring class packages. You only pay after your free 30-min demo if satisfied.
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--tc-teal)]/10 border border-[var(--tc-teal)]/20 px-3 py-1 text-xs font-bold text-[var(--tc-teal)]">
                    45 Days Validity
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {tuitionPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-5 shadow-xs flex flex-col justify-between transition-colors"
                    >
                      <div>
                        <span className="text-xs font-extrabold text-[var(--tc-primary)]">
                          {pkg.title}
                        </span>
                        <div className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[var(--tc-text-primary)]">
                          {formatCurrency(pkg.price)}
                        </div>
                        <div className="text-xs text-[var(--tc-text-secondary)] font-semibold mt-0.5">
                          {pkg.numberOfClasses} classes &bull; 60m each
                        </div>
                        <p className="mt-2 text-xs text-[var(--tc-text-secondary)] leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--tc-border)] text-[11px] font-bold text-[var(--tc-primary)]">
                        45-day package validity
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking Widget (Desktop) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)]/95 p-7 shadow-sm backdrop-blur-md transition-colors">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--tc-teal)] bg-[var(--tc-teal)]/10 border border-[var(--tc-teal)]/20 px-3 py-1.5 rounded-full">
                  <IconVideo size={13} />
                  <span>Free 30-Min Demo</span>
                </div>

                <div className="mt-4">
                  <h3 className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-[var(--tc-text-primary)]">
                    Evaluate 1-on-1 with {tutor.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[var(--tc-text-secondary)] leading-relaxed">
                    Test concept explanation and teaching chemistry in a 30-minute free online session before selecting a routine.
                  </p>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-[var(--tc-text-primary)]">
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[var(--tc-teal)]" />
                    <span>Duration: Exactly 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[var(--tc-teal)]" />
                    <span>Format: Interactive digital classroom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[var(--tc-teal)]" />
                    <span>Cost: ₹0 (No card details required)</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/demo/book?tutor=${tutor.id}`}
                    className="btn btn-primary w-full min-h-[46px] text-sm font-bold rounded-xl justify-center gap-2"
                  >
                    <span>Book Free Demo Now</span>
                    <IconArrowRight size={15} />
                  </Link>
                  <p className="mt-2.5 text-center text-[11px] text-[var(--tc-text-secondary)]">
                    Takes less than 1 minute to schedule
                  </p>
                </div>

                <div className="mt-5 rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] p-4 text-xs text-[var(--tc-text-secondary)]">
                  <span className="font-bold text-[var(--tc-text-primary)]">Class Packages:</span>
                  <div className="mt-1 font-bold text-[var(--tc-text-primary)] text-sm">
                    Starting from {formatCurrency((tutor.startingPackagePrice || tutor.startingMonthlyFee || 3200))} (8 classes)
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--tc-text-secondary)]">
                    Choose 8, 12, or 15 classes after your demo if satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile Bottom Booking Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--tc-border)] bg-[var(--tc-surface)]/95 px-4 py-3 shadow-md backdrop-blur-md lg:hidden transition-colors">
          <div className="container-shell flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--tc-text-secondary)]">
                Free 30-Min Demo
              </span>
              <div className="font-[family-name:var(--font-manrope)] text-sm font-extrabold text-[var(--tc-text-primary)]">
                Meet {tutor.name}
              </div>
            </div>
            <Link
              href={`/demo/book?tutor=${tutor.id}`}
              className="btn btn-primary min-h-[42px] px-5 text-xs font-bold rounded-xl shrink-0 shadow-xs"
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
