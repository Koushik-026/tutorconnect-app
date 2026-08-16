"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/logo";

type Tutor = {
  id: string;
  initials: string;
  name: string;
  headline: string;
  profileImage?: string;
};

const tutors: Record<string, Tutor> = {
  "ananya-sharma": {
    id: "ananya-sharma",
    initials: "AS",
    name: "Ananya Sharma",
    headline: "Mathematics & Science Tutor",
    profileImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA",
  },

  "rahul-verma": {
    id: "rahul-verma",
    initials: "RV",
    name: "Rahul Verma",
    headline: "English & Social Studies Tutor",
  },

  "meera-reddy": {
    id: "meera-reddy",
    initials: "MR",
    name: "Meera Reddy",
    headline: "Physics & Chemistry Tutor",
  },

  "arjun-nair": {
    id: "arjun-nair",
    initials: "AN",
    name: "Arjun Nair",
    headline: "Computer Science & Mathematics Tutor",
  },
};

function getEndTime(time: string) {
  const match = time.match(
    /^(\d{1,2}):(\d{2})\s(AM|PM)$/,
  );

  if (!match) {
    return time;
  }

  let hour = Number(match[1]);
  let minute = Number(match[2]);
  const period = match[3];

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  minute += 30;

  if (minute >= 60) {
    hour += 1;
    minute -= 60;
  }

  hour %= 24;

  const outputPeriod =
    hour >= 12 ? "PM" : "AM";

  let outputHour = hour % 12;

  if (outputHour === 0) {
    outputHour = 12;
  }

  return `${outputHour}:${String(
    minute,
  ).padStart(2, "0")} ${outputPeriod}`;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();

  const tutorId =
    searchParams.get("tutor") ??
    "ananya-sharma";

  const tutor =
    tutors[tutorId] ??
    tutors["ananya-sharma"];

  const day =
    Number(searchParams.get("day")) || 4;

  const time =
    searchParams.get("time") ||
    "4:00 PM";

  const endTime = getEndTime(time);

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[#faf9ff]"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-200/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="dot-grid absolute inset-0 opacity-[0.14]"
      />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="container-shell flex h-[72px] items-center justify-between">
          <Logo />

          <Link
            href="/"
            className="text-sm font-bold text-slate-500 transition hover:text-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container-shell relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center py-10 sm:py-14">
        <section className="w-full max-w-[900px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(37,99,235,0.13)]">
          {/* Success top area */}
          <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 px-6 pb-14 pt-10 text-center sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_15px_35px_rgba(37,99,235,0.28)]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
                <path d="m8 12 2.5 2.5L16 9" />
              </svg>
            </div>

            <span className="mt-5 inline-flex rounded-full border border-blue-100 bg-white/70 px-3 py-1.5 text-xs font-extrabold text-blue-700 backdrop-blur">
              Free Online Demo
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Booking Confirmed!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Your free online demo with{" "}
              <strong className="text-slate-900">
                {tutor.name}
              </strong>{" "}
              is scheduled.
            </p>
          </div>

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            {/* Tutor + student */}
            <div className="-mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  {tutor.profileImage ? (
                    <div
                      role="img"
                      aria-label={`${tutor.name} profile`}
                      className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center shadow-sm"
                      style={{
                        backgroundImage: `url('${tutor.profileImage}')`,
                      }}
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-sm font-extrabold text-white">
                      {tutor.initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Tutor
                    </p>

                    <p className="mt-1 font-extrabold text-slate-950">
                      {tutor.name}
                    </p>

                    <p className="mt-1 text-sm text-blue-700">
                      {tutor.headline}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-extrabold text-blue-700">
                    AR
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Student
                    </p>

                    <p className="mt-1 font-extrabold text-slate-950">
                      Aarav Reddy
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Class 9 · CBSE
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* Date/session */}
            <article className="mt-4 grid gap-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:grid-cols-2 sm:p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
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
                      y="5"
                      width="18"
                      height="16"
                      rx="2"
                    />
                    <path d="M16 3v4" />
                    <path d="M8 3v4" />
                    <path d="M3 10h18" />
                  </svg>
                </span>

                <div>
                  <p className="font-extrabold text-slate-950">
                    {day} August 2026
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {time} – {endTime} IST
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:justify-end">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
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
                </span>

                <div>
                  <p className="flex items-center gap-2 font-extrabold text-slate-950">
                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                    Online Session
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    30 minutes
                  </p>
                </div>
              </div>
            </article>

            {/* Info */}
            <div className="mt-4 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 sm:p-5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                i
              </span>

              <p>
                The join link will appear in the
                student dashboard before the session.
                Reminder notifications will be enabled
                when the TutorConnect notification
                backend is connected.
              </p>
            </div>

            {/* Prototype note */}
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
              Frontend preview: this confirmation is not
              stored in the database yet. Real booking
              persistence will be connected during the
              backend phase.
            </div>

            {/* Actions */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  window.alert(
                    "Calendar integration will be enabled when the live booking backend is connected.",
                  );
                }}
                className="btn btn-secondary w-full"
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
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                  />
                  <path d="M16 3v4" />
                  <path d="M8 3v4" />
                  <path d="M3 10h18" />
                  <path d="M12 13v5" />
                  <path d="M9.5 15.5h5" />
                </svg>

                Add to Calendar
              </button>

              <Link
                href="/dashboard/student"
                className="btn btn-primary w-full"
              >
                View Dashboard
                <span aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            <div className="mt-5 text-center">
              <Link
                href={`/tutors/${tutor.id}`}
                className="text-sm font-semibold text-slate-500 transition hover:text-blue-700"
              >
                ← Back to Tutor Profile
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function DemoConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
          <div className="text-center">
            <Logo />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading booking confirmation…
            </p>
          </div>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}