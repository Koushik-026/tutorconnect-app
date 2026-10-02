import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroComposer } from "@/components/hero-composer";
import { TutorCard } from "@/components/tutor-card";
import { tutors } from "@/lib/data";
import {
  IconShieldCheck,
  IconVideo,
  IconHomeTuition,
  IconArrowRight,
  IconStar,
  IconCheck,
  IconSparkles,
  IconCalendar,
  IconClock,
  SubjectIcon,
} from "@/components/ui/icons";

export default function HomePage() {
  const featuredTutors = tutors.slice(0, 3);

  const subjectShowcase = [
    {
      name: "Mathematics",
      grades: "Classes 6 - 12 (CBSE, ICSE, State)",
      fieldBg: "bg-[#EEE7FF]",
      accentText: "text-[#594282]",
      badgeBg: "bg-[#7257A5]/10",
      description: "Concept building, algebra, geometry, calculus, and board exam speed.",
      href: "/tutors?subject=Mathematics",
    },
    {
      name: "Science",
      grades: "Classes 6 - 10 (CBSE, ICSE, State)",
      fieldBg: "bg-[#E5F0EA]",
      accentText: "text-[#3D5A4D]",
      badgeBg: "bg-[#5D806F]/10",
      description: "Fundamental physics, chemistry, biology, and experimental curiosity.",
      href: "/tutors?subject=Science",
    },
    {
      name: "Physics",
      grades: "Classes 9 - 12 (CBSE & ICSE)",
      fieldBg: "bg-[#E4F1FA]",
      accentText: "text-[#2C5282]",
      badgeBg: "bg-[#3182CE]/10",
      description: "Mechanics, thermodynamics, electrodynamics, and numerical problem solving.",
      href: "/tutors?subject=Physics",
    },
    {
      name: "Chemistry",
      grades: "Classes 9 - 12 (CBSE & ICSE)",
      fieldBg: "bg-[#FCE7DE]",
      accentText: "text-[#A85834]",
      badgeBg: "bg-[#EFA17F]/15",
      description: "Physical, organic, and inorganic chemistry with clear reaction mechanisms.",
      href: "/tutors?subject=Chemistry",
    },
    {
      name: "English",
      grades: "Classes 6 - 12 (All Boards)",
      fieldBg: "bg-[#F7E9BE]/50",
      accentText: "text-[#7A5812]",
      badgeBg: "bg-[#D4A328]/15",
      description: "Grammar mastery, literature analysis, critical writing, and expression.",
      href: "/tutors?subject=English",
    },
    {
      name: "Computer Science",
      grades: "Classes 8 - 12 (Python & Java)",
      fieldBg: "bg-[#F4F0FF]",
      accentText: "text-[#594282]",
      badgeBg: "bg-[#7257A5]/10",
      description: "Computational logic, Python programming, Java fundamentals, and school practicals.",
      href: "/tutors?subject=Computer+Science",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF8]">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* =====================================================
            1. HERO SECTION: Airy, Confident, Dominant Match Composer
        ====================================================== */}
        <section className="relative overflow-hidden pt-6 pb-20 md:pt-10 md:pb-28 lg:pb-36 bg-gradient-to-b from-[#EEE7FF]/35 via-[#FCFBF8] to-[#FCFBF8]">
          {/* Ambient soft background fields */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-0 h-[450px] w-[450px] rounded-full bg-[#EEE7FF]/60 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-16 h-[400px] w-[400px] rounded-full bg-[#E5F0EA]/40 blur-3xl"
          />

          <div className="container-shell relative z-10">
            {/* Header Content with tightened tracking and large display scale */}
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#7257A5]/20 bg-white/90 px-4 py-1.5 text-xs font-bold text-[#594282] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#7257A5] text-white">
                  <IconShieldCheck size={11} />
                </span>
                <span>Hyderabad Mentorship &bull; Verified Profiles &bull; Free 30-Min Demo</span>
              </div>

              <h1 className="mt-6 font-[family-name:var(--font-manrope)] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.035em] text-[#20221F] leading-[1.08]">
                Find the tutor your child{" "}
                <span className="text-[#7257A5] underline decoration-[#EEE7FF] decoration-wavy decoration-2 underline-offset-8">
                  actually learns well with.
                </span>
              </h1>

              <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-[#6D706A]">
                Thoughtfully curated 1-on-1 online and in-home tuition for school students in Hyderabad. Connect with vetted educators, attend a free 30-minute demo, and establish a steady learning rhythm.
              </p>
            </div>

            {/* Dominant Focal Object: Tutor Requirement Composer */}
            <div className="mt-10 md:mt-14">
              <HeroComposer />
            </div>

            {/* Restrained Value Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-[#6D706A]">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5F0EA] text-[#3D5A4D]">
                  <IconCheck size={12} />
                </span>
                <span>1-on-1 Dedicated Attention</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEE7FF] text-[#594282]">
                  <IconVideo size={12} />
                </span>
                <span>Free 30-min Online Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FCE7DE] text-[#A85834]">
                  <IconHomeTuition size={12} />
                </span>
                <span>Home Tuition in Eligible Areas</span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            2. LARGE EDITORIAL STATEMENT: Generous Space, Zero Clutter
        ====================================================== */}
        <section className="py-24 md:py-36 border-y border-[rgba(54,48,60,0.08)] bg-white">
          <div className="container-shell">
            <div className="mx-auto max-w-4xl text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#7257A5]">
                Our Core Belief
              </span>
              <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#20221F] leading-[1.15]">
                &ldquo;Tuition should feel personal, not crowded.&rdquo;
              </h2>
              <p className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-[#6D706A] leading-relaxed">
                Every student processes concepts differently. Rather than batch coaching classes where doubt resolution is rushed, TutorConnect pairs your child with dedicated 1-on-1 educators who adapt to their pace, curriculum, and exam goals.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            3. MATCHING STORY: Split Editorial + Miniature Product Visual
        ====================================================== */}
        <section id="how-it-works" className="py-24 md:py-32 bg-[#FCFBF8]">
          <div className="container-shell">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Editorial Explanation */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#5D806F]">
                    01 / The Matching Philosophy
                  </span>
                  <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20221F] leading-tight">
                    Start with how the student grasps concepts.
                  </h2>
                </div>

                <p className="text-base text-[#6D706A] leading-relaxed">
                  We look beyond simple subject tags. We identify your child&apos;s curriculum requirements, conceptual hesitation points, and preferred learning tempo before introducing the right tutor.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEE7FF] text-xs font-extrabold text-[#594282]">
                      1
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#20221F]">Diagnostic Understanding</h4>
                      <p className="mt-0.5 text-xs text-[#6D706A]">
                        We review class level, board alignment (CBSE, ICSE, State), and specific syllabus areas needing clarity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5F0EA] text-xs font-extrabold text-[#3D5A4D]">
                      2
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#20221F]">Pedagogy &amp; Pacing Alignment</h4>
                      <p className="mt-0.5 text-xs text-[#6D706A]">
                        Match with educators who excel at step-by-step intuition, problem practice, or foundational revision.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FCE7DE] text-xs font-extrabold text-[#A85834]">
                      3
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#20221F]">Free 30-Minute Trial</h4>
                      <p className="mt-0.5 text-xs text-[#6D706A]">
                        Attend an online demo to confirm student-tutor compatibility before committing to any package.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/tutors"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#7257A5] hover:text-[#594282] transition"
                  >
                    <span>Browse available educators</span>
                    <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Miniature Match Product Mockup */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl border border-[rgba(54,48,60,0.12)] bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-5">
                  {/* Step 1 Requirement Card */}
                  <div className="rounded-2xl border border-[rgba(54,48,60,0.08)] bg-[#FCFBF8] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A]">
                        Student Profile
                      </span>
                      <span className="rounded-full bg-[#EEE7FF] px-2.5 py-0.5 text-[11px] font-bold text-[#594282]">
                        Active Inquiry
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#20221F]">Aarav Reddy</p>
                        <p className="text-xs text-[#6D706A]">Class 9 &bull; CBSE &bull; Mathematics &amp; Science</p>
                      </div>
                      <span className="text-xs font-semibold text-[#5D806F]">Hyderabad</span>
                    </div>
                  </div>

                  {/* Compatibility Signals Connector */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="h-px flex-1 bg-[rgba(54,48,60,0.10)]" />
                    <span className="rounded-full bg-[#E5F0EA] px-3 py-1 text-[11px] font-bold text-[#3D5A4D]">
                      High Pedagogical Match
                    </span>
                    <div className="h-px flex-1 bg-[rgba(54,48,60,0.10)]" />
                  </div>

                  {/* Matched Educator Card */}
                  <div className="rounded-2xl border border-[#7257A5]/25 bg-[#EEE7FF]/30 p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7257A5] text-sm font-bold text-white shadow-xs">
                          AS
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-[#20221F]">Ananya Sharma</p>
                            <span className="text-[#7257A5]">
                              <IconShieldCheck size={14} />
                            </span>
                          </div>
                          <p className="text-xs text-[#6D706A]">Mathematics &amp; Science &bull; 8+ Yrs Exp</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#20221F] shadow-2xs">
                        <IconStar size={12} className="text-[#D4A328]" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#6D706A] leading-relaxed">
                      Specializes in concept intuition and CBSE board exam clarity for Class 9 &amp; 10 students.
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="font-semibold text-[#5D806F]">Online &amp; Eligible Home Tuition</span>
                      <Link
                        href="/demo/book?tutor=ananya-sharma"
                        className="font-bold text-[#7257A5] hover:underline"
                      >
                        Book Free Trial &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            4. FREE DEMO STORY: Reverse Split (Visual Left, Narrative Right)
        ====================================================== */}
        <section className="py-24 md:py-32 border-y border-[rgba(54,48,60,0.08)] bg-white">
          <div className="container-shell">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Demo Product Experience Mockup */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="rounded-3xl border border-[rgba(54,48,60,0.12)] bg-[#FCFBF8] p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-4">
                  {/* Top Bar of Simulated Demo Tool */}
                  <div className="flex items-center justify-between border-b border-[rgba(54,48,60,0.08)] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#5D806F]" />
                      <span className="text-xs font-bold text-[#20221F]">Free 30-Min Trial Session</span>
                    </div>
                    <span className="rounded-full bg-[#E5F0EA] px-2.5 py-0.5 text-[11px] font-bold text-[#3D5A4D]">
                      Zero Payment Required
                    </span>
                  </div>

                  {/* Simulated Classroom Viewport */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#20221F] text-white p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="font-medium">1-on-1 Concept Review</span>
                      <span className="flex items-center gap-1 rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                        <IconClock size={10} />
                        30:00
                      </span>
                    </div>

                    <div className="text-center my-auto">
                      <p className="text-xs uppercase tracking-wider text-[#EEE7FF] font-semibold">Live Whiteboard &amp; Video</p>
                      <p className="text-sm font-bold mt-1 text-white">Diagnostic Session: Quadratic Equations</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>Tutor: Ananya S.</span>
                      <span>Student: Aarav R.</span>
                    </div>
                  </div>

                  {/* Demo Value Confirmation */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="rounded-xl border border-[rgba(54,48,60,0.08)] bg-white p-2.5">
                      <p className="font-extrabold text-[#20221F]">30 Mins</p>
                      <p className="text-[10px] text-[#6D706A]">1-on-1 Focus</p>
                    </div>
                    <div className="rounded-xl border border-[rgba(54,48,60,0.08)] bg-white p-2.5">
                      <p className="font-extrabold text-[#5D806F]">100% Free</p>
                      <p className="text-[10px] text-[#6D706A]">No Credit Card</p>
                    </div>
                    <div className="rounded-xl border border-[rgba(54,48,60,0.08)] bg-white p-2.5">
                      <p className="font-extrabold text-[#7257A5]">Direct Rapport</p>
                      <p className="text-[10px] text-[#6D706A]">Evaluate Chemistry</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative */}
              <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#7257A5]">
                    02 / Zero-Obligation Demo
                  </span>
                  <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20221F] leading-tight">
                    Try the tutor first. No payment required.
                  </h2>
                </div>

                <p className="text-base text-[#6D706A] leading-relaxed">
                  Choosing a tutor is a personal decision. A free 30-minute online demo gives your child the opportunity to experience the educator&apos;s teaching style, discuss upcoming syllabus milestones, and see if the connection feels natural.
                </p>

                <ul className="space-y-3 text-sm text-[#20221F]">
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5F0EA] text-[#3D5A4D]">
                      <IconCheck size={12} />
                    </span>
                    <span>1-on-1 focused live video session with screen sharing</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5F0EA] text-[#3D5A4D]">
                      <IconCheck size={12} />
                    </span>
                    <span>Direct discussion on strengths, syllabus goals, and weekly pace</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E5F0EA] text-[#3D5A4D]">
                      <IconCheck size={12} />
                    </span>
                    <span>Zero upfront commitment: purchase a package only if you are completely satisfied</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    href="/demo/book"
                    className="btn btn-primary min-h-[46px] px-6 rounded-full text-xs font-bold shadow-[0_4px_16px_rgba(114,87,165,0.22)]"
                  >
                    <span>Book a Free 30-Min Demo</span>
                    <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            5. ONLINE + HOME STORY: Unified Dual-Branch Experience
        ====================================================== */}
        <section id="modes" className="py-24 md:py-32 bg-[#FCFBF8]">
          <div className="container-shell">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#EFA17F]">
                03 / Learning Environment
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20221F]">
                Two flexible modes. One uncompromising standard.
              </h2>
              <p className="mt-4 text-base text-[#6D706A] leading-relaxed">
                Whether your student prefers interactive online mentorship or in-person guidance at home in Hyderabad, we support both with vetted educators and flexible weekly rhythms.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2">
              {/* Online Mode Panel */}
              <div className="rounded-3xl border border-[rgba(54,48,60,0.10)] bg-white p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.02)] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE7FF] text-[#594282]">
                    <IconVideo size={22} />
                  </div>
                  <span className="rounded-full bg-[#EEE7FF] px-3 py-1 text-xs font-bold text-[#594282]">
                    Universal Access
                  </span>
                </div>

                <div>
                  <h3 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#20221F]">
                    Online Tuition
                  </h3>
                  <p className="mt-2 text-sm text-[#6D706A] leading-relaxed">
                    Interactive 1-on-1 virtual sessions featuring digital lesson notes, screen sharing, and comfortable scheduling without commute friction.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[rgba(54,48,60,0.08)] text-xs text-[#20221F]">
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#5D806F]" />
                    <span>Free 30-min online demo for every new tutor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#5D806F]" />
                    <span>Digital lesson notes when shared by tutor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#5D806F]" />
                    <span>Available across Hyderabad &amp; all regions</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/tutors?mode=online"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7257A5] hover:text-[#594282] transition"
                  >
                    <span>Browse Online Tutors</span>
                    <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Home Mode Panel */}
              <div className="rounded-3xl border border-[rgba(54,48,60,0.10)] bg-white p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.02)] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCE7DE] text-[#A85834]">
                    <IconHomeTuition size={22} />
                  </div>
                  <span className="rounded-full bg-[#FCE7DE] px-3 py-1 text-xs font-bold text-[#A85834]">
                    Hyderabad In-Person
                  </span>
                </div>

                <div>
                  <h3 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#20221F]">
                    Eligible Home Tuition
                  </h3>
                  <p className="mt-2 text-sm text-[#6D706A] leading-relaxed">
                    Qualified educators visit your home in person for disciplined, distraction-free study within designated Hyderabad localities.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[rgba(54,48,60,0.08)] text-xs text-[#20221F]">
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#5D806F]" />
                    <span>In-person mentor visits your residence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#5D806F]" />
                    <span>Coverage in Madhapur, Gachibowli, Jubilee Hills, Banjara Hills, Kondapur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCheck size={14} className="text-[#5D806F]" />
                    <span>Subject to tutor offering &amp; locality radius eligibility</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/tutors?mode=home"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EFA17F] hover:text-[#DE8E6A] transition"
                  >
                    <span>Browse Home Tutors</span>
                    <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            6. SUBJECT & TUTOR SHOWCASE: Low-Saturation Field Tiles
        ====================================================== */}
        <section className="py-24 md:py-32 border-t border-[rgba(54,48,60,0.08)] bg-white">
          <div className="container-shell">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#7257A5]">
                  04 / Curriculum Scope
                </span>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20221F]">
                  Explore subjects by learning field.
                </h2>
              </div>
              <Link
                href="/tutors"
                className="text-xs font-bold text-[#7257A5] hover:underline flex items-center gap-1"
              >
                <span>View all subjects</span>
                <IconArrowRight size={13} />
              </Link>
            </div>

            {/* Subject Field Tiles */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjectShowcase.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  className="group rounded-3xl border border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.fieldBg} ${s.accentText}`}>
                      <SubjectIcon name={s.name} size={22} />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${s.badgeBg} ${s.accentText}`}>
                      CBSE &bull; ICSE
                    </span>
                  </div>

                  <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-xl font-bold text-[#20221F] group-hover:text-[#7257A5] transition-colors">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#6D706A]">{s.grades}</p>
                  <p className="mt-3 text-xs text-[#6D706A] leading-relaxed">{s.description}</p>

                  <div className="mt-5 pt-3 border-t border-[rgba(54,48,60,0.06)] flex items-center justify-between text-xs font-bold text-[#7257A5]">
                    <span>Find {s.name} Tutors</span>
                    <IconArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured Tutors Mini Grid */}
            <div className="mt-20">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#5D806F]">
                    Educators in Hyderabad
                  </span>
                  <h3 className="mt-1 font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#20221F]">
                    Meet vetted mentors ready to guide.
                  </h3>
                </div>
                <Link
                  href="/tutors"
                  className="text-xs font-bold text-[#7257A5] hover:underline flex items-center gap-1"
                >
                  <span>See all educators</span>
                  <IconArrowRight size={13} />
                </Link>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {featuredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            7. LEARNING JOURNEY: Progressive Sequence (Not Boxed Bento)
        ====================================================== */}
        <section className="py-24 md:py-32 bg-[#FCFBF8]">
          <div className="container-shell">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#7257A5]">
                05 / Progression
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20221F]">
                From first match to steady academic momentum.
              </h2>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  step: "01",
                  title: "Find Tutor",
                  text: "Search by subject, class, board, and online/home preference.",
                  bg: "bg-[#EEE7FF]",
                  color: "text-[#594282]",
                },
                {
                  step: "02",
                  title: "Free Demo",
                  text: "Attend a 30-min online trial. Confirm rapport before committing.",
                  bg: "bg-[#E5F0EA]",
                  color: "text-[#3D5A4D]",
                },
                {
                  step: "03",
                  title: "Select Rhythm",
                  text: "Choose 8, 12, or 15 classes with 45-day validity and weekly slots.",
                  bg: "bg-[#FCE7DE]",
                  color: "text-[#A85834]",
                },
                {
                  step: "04",
                  title: "Master Concepts",
                  text: "1-on-1 focused study with lesson notes shared by tutor.",
                  bg: "bg-[#E4F1FA]",
                  color: "text-[#2C5282]",
                },
                {
                  step: "05",
                  title: "Track Progress",
                  text: "Review homework, class milestones, and syllabus momentum in workspace.",
                  bg: "bg-[#F7E9BE]/60",
                  color: "text-[#7A5812]",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-3xl border border-[rgba(54,48,60,0.10)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                >
                  <div>
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${item.bg} text-xs font-black ${item.color}`}>
                      {item.step}
                    </span>
                    <h4 className="mt-4 font-[family-name:var(--font-manrope)] text-base font-bold text-[#20221F]">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs text-[#6D706A] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            8. TRUST & VERIFICATION: Restrained Factual Standards
        ====================================================== */}
        <section className="py-20 md:py-28 border-t border-[rgba(54,48,60,0.08)] bg-white">
          <div className="container-shell">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#5D806F]">
                Trust &amp; Governance
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#20221F]">
                Factual standards you can rely on.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[rgba(54,48,60,0.08)] bg-[#FCFBF8] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEE7FF] text-[#594282]">
                  <IconShieldCheck size={18} />
                </span>
                <h4 className="mt-3 text-sm font-bold text-[#20221F]">Verified Tutor Profiles</h4>
                <p className="mt-1 text-xs text-[#6D706A] leading-relaxed">
                  Academic qualifications, teaching experience, and identity details are personally reviewed.
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(54,48,60,0.08)] bg-[#FCFBF8] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5F0EA] text-[#3D5A4D]">
                  <IconVideo size={18} />
                </span>
                <h4 className="mt-3 text-sm font-bold text-[#20221F]">Free 30-Min Demo</h4>
                <p className="mt-1 text-xs text-[#6D706A] leading-relaxed">
                  Experience the tutor&apos;s pedagogy in a live 1-on-1 trial before any payment is discussed.
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(54,48,60,0.08)] bg-[#FCFBF8] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FCE7DE] text-[#A85834]">
                  <IconCalendar size={18} />
                </span>
                <h4 className="mt-3 text-sm font-bold text-[#20221F]">No Lock-In Subscriptions</h4>
                <p className="mt-1 text-xs text-[#6D706A] leading-relaxed">
                  Packages of 8, 12, or 15 classes come with a 45-day validity window. No recurring billing.
                </p>
              </div>

              <div className="rounded-2xl border border-[rgba(54,48,60,0.08)] bg-[#FCFBF8] p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4F1FA] text-[#2C5282]">
                  <IconSparkles size={18} />
                </span>
                <h4 className="mt-3 text-sm font-bold text-[#20221F]">Tuition Support Assistance</h4>
                <p className="mt-1 text-xs text-[#6D706A] leading-relaxed">
                  Direct coordination support for parents and students throughout their learning journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            9. FINAL CTA: Atmospheric Light Field
        ====================================================== */}
        <section className="py-20 md:py-28 bg-[#FCFBF8]">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-3xl border border-[rgba(54,48,60,0.12)] bg-gradient-to-r from-[#EEE7FF]/40 via-[#FFFDF9] to-[#E5F0EA]/40 p-10 sm:p-14 lg:p-16 text-center shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#7257A5]">
                Get Started
              </span>
              <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#20221F]">
                Ready to give your child the right mentor?
              </h2>
              <p className="mt-4 mx-auto max-w-xl text-base sm:text-lg text-[#6D706A] leading-relaxed">
                Start with a free 30-minute online trial. Connect with verified Hyderabad educators without upfront payment.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/tutors"
                  className="btn btn-primary w-full sm:w-auto min-h-[50px] px-8 rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(114,87,165,0.22)]"
                >
                  <span>Find a Tutor</span>
                  <IconArrowRight size={15} />
                </Link>

                <Link
                  href="/demo/book"
                  className="btn btn-outline w-full sm:w-auto min-h-[50px] px-7 rounded-full text-sm font-bold"
                >
                  <span>Book a Free Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
