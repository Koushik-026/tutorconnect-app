import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SubjectCard } from "@/components/subject-card";
import { TutorCard } from "@/components/tutor-card";
import { subjects, tutors } from "@/lib/data";
import {
  IconShieldCheck,
  IconVideo,
  IconHomeTuition,
  IconArrowRight,
  IconSearch,
  IconStar,
  IconCheck,
  IconCalendar,
  IconClock,
  IconSparkles,
} from "@/components/ui/icons";

export default function HomePage() {
  const featuredTutors = tutors.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE]">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* =====================================================
            1. HERO SECTION: Editorial Headline + Paper Bloom Learning Map
        ====================================================== */}
        <section className="relative overflow-hidden border-b border-[#E4DED4] py-12 md:py-18 lg:py-22">
          {/* Subtle Ambient Warm Background Blobs (Soft Sage & Plum Tints) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#EFEAF8]/60 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-12 h-96 w-96 rounded-full bg-[#E6F0EA]/50 blur-3xl"
          />

          <div className="container-shell relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
              {/* Left Column: Strong Editorial Intent */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#66518A]/25 bg-[#EFEAF8] px-3.5 py-1.5 text-xs font-bold text-[#4E3C70] shadow-xs">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#66518A] text-white">
                    <IconShieldCheck size={11} />
                  </span>
                  <span>Hyderabad Mentorship &bull; Free 30-Min Demos</span>
                </div>

                <h1 className="mt-5 font-[family-name:var(--font-manrope)] text-4xl font-extrabold tracking-tight text-[#232520] sm:text-5xl lg:text-[3.65rem] lg:leading-[1.1]">
                  Where dedicated mentorship meets{" "}
                  <span className="text-[#66518A] underline decoration-[#B7A5DE]/60 decoration-wavy decoration-2 underline-offset-6">
                    student momentum.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#676B64] sm:text-lg">
                  1-on-1 online classes and verified in-home tuition tailored to CBSE &amp; ICSE curriculums. Experience a free 30-minute demo before establishing your weekly routine.
                </p>

                {/* High-Confidence Search & Action Bar */}
                <form
                  action="/tutors"
                  method="GET"
                  className="mt-8 rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-2.5 shadow-sm shadow-[#232520]/5 sm:flex sm:items-center sm:gap-2 sm:p-2"
                >
                  <div className="flex flex-1 items-center gap-2.5 px-3 py-2">
                    <IconSearch size={18} className="text-[#989C94] shrink-0" />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject (e.g. Mathematics, Science)"
                      className="w-full text-sm font-semibold text-[#232520] placeholder:text-[#989C94] focus:outline-hidden"
                    />
                  </div>

                  <div className="hidden h-8 w-px bg-[#E4DED4] sm:block" />

                  <div className="flex flex-1 items-center gap-2 px-3 py-2">
                    <select
                      name="mode"
                      className="w-full bg-transparent text-sm font-semibold text-[#676B64] focus:outline-hidden"
                      defaultValue=""
                    >
                      <option value="">Any Mode (Online or Home)</option>
                      <option value="online">Online Tuition</option>
                      <option value="home">Home Tuition</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto shrink-0 mt-2 sm:mt-0 font-extrabold"
                  >
                    <span>Find Your Tutor</span>
                    <IconArrowRight size={15} />
                  </button>
                </form>

                {/* Micro-Trust Highlights */}
                <div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-bold text-[#676B64]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E9F5EF] text-[#2E7D5B]">
                      <IconCheck size={12} />
                    </span>
                    <span>Identity &amp; Qualification Verified</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EFEAF8] text-[#66518A]">
                      <IconCheck size={12} />
                    </span>
                    <span>Zero Obligation Free Demo</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FBE9DF] text-[#A64E28]">
                      <IconCheck size={12} />
                    </span>
                    <span>Classes 6–12 &bull; CBSE / ICSE</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Distinctive Paper Bloom Learning Map */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Outer Warm Paper Panel */}
                  <div className="relative rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-sm">
                    {/* Top Status Header */}
                    <div className="flex items-center justify-between border-b border-[#ECE6DC] pb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-[#2E7D5B] animate-pulse" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#66518A]">
                          Active Learning Match
                        </span>
                      </div>
                      <span className="rounded-full bg-[#F4F0FB] px-2.5 py-0.5 text-[11px] font-bold text-[#554477] border border-[#B7A5DE]/30">
                        Class 10 CBSE
                      </span>
                    </div>

                    {/* Central Tutor Dossier Vignette */}
                    <div className="mt-5 rounded-2xl border border-[#E4DED4] bg-[#F7F4EE]/60 p-4.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div
                            aria-hidden="true"
                            className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#66518A] via-[#554173] to-[#4F7867] text-base font-extrabold text-white shadow-xs"
                          >
                            AS
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#232520]">
                                Ananya Sharma
                              </h3>
                              <span title="Verified Tutor Profile" className="text-[#2E7D5B]">
                                <IconShieldCheck size={16} />
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#676B64]">
                              Mathematics &amp; Science &bull; 8y exp
                            </p>
                            <p className="text-[11px] text-[#989C94] mt-0.5">
                              B.N. Reddy Nagar, Hyderabad
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 rounded-lg bg-[#FDF4E5] px-2 py-1 text-xs font-extrabold text-[#965C12] border border-[#C27A1B]/30 shrink-0">
                          <IconStar size={13} className="text-[#C27A1B]" />
                          <span>4.9</span>
                        </div>
                      </div>

                      {/* Learning Schedule Milestone Strip */}
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FFFEFB] border border-[#E4DED4] p-3 text-xs">
                        <div className="flex items-center gap-2 text-[#676B64]">
                          <IconCalendar size={15} className="text-[#66518A]" />
                          <span className="font-semibold">Upcoming 30m Demo</span>
                        </div>
                        <span className="font-bold text-[#2E7D5B]">Today, 4:00 PM</span>
                      </div>
                    </div>

                    {/* Offset Asymmetric Learning Notes & Modality Badges */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-[#E4DED4] bg-[#E6F0EA]/40 p-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E6153]">
                          <IconHomeTuition size={15} />
                          <span>Home Tuition</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#676B64]">
                          Within 5 km radius of tutor residence.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E4DED4] bg-[#FBE9DF]/40 p-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#A64E28]">
                          <IconVideo size={15} />
                          <span>Digital Class</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#676B64]">
                          Interactive 1-on-1 whiteboard &amp; notes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            2. WHY TUTORCONNECT FEELS DIFFERENT (Editorial Perspective)
        ====================================================== */}
        <section className="py-16 md:py-22 border-b border-[#E4DED4] bg-[#FFFEFB]">
          <div className="container-shell">
            <div className="grid gap-12 lg:grid-cols-12 items-start">
              {/* Left Column: Editorial Thesis */}
              <div className="lg:col-span-5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#66518A]">
                  The TutorConnect Approach
                </span>
                <h2 className="mt-3 font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[#232520] sm:text-4xl leading-tight">
                  Built for steady academic confidence, not hurried cramming.
                </h2>
                <p className="mt-4 text-base text-[#676B64] leading-relaxed">
                  Every child learns at an individualized rhythm. We strip away mass-market video lectures and impersonal batch tuition, replacing them with genuine human accountability.
                </p>
                <div className="mt-6">
                  <Link
                    href="/tutors"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#66518A] hover:text-[#4E3C70] transition-colors"
                  >
                    <span>Browse available educators</span>
                    <IconArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Right Column: 3 Contrasting Principles (Varied Containment) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-[#E4DED4] bg-[#F7F4EE] p-6 transition hover:border-[#66518A]/40">
                  <div className="flex items-start gap-4">
                    <span className="font-[family-name:var(--font-manrope)] text-2xl font-black text-[#66518A]/40">
                      01
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520]">
                        True 1-on-1 Chemistry
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#676B64]">
                        Tutors adapt their explanations in real time to the student&apos;s doubts. No peer pressure, no hesitation to ask foundational questions, and zero skipped concepts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4DED4] bg-[#F7F4EE] p-6 transition hover:border-[#4F7867]/40">
                  <div className="flex items-start gap-4">
                    <span className="font-[family-name:var(--font-manrope)] text-2xl font-black text-[#4F7867]/40">
                      02
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520]">
                        Curriculum-Specific Expertise
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#676B64]">
                        Educators who specialize directly in CBSE, ICSE, and State Board frameworks, ensuring school exams, internal assessments, and board patterns are systematically mastered.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4DED4] bg-[#F7F4EE] p-6 transition hover:border-[#E99873]/40">
                  <div className="flex items-start gap-4">
                    <span className="font-[family-name:var(--font-manrope)] text-2xl font-black text-[#E99873]/40">
                      03
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520]">
                        Flexible Class Packages (45-Day Validity)
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#676B64]">
                        Transparent 8, 12, and 15-class packages starting from ₹3,200. No locked-in monthly auto-renewals. Schedule regular routines that fit around school tests and sports.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            3. HOW MATCHING WORKS (Paper Bloom Stationery Steps)
        ====================================================== */}
        <section id="how-it-works" className="py-16 md:py-22 border-b border-[#E4DED4] bg-[#F7F4EE]">
          <div className="container-shell">
            <div className="max-w-2xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#66518A]">
                Careful Matching Workflow
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[#232520] sm:text-4xl">
                Four simple steps to consistent learning
              </h2>
              <p className="mt-3 text-base text-[#676B64]">
                Evaluate mentor suitability before making any financial commitment.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Find your ideal mentor",
                  desc: "Filter by subject, grade level (Classes 6–12), curriculum (CBSE, ICSE, State), and in-person travel radius.",
                  badge: "Discovery",
                  color: "border-[#66518A]/20 bg-[#FFFEFB]",
                },
                {
                  step: "02",
                  title: "Attend a free 30-min demo",
                  desc: "Connect 1-on-1 in our interactive digital classroom to test communication chemistry and conceptual approach.",
                  badge: "Evaluation",
                  color: "border-[#4F7867]/20 bg-[#FFFEFB]",
                },
                {
                  step: "03",
                  title: "Confirm your weekly routine",
                  desc: "Select an 8, 12, or 15-class package. Choose preferred weekly days for either online classes or home visits.",
                  badge: "Routine",
                  color: "border-[#E99873]/20 bg-[#FFFEFB]",
                },
                {
                  step: "04",
                  title: "Track steady mastery",
                  desc: "Access lesson notes, assigned practice problems, and parent progress reviews in your student learning workspace.",
                  badge: "Momentum",
                  color: "border-[#B7A5DE]/20 bg-[#FFFEFB]",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`relative flex flex-col justify-between rounded-2xl border ${item.color} p-6 shadow-xs transition hover:border-[#66518A]/40`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-manrope)] text-2xl font-black text-[#66518A]">
                        {item.step}
                      </span>
                      <span className="rounded-full bg-[#F7F4EE] px-2 py-0.5 text-[10px] font-bold text-[#676B64] border border-[#E4DED4]">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-base font-bold text-[#232520]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#676B64]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            4. POPULAR SUBJECTS (Subject Visual System)
        ====================================================== */}
        <section id="subjects" className="py-16 md:py-22 border-b border-[#E4DED4] bg-[#FFFEFB]">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#4F7867]">
                  Curriculum Coverage
                </span>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[#232520] sm:text-4xl">
                  Popular subjects taught
                </h2>
                <p className="mt-2 text-base text-[#676B64]">
                  From foundational secondary STEM to language arts and programming.
                </p>
              </div>

              <Link
                href="/tutors"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#66518A] hover:text-[#4E3C70] transition-colors"
              >
                <span>View all subjects</span>
                <IconArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            5. FEATURED VERIFIED TUTORS (Editorial Dossier Grid)
        ====================================================== */}
        <section className="py-16 md:py-22 border-b border-[#E4DED4] bg-[#F7F4EE]">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#66518A]">
                  Reviewed Profiles
                </span>
                <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[#232520] sm:text-4xl">
                  Meet our verified educators
                </h2>
                <p className="mt-2 text-base text-[#676B64]">
                  Carefully vetted profiles with verified identity, subject qualifications, and student feedback.
                </p>
              </div>

              <Link
                href="/tutors"
                className="btn btn-secondary"
              >
                <span>Browse All Tutors</span>
                <IconArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            6. ONLINE VS IN-PERSON HOME LEARNING (Comparative Rhythm)
        ====================================================== */}
        <section className="py-16 md:py-22 border-b border-[#E4DED4] bg-[#FFFEFB]">
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#66518A]">
                Dual Modality Choice
              </span>
              <h2 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[#232520] sm:text-4xl">
                Online tuition vs. home tuition
              </h2>
              <p className="mt-3 text-base text-[#676B64]">
                Choose the format that best fits your student&apos;s daily routine and concentration style.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* Online Tuition Box */}
              <div className="rounded-3xl border border-[#E4DED4] bg-[#F7F4EE] p-8 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFEAF8] text-[#66518A]">
                  <IconVideo size={24} />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-xl font-bold text-[#232520]">
                  1-on-1 Online Tuition
                </h3>
                <p className="mt-2 text-sm text-[#676B64]">
                  Ideal for students who thrive in focused, screen-shared digital environments with interactive notes.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-[#232520]">
                  <li className="flex items-center gap-2.5">
                    <IconCheck size={16} className="text-[#66518A] shrink-0" />
                    <span>Access top tutors across any Hyderabad locality</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IconCheck size={16} className="text-[#66518A] shrink-0" />
                    <span>Interactive whiteboard and digital concept notes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IconCheck size={16} className="text-[#66518A] shrink-0" />
                    <span>Zero travel time; fits easily between sports and dinner</span>
                  </li>
                </ul>
              </div>

              {/* Home Tuition Box */}
              <div className="rounded-3xl border border-[#E4DED4] bg-[#F7F4EE] p-8 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F0EA] text-[#4F7867]">
                  <IconHomeTuition size={24} />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-manrope)] text-xl font-bold text-[#232520]">
                  In-Person Home Tuition
                </h3>
                <p className="mt-2 text-sm text-[#676B64]">
                  Dedicated in-home mentorship for students who benefit from physical presence, notebook inspection, and disciplined structure.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-[#232520]">
                  <li className="flex items-center gap-2.5">
                    <IconCheck size={16} className="text-[#4F7867] shrink-0" />
                    <span>Tutors located within your neighborhood travel radius</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IconCheck size={16} className="text-[#4F7867] shrink-0" />
                    <span>Direct notebook inspection and handwritten practice</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <IconCheck size={16} className="text-[#4F7867] shrink-0" />
                    <span>Face-to-face feedback with parents after regular classes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            7. TRUST & SAFETY ASSURANCE PANEL
        ====================================================== */}
        <section className="py-14 border-b border-[#E4DED4] bg-[#F7F4EE]">
          <div className="container-shell">
            <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-8 sm:p-10 shadow-xs">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFEAF8] text-[#66518A]">
                    <IconShieldCheck size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#232520] text-sm">Verified Credentials</h4>
                    <p className="mt-1 text-xs text-[#676B64] leading-relaxed">
                      Every tutor profile undergoes manual identity checks and academic qualification reviews prior to listing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E6F0EA] text-[#4F7867]">
                    <IconSparkles size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#232520] text-sm">Zero Obligation Demo</h4>
                    <p className="mt-1 text-xs text-[#676B64] leading-relaxed">
                      Experience teaching style and compatibility in a free 30-minute online session before booking any package.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBE9DF] text-[#A64E28]">
                    <IconClock size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#232520] text-sm">Support Assistance</h4>
                    <p className="mt-1 text-xs text-[#676B64] leading-relaxed">
                      Support available if you need help with your tuition arrangement or scheduling assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            8. FINAL CALL TO ACTION (Warm Paper Bloom Light Theme)
        ====================================================== */}
        <section className="py-16 md:py-20 bg-[#EFEAF8] border-b border-[#E4DED4]">
          <div className="container-shell text-center max-w-2xl">
            <span className="inline-block rounded-full bg-[#FFFEFB] border border-[#66518A]/20 px-3.5 py-1 text-xs font-bold text-[#4E3C70] shadow-xs">
              Free 30-Minute Online Evaluation
            </span>

            <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl font-extrabold sm:text-4xl text-[#232520]">
              Ready to find the right tutor for your child?
            </h2>

            <p className="mt-3 text-base text-[#676B64] max-w-lg mx-auto">
              Book a 30-minute online demo class today. No credit card required, no automated renewal.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tutors"
                className="btn btn-primary min-h-[48px] px-6 text-sm font-extrabold shadow-sm gap-2"
              >
                <span>Find Your Tutor</span>
                <IconArrowRight size={16} />
              </Link>

              <Link
                href="/auth?role=tutor"
                className="btn btn-secondary min-h-[48px] px-6 text-sm font-bold"
              >
                <span>Join as a Tutor</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
