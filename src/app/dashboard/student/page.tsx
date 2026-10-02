"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconCalendar,
  IconClock,
  IconShieldCheck,
  IconArrowRight,
  IconChecklist,
  IconBookOpen,
  IconMessageSquare,
  IconCreditCard,
  IconSearch,
  IconSettings,
  IconHelpCircle,
} from "@/components/ui/icons";

const navigationItems = [
  { label: "Learning Space", icon: "home", href: "/dashboard/student", active: true },
  { label: "My Sessions", icon: "calendar", href: "#", active: false },
  { label: "Find Educators", icon: "search", href: "/tutors", active: false },
  { label: "Doubt Chat", icon: "messages", href: "#", active: false },
  { label: "Tuition Packages", icon: "payments", href: "#", active: false },
];

function NavIcon({ type, size = 18 }: { type: string; size?: number }) {
  switch (type) {
    case "calendar":
      return <IconCalendar size={size} />;
    case "search":
      return <IconSearch size={size} />;
    case "messages":
      return <IconMessageSquare size={size} />;
    case "payments":
      return <IconCreditCard size={size} />;
    case "settings":
      return <IconSettings size={size} />;
    case "help":
      return <IconHelpCircle size={size} />;
    default:
      return <IconBookOpen size={size} />;
  }
}

function StudentDashboardContent() {
  const searchParams = useSearchParams();

  const state = searchParams.get("state") === "active" ? "active" : "pre-demo";
  const activeClasses = Number(searchParams.get("classes")) || 15;
  const completedClasses = state === "active" ? 3 : 0;
  const remainingClasses = activeClasses - completedClasses;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showNotice(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  return (
    <div className="flex min-h-screen bg-[#FFFBF5] text-[#25231F]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl border border-[rgba(55,48,40,0.12)] bg-white p-4 shadow-xl text-xs font-semibold text-[#25231F] flex items-center gap-2 max-w-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4EEE9] text-[#244A40] shrink-0 font-bold">
            i
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Persistent Quiet Sidebar (w-64) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[rgba(55,48,40,0.08)] bg-white z-30">
        <div className="flex h-18 items-center px-6 border-b border-[rgba(55,48,40,0.06)]">
          <Logo />
        </div>

        {/* Sidebar Nav */}
        <nav aria-label="Student Navigation" className="flex-1 p-4 space-y-1.5">
          {navigationItems.map((item) => {
            if (item.href.startsWith("/")) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                    item.active
                      ? "bg-[#E4EEE9] text-[#244A40] shadow-2xs"
                      : "text-[#6F6A62] hover:bg-[#FFFBF5] hover:text-[#25231F]"
                  }`}
                >
                  <NavIcon type={item.icon} size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  showNotice(
                    `${item.label} workspace will be connected in upcoming platform modules.`
                  )
                }
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold text-[#6F6A62] hover:bg-[#FFFBF5] hover:text-[#25231F] transition-colors text-left"
              >
                <NavIcon type={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Profile Snapshot */}
        <div className="p-4 border-t border-[rgba(55,48,40,0.08)] space-y-2">
          <div className="flex items-center gap-3 rounded-2xl bg-[#FFFBF5] p-3 border border-[rgba(55,48,40,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#315F52] font-extrabold text-white text-xs">
              AR
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#25231F]">Aarav Reddy</p>
              <p className="truncate text-[11px] text-[#6F6A62]">Class 9 &bull; CBSE</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#6F6A62]">
            <button
              type="button"
              onClick={() => showNotice("Settings preferences.")}
              className="hover:text-[#25231F]"
            >
              Settings
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => showNotice("TutorConnect tuition support assistance is active.")}
              className="hover:text-[#25231F]"
            >
              Support
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-28 lg:pb-16">
        {/* Mobile Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[rgba(55,48,40,0.08)] bg-white/95 px-4 backdrop-blur-md lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#315F52] text-xs font-extrabold text-white">
              AR
            </span>
          </div>
        </header>

        <main className="container-shell max-w-5xl py-8 md:py-12 space-y-8">
          {/* Welcome & State Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#315F52]">
                My Learning Space
              </span>
              <h1 className="mt-1 font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                Welcome back, Aarav.
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#6F6A62]">
                {state === "active"
                  ? "Your active tuition rhythm is on track. Keep up the weekly momentum!"
                  : "Your free 30-minute diagnostic demo with Ananya Sharma is scheduled."}
              </p>
            </div>

            {/* Prototype State Toggle */}
            <div className="flex items-center gap-2 self-start rounded-full border border-[rgba(55,48,40,0.10)] bg-white p-1 text-xs">
              <Link
                href="/dashboard/student"
                className={`rounded-full px-3 py-1 font-bold transition ${
                  state === "pre-demo"
                    ? "bg-[#315F52] text-white"
                    : "text-[#6F6A62] hover:text-[#25231F]"
                }`}
              >
                Pre-Demo View
              </Link>
              <Link
                href="/dashboard/student?state=active&classes=15&amount=5400"
                className={`rounded-full px-3 py-1 font-bold transition ${
                  state === "active"
                    ? "bg-[#315F52] text-white"
                    : "text-[#6F6A62] hover:text-[#25231F]"
                }`}
              >
                Active Routine View
              </Link>
            </div>
          </div>

          {/* =====================================================
              1. DOMINANT NEXT-CLASS COMPOSITION (Visual Priority #1)
          ====================================================== */}
          <section className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-6 sm:p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Left Portion: Session Focus & Topic */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#E3EADD] px-3 py-0.5 text-xs font-bold text-[#244A40]">
                    {state === "active" ? "Next Scheduled Class" : "Upcoming Free Trial"}
                  </span>
                  <span className="text-xs font-semibold text-[#6F6A62]">
                    {state === "active" ? "Class 4 of 15" : "30-Minute Online Trial"}
                  </span>
                </div>

                <h2 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F] leading-tight">
                  {state === "active"
                    ? "Quadratic Factorization & Problem Solving"
                    : "Diagnostic Session: Quadratic Roots & Concepts"}
                </h2>

                <p className="text-xs sm:text-sm text-[#6F6A62] leading-relaxed max-w-xl">
                  {state === "active"
                    ? "Continuing syllabus coverage for CBSE Class 9 Mathematics. Focus on multi-step factorization methods and textbook problem solving."
                    : "Meet your educator, review current syllabus comfort, and determine where focused practice is needed most."}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-[#25231F]">
                  <span className="flex items-center gap-1.5 text-[#244A40]">
                    <IconCalendar size={14} />
                    <span>Monday, Oct 5, 2026</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#244A40]">
                    <IconClock size={14} />
                    <span>04:30 PM &ndash; {state === "active" ? "05:30 PM" : "05:00 PM"}</span>
                  </span>
                </div>
              </div>

              {/* Right Supporting Portion: Tutor & Join Action */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[rgba(55,48,40,0.08)] pt-6 lg:pt-0 lg:pl-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4EEE9] text-base font-extrabold text-[#244A40]">
                    AS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-[#25231F]">Ananya Sharma</p>
                      <span className="text-[#315F52]"><IconShieldCheck size={16} /></span>
                    </div>
                    <p className="text-xs text-[#6F6A62]">Mathematics &bull; 8+ Yrs Exp</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#6F6A62]">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-bold text-[#25231F]">1-on-1 Online Classroom</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes:</span>
                    <span className="font-semibold text-[#315F52]">Digital whiteboard enabled</span>
                  </div>
                </div>

                <Link
                  href={state === "active" ? "/demo/session" : "/demo/waiting-room"}
                  className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
                >
                  <span>{state === "active" ? "Join Scheduled Class" : "Enter Waiting Room"}</span>
                  <IconArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>

          {/* =====================================================
              2. WIDE LEARNING RHYTHM & PROGRESS COMPOSITION
          ====================================================== */}
          <section className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[rgba(55,48,40,0.06)] pb-5">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#315F52]">
                  Learning Rhythm Status
                </span>
                <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#25231F]">
                  {state === "active"
                    ? "Comprehensive Mastery Rhythm (15 Classes)"
                    : "Trial Phase: Free 30-Minute Diagnostic Demo"}
                </h3>
              </div>

              {state === "active" ? (
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#E4EEE9] px-3 py-1 text-xs font-bold text-[#244A40]">
                    45-Day Validity Active
                  </span>
                  <span className="text-xs text-[#6F6A62]">
                    <strong className="text-[#25231F]">{remainingClasses}</strong> classes left
                  </span>
                </div>
              ) : (
                <span className="rounded-full bg-[#E3EADD] px-3 py-1 text-xs font-bold text-[#244A40]">
                  Demo Reserved &bull; ₹0 Paid
                </span>
              )}
            </div>

            {state === "active" ? (
              <div className="mt-6 space-y-4">
                {/* Visual Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#6F6A62] mb-2">
                    <span>Course Progress: {completedClasses} of {activeClasses} sessions completed</span>
                    <span className="text-[#315F52] font-bold">20%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#FFFBF5] border border-[rgba(55,48,40,0.08)] overflow-hidden">
                    <div className="h-full rounded-full bg-[#315F52]" style={{ width: "20%" }} />
                  </div>
                </div>

                {/* Schedule Days */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-3.5">
                    <span className="text-[#9B958C] font-bold block mb-1">RECURRING DAYS</span>
                    <p className="font-bold text-[#25231F]">Mon, Wed, Fri</p>
                    <p className="text-[11px] text-[#6F6A62]">05:00 PM (60 mins)</p>
                  </div>
                  <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-3.5">
                    <span className="text-[#9B958C] font-bold block mb-1">ASSIGNED EDUCATOR</span>
                    <p className="font-bold text-[#25231F]">Ananya Sharma</p>
                    <p className="text-[11px] text-[#6F6A62]">Verified Specialist</p>
                  </div>
                  <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-3.5">
                    <span className="text-[#9B958C] font-bold block mb-1">PACKAGE EXPIRY</span>
                    <p className="font-bold text-[#25231F]">Nov 19, 2026</p>
                    <p className="text-[11px] text-[#315F52]">45 days from first class</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-[#FFFBF5] p-5 border border-[rgba(55,48,40,0.08)]">
                <div>
                  <h4 className="text-sm font-bold text-[#25231F]">What happens next?</h4>
                  <p className="mt-1 text-xs text-[#6F6A62] leading-relaxed max-w-xl">
                    Attend your 30-minute online trial. If your child and tutor establish good rapport, you can select an 8, 12, or 15-class package right from this workspace.
                  </p>
                </div>
                <Link
                  href="/packages/select"
                  className="btn btn-outline min-h-[42px] px-5 rounded-full text-xs font-bold shrink-0"
                >
                  <span>Preview Packages</span>
                </Link>
              </div>
            )}
          </section>

          {/* =====================================================
              3. EDITORIAL SPLIT: LESSON NOTES & HOMEWORK
          ====================================================== */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: Digital Lesson Notes */}
            <section className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(55,48,40,0.06)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E4EEE9] text-[#244A40]">
                    <IconBookOpen size={16} />
                  </span>
                  <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#25231F]">
                    Digital Lesson Notes
                  </h3>
                </div>
                <span className="text-[11px] text-[#9B958C]">Shared by tutor</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Class 3: Splitting the Middle Term",
                    date: "Oct 2, 2026",
                    file: "Algebra_Ch4_Recap.pdf",
                    pages: "3 pages &bull; Whiteboard captures",
                  },
                  {
                    title: "Class 2: Quadratic Identities & Roots",
                    date: "Sep 30, 2026",
                    file: "Identities_Formula_Sheet.pdf",
                    pages: "2 pages &bull; Core formula summary",
                  },
                  {
                    title: "Class 1: Introduction & Diagnostic",
                    date: "Sep 28, 2026",
                    file: "Baseline_Diagnostic_Notes.pdf",
                    pages: "2 pages &bull; Focus areas roadmap",
                  },
                ].map((note) => (
                  <div
                    key={note.title}
                    className="flex items-center justify-between rounded-2xl border border-[rgba(55,48,40,0.06)] bg-[#FFF7ED] p-3.5 hover:border-[#315F52]/25 transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#25231F]">{note.title}</p>
                      <p className="text-[11px] text-[#6F6A62] mt-0.5">{note.pages}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showNotice(`Viewing ${note.file}`)}
                      className="text-xs font-bold text-[#315F52] hover:underline"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Right: Homework & Tasks */}
            <section className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(55,48,40,0.06)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E3EADD] text-[#244A40]">
                    <IconChecklist size={16} />
                  </span>
                  <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#25231F]">
                    Homework &amp; Practice
                  </h3>
                </div>
                <span className="text-[11px] text-[#315F52] font-bold">1 Pending</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    task: "NCERT Exercise 4.2: Q1 to Q6",
                    deadline: "Due Before Class 4 (Oct 5)",
                    status: "Pending",
                    subject: "Mathematics",
                  },
                  {
                    task: "Factorization Worksheet (Level 1)",
                    deadline: "Completed on Oct 1",
                    status: "Reviewed",
                    subject: "Mathematics",
                  },
                  {
                    task: "Diagnostic Review Checklist",
                    deadline: "Completed on Sep 29",
                    status: "Reviewed",
                    subject: "Mathematics",
                  },
                ].map((item) => (
                  <div
                    key={item.task}
                    className="flex items-center justify-between rounded-2xl border border-[rgba(55,48,40,0.06)] bg-[#FFF7ED] p-3.5"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#25231F]">{item.task}</p>
                      <p className="text-[11px] text-[#6F6A62] mt-0.5">{item.deadline}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.status === "Pending"
                          ? "bg-[#FBE2D8] text-[#BA5945]"
                          : "bg-[#E3EADD] text-[#244A40]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Mobile Integrated Bottom Navigation */}
        <nav
          aria-label="Mobile Bottom Navigation"
          className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-[rgba(55,48,40,0.10)] bg-white/95 backdrop-blur-md px-2 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href.startsWith("/") ? item.href : "#"}
              onClick={() => {
                if (!item.href.startsWith("/")) {
                  showNotice(`${item.label} workspace will open soon.`);
                }
              }}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold transition ${
                item.active ? "text-[#315F52]" : "text-[#6F6A62] hover:text-[#25231F]"
              }`}
            >
              <NavIcon type={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF5]" />}>
      <StudentDashboardContent />
    </Suspense>
  );
}
