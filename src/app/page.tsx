"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroComposer } from "@/components/hero-composer";
import { tutors } from "@/lib/data";
import {
  IconArrowRight,
  IconCheck,
  IconVideo,
  IconHomeTuition,
} from "@/components/ui/icons";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* Scroll-reveal observer hook */
function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal, .reveal-fade, .reveal-scale").forEach((node) => {
            node.classList.add("revealed");
          });
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref as React.RefObject<HTMLElement>;
}

export default function HomePage() {
  const sampleTutors = tutors.slice(0, 3);

  const heroRef = useRef<HTMLElement | null>(null);
  const [spotlight, setSpotlight] = useState({ x: -1000, y: -1000, active: false });

  const sectionStoryRef = useReveal() as React.RefObject<HTMLDivElement>;
  const sectionModesRef = useReveal() as React.RefObject<HTMLDivElement>;
  const sectionDemoRef  = useReveal() as React.RefObject<HTMLDivElement>;
  const sectionStepsRef = useReveal() as React.RefObject<HTMLDivElement>;

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSpotlight({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      });
    }
  };

  const quickSubjects = [
    { name: "Mathematics", href: "/tutors?subject=Mathematics" },
    { name: "Science", href: "/tutors?subject=Science" },
    { name: "Physics", href: "/tutors?subject=Physics" },
    { name: "English", href: "/tutors?subject=English" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] text-[var(--tc-text-primary)] transition-colors">
      <SiteHeader />

      <main id="main-content" className="flex-1">

        {/* 1. HERO */}
        <section
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setSpotlight((prev) => ({ ...prev, active: false }))}
          className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-36 atmo-hero transition-colors"
        >
          {/* Restrained desktop pointer spotlight */}
          {spotlight.active && (
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-60 dark:opacity-20 hidden md:block"
              style={{
                background: `radial-gradient(650px circle at ${spotlight.x}px ${spotlight.y}px, var(--tc-soft-primary), transparent 75%)`,
              }}
              aria-hidden="true"
            />
          )}

          <div className="container-shell relative z-10">
            <div className="mx-auto max-w-[840px] flex flex-col items-center text-center">

              {/* Eyebrow */}
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--tc-primary)] mb-5 text-center">
                1-on-1 tutoring &bull; Online &amp; at home &bull; Hyderabad
              </p>

              {/* Primary Headline */}
              <h1
                className="mx-auto max-w-2xl text-center font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.035em] text-[var(--tc-text-primary)] leading-[1.08]"
                style={{ fontSize: "clamp(2.4rem, 6vw, 4.1rem)" }}
              >
                <span className="sm:block">Find a tutor your child</span>{" "}
                <span className="sm:block">learns well with.</span>
              </h1>

              {/* Supporting Copy */}
              <p
                className="mt-6 mx-auto max-w-xl text-center text-[var(--tc-text-secondary)] leading-relaxed"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.18rem)" }}
              >
                <span className="sm:block">Thoughtful 1-on-1 tutoring, online or at home,</span>{" "}
                <span className="sm:block">with a free 30-minute online demo.</span>
              </p>

              {/* Primary Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/tutors"
                  className="btn btn-primary min-h-[50px] px-8 text-sm font-bold gap-2"
                >
                  <span>Find a Tutor</span>
                  <IconArrowRight size={15} />
                </Link>
                <Link
                  href="/demo/book"
                  className="btn btn-outline min-h-[50px] px-7 text-sm font-bold"
                >
                  Book a Free Demo
                </Link>
              </div>

              {/* Search Dock */}
              <div className="mt-12 w-full flex justify-center">
                <HeroComposer />
              </div>

            </div>
          </div>
        </section>

        {/* 2. PERSONAL TUTOR EXPLORATION STORY */}
        <section
          id="subjects"
          ref={sectionStoryRef}
          className="py-24 md:py-36 bg-[var(--tc-surface)] border-y border-[var(--tc-border)] transition-colors"
        >
          <div className="container-shell">
            <div className="grid items-center gap-14 lg:grid-cols-12">

              {/* Left Column: Narrative */}
              <div className="space-y-6 lg:col-span-6">
                <div>
                  <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-[var(--tc-primary)]">
                    01 &bull; Personal Fit
                  </p>
                  <h2
                    className="reveal reveal-delay-1 mt-4 font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.03em] text-[var(--tc-text-primary)] leading-[1.12]"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
                  >
                    Every student learns at their own pace.
                  </h2>
                </div>
                <p className="reveal reveal-delay-2 text-[var(--tc-text-secondary)] leading-relaxed max-w-md text-base">
                  Explore tutor profiles, teaching approach, and subject expertise
                  across Classes 6 to 12. Filter by curriculum, syllabus goals, and
                  preferred schedule to find a tutor suited to your child.
                </p>

                {/* Lightweight Subject Examples */}
                <div className="reveal reveal-delay-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-secondary)] mb-3">Explore Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSubjects.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="rounded-full border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] px-3.5 py-1.5 text-xs font-semibold text-[var(--tc-text-primary)] hover:border-[var(--tc-primary)]/40 hover:bg-[var(--tc-soft-primary)] hover:text-[var(--tc-primary)] transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="reveal reveal-delay-4 pt-3">
                  <Link
                    href="/tutors"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--tc-primary)] hover:text-[var(--tc-primary-hover)] transition-colors group"
                  >
                    <span>Browse all tutor profiles</span>
                    <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Sample Tutor Profile Previews */}
              <div className="reveal-scale space-y-3.5 lg:col-span-6">
                {sampleTutors.map((tutor) => (
                  <Link
                    key={tutor.id}
                    href={`/tutors/${tutor.id}`}
                    className="group block rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-5 shadow-xs hover:-translate-y-0.5 hover:border-[var(--tc-primary)]/40 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--tc-soft-primary)] text-sm font-extrabold text-[var(--tc-primary)]">
                          {tutor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-[var(--tc-text-primary)] group-hover:text-[var(--tc-primary)] transition-colors truncate">
                              {tutor.name}
                            </p>
                            <span className="rounded-full bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--tc-text-secondary)] shrink-0">
                              Sample profile
                            </span>
                          </div>
                          <p className="text-xs text-[var(--tc-text-secondary)] truncate">{tutor.headline}</p>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-[var(--tc-text-primary)]">
                          {formatCurrency(tutor.startingPackagePrice || 3200)}
                        </span>
                        <span className="text-[11px] text-[var(--tc-text-secondary)]">/ 8 classes</span>
                      </div>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {tutor.subjects.map((sub) => (
                        <span
                          key={sub}
                          className="rounded-full bg-[var(--tc-soft-primary)] border border-[var(--tc-primary)]/15 px-2.5 py-0.5 text-[11px] font-medium text-[var(--tc-primary)]"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* 3. ONLINE OR IN YOUR LIVING ROOM */}
        <section
          ref={sectionModesRef}
          className="py-24 md:py-36 atmo-alt border-b border-[var(--tc-border)] transition-colors"
        >
          <div className="container-shell">
            <div className="mx-auto max-w-xl text-center mb-14">
              <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-[var(--tc-primary)]">
                02 &bull; Delivery Modes
              </p>
              <h2
                className="reveal reveal-delay-1 mt-4 font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.03em] text-[var(--tc-text-primary)]"
                style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}
              >
                Online or in your living room.
              </h2>
              <p className="reveal reveal-delay-2 mt-3 text-sm text-[var(--tc-text-secondary)] leading-relaxed">
                Choose the mode that best fits your childs attention span and your home routine.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Online Mode Card */}
              <div className="reveal rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-8 shadow-xs hover:-translate-y-0.5 hover:border-[var(--tc-primary)]/35 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--tc-teal)]/10 text-[var(--tc-teal)] mb-5">
                    <IconVideo size={22} />
                  </div>
                  <h3 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[var(--tc-text-primary)]">
                    Online 1-on-1 Tuition
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-[var(--tc-text-secondary)] leading-relaxed">
                    Interactive virtual whiteboard lessons with experienced tutors across India. Includes shared study notes, instant problem solving, and zero commute time.
                  </p>
                </div>
                <div className="border-t border-[var(--tc-border)] pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--tc-teal)]">Free 30-min online demo</span>
                  <Link href="/tutors?mode=online" className="text-xs font-bold text-[var(--tc-primary)] hover:underline inline-flex items-center gap-1">
                    <span>View online tutors</span>
                    <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Home Mode Card */}
              <div className="reveal reveal-delay-1 rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-8 shadow-xs hover:-translate-y-0.5 hover:border-[var(--tc-primary)]/35 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] mb-5">
                    <IconHomeTuition size={22} />
                  </div>
                  <h3 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[var(--tc-text-primary)]">
                    In-Home Tuition (Hyderabad)
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-[var(--tc-text-secondary)] leading-relaxed">
                    Personalized in-person tutoring at your residence in Hyderabad. Ideal for students who benefit from direct physical presence, structured paper exercises, and tactile guidance.
                  </p>
                </div>
                <div className="border-t border-[var(--tc-border)] pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--tc-primary)]">Home tuition across Hyderabad localities</span>
                  <Link href="/tutors?mode=home" className="text-xs font-bold text-[var(--tc-primary)] hover:underline inline-flex items-center gap-1">
                    <span>View home tutors</span>
                    <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. THE FREE DEMO */}
        <section
          ref={sectionDemoRef}
          className="py-24 md:py-36 bg-[var(--tc-surface)] border-b border-[var(--tc-border)] transition-colors"
        >
          <div className="container-shell">
            <div className="grid items-center gap-12 lg:grid-cols-12">

              {/* Text column */}
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-[var(--tc-primary)]">
                    03 &bull; Free Online Demo
                  </p>
                  <h2
                    className="reveal reveal-delay-1 mt-4 font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.03em] text-[var(--tc-text-primary)] leading-[1.12]"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
                  >
                    Experience rapport first.
                  </h2>
                </div>
                <p className="reveal reveal-delay-2 text-[var(--tc-text-secondary)] leading-relaxed text-base max-w-lg">
                  Every regular tuition begins with a complimentary 30-minute online trial. Meet the educator, review a tricky chapter topic, and confirm that your child feels encouraged before making any tuition commitment.
                </p>

                <div className="reveal reveal-delay-3 space-y-3.5 pt-2">
                  <div className="flex items-start gap-3 text-sm text-[var(--tc-text-primary)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--tc-teal)]/10 text-[var(--tc-teal)] mt-0.5">
                      <IconCheck size={11} />
                    </span>
                    <span>Assess teaching pace, patience, and student comfort firsthand</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[var(--tc-text-primary)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--tc-teal)]/10 text-[var(--tc-teal)] mt-0.5">
                      <IconCheck size={11} />
                    </span>
                    <span>No upfront fee or payment details required to book</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[var(--tc-text-primary)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--tc-teal)]/10 text-[var(--tc-teal)] mt-0.5">
                      <IconCheck size={11} />
                    </span>
                    <span>Decide on an 8, 12, or 15 class package only after the trial</span>
                  </div>
                </div>

                <div className="reveal reveal-delay-4 pt-4">
                  <Link
                    href="/demo/book"
                    className="btn btn-primary min-h-[48px] px-7 text-sm font-bold gap-2"
                  >
                    <span>Book a Free Demo</span>
                    <IconArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Visual Card */}
              <div className="reveal-scale lg:col-span-5">
                <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] p-7 md:p-9 space-y-6 transition-colors">
                  <div className="border-b border-[var(--tc-border)] pb-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-secondary)]">Demo Session Structure</p>
                    <p className="mt-2 font-[family-name:var(--font-manrope)] font-extrabold text-2xl sm:text-3xl text-[var(--tc-text-primary)]">
                      30 Minutes
                    </p>
                    <p className="text-xs text-[var(--tc-text-secondary)] mt-1">30-minute online demo</p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--tc-text-secondary)]">Session Fee</span>
                      <span className="font-bold text-[var(--tc-teal)]">?0 (Free)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--tc-text-secondary)]">Mode</span>
                      <span className="font-semibold text-[var(--tc-text-primary)]">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--tc-text-secondary)]">Syllabus Discussion</span>
                      <span className="font-semibold text-[var(--tc-text-primary)]">Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--tc-text-secondary)]">Commitment</span>
                      <span className="font-semibold text-[var(--tc-text-primary)]">Zero Obligation</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section
          id="how-it-works"
          ref={sectionStepsRef}
          className="py-24 md:py-36 atmo-alt border-t border-[var(--tc-border)] transition-colors"
        >
          <div className="container-shell">
            <div className="mx-auto max-w-xl text-center mb-14">
              <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-[var(--tc-primary)]">
                04 &bull; How It Works
              </p>
              <h2
                className="reveal reveal-delay-1 mt-4 font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.03em] text-[var(--tc-text-primary)]"
                style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)" }}
              >
                Three simple steps.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Find your tutor",
                  text: "Filter profiles by subject, grade level (Classes 612), and delivery mode.",
                },
                {
                  step: "02",
                  title: "Book a free demo",
                  text: "Attend a 30-minute online trial to assess mutual comfort, teaching pace, and style.",
                },
                {
                  step: "03",
                  title: "Start regular lessons",
                  text: "Select a package (8, 12, or 15 sessions) and track lesson logs in your Class Ledger.",
                },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className={`reveal reveal-delay-${i + 1} rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-7 flex flex-col justify-between space-y-5 shadow-xs hover:-translate-y-0.5 hover:border-[var(--tc-primary)]/35 hover:shadow-md transition-all duration-200`}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--tc-soft-primary)] text-xs font-extrabold text-[var(--tc-primary)]">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-manrope)] font-bold text-base text-[var(--tc-text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-[var(--tc-text-secondary)] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="py-28 md:py-40 atmo-cta border-t border-[var(--tc-border)] transition-colors">
          <div className="container-tight flex flex-col items-center text-center">
            <h2
              className="mx-auto max-w-2xl text-center font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.035em] text-[var(--tc-text-primary)] leading-[1.08]"
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)" }}
            >
              <span className="sm:block">Find a tutor your child</span>{" "}
              <span className="sm:block">learns well with.</span>
            </h2>

            <p className="mt-6 mx-auto max-w-xl text-center text-[var(--tc-text-secondary)] leading-relaxed text-base">
              <span className="sm:block">Thoughtful 1-on-1 tutoring, online or at home,</span>{" "}
              <span className="sm:block">with a free 30-minute online demo.</span>
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/tutors"
                className="btn btn-primary min-h-[50px] px-8 text-sm font-bold gap-2"
              >
                <span>Find a Tutor</span>
                <IconArrowRight size={15} />
              </Link>
              <Link
                href="/demo/book"
                className="btn btn-outline min-h-[50px] px-8 text-sm font-bold"
              >
                Book a Free Demo
              </Link>
            </div>

            <p className="mt-7 text-xs text-[var(--tc-text-secondary)] text-center">
              Free 30-minute demo &bull; 1-on-1 dedicated attention &bull; No subscription lock-in
            </p>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
