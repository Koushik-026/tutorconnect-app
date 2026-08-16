"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard/student",
    icon: "▦",
  },
  {
    label: "My Sessions",
    href: "#sessions",
    icon: "□",
  },
  {
    label: "Find Tutors",
    href: "/tutors",
    icon: "⌕",
  },
  {
    label: "Messages",
    href: "#messages",
    icon: "✉",
  },
  {
    label: "Payments",
    href: "#payments",
    icon: "▣",
  },
];

export default function StudentDashboardPage() {
  const [notice, setNotice] =
    useState<string | null>(null);

  function showComingSoon(message: string) {
    setNotice(message);

    window.setTimeout(() => {
      setNotice(null);
    }, 4500);
  }

  return (
    <div className="min-h-screen bg-[#faf9ff]">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-slate-200 bg-[#f3f4ff] lg:flex lg:flex-col">
        <div className="px-6 py-7">
          <Logo />
        </div>

        <nav
          aria-label="Student dashboard navigation"
          className="mt-5 px-4"
        >
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const active =
                item.label === "Dashboard";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex min-h-12 items-center gap-4 rounded-xl px-4 text-sm font-extrabold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-700 hover:bg-white hover:text-blue-700"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center text-lg ${
                      active
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto">
          <div className="px-4">
            <Link
              href="/tutors"
              className="btn btn-primary w-full"
            >
              <span className="text-lg">＋</span>
              Find a Tutor
            </Link>
          </div>

          <div className="mt-5 border-t border-slate-200 px-4 py-5">
            <button
              type="button"
              onClick={() =>
                showComingSoon(
                  "Student settings will be connected during the account-management phase.",
                )
              }
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-white"
            >
              <span className="text-lg">⚙</span>
              Settings
            </button>

            <button
              type="button"
              onClick={() =>
                showComingSoon(
                  "TutorConnect support tools will be connected later.",
                )
              }
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-white"
            >
              <span className="text-lg">?</span>
              Help Center
            </button>

            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/70 p-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-sm font-extrabold text-white">
                SR
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-950">
                  Suresh Reddy
                </p>

                <p className="text-xs text-slate-500">
                  Parent Account
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          TABLET / MOBILE HEADER
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="container-shell flex h-[68px] items-center justify-between">
          <Logo />

          <div className="flex items-center gap-2">
            <Link
              href="/tutors"
              className="hidden rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white sm:inline-flex"
            >
              Find Tutors
            </Link>

            <button
              type="button"
              aria-label="Open account settings"
              onClick={() =>
                showComingSoon(
                  "Account settings will be connected later.",
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700"
            >
              SR
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN DASHBOARD
      ====================================================== */}
      <main
        id="main-content"
        className="pb-24 lg:ml-[280px] lg:pb-10"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10 xl:px-10">
          {/* HEADING */}
          <section>
            <span className="badge badge-blue lg:hidden">
              Student dashboard
            </span>

            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:mt-0 lg:text-[2.6rem]">
              Welcome back, Aarav!
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Here&apos;s a quick overview of your
              learning journey.
            </p>
          </section>

          {/* TEMPORARY FRONTEND NOTICE */}
          {notice && (
            <div
              role="status"
              className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
            >
              {notice}
            </div>
          )}

          {/* =================================================
              TOP DASHBOARD GRID
          ================================================== */}
          <section className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_320px]">
            {/* UPCOMING DEMO */}
            <article className="tc-card overflow-hidden">
              <div className="border-b border-slate-100 p-5 sm:p-6 lg:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="badge badge-blue">
                      Upcoming Free Online Demo
                    </span>

                    <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.025em] text-slate-950 sm:text-3xl">
                      Mathematics & Science
                    </h2>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm font-extrabold text-blue-700">
                      4 August 2026
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      4:00 PM – 4:30 PM IST
                    </p>
                  </div>
                </div>

                {/* TUTOR ROW */}
                <div className="mt-6 flex items-center gap-4 rounded-2xl border-l-4 border-teal-600 bg-indigo-50/70 p-4">
                  <div
                    role="img"
                    aria-label="Ananya Sharma"
                    className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center shadow-sm"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA')",
                    }}
                  />

                  <div className="min-w-0">
                    <Link
                      href="/tutors/ananya-sharma"
                      className="font-extrabold text-slate-950 transition hover:text-blue-700"
                    >
                      Ananya Sharma
                    </Link>

                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-bold text-amber-600">
                        ★ 4.9
                      </span>
                      {" · "}
                      Mathematics & Science Tutor
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() =>
                      showComingSoon(
                        "The secure demo meeting room will become available shortly before the scheduled session when the live booking backend is connected.",
                      )
                    }
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="6"
                        width="14"
                        height="12"
                        rx="2"
                      />
                      <path d="m17 10 4-2v8l-4-2" />
                    </svg>

                    Join Demo
                  </button>

                  <Link
                    href="/demo/book?tutor=ananya-sharma"
                    className="btn btn-secondary w-full sm:w-auto"
                  >
                    Reschedule
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      showComingSoon(
                        "Demo cancellation will be connected to the booking backend and cancellation policy.",
                      )
                    }
                    className="min-h-12 rounded-xl px-5 text-sm font-extrabold text-red-600 transition hover:bg-red-50 sm:ml-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* DEMO INFO STRIP */}
              <div className="grid gap-px bg-slate-200 sm:grid-cols-3">
                <div className="bg-white px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                    Session
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-slate-800">
                    Free Online Demo
                  </p>
                </div>

                <div className="bg-white px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-slate-800">
                    30 minutes
                  </p>
                </div>

                <div className="bg-white px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                    Cost
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-teal-700">
                    Free
                  </p>
                </div>
              </div>
            </article>

            {/* RIGHT STATS */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              {/* PACKAGE */}
              <article className="tc-card flex min-h-[190px] flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                  ▣
                </div>

                <h2 className="mt-4 font-extrabold text-slate-950">
                  No active monthly package
                </h2>

                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
                  Attend the demo first, then choose a
                  tuition package if you are satisfied.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    showComingSoon(
                      "Package selection becomes available after the demo feedback step.",
                    )
                  }
                  className="mt-4 text-sm font-extrabold text-blue-700 transition hover:text-blue-800"
                >
                  View Packages
                </button>
              </article>

              {/* COMPLETED CLASSES */}
              <article className="tc-card flex min-h-[190px] flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700">
                  ◇
                </div>

                <p className="mt-3 text-4xl font-extrabold text-slate-950">
                  0
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Classes completed
                </p>
              </article>
            </div>
          </section>

          {/* =================================================
              EMPTY LEARNING STATES
          ================================================== */}
          <section className="mt-5 grid gap-5 md:grid-cols-2">
            {/* NOTES */}
            <article className="flex min-h-[245px] items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/70 p-7 text-center">
              <div className="max-w-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                  ▤
                </div>

                <h2 className="mt-4 text-lg font-extrabold text-slate-800">
                  No Notes Yet
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Tutor notes and learning materials will
                  appear here after your sessions begin.
                </p>
              </div>
            </article>

            {/* QUIZZES */}
            <article className="flex min-h-[245px] items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/70 p-7 text-center">
              <div className="max-w-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                  ?
                </div>

                <h2 className="mt-4 text-lg font-extrabold text-slate-800">
                  No Active Quizzes
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Assessments assigned by your tutor will
                  appear here once regular tuition starts.
                </p>
              </div>
            </article>
          </section>

          {/* =================================================
              MOBILE QUICK ACTION
          ================================================== */}
          <section className="mt-5 lg:hidden">
            <Link
              href="/tutors"
              className="btn btn-primary w-full sm:w-auto"
            >
              Find Another Tutor
            </Link>
          </section>

          {/* FRONTEND STATUS */}
          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            Frontend preview: demo status, notes,
            quizzes, packages and completed-class counts
            are currently mock data. These will later come
            from TutorConnect&apos;s authenticated database.
          </section>
        </div>
      </main>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}
      <nav
        aria-label="Student mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 lg:hidden"
      >
        <div className="mx-auto grid max-w-xl grid-cols-4 gap-1">
          <Link
            href="/dashboard/student"
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl bg-blue-50 text-blue-700"
          >
            <span className="text-lg">▦</span>
            <span className="text-[11px] font-extrabold">
              Home
            </span>
          </Link>

          <button
            type="button"
            onClick={() =>
              showComingSoon(
                "Student sessions will appear here once session data is connected.",
              )
            }
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-blue-700"
          >
            <span className="text-lg">□</span>
            <span className="text-[11px] font-bold">
              Sessions
            </span>
          </button>

          <Link
            href="/tutors"
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-blue-700"
          >
            <span className="text-lg">⌕</span>
            <span className="text-[11px] font-bold">
              Tutors
            </span>
          </Link>

          <button
            type="button"
            onClick={() =>
              showComingSoon(
                "TutorConnect messaging will be connected during the communication phase.",
              )
            }
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-blue-700"
          >
            <span className="text-lg">✉</span>
            <span className="text-[11px] font-bold">
              Messages
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}