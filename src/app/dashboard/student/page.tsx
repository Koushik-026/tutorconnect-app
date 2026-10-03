"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  StudentProfile,
  StudentTutorEnrollmentRow,
  ClassSessionRow,
  DemoBookingRow,
} from "@/lib/types/database";
import {
  IconCalendar,
  IconClock,
  IconShieldCheck,
  IconArrowRight,
  IconBookOpen,
  IconMessageSquare,
  IconCreditCard,
  IconSearch,
  IconSettings,
  IconHelpCircle,
} from "@/components/ui/icons";

const navigationItems = [
  { label: "Learning Space", icon: "home", href: "/dashboard/student", active: true },
  { label: "My Sessions", icon: "calendar", href: "/dashboard/student/sessions", active: false },
  { label: "Find Educators", icon: "search", href: "/tutors", active: false },
  { label: "Doubt Chat", icon: "messages", href: "#", active: false },
  { label: "Tuition Packages", icon: "payments", href: "/packages/select", active: false },
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
  const urlState = searchParams.get("state");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activeEnrollment, setActiveEnrollment] = useState<StudentTutorEnrollmentRow | null>(null);
  const [nextSession, setNextSession] = useState<ClassSessionRow | null>(null);
  const [upcomingDemo, setUpcomingDemo] = useState<DemoBookingRow | null>(null);

  function showNotice(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  useEffect(() => {
    let ignore = false;

    async function loadDashboardData() {
      if (!isSupabaseConfigured()) return;

      try {
        const supabase = createClient();
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user || ignore) return;

        // 1. Fetch learner profile
        const { data: profs } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("owner_user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1);

        if (!ignore && profs && profs[0]) {
          setProfile(profs[0] as StudentProfile);
        }

        // 2. Fetch active enrollments
        const { data: enrolls } = await supabase
          .from("student_tutor_enrollments")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1);

        if (!ignore && enrolls && enrolls[0]) {
          setActiveEnrollment(enrolls[0] as StudentTutorEnrollmentRow);
        }

        // 3. Fetch next scheduled session
        const { data: sessions } = await supabase
          .from("class_sessions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "scheduled")
          .order("scheduled_start_at", { ascending: true })
          .limit(1);

        if (!ignore && sessions && sessions[0]) {
          setNextSession(sessions[0] as ClassSessionRow);
        }

        // 4. Fetch upcoming demo booking
        const { data: demos } = await supabase
          .from("demo_bookings")
          .select("*")
          .eq("user_id", user.id)
          .in("status", ["confirmed", "requested"])
          .order("scheduled_start_at", { ascending: true })
          .limit(1);

        if (!ignore && demos && demos[0]) {
          setUpcomingDemo(demos[0] as DemoBookingRow);
        }
      } catch (e) {
        console.error("Dashboard data load error:", e);
      }
    }

    void loadDashboardData();
    return () => {
      ignore = true;
    };
  }, []);

  // Determine effective dashboard state:
  // Prioritize live database enrollment -> live database demo -> URL simulation param
  const hasLiveEnrollment = Boolean(activeEnrollment);
  const hasLiveDemo = Boolean(upcomingDemo);
  const isSimulatedActive = urlState === "active";

  const isModeActive = hasLiveEnrollment || isSimulatedActive;

  const totalClasses = activeEnrollment?.total_classes || (isSimulatedActive ? 15 : 0);
  const remainingClasses = activeEnrollment ? activeEnrollment.remaining_classes : isSimulatedActive ? 12 : 0;
  const completedClasses = Math.max(0, totalClasses - remainingClasses);
  const progressPercent = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

  const learnerName = profile?.display_name || "Aarav";
  const learnerInitials = learnerName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const tutorDisplayName = activeEnrollment?.tutor_name || upcomingDemo?.tutor_name || "Ananya Sharma";
  const tutorHeadline = activeEnrollment ? "Active Tuition Mentor" : "Mathematics &bull; 8+ Yrs Exp";

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
              {learnerInitials || "TC"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#25231F]">{learnerName}</p>
              <p className="truncate text-[11px] text-[#6F6A62]">
                {profile?.class_level || "Class 9"} &bull; {profile?.board || "CBSE"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#6F6A62]">
            <Link href="/dashboard/student/sessions" className="hover:text-[#25231F]">
              My Sessions
            </Link>
            <span>&bull;</span>
            <form method="POST" action="/auth/signout">
              <button
                type="submit"
                className="hover:text-[#DE765D] font-bold transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-28 lg:pb-16">
        {/* Mobile Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[rgba(55,48,40,0.08)] bg-white/95 px-4 backdrop-blur-md lg:hidden">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#315F52] text-xs font-extrabold text-white">
              {learnerInitials || "TC"}
            </span>
            <form method="POST" action="/auth/signout">
              <button
                type="submit"
                className="text-xs font-bold text-[#6F6A62] hover:text-[#DE765D] transition"
              >
                Sign Out
              </button>
            </form>
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
                Welcome back, {learnerName}.
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#6F6A62]">
                {isModeActive
                  ? "Your active tuition rhythm is on track. Keep up the steady weekly momentum!"
                  : hasLiveDemo
                  ? `Your free 30-minute diagnostic demo with ${tutorDisplayName} is scheduled.`
                  : "Explore verified educators and book a free 30-minute demo to begin."}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start">
              <Link
                href="/dashboard/student/sessions"
                className="btn btn-outline min-h-[44px] px-4 rounded-full text-xs font-bold"
              >
                <span>View All Sessions</span>
              </Link>
            </div>
          </div>

          {/* 1. DOMINANT NEXT-CLASS / DEMO COMPOSITION */}
          <section className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-6 sm:p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Left Portion: Session Focus & Topic */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#E3EADD] px-3 py-0.5 text-xs font-bold text-[#244A40]">
                    {nextSession
                      ? "Next Scheduled Class"
                      : upcomingDemo
                      ? "Upcoming Free Demo"
                      : "Tuition Overview"}
                  </span>
                  <span className="text-xs font-semibold text-[#6F6A62]">
                    {isModeActive
                      ? `Class ${completedClasses + 1} of ${totalClasses}`
                      : "30-Minute Online Demo"}
                  </span>
                </div>

                <h2 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F] leading-tight">
                  {nextSession
                    ? `${nextSession.subject} with ${nextSession.tutor_name}`
                    : upcomingDemo
                    ? `Demo Session with ${upcomingDemo.tutor_name}`
                    : "No Upcoming Classes Scheduled"}
                </h2>

                <p className="text-xs sm:text-sm text-[#6F6A62] leading-relaxed max-w-xl">
                  {nextSession
                    ? `Continuing syllabus coverage. Session mode: ${nextSession.session_mode === "home" ? "Home In-person" : "1-on-1 Online"}.`
                    : upcomingDemo
                    ? `Diagnostic demo session. Purpose: ${upcomingDemo.learning_goal || "Evaluate teaching style and subject comfort."}`
                    : "Schedule a free demo with any of our verified educators to explore concepts before selecting a routine."}
                </p>

                {(nextSession || upcomingDemo) && (
                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-[#25231F]">
                    <span className="flex items-center gap-1.5 text-[#244A40]">
                      <IconCalendar size={14} />
                      <span>
                        {new Date(
                          (nextSession?.scheduled_start_at || upcomingDemo?.scheduled_start_at) as string
                        ).toLocaleDateString("en-IN", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#244A40]">
                      <IconClock size={14} />
                      <span>
                        {new Date(
                          (nextSession?.scheduled_start_at || upcomingDemo?.scheduled_start_at) as string
                        ).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Right Supporting Portion: Tutor & Action */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[rgba(55,48,40,0.08)] pt-6 lg:pt-0 lg:pl-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4EEE9] text-base font-extrabold text-[#244A40]">
                    {tutorDisplayName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-[#25231F]">{tutorDisplayName}</p>
                      <span className="text-[#315F52]"><IconShieldCheck size={16} /></span>
                    </div>
                    <p className="text-xs text-[#6F6A62]">{tutorHeadline}</p>
                  </div>
                </div>

                {nextSession ? (
                  nextSession.session_mode === "online" ? (
                    <div className="space-y-1">
                      <button
                        type="button"
                        disabled
                        className="btn btn-primary w-full min-h-[46px] rounded-full text-xs font-bold opacity-60 cursor-not-allowed justify-center"
                      >
                        Join Class
                      </button>
                      <p className="text-[10px] text-center text-[#9B958C]">
                        Video room available in demo mode / coming next
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFF7ED] p-3 text-center text-xs font-semibold text-[#6F6A62]">
                      Home tuition visit scheduled
                    </div>
                  )
                ) : upcomingDemo ? (
                  <Link
                    href={`/demo/waiting-room?tutor=${upcomingDemo.tutor_slug}`}
                    className="btn btn-primary w-full min-h-[46px] rounded-full text-xs font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
                  >
                    <span>Enter Demo Waiting Room</span>
                    <IconArrowRight size={14} />
                  </Link>
                ) : (
                  <Link
                    href="/tutors"
                    className="btn btn-primary w-full min-h-[46px] rounded-full text-xs font-bold justify-center"
                  >
                    <span>Browse Verified Tutors</span>
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* 2. TUITION RHYTHM & PACKAGE PROGRESS */}
          {isModeActive && (
            <section className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-[#25231F]">
                    Active Learning Package &bull; Class Ledger
                  </h3>
                  <p className="text-xs text-[#6F6A62]">
                    Audited class consumption for active enrollment
                  </p>
                </div>
                <span className="self-start rounded-full bg-[#E4EEE9] px-3 py-1 text-xs font-bold text-[#244A40]">
                  {remainingClasses} of {totalClasses} Classes Remaining
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded-full bg-[#FFF7ED] overflow-hidden">
                  <div
                    className="h-full bg-[#315F52] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-[#6F6A62]">
                  <span>{completedClasses} classes audited &amp; completed</span>
                  <span>{progressPercent}% completed</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-3.5">
                  <span className="text-[#9B958C] font-bold block mb-0.5">TOTAL CLASSES</span>
                  <p className="font-extrabold text-base text-[#25231F]">{totalClasses}</p>
                </div>
                <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-3.5">
                  <span className="text-[#9B958C] font-bold block mb-0.5">REMAINING</span>
                  <p className="font-extrabold text-base text-[#244A40]">{remainingClasses}</p>
                </div>
                <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-3.5">
                  <span className="text-[#9B958C] font-bold block mb-0.5">CLASS DURATION</span>
                  <p className="font-extrabold text-base text-[#25231F]">60 Mins</p>
                </div>
                <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-3.5">
                  <span className="text-[#9B958C] font-bold block mb-0.5">VALIDITY</span>
                  <p className="font-extrabold text-base text-[#25231F]">45 Days</p>
                </div>
              </div>
            </section>
          )}

          {/* 3. QUICK LINKS & SUPPORT */}
          <section className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/dashboard/student/sessions"
              className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-5 hover:border-[#315F52]/40 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4EEE9] text-[#244A40] mb-3 group-hover:scale-105 transition-transform">
                <IconCalendar size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#25231F]">My Schedule</h4>
              <p className="text-[11px] text-[#6F6A62] mt-0.5">
                Review upcoming classes and audit completed sessions
              </p>
            </Link>

            <Link
              href="/packages/select"
              className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-5 hover:border-[#315F52]/40 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#315F52] mb-3 group-hover:scale-105 transition-transform">
                <IconCreditCard size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#25231F]">Class Packages</h4>
              <p className="text-[11px] text-[#6F6A62] mt-0.5">
                Explore 8, 12, or 15 class learning packages
              </p>
            </Link>

            <Link
              href="/tutors"
              className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-5 hover:border-[#315F52]/40 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBE2D8] text-[#BA5945] mb-3 group-hover:scale-105 transition-transform">
                <IconSearch size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#25231F]">Discover Mentors</h4>
              <p className="text-[11px] text-[#6F6A62] mt-0.5">
                Browse educators across CBSE, ICSE, and State boards
              </p>
            </Link>
          </section>
        </main>
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
