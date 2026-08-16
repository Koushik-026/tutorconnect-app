"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useState,
} from "react";
import { Logo } from "@/components/logo";

type ShowNotice = (message: string) => void;

type PackageInfo = {
  classes: number;
  price: number;
  mathematics: number;
  science: number;
};

const packageOptions: Record<number, PackageInfo> = {
  8: {
    classes: 8,
    price: 3200,
    mathematics: 4,
    science: 4,
  },

  12: {
    classes: 12,
    price: 4500,
    mathematics: 6,
    science: 6,
  },

  15: {
    classes: 15,
    price: 5400,
    mathematics: 8,
    science: 7,
  },
};

const navigationItems = [
  {
    label: "Dashboard",
    icon: "▦",
  },
  {
    label: "My Sessions",
    icon: "□",
  },
  {
    label: "Find Tutors",
    icon: "⌕",
  },
  {
    label: "Messages",
    icon: "✉",
  },
  {
    label: "Payments",
    icon: "▣",
  },
];

function formatPrice(value: number) {
  return value.toLocaleString("en-IN");
}

/* =========================================================
   DESKTOP SIDEBAR
========================================================= */

function DesktopSidebar({
  showNotice,
}: {
  showNotice: ShowNotice;
}) {
  return (
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

            if (item.label === "Find Tutors") {
              return (
                <Link
                  key={item.label}
                  href="/tutors"
                  className="flex min-h-12 items-center gap-4 rounded-xl px-4 text-sm font-extrabold text-slate-700 transition hover:bg-white hover:text-blue-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center text-lg text-slate-500">
                    {item.icon}
                  </span>

                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (!active) {
                    showNotice(
                      `${item.label} will be connected as we build the learning workspace.`,
                    );
                  }
                }}
                className={`flex min-h-12 w-full items-center gap-4 rounded-xl px-4 text-left text-sm font-extrabold transition ${
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
              </button>
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
            <span className="text-lg">
              ＋
            </span>

            Find a Tutor
          </Link>
        </div>

        <div className="mt-5 border-t border-slate-200 px-4 py-5">
          <button
            type="button"
            onClick={() =>
              showNotice(
                "Student settings will be connected during the account-management phase.",
              )
            }
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-white"
          >
            <span className="text-lg">
              ⚙
            </span>

            Settings
          </button>

          <button
            type="button"
            onClick={() =>
              showNotice(
                "TutorConnect support tools will be connected later.",
              )
            }
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-white"
          >
            <span className="text-lg">
              ?
            </span>

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
  );
}

/* =========================================================
   MOBILE / TABLET HEADER
========================================================= */

function MobileHeader({
  showNotice,
}: {
  showNotice: ShowNotice;
}) {
  return (
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
            aria-label="Account settings"
            onClick={() =>
              showNotice(
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
  );
}

/* =========================================================
   MOBILE BOTTOM NAVIGATION
========================================================= */

function BottomNavigation({
  showNotice,
  dashboardHref,
}: {
  showNotice: ShowNotice;
  dashboardHref: string;
}) {
  return (
    <nav
      aria-label="Student mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4 lg:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-1">
        <Link
          href={dashboardHref}
          className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl bg-blue-50 text-blue-700"
        >
          <span className="text-lg">
            ▦
          </span>

          <span className="text-[11px] font-extrabold">
            Home
          </span>
        </Link>

        <button
          type="button"
          onClick={() =>
            showNotice(
              "The full My Sessions workspace is coming next.",
            )
          }
          className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-blue-700"
        >
          <span className="text-lg">
            □
          </span>

          <span className="text-[11px] font-bold">
            Sessions
          </span>
        </button>

        <Link
          href="/tutors"
          className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-blue-700"
        >
          <span className="text-lg">
            ⌕
          </span>

          <span className="text-[11px] font-bold">
            Tutors
          </span>
        </Link>

        <button
          type="button"
          onClick={() =>
            showNotice(
              "TutorConnect messaging will be connected during the communication phase.",
            )
          }
          className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-blue-700"
        >
          <span className="text-lg">
            ✉
          </span>

          <span className="text-[11px] font-bold">
            Messages
          </span>
        </button>
      </div>
    </nav>
  );
}

/* =========================================================
   PRE-DEMO DASHBOARD
========================================================= */

function PreDemoDashboard({
  showNotice,
}: {
  showNotice: ShowNotice;
}) {
  return (
    <>
      <section>
        <span className="badge badge-blue lg:hidden">
          Student dashboard
        </span>

        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:mt-0 lg:text-[2.6rem]">
          Welcome back, Aarav!
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Here&apos;s a quick overview of
          your learning journey.
        </p>
      </section>

      <section className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_320px]">
        <article className="tc-card overflow-hidden">
          <div className="border-b border-slate-100 p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="badge badge-blue">
                  Upcoming Free Online Demo
                </span>

                <h2 className="mt-4 text-2xl font-extrabold text-slate-950 sm:text-3xl">
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

              <div>
                <p className="font-extrabold text-slate-950">
                  Ananya Sharma
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-bold text-amber-600">
                    ★ 4.9
                  </span>

                  {" · "}

                  Mathematics & Science Tutor
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/demo/waiting-room"
                className="btn btn-primary w-full sm:w-auto"
              >
                Join Demo
              </Link>

              <Link
                href="/demo/book?tutor=ananya-sharma"
                className="btn btn-secondary w-full sm:w-auto"
              >
                Reschedule
              </Link>

              <button
                type="button"
                onClick={() =>
                  showNotice(
                    "Demo cancellation will be connected to the booking backend.",
                  )
                }
                className="min-h-12 rounded-xl px-5 text-sm font-extrabold text-red-600 transition hover:bg-red-50 sm:ml-auto"
              >
                Cancel
              </button>
            </div>
          </div>

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

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <article className="tc-card flex min-h-[190px] flex-col items-center justify-center p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
              ▣
            </div>

            <h2 className="mt-4 font-extrabold text-slate-950">
              No active monthly package
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
              Attend the demo first, then
              choose a tuition package.
            </p>
          </article>

          <article className="tc-card flex min-h-[190px] flex-col items-center justify-center p-6 text-center">
            <p className="text-4xl font-extrabold text-slate-950">
              0
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              Classes completed
            </p>
          </article>
        </div>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <article className="flex min-h-[245px] items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/70 p-7 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              ▤
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-slate-800">
              No Notes Yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tutor notes will appear here
              after regular tuition begins.
            </p>
          </div>
        </article>

        <article className="flex min-h-[245px] items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-white/70 p-7 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              ?
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-slate-800">
              No Active Quizzes
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tutor assessments will appear
              here once classes begin.
            </p>
          </div>
        </article>
      </section>
    </>
  );
}

/* =========================================================
   ACTIVE TUITION DASHBOARD
========================================================= */

function ActiveDashboard({
  showNotice,
  packageInfo,
}: {
  showNotice: ShowNotice;
  packageInfo: PackageInfo;
}) {
  /*
   * For this UI prototype we are showing an
   * example learning-in-progress state.
   *
   * Later these values come from the database.
   */
  const completedClasses =
    Math.min(3, packageInfo.classes);

  const remainingClasses =
    packageInfo.classes - completedClasses;

  const progressPercent =
    Math.round(
      (completedClasses /
        packageInfo.classes) *
        100,
    );

  return (
    <>
      {/* =====================================================
          HEADING
      ====================================================== */}
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <span className="badge badge-blue lg:hidden">
            Student dashboard
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:mt-0 lg:text-[2.6rem]">
            Welcome back, Aarav!
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Here&apos;s a quick overview of
            your progress today.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-extrabold text-teal-700">
            ✓
          </span>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Status
            </p>

            <p className="text-sm font-extrabold text-slate-950">
              Active{" "}
              {packageInfo.classes}-class
              package{" "}
              <span className="text-blue-700">
                (₹
                {formatPrice(
                  packageInfo.price,
                )}
                )
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROGRESS + SCORES
      ====================================================== */}
      <section className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_320px]">
        <article className="tc-card overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Course Progress
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {completedClasses} of{" "}
                  {packageInfo.classes}{" "}
                  classes completed
                </p>
              </div>

              <span className="badge badge-blue">
                Mathematics & Science
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-500">
                  Overall package progress
                </span>

                <span className="font-extrabold text-blue-700">
                  {progressPercent}%
                </span>
              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
            </div>

            {/* Subject allocation */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-600">
                  Mathematics
                </p>

                <p className="mt-2 text-xl font-extrabold text-slate-950">
                  {
                    packageInfo.mathematics
                  }{" "}
                  classes
                </p>
              </div>

              <div className="rounded-2xl bg-teal-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-teal-700">
                  Science
                </p>

                <p className="mt-2 text-xl font-extrabold text-slate-950">
                  {packageInfo.science}{" "}
                  classes
                </p>
              </div>

              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-violet-700">
                  Remaining
                </p>

                <p className="mt-2 text-xl font-extrabold text-slate-950">
                  {remainingClasses}{" "}
                  classes
                </p>
              </div>
            </div>

            {/* Next class */}
            <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50/60 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-xl text-white">
                    ▣
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                      Next Class
                    </p>

                    <p className="mt-1 font-extrabold text-slate-950">
                      Mathematics with
                      Ananya Sharma
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Monday, 17 August ·
                      5:00 PM – 6:00 PM
                    </p>

                    <p className="mt-1 text-xs font-semibold text-violet-700">
                      Home Tuition · B.N.
                      Reddy Nagar
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showNotice(
                      "Class details and attendance controls will be connected in My Sessions.",
                    )
                  }
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  View Class
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Scores */}
        <article className="tc-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="text-xl text-violet-600">
              ♕
            </span>

            <h2 className="text-xl font-extrabold text-slate-950">
              Recent Scores
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-extrabold text-slate-900">
                    Algebra Basics
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Mathematics
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-extrabold text-teal-700">
                    88%
                  </p>

                  <p className="text-xs font-semibold text-teal-700">
                    Good
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-extrabold text-slate-900">
                    Motion Check
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Science
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-extrabold text-blue-700">
                    92%
                  </p>

                  <p className="text-xs font-semibold text-blue-700">
                    Excellent
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              showNotice(
                "The full quiz history will be connected when we build Quizzes.",
              )
            }
            className="mt-5 w-full text-center text-sm font-extrabold text-blue-700"
          >
            View all scores →
          </button>
        </article>
      </section>

      {/* =====================================================
          NOTES + HOMEWORK
      ====================================================== */}
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        {/* Notes */}
        <article className="tc-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl text-blue-600">
                ▤
              </span>

              <h2 className="text-xl font-extrabold text-slate-950">
                Latest Notes
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                showNotice(
                  "The complete Notes workspace is coming shortly.",
                )
              }
              className="text-sm font-extrabold text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            <div className="flex items-center gap-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                ▤
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-slate-900">
                  Linear Equations –
                  Quick Notes
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Added 14 August 2026
                </p>
              </div>

              <button
                type="button"
                aria-label="Download notes"
                onClick={() =>
                  showNotice(
                    "Secure note downloads will work after file storage is connected.",
                  )
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-700"
              >
                ↓
              </button>
            </div>

            <div className="flex items-center gap-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                ▤
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-slate-900">
                  Motion & Force Summary
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Added 12 August 2026
                </p>
              </div>

              <button
                type="button"
                aria-label="Download notes"
                onClick={() =>
                  showNotice(
                    "Secure note downloads will work after file storage is connected.",
                  )
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-700"
              >
                ↓
              </button>
            </div>
          </div>
        </article>

        <div className="space-y-5">
          {/* Homework */}
          <article className="tc-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="text-xl text-red-600">
                ▣
              </span>

              <h2 className="text-xl font-extrabold text-slate-950">
                Homework Due
              </h2>
            </div>

            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-extrabold text-red-900">
                    Linear Equations
                    Practice Set
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    Due 17 August by
                    11:59 PM
                  </p>

                  <p className="mt-2 text-xs text-red-700/80">
                    Mathematics · Ananya
                    Sharma
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    showNotice(
                      "Homework upload will connect to secure student file storage.",
                    )
                  }
                  className="rounded-xl bg-red-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-800"
                >
                  Upload
                </button>
              </div>
            </div>
          </article>

          {/* Feedback */}
          <article className="rounded-[22px] border-l-4 border-blue-600 bg-blue-50/70 p-5 sm:p-6">
            <div className="flex gap-4">
              <span className="text-4xl font-serif text-blue-600">
                ”
              </span>

              <div>
                <p className="text-sm italic leading-7 text-slate-700">
                  “Aarav is engaging well
                  with the core concepts.
                  Regular practice before
                  each class will help him
                  build even stronger
                  confidence.”
                </p>

                <p className="mt-3 text-sm font-extrabold text-slate-900">
                  — Ananya Sharma
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Tutor feedback
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          PACKAGE SUMMARY
      ====================================================== */}
      <section className="mt-5 tc-card p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="badge badge-teal">
              Active Tuition
            </span>

            <h2 className="mt-3 text-xl font-extrabold text-slate-950">
              {packageInfo.classes}-Class
              Mathematics & Science Package
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Home tuition · Mon / Wed /
              Fri · 5:00 PM · 60-minute
              sessions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                Price
              </p>

              <p className="mt-1 text-sm font-extrabold text-slate-900">
                ₹
                {formatPrice(
                  packageInfo.price,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                Started
              </p>

              <p className="mt-1 text-sm font-extrabold text-slate-900">
                10 Aug
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                Validity
              </p>

              <p className="mt-1 text-sm font-extrabold text-slate-900">
                45 days
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                Remaining
              </p>

              <p className="mt-1 text-sm font-extrabold text-blue-700">
                {remainingClasses} classes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prototype note */}
      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
        Frontend preview: package status,
        progress, scores, notes, homework
        and tutor feedback are mock data.
        During backend integration,
        TutorConnect will load the verified
        purchase and learning records from
        the authenticated database instead
        of trusting URL parameters.
      </section>
    </>
  );
}

/* =========================================================
   DASHBOARD CONTENT
========================================================= */

function StudentDashboardContent() {
  const searchParams = useSearchParams();

  const activePackage =
    searchParams.get("state") === "active";

  const requestedClasses =
    Number(searchParams.get("classes")) ||
    15;

  const packageInfo =
    packageOptions[requestedClasses] ??
    packageOptions[15];

  const [notice, setNotice] =
    useState<string | null>(null);

  function showNotice(message: string) {
    setNotice(message);

    window.setTimeout(() => {
      setNotice(null);
    }, 4500);
  }

  const dashboardHref = activePackage
    ? `/dashboard/student?state=active&classes=${packageInfo.classes}&amount=${packageInfo.price}`
    : "/dashboard/student";

  return (
    <div className="min-h-screen bg-[#faf9ff]">
      <DesktopSidebar
        showNotice={showNotice}
      />

      <MobileHeader
        showNotice={showNotice}
      />

      <main
        id="main-content"
        className="pb-24 lg:ml-[280px] lg:pb-10"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10 xl:px-10">
          {notice && (
            <div
              role="status"
              className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
            >
              {notice}
            </div>
          )}

          {activePackage ? (
            <ActiveDashboard
              showNotice={showNotice}
              packageInfo={packageInfo}
            />
          ) : (
            <PreDemoDashboard
              showNotice={showNotice}
            />
          )}
        </div>
      </main>

      <BottomNavigation
        showNotice={showNotice}
        dashboardHref={dashboardHref}
      />
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
          <div className="text-center">
            <Logo />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading your dashboard…
            </p>
          </div>
        </main>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}