"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ClassSessionRow } from "@/lib/types/database";
import { completeClassSessionAction } from "@/app/actions/workflow";
import {
  IconCalendar,
  IconClock,
  IconVideo,
  IconHomeTuition,
  IconCheck,
  IconBookOpen,
  IconMessageSquare,
  IconCreditCard,
  IconSearch,
  IconSettings,
  IconHelpCircle,
  IconArrowLeft,
} from "@/components/ui/icons";

const navigationItems = [
  { label: "Learning Space", icon: "home", href: "/dashboard/student", active: false },
  { label: "My Sessions", icon: "calendar", href: "/dashboard/student/sessions", active: true },
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

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<ClassSessionRow[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const [isHistoricalOnly, setIsHistoricalOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchSessions() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user || !active) {
          if (active) setIsLoading(false);
          return;
        }

        // Check active enrollment status
        const { data: enrollments } = await supabase
          .from("student_tutor_enrollments")
          .select("*")
          .eq("user_id", authData.user.id)
          .order("created_at", { ascending: false });

        const hasActive = enrollments?.some(
          (e) => e.status === "active" && e.remaining_classes > 0
        );
        if (active && !hasActive && enrollments && enrollments.length > 0) {
          setIsHistoricalOnly(true);
        }

        const { data: sess } = await supabase
          .from("class_sessions")
          .select("*")
          .eq("user_id", authData.user.id)
          .order("scheduled_start_at", { ascending: true });

        if (active) {
          if (sess) {
            setSessions(sess as ClassSessionRow[]);
          }
          setIsLoading(false);
        }
      } catch (e) {
        console.error("fetchSessions error:", e);
        if (active) setIsLoading(false);
      }
    }

    void fetchSessions();
    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  function handleCompleteSession(sessionId: string) {
    startTransition(async () => {
      const res = await completeClassSessionAction(
        sessionId,
        "Completed via student sessions workspace"
      );
      if (res.success) {
        showToast(
          `Class completed! Ledger updated. Remaining balance: ${res.remainingClasses ?? 0} classes.`
        );
        setRefreshTrigger((k) => k + 1);
      } else {
        showToast(res.error || "Failed to mark class completed.");
      }
    });
  }

  const upcomingSessions = sessions.filter(
    (s) => s.status === "scheduled" || s.status === "in_progress"
  );
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const cancelledSessions = sessions.filter(
    (s) => s.status === "cancelled" || s.status === "student_no_show" || s.status === "tutor_no_show"
  );

  const displayedSessions =
    activeTab === "upcoming"
      ? upcomingSessions
      : activeTab === "completed"
      ? completedSessions
      : cancelledSessions;

  return (
    <div className="flex min-h-screen bg-[#FFFBF5] text-[#25231F]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl border border-[rgba(55,48,40,0.12)] bg-white p-4 shadow-xl text-xs font-semibold text-[#25231F] flex items-center gap-2 max-w-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E4EEE9] text-[#244A40] shrink-0 font-bold">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-[rgba(55,48,40,0.08)] bg-white z-30">
        <div className="flex h-18 items-center px-6 border-b border-[rgba(55,48,40,0.06)]">
          <Logo />
        </div>

        <div className="flex-1 flex flex-col justify-between p-4">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  item.active
                    ? "bg-[#315F52] text-white shadow-xs"
                    : "text-[#6F6A62] hover:bg-[#FFF7ED] hover:text-[#25231F]"
                }`}
              >
                <NavIcon type={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-[rgba(55,48,40,0.08)] pt-4 space-y-2">
            <Link
              href="/dashboard/student"
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#6F6A62] hover:text-[#25231F]"
            >
              <IconArrowLeft size={14} />
              <span>Back to Learning Space</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[rgba(55,48,40,0.08)] bg-white/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/student"
              className="lg:hidden text-xs font-bold text-[#6F6A62]"
            >
              &larr; Workspace
            </Link>
            <h1 className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-[#25231F]">
              My Scheduled Sessions
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tutors"
              className="btn btn-outline min-h-[44px] px-4 rounded-full text-xs font-bold"
            >
              Explore Educators
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl">
          {/* Tabs Filter */}
          <div className="flex items-center gap-2 border-b border-[rgba(55,48,40,0.08)] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "upcoming"
                  ? "bg-[#315F52] text-white shadow-xs"
                  : "bg-white text-[#6F6A62] border border-[rgba(55,48,40,0.10)] hover:text-[#25231F]"
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "completed"
                  ? "bg-[#315F52] text-white shadow-xs"
                  : "bg-white text-[#6F6A62] border border-[rgba(55,48,40,0.10)] hover:text-[#25231F]"
              }`}
            >
              Completed ({completedSessions.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cancelled")}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                activeTab === "cancelled"
                  ? "bg-[#315F52] text-white shadow-xs"
                  : "bg-white text-[#6F6A62] border border-[rgba(55,48,40,0.10)] hover:text-[#25231F]"
              }`}
            >
              Cancelled ({cancelledSessions.length})
            </button>
          </div>

          {/* Session Cards List */}
          {isLoading ? (
            <div className="rounded-3xl border border-[rgba(55,48,40,0.08)] bg-white p-12 text-center text-xs font-semibold text-[#6F6A62]">
              Loading sessions...
            </div>
          ) : displayedSessions.length === 0 ? (
            <div className="rounded-3xl border border-[rgba(55,48,40,0.08)] bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#315F52]">
                <IconCalendar size={22} />
              </div>
              <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#25231F]">
                No {activeTab} sessions found
              </h2>
              <p className="text-xs text-[#6F6A62] max-w-sm mx-auto">
                {activeTab === "upcoming"
                  ? "Book a free demo or activate a tuition package to schedule 1-on-1 classes with your mentor."
                  : "Completed classes and audit ledger records will appear here as your routine progresses."}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/tutors"
                  className="btn btn-primary min-h-[44px] px-6 rounded-full text-xs font-bold"
                >
                  Find a Tutor
                </Link>
                <Link
                  href="/packages/select"
                  className="btn btn-outline min-h-[44px] px-6 rounded-full text-xs font-bold"
                >
                  View Packages
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedSessions.map((session) => {
                const startDate = new Date(session.scheduled_start_at);
                const isOnline = session.session_mode === "online";
                const isHome = session.session_mode === "home";

                return (
                  <div
                    key={session.id}
                    className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* Left: Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#E4EEE9] px-2.5 py-0.5 text-xs font-bold text-[#244A40]">
                          {session.subject}
                        </span>
                        {isOnline && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8EFF6] px-2.5 py-0.5 text-xs font-bold text-[#204E78]">
                            <IconVideo size={12} />
                            <span>1-on-1 Online Class</span>
                          </span>
                        )}
                        {isHome && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FBE2D8] px-2.5 py-0.5 text-xs font-bold text-[#BA5945]">
                            <IconHomeTuition size={12} />
                            <span>Home Tuition</span>
                          </span>
                        )}
                        <span className="rounded-full bg-[#FFF7ED] px-2 py-0.5 text-[11px] font-semibold text-[#6F6A62]">
                          Status: {session.status}
                        </span>
                      </div>

                      <h3 className="font-[family-name:var(--font-manrope)] text-base font-extrabold text-[#25231F]">
                        {session.subject} with {session.tutor_name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#6F6A62]">
                        <span className="flex items-center gap-1.5 font-bold text-[#25231F]">
                          <IconCalendar size={13} className="text-[#315F52]" />
                          {startDate.toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <IconClock size={13} className="text-[#315F52]" />
                          {startDate.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}{" "}
                          ({session.duration_minutes} min)
                        </span>
                        {isHome && session.locality && (
                          <span>
                            Location: {session.locality} (In-person)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      {isOnline && session.status === "scheduled" && (
                        <div className="flex flex-col gap-1 text-center">
                          <button
                            type="button"
                            disabled
                            className="btn btn-primary min-h-[44px] px-6 rounded-full text-xs font-bold opacity-60 cursor-not-allowed justify-center"
                          >
                            Join Class
                          </button>
                          <span className="text-[10px] text-[#9B958C]">
                            Video room available in demo mode / coming next
                          </span>
                        </div>
                      )}

                      {/* Home Session: STRICT RULE - NEVER show Join Class button */}
                      {isHome && session.status === "scheduled" && (
                        <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFF7ED] px-4 py-2 text-center text-xs text-[#6F6A62] font-semibold">
                          In-person home visit scheduled
                        </div>
                      )}

                      {/* Completion Demo Ledger Trigger for scheduled sessions (disabled in historical mode) */}
                      {session.status === "scheduled" && !isHistoricalOnly && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleCompleteSession(session.id)}
                          className="btn btn-outline min-h-[44px] px-4 rounded-full text-xs font-bold justify-center hover:bg-[#E4EEE9] hover:border-[#315F52]"
                        >
                          Mark Completed (Test Ledger)
                        </button>
                      )}

                      {session.status === "completed" && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#244A40] bg-[#E3EADD] px-3.5 py-1.5 rounded-full">
                          <IconCheck size={14} />
                          <span>Ledger Audited &bull; Completed</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
