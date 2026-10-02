"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconCalendar,
  IconClock,
  IconVideo,
  IconShieldCheck,
  IconArrowRight,
  IconCheck,
  IconChecklist,
  IconBookOpen,
  IconMessageSquare,
  IconCreditCard,
  IconSearch,
  IconSettings,
  IconHelpCircle,
  IconUser,
  IconSparkles,
} from "@/components/ui/icons";


const navigationItems = [
  { label: "Home", icon: "home", href: "/dashboard/student", active: true },
  { label: "Sessions", icon: "calendar", href: "#", active: false },
  { label: "Find Tutors", icon: "search", href: "/tutors", active: false },
  { label: "Messages", icon: "messages", href: "#", active: false },
  { label: "Payments", icon: "payments", href: "#", active: false },
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
    case "user":
      return <IconUser size={size} />;
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
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl border border-blue-200 bg-white p-4 shadow-xl text-xs font-semibold text-slate-800 flex items-center gap-2 max-w-sm animate-fade-in">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 shrink-0">
            i
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Persistent Sidebar (w-64) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200/80 bg-white z-30">
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
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
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                    item.active
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <NavIcon type={item.icon} size={18} />
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
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
              >
                <NavIcon type={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom User & Settings */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <button
            type="button"
            onClick={() => showNotice("Settings and account preferences will be enabled.")}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 text-left"
          >
            <IconSettings size={16} />
            <span>Settings</span>
          </button>
          <button
            type="button"
            onClick={() => showNotice("TutorConnect Support & Help Desk is active.")}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 text-left"
          >
            <IconHelpCircle size={16} />
            <span>Help Center</span>
          </button>

          <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white text-xs">
              AR
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">Aarav Reddy</p>
              <p className="truncate text-[10px] text-slate-500">Class 9 &bull; CBSE</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace (Offset by 64 on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-24 lg:pb-12">
        {/* Top Header for Mobile/Tablet */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/tutors"
              className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              Find Tutors
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700 text-xs">
              AR
            </div>
          </div>
        </header>

        {/* Dashboard Content Canvas */}
        <main id="main-content" className="p-4 sm:p-6 lg:p-10 max-w-6xl w-full mx-auto">
          {/* Top Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Student Learning Workspace
              </span>
              <h1 className="mt-1 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Welcome back, Aarav!
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Parent Account: Suresh Reddy &bull; Hyderabad (B.N. Reddy Nagar)
              </p>
            </div>

            {/* Quick state switcher for testing prototype */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">View Mode:</span>
              <Link
                href="/dashboard/student"
                className={`rounded-lg px-2.5 py-1 font-bold text-xs transition ${
                  state === "pre-demo"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                Pre-Demo
              </Link>
              <Link
                href="/dashboard/student?state=active&classes=15&amount=5400"
                className={`rounded-lg px-2.5 py-1 font-bold text-xs transition ${
                  state === "active"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                Active Tuition
              </Link>
            </div>
          </div>

          {/* ===================================================
              PRE-DEMO STATE
          ==================================================== */}
          {state === "pre-demo" && (
            <div className="space-y-8">
              {/* Task-First Hero: What should I do next? */}
              <div className="rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/80 via-white to-teal-50/50 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-800">
                      <IconVideo size={13} />
                      <span>Next Action &bull; Upcoming 30-min Demo</span>
                    </div>

                    <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950 sm:text-3xl">
                      Mathematics &amp; Science Trial Class
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <IconCalendar size={15} className="text-blue-600" />
                        <span>Today &bull; 4 August 2026</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <IconClock size={15} className="text-blue-600" />
                        <span>4:00 PM – 4:30 PM IST</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div
                        aria-hidden="true"
                        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-xs font-extrabold text-white shadow-xs"
                      >
                        AS
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                          <span>Ananya Sharma</span>
                          <IconShieldCheck size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-[11px] text-slate-500">8y experience &bull; CBSE &bull; 4.9 ★</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Join Action */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      href="/demo/waiting-room"
                      className="btn btn-primary min-h-[50px] px-6 text-sm font-extrabold shadow-sm gap-2"
                    >
                      <IconVideo size={16} />
                      <span>Enter Waiting Room</span>
                      <IconArrowRight size={15} />
                    </Link>
                    <span className="text-[11px] text-center text-slate-400">
                      Join link ready &bull; Camera &amp; Mic test
                    </span>
                  </div>
                </div>
              </div>

              {/* Bento Grid: Preparation & Package Readiness */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Pre-session Preparation */}
                <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <IconChecklist size={16} />
                    </div>
                    <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-slate-900">
                      Session Preparation
                    </h3>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <IconCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>Connect 5 minutes before scheduled start time for audio check.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <IconCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>Keep Class 9 Mathematics textbook or homework questions handy.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <IconCheck size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>Discuss customized study plan and weekly rhythm after the demo.</span>
                    </li>
                  </ul>
                </div>

                {/* Post-Demo Package Selection */}
                <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                        <IconSparkles size={16} />
                      </div>
                      <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-slate-900">
                        Class Packages Ready
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Following your trial lesson, you can choose an 8, 12, or 15 class package tailored for online or in-person home tuition.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">8-Class Package from ₹3,200</span>
                    <Link
                      href="/packages/select?tutor=ananya-sharma"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Preview Packages</span>
                      <IconArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              ACTIVE TUITION STATE
          ==================================================== */}
          {state === "active" && (
            <div className="space-y-8">
              {/* Task-First: Next Scheduled Class */}
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/40 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-bold text-emerald-800">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active Package &bull; Next Class Ready</span>
                    </div>

                    <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950 sm:text-3xl">
                      Mathematics: Quadratic Equations &bull; Lesson 4
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <IconCalendar size={15} className="text-emerald-700" />
                        <span>Monday &bull; 10 August 2026</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <IconClock size={15} className="text-emerald-700" />
                        <span>4:00 PM – 5:00 PM IST (60m)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div
                        aria-hidden="true"
                        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-xs font-extrabold text-white shadow-xs"
                      >
                        AS
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                          <span>Ananya Sharma</span>
                          <IconShieldCheck size={14} className="text-emerald-600" />
                        </div>
                        <p className="text-[11px] text-slate-500">Online Classroom &bull; Notes Attached</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      href="/demo/session"
                      className="btn btn-primary min-h-[50px] px-6 text-sm font-extrabold shadow-sm gap-2"
                    >
                      <IconVideo size={16} />
                      <span>Join Classroom</span>
                      <IconArrowRight size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => showNotice("Reschedule request submitted to Ananya Sharma.")}
                      className="text-xs text-center font-bold text-slate-500 hover:text-slate-800"
                    >
                      Request Reschedule
                    </button>
                  </div>
                </div>
              </div>

              {/* Package Progress & Routine Overview */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Card 1: Package Progress */}
                <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Tuition Progress
                  </span>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-900">
                      {completedClasses} / {activeClasses}
                    </span>
                    <span className="text-xs font-bold text-blue-700">
                      {remainingClasses} Remaining
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${(completedClasses / activeClasses) * 100}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Package valid through 24 September 2026
                  </p>
                </div>

                {/* Card 2: Weekly Routine */}
                <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Weekly Routine
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    Mon, Wed, Fri &bull; 4:00 PM IST
                  </h3>
                  <div className="mt-3 flex gap-1.5">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                      const isClassDay = ["Mon", "Wed", "Fri"].includes(day);
                      return (
                        <span
                          key={day}
                          className={`flex-1 text-center py-1 rounded-md text-[10px] font-bold ${
                            isClassDay ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    60 minutes per session &bull; 1-on-1 Online
                  </p>
                </div>

                {/* Card 3: Recent Assessments */}
                <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Recent Assessments
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-slate-900">
                      Algebra Fundamentals Quiz
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <span>Score: 18 / 20 (90%)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => showNotice("Quiz review notes downloaded.")}
                    className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 text-left"
                  >
                    View Tutor Feedback &rarr;
                  </button>
                </div>
              </div>

              {/* Homework & Resources Placeholders */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-slate-900">
                      Recent Class Notes
                    </h3>
                    <button
                      type="button"
                      onClick={() => showNotice("All lecture PDF notes exported.")}
                      className="text-xs font-bold text-blue-600"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">Lesson 3: Factoring Polynomials</span>
                        <p className="text-slate-400 text-[10px]">PDF &bull; 1.4 MB &bull; Uploaded Aug 7</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showNotice("Downloading PDF...")}
                        className="text-xs font-bold text-blue-600"
                      >
                        Download
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">Lesson 2: Algebraic Identities Practice</span>
                        <p className="text-slate-400 text-[10px]">PDF &bull; 2.1 MB &bull; Uploaded Aug 5</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showNotice("Downloading PDF...")}
                        className="text-xs font-bold text-blue-600"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/85 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-slate-900">
                      Pending Homework
                    </h3>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      1 Pending
                    </span>
                  </div>
                  <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4">
                    <span className="text-xs font-bold text-slate-900">
                      Exercise 4.2: Quadratic Formula (Problems 1–10)
                    </span>
                    <p className="mt-1 text-xs text-slate-500">
                      Due before Monday 4:00 PM session
                    </p>
                    <button
                      type="button"
                      onClick={() => showNotice("Homework upload workflow will be connected.")}
                      className="mt-3 btn btn-secondary min-h-[36px] py-1 text-xs font-bold"
                    >
                      Submit Homework
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation (>= 48px touch targets) */}
      <nav
        aria-label="Student Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 py-2 lg:hidden shadow-lg"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {navigationItems.map((item) => {
            const isActive = item.active;
            const content = (
              <>
                <NavIcon type={item.icon} size={20} />
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </>
            );

            if (item.href.startsWith("/")) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl transition ${
                    isActive ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  showNotice(`${item.label} workspace will be connected in upcoming modules.`)
                }
                className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl transition ${
                  isActive ? "text-blue-600 bg-blue-50/80" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {content}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading student dashboard...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}
