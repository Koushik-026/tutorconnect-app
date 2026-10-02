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
    <div className="flex min-h-screen bg-[#F7F4EE] text-[#232520]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl border border-[#B7A5DE]/40 bg-[#FFFEFB] p-4 shadow-xl text-xs font-semibold text-[#232520] flex items-center gap-2 max-w-sm animate-fade-in">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFEAF8] text-[#66518A] shrink-0 font-bold">
            i
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Persistent Quiet Sidebar (w-64) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[#E4DED4] bg-[#FFFEFB] z-30">
        <div className="flex h-16 items-center px-6 border-b border-[#E4DED4]">
          <Logo />
        </div>

        {/* Sidebar Nav */}
        <nav aria-label="Student Navigation" className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            if (item.href.startsWith("/")) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    item.active
                      ? "bg-[#EFEAF8] text-[#66518A] shadow-xs"
                      : "text-[#676B64] hover:bg-[#F7F4EE] hover:text-[#232520]"
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
                className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#676B64] hover:bg-[#F7F4EE] hover:text-[#232520] transition-colors text-left"
              >
                <NavIcon type={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Profile Snapshot */}
        <div className="p-4 border-t border-[#E4DED4] space-y-2">
          <div className="flex items-center gap-3 rounded-2xl bg-[#F7F4EE] p-3 border border-[#E4DED4]/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#66518A] font-extrabold text-white text-xs">
              AR
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#232520]">Aarav Reddy</p>
              <p className="truncate text-[11px] text-[#676B64]">Class 9 &bull; CBSE</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#676B64]">
            <button
              type="button"
              onClick={() => showNotice("Settings preferences.")}
              className="hover:text-[#232520]"
            >
              Settings
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => showNotice("TutorConnect support is available.")}
              className="hover:text-[#232520]"
            >
              Help Desk
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace (Offset by 64 on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-24 lg:pb-12">
        {/* Top Header for Mobile/Tablet */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E4DED4] bg-[#FFFEFB]/95 px-4 backdrop-blur-md lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              href="/tutors"
              className="rounded-xl bg-[#66518A] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              Find Tutors
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFEAF8] font-bold text-[#66518A] text-xs">
              AR
            </div>
          </div>
        </header>

        {/* Dashboard Content Canvas */}
        <main id="main-content" className="p-4 sm:p-6 lg:p-10 max-w-5xl w-full mx-auto">
          {/* Top Greeting & State Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#66518A]">
                My Learning Space
              </span>
              <h1 className="mt-1 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520] sm:text-3xl">
                Welcome back, Aarav!
              </h1>
              <p className="mt-0.5 text-xs text-[#676B64] sm:text-sm">
                Parent Account: Suresh Reddy &bull; Hyderabad (B.N. Reddy Nagar)
              </p>
            </div>

            {/* Quick state switcher for testing prototype */}
            <div className="flex items-center gap-2 text-xs self-start sm:self-center">
              <span className="text-[#676B64] font-semibold">Mode:</span>
              <Link
                href="/dashboard/student"
                className={`rounded-xl px-3 py-1.5 font-bold text-xs transition ${
                  state === "pre-demo"
                    ? "bg-[#66518A] text-white shadow-xs"
                    : "bg-[#FFFEFB] text-[#676B64] border border-[#E4DED4] hover:text-[#232520]"
                }`}
              >
                Pre-Demo
              </Link>
              <Link
                href="/dashboard/student?state=active&classes=15&amount=5400"
                className={`rounded-xl px-3 py-1.5 font-bold text-xs transition ${
                  state === "active"
                    ? "bg-[#66518A] text-white shadow-xs"
                    : "bg-[#FFFEFB] text-[#676B64] border border-[#E4DED4] hover:text-[#232520]"
                }`}
              >
                Active Tuition (15 Classes)
              </Link>
            </div>
          </div>

          {/* ===================================================
              PRE-DEMO STATE
          ==================================================== */}
          {state === "pre-demo" && (
            <div className="space-y-6">
              {/* Task-First Primary Hero Surface */}
              <div className="rounded-3xl border border-[#B7A5DE]/50 bg-gradient-to-br from-[#EFEAF8] via-[#FFFEFB] to-[#F7F4EE] p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFEFB] px-3 py-1 text-xs font-bold text-[#66518A] border border-[#B7A5DE]/40">
                      <IconVideo size={13} />
                      <span>Next Action &bull; Upcoming 30-min Trial Class</span>
                    </span>

                    <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520] sm:text-3xl">
                      Mathematics &amp; Science Demo Session
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#676B64]">
                      <div className="flex items-center gap-1.5 text-[#232520]">
                        <IconCalendar size={15} className="text-[#66518A]" />
                        <span>Today &bull; 4 August 2026</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#232520]">
                        <IconClock size={15} className="text-[#66518A]" />
                        <span>4:00 PM – 4:30 PM IST (30 mins)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#66518A] text-xs font-extrabold text-white shadow-xs">
                        AS
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#232520]">
                          <span>Ananya Sharma</span>
                          <IconShieldCheck size={14} className="text-[#4F7867]" />
                        </div>
                        <p className="text-[11px] text-[#676B64]">8y experience &bull; CBSE Specialist &bull; 4.9 ★</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Join Action */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      href="/demo/waiting-room"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#66518A] px-6 py-4 text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
                    >
                      <IconVideo size={16} />
                      <span>Enter Waiting Room</span>
                      <IconArrowRight size={15} />
                    </Link>
                    <span className="text-[11px] text-center text-[#676B64]">
                      Join link ready &bull; Camera &amp; Mic test
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Focused Surfaces: Preparation + Next Steps */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Session Preparation */}
                <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFEAF8] text-[#66518A]">
                      <IconChecklist size={16} />
                    </div>
                    <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#232520]">
                      Preparation for Your Demo
                    </h3>
                  </div>

                  <ul className="space-y-3 text-xs text-[#232520]">
                    <li className="flex items-start gap-2.5">
                      <IconCheck size={15} className="text-[#4F7867] shrink-0 mt-0.5" />
                      <span>Connect 5 minutes before scheduled start time for audio check.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <IconCheck size={15} className="text-[#4F7867] shrink-0 mt-0.5" />
                      <span>Keep Class 9 Mathematics textbook or homework questions handy.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <IconCheck size={15} className="text-[#4F7867] shrink-0 mt-0.5" />
                      <span>Discuss customized study plan and weekly rhythm after the demo.</span>
                    </li>
                  </ul>
                </div>

                {/* Package Options Ready */}
                <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFEAF8] text-[#66518A]">
                        <IconSparkles size={16} />
                      </div>
                      <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#232520]">
                        Class Packages Ready
                      </h3>
                    </div>
                    <p className="text-xs text-[#676B64] leading-relaxed">
                      Following your trial lesson, choose an 8, 12, or 15 class package tailored for online or in-person home tuition.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#E4DED4]/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#232520]">8-Class Package from ₹3,200</span>
                    <Link
                      href="/packages/select?tutor=ananya-sharma"
                      className="text-xs font-bold text-[#66518A] hover:text-[#4E3C70] flex items-center gap-1"
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
            <div className="space-y-6">
              {/* Task-First: Next Scheduled Class Hero */}
              <div className="rounded-3xl border border-[#4F7867]/40 bg-gradient-to-br from-[#E6F0EA]/60 via-[#FFFEFB] to-[#F7F4EE] p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFEFB] px-3 py-1 text-xs font-bold text-[#4F7867] border border-[#4F7867]/30">
                      <span className="h-2 w-2 rounded-full bg-[#4F7867] animate-pulse" />
                      <span>Active Tuition &bull; Next Class Tomorrow</span>
                    </span>

                    <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520] sm:text-3xl">
                      Mathematics: Quadratic Equations &bull; Lesson 4
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#676B64]">
                      <div className="flex items-center gap-1.5 text-[#232520]">
                        <IconCalendar size={15} className="text-[#4F7867]" />
                        <span>Wednesday &bull; 4:00 PM – 5:00 PM IST</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#232520]">
                        <IconVideo size={15} className="text-[#66518A]" />
                        <span>1-on-1 Online Live Interactive</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#4F7867] text-xs font-extrabold text-white shadow-xs">
                        AS
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#232520]">
                          <span>Ananya Sharma</span>
                          <IconShieldCheck size={14} className="text-[#4F7867]" />
                        </div>
                        <p className="text-[11px] text-[#676B64]">Primary Educator &bull; 4.9 ★ Rating</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Classroom Action */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link
                      href="/demo/session"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#66518A] px-6 py-4 text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
                    >
                      <IconVideo size={16} />
                      <span>Join Live Classroom</span>
                      <IconArrowRight size={15} />
                    </Link>
                    <span className="text-[11px] text-center text-[#676B64]">
                      Whiteboard &amp; Notes Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Learning Progress & Rhythm Panel */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Surface 1: Package Progress */}
                <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#676B64]">
                      Package Progress
                    </span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520]">
                        {completedClasses} / {activeClasses}
                      </span>
                      <span className="text-xs font-bold text-[#66518A]">
                        {remainingClasses} remaining
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-2.5 w-full rounded-full bg-[#F7F4EE] overflow-hidden border border-[#E4DED4]">
                      <div
                        className="h-full rounded-full bg-[#66518A] transition-all"
                        style={{ width: `${(completedClasses / activeClasses) * 100}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] text-[#676B64]">
                    45-day package &bull; 38 days remaining &bull; One-time package
                  </p>
                </div>

                {/* Surface 2: Weekly Rhythm */}
                <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#676B64]">
                      Weekly Rhythm
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-[#232520]">
                      Mon, Wed, Fri &bull; 4:00 PM IST
                    </h3>
                    <div className="mt-3 flex gap-1.5">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                        const isClassDay = ["Mon", "Wed", "Fri"].includes(day);
                        return (
                          <span
                            key={day}
                            className={`flex-1 text-center py-1 rounded-lg text-[10px] font-bold ${
                              isClassDay
                                ? "bg-[#66518A] text-white"
                                : "bg-[#F7F4EE] text-[#676B64]"
                            }`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] text-[#676B64]">
                    60 minutes per session &bull; 1-on-1 Interactive
                  </p>
                </div>

                {/* Surface 3: Recent Topic Review */}
                <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#676B64]">
                      Recent Topic Review
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-[#232520]">
                      Algebra Fundamentals
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#4F7867] bg-[#E6F0EA] px-2.5 py-1 rounded-lg">
                      <span>Status: Completed with tutor</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => showNotice("Review notes downloaded.")}
                    className="mt-4 text-xs font-bold text-[#66518A] hover:text-[#4E3C70] text-left"
                  >
                    View Concept Notes &rarr;
                  </button>
                </div>
              </div>

              {/* Homework & Study Materials */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#232520]">
                      Recent Class Notes
                    </h3>
                    <button
                      type="button"
                      onClick={() => showNotice("All lecture PDF notes exported.")}
                      className="text-xs font-bold text-[#66518A]"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between rounded-2xl bg-[#F7F4EE] p-3 text-xs border border-[#E4DED4]">
                      <div>
                        <span className="font-bold text-[#232520]">Lesson 3: Factoring Polynomials</span>
                        <p className="text-[#676B64] text-[10px]">PDF &bull; 1.4 MB &bull; Uploaded Aug 7</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showNotice("Downloading PDF...")}
                        className="text-xs font-bold text-[#66518A]"
                      >
                        Download
                      </button>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-[#F7F4EE] p-3 text-xs border border-[#E4DED4]">
                      <div>
                        <span className="font-bold text-[#232520]">Lesson 2: Algebraic Identities Practice</span>
                        <p className="text-[#676B64] text-[10px]">PDF &bull; 2.1 MB &bull; Uploaded Aug 5</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showNotice("Downloading PDF...")}
                        className="text-xs font-bold text-[#66518A]"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#232520]">
                      Pending Homework
                    </h3>
                    <span className="rounded-full bg-[#F8EFCF] px-2.5 py-0.5 text-[10px] font-bold text-[#D9B85F]">
                      1 Pending
                    </span>
                  </div>
                  <div className="rounded-2xl border border-[#D9B85F]/40 bg-[#F8EFCF]/30 p-4">
                    <span className="text-xs font-bold text-[#232520]">
                      Exercise 4.2: Quadratic Formula (Problems 1–10)
                    </span>
                    <p className="mt-1 text-xs text-[#676B64]">
                      Due before Wednesday 4:00 PM session
                    </p>
                    <button
                      type="button"
                      onClick={() => showNotice("Homework upload workflow will be connected.")}
                      className="mt-3 rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-1.5 text-xs font-bold text-[#232520] hover:bg-[#F7F4EE] transition-colors"
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

      {/* Mobile Fixed Bottom Navigation (>= 48px touch targets, integrated Paper Bloom styling) */}
      <nav
        aria-label="Student Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4DED4] bg-[#FFFEFB]/95 backdrop-blur-md px-2 py-2 lg:hidden shadow-md"
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
                    isActive ? "text-[#66518A] bg-[#EFEAF8]" : "text-[#676B64] hover:text-[#232520]"
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
                  isActive ? "text-[#66518A] bg-[#EFEAF8]" : "text-[#676B64] hover:text-[#232520]"
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center text-xs font-bold text-[#676B64]">
          Loading student learning space...
        </div>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}
