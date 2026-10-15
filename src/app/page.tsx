"use client";

import { useEffect, useRef } from "react";
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

/* ── Scroll-reveal observer hook ────────────────────────────────────────── */
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

  const sectionStoryRef = useReveal() as React.RefObject<HTMLDivElement>;
  const sectionModesRef = useReveal() as React.RefObject<HTMLDivElement>;
  const sectionDemoRef  = useReveal() as React.RefObject<HTMLDivElement>;
  const sectionStepsRef = useReveal() as React.RefObject<HTMLDivElement>;

  const quickSubjects = [
    { name: "Mathematics", href: "/tutors?subject=Mathematics" },
    { name: "Science", href: "/tutors?subject=Science" },
    { name: "Physics", href: "/tutors?subject=Physics" },
    { name: "English", href: "/tutors?subject=English" },
  ];

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--tc-canvas)" }}>
      <SiteHeader />

      <main id="main-content" className="flex-1">

        {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-36 atmo-hero">
          <div className="container-shell relative z-10">
            <div className="mx-auto max-w-[840px] flex flex-col items-center text-center">

              {/* Eyebrow */}
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#236B5B] mb-5 text-center">
                1-on-1 tutoring &bull; Online &amp; at home &bull; Hyderabad
              </p>

              {/* Primary Headline (Deliberate 2-line desktop layout) */}
              <h1
                className="mx-auto max-w-2xl text-center font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.035em] text-[#18211E] leading-[1.08]"
                style={{ fontSize: "clamp(2.4rem, 6vw, 4.1rem)" }}
              >
                <span className="sm:block">Find a tutor your child</span>{" "}
                <span className="sm:block">learns well with.</span>
              </h1>

              {/* Supporting Copy (Deliberate 2-line desktop layout) */}
              <p
                className="mt-6 mx-auto max-w-xl text-center text-[#66716D] leading-relaxed"
                style={{ fontSize: "clamp(1rem, 2.2vw, 1.18rem)" }}
              >
                <span className="sm:block">Thoughtful 1-on-1 tutoring, online or at home,</span>{" "}
                <span className="sm:block">with a free 30-minute online demo.</span>
              </p>

              {/* Primary Actions (Centered axis) */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/tutors"
                  className="btn btn-primary min-h-[52px] px-8 text-sm font-bold gap-2 shadow-[0_4px_20px_rgba(35,107,91,0.25)]"
                >
                  <span>Find a Tutor</span>
                  <IconArrowRight size={15} />
                </Link>
                <Link
                  href="/demo/book"
                  className="btn btn-outline min-h-[52px] px-7 text-sm font-bold"
                >
                  Book a Free Demo
                </Link>
              </div>

              {/* Search Dock (Centered axis) */}
              <div className="mt-12 w-full flex justify-center">
                <HeroComposer />
              </div>

            </div>
          </div>
        </section>

        {/* ── 2. PERSONAL TUTOR EXPLORATION STORY ───────────────────────────── */}
        <section
          id="subjects"
          ref={sectionStoryRef}
          className="py-28 md:py-40 bg-white border-y border-[rgba(24,33,30,0.06)]"
        >
          <div className="container-shell">
            <div className="grid items-center gap-16 lg:grid-cols-12">

              {/* Left Column: Narrative */}
              <div className="space-y-6 lg:col-span-6">
                <div>
                  <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-[#236B5B]">
                    01 &bull; Personal Fit
                  </p>
                  <h2
                    className="reveal reveal-delay-1 mt-4 font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.03em] text-[#18211E] leading-[1.12]"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
                  >
                    Every student learns at their own pace.
                  </h2>
                </div>
                <p className="reveal reveal-delay-2 text-[#66716D] leading-relaxed max-w-md text-base">
                  Explore tutor profiles, teaching approach, and subject expertise
                  across Classes 6 to 12. Filter by curriculum, syllabus goals, and
                  preferred schedule to find a tutor suited to your child.
                </p>

                {/* Lightweight Subject Examples */}
                <div className="reveal reveal-delay-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#9BAAA5] mb-3">Explore Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSubjects.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="rounded-full border border-[rgba(24,33,30,0.08)] bg-[#F4F8FB] px-3.5 py-1.5 text-xs font-semibold text-[#18211E] hover:border-[#236B5B]/30 hover:bg-[#E2F5EC] hover:text-[#1A5247] transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="reveal reveal-delay-4 pt-3">
                  <Link
                    href="/tutors"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#236B5B] hover:text-[#1A5247] transition-colors group"
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
                    className="group block rounded-2xl border border-[rgba(24,33,30,0.08)] bg-[#FCFDFE] p-5 shadow-[0_2px_12px_rgba(24,33,30,0.03)] hover:border-[#236B5B]/30 hover:shadow-[0_8px_24px_rgba(24,33,30,0.06)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E2F5EC] text-sm font-extrabold text-[#1A5247]">
                          {tutor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-[#18211E] group-hover:text-[#236B5B] transition-colors truncate">
                              {tutor.name}
                            </p>
                            <span className="rounded-full bg-[rgba(24,33,30,0.06)] px-2 py-0.5 text-[10px] font-medium text-[#66716D] shrink-0">
                              Demo profile
                            </span>
                          </div>
                          <p className="text-xs text-[#66716D] truncate mt-0.5">
                            {tutor.headline}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-xs font-bold text-[#18211E] tabular-nums">From &#8377;{tutor.startingPackagePrice || 3200}</span>
                        <span className="text-[11px] text-[#9BAAA5]"> / pkg</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(24,33,30,0.05)] pt-3 text-xs">
                      <span className="text-[#66716D]">
                        {tutor.subjects.slice(0, 2).join(" &bull; ")}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {tutor.modes.includes("online") && (
                          <span className="rounded-full bg-[#E3F2FF] px-2.5 py-0.5 text-[10px] font-bold text-[#1D4ED8]">
                            Online
                          </span>
                        )}
                        {tutor.modes.includes("home") && (
                          <span className="rounded-full bg-[#E2F5EC] px-2.5 py-0.5 text-[10px] font-bold text-[#1A5247]">
                            Home
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── 3. ONLINE VS HOME TUITION ─────────────────────────────────────── */}
        <section
          ref={sectionModesRef}
          className="py-28 md:py-40 atmo-alt"
        >
          <div className="container-shell">
            <div className="mx-auto max-w-xl text-center mb-16">
              <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-[#236B5B]">
                02 &bull; Delivery Formats
              </p>
              <h2
                className="reveal reveal-delay-1 mt-4 font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.03em] text-[#18211E] leading-[1.12]"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
              >
                Online, at home, or both.
              </h2>
              <p className="reveal reveal-delay-2 mt-4 text-[#66716D] leading-relaxed text-base">
                Choose the mode that best fits your child&apos;s learning environment and weekly schedule.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">

              {/* Card 1: Online Tuition */}
              <div className="reveal rounded-3xl border border-[rgba(24,33,30,0.08)] bg-white p-8 md:p-10 shadow-[0_4px_20px_rgba(24,33,30,0.04)] flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3F2FF] text-[#1D4ED8] mb-6">
                    <IconVideo size={24} />
                  </div>
                  <h3 className="font-[family-name:var(--font-manrope)] font-bold text-xl text-[#18211E]">
                    1-on-1 Online Tuition
                  </h3>
                  <p className="mt-3 text-sm text-[#66716D] leading-relaxed">
                    1-on-1 online tutoring with flexible scheduling and focused attention from your selected tutor.
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-[#18211E]">
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247]">
                        <IconCheck size={10} />
                      </span>
                      1-on-1 attention from your selected tutor
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247]">
                        <IconCheck size={10} />
                      </span>
                      Flexible online scheduling
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247]">
                        <IconCheck size={10} />
                      </span>
                      Learn from home without travel
                    </li>
                  </ul>
                </div>
                <div>
                  <Link
                    href="/tutors?mode=online"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors group"
                  >
                    <span>Browse online tutors</span>
                    <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Home Tuition */}
              <div className="reveal reveal-delay-1 rounded-3xl border border-[rgba(24,33,30,0.08)] bg-white p-8 md:p-10 shadow-[0_4px_20px_rgba(24,33,30,0.04)] flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E2F5EC] text-[#1A5247] mb-6">
                    <IconHomeTuition size={24} />
                  </div>
                  <h3 className="font-[family-name:var(--font-manrope)] font-bold text-xl text-[#18211E]">
                    In-Person Home Tuition
                  </h3>
                  <p className="mt-3 text-sm text-[#66716D] leading-relaxed">
                    Tutors can teach at your home in eligible Hyderabad areas.
                    Personalized in-person guidance at the student&apos;s own study desk.
                  </p>
                  <ul className="mt-6 space-y-3 text-xs text-[#18211E]">
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247]">
                        <IconCheck size={10} />
                      </span>
                      Direct in-person guidance and study routines
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247]">
                        <IconCheck size={10} />
                      </span>
                      Scheduled weekly slots in eligible Hyderabad localities
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247]">
                        <IconCheck size={10} />
                      </span>
                      Comfortable, distraction-free home learning environment
                    </li>
                  </ul>
                </div>
                <div>
                  <Link
                    href="/tutors?mode=home"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#236B5B] hover:text-[#1A5247] transition-colors group"
                  >
                    <span>Browse home tutors in Hyderabad</span>
                    <IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 4. FREE DEMO ─────────────────────────────────────────────────── */}
        <section
          ref={sectionDemoRef}
          className="py-28 md:py-40 bg-white border-y border-[rgba(24,33,30,0.06)]"
        >
          <div className="container-shell">
            <div className="grid items-center gap-16 lg:grid-cols-12">

              {/* Narrative */}
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-[#236B5B]">
                    03 &bull; Free Demo
                  </p>
                  <h2
                    className="reveal reveal-delay-1 mt-4 font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.03em] text-[#18211E] leading-[1.12]"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
                  >
                    Experience the teaching style before you commit.
                  </h2>
                </div>
                <p className="reveal reveal-delay-2 text-[#66716D] leading-relaxed max-w-lg text-base">
                  A free 30-minute online demo lets your child and tutor meet, assess
                  current coursework, and understand communication style — before choosing any class package.
                </p>

                <div className="reveal reveal-delay-3 space-y-3.5 pt-2">
                  <div className="flex items-start gap-3 text-sm text-[#18211E]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247] mt-0.5">
                      <IconCheck size={11} />
                    </span>
                    <span>Free 30-minute online demo with your selected tutor</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#18211E]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247] mt-0.5">
                      <IconCheck size={11} />
                    </span>
                    <span>No upfront fee or payment details required to book</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[#18211E]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E2F5EC] text-[#1A5247] mt-0.5">
                      <IconCheck size={11} />
                    </span>
                    <span>Decide on an 8, 12, or 15 class package only after the trial</span>
                  </div>
                </div>

                <div className="reveal reveal-delay-4 pt-4">
                  <Link
                    href="/demo/book"
                    className="btn btn-primary min-h-[50px] px-8 text-sm font-bold gap-2"
                  >
                    <span>Book a Free Demo</span>
                    <IconArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Visual Card */}
              <div className="reveal-scale lg:col-span-5">
                <div className="rounded-3xl border border-[rgba(24,33,30,0.08)] bg-[#F4F8FB] p-8 md:p-10 space-y-6">
                  <div className="border-b border-[rgba(24,33,30,0.07)] pb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9BAAA5]">Demo Session Structure</p>
                    <p className="mt-2 font-[family-name:var(--font-manrope)] font-extrabold text-3xl text-[#18211E]">
                      30 Minutes
                    </p>
                    <p className="text-xs text-[#66716D] mt-1">30-minute online demo</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#66716D]">Session Fee</span>
                      <span className="font-bold text-[#236B5B]">&#8377;0 (Free)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#66716D]">Mode</span>
                      <span className="font-semibold text-[#18211E]">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#66716D]">Syllabus Discussion</span>
                      <span className="font-semibold text-[#18211E]">Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#66716D]">Commitment</span>
                      <span className="font-semibold text-[#18211E]">Zero Obligation</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 5. VERY SMALL HOW IT WORKS ─────────────────────────────────────── */}
        <section
          id="how-it-works"
          ref={sectionStepsRef}
          className="py-24 md:py-36 atmo-alt border-t border-[rgba(24,33,30,0.06)]"
        >
          <div className="container-shell">
            <div className="mx-auto max-w-xl text-center mb-14">
              <p className="reveal text-xs font-bold uppercase tracking-[0.2em] text-[#236B5B]">
                04 &bull; How It Works
              </p>
              <h2
                className="reveal reveal-delay-1 mt-4 font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.03em] text-[#18211E]"
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
                  text: "Filter profiles by subject, grade level (Classes 6–12), and delivery mode.",
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
                  className={`reveal reveal-delay-${i + 1} rounded-2xl border border-[rgba(24,33,30,0.07)] bg-white p-7 flex flex-col justify-between space-y-5`}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#E2F5EC] text-xs font-black text-[#1A5247]">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-manrope)] font-bold text-base text-[#18211E]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#66716D] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. FINAL CTA (Identical Typography Pattern) ──────────────────── */}
        <section className="py-36 md:py-48 atmo-cta border-t border-[rgba(24,33,30,0.06)]">
          <div className="container-tight flex flex-col items-center text-center">
            {/* Headline with exact 2-line desktop control */}
            <h2
              className="mx-auto max-w-2xl text-center font-[family-name:var(--font-manrope)] font-extrabold tracking-[-0.035em] text-[#18211E] leading-[1.08]"
              style={{ fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)" }}
            >
              <span className="sm:block">Find a tutor your child</span>{" "}
              <span className="sm:block">learns well with.</span>
            </h2>

            {/* Subtitle with exact 2-line desktop control */}
            <p
              className="mt-6 mx-auto max-w-xl text-center text-[#66716D] leading-relaxed text-base"
            >
              <span className="sm:block">Thoughtful 1-on-1 tutoring, online or at home,</span>{" "}
              <span className="sm:block">with a free 30-minute online demo.</span>
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/tutors"
                className="btn btn-primary min-h-[54px] px-9 text-sm font-bold gap-2 shadow-[0_6px_24px_rgba(35,107,91,0.28)]"
              >
                <span>Find a Tutor</span>
                <IconArrowRight size={15} />
              </Link>
              <Link
                href="/demo/book"
                className="btn btn-outline min-h-[54px] px-8 text-sm font-bold"
              >
                Book a Free Demo
              </Link>
            </div>

            <p className="mt-8 text-xs text-[#9BAAA5] text-center">
              Free 30-minute demo &bull; 1-on-1 dedicated attention &bull; No subscription lock-in
            </p>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}