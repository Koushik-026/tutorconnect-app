"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useMemo,
  useState,
} from "react";
import { Logo } from "@/components/logo";

type TutorPreview = {
  id: string;
  initials: string;
  name: string;
  headline: string;
  profileImage?: string;
};

const tutors: Record<string, TutorPreview> = {
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

const availableSlots: Record<number, string[]> = {
  4: ["2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
  6: ["4:00 PM", "5:00 PM", "6:30 PM"],
  8: ["10:00 AM", "11:30 AM", "4:00 PM"],
};

const weekDays = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
];

function DemoBookingContent() {
  const searchParams = useSearchParams();

  const tutorId =
    searchParams.get("tutor") ?? "ananya-sharma";

  const tutor =
    tutors[tutorId] ?? tutors["ananya-sharma"];

  const [selectedDay, setSelectedDay] =
    useState(4);

  const [selectedTime, setSelectedTime] =
    useState("4:00 PM");

  const [notice, setNotice] =
    useState<string | null>(null);

  const calendarDays = useMemo(() => {
    const emptyDaysBeforeAugust = 6;
    const totalDays = 31;

    return Array.from(
      {
        length:
          emptyDaysBeforeAugust + totalDays,
      },
      (_, index) => {
        if (index < emptyDaysBeforeAugust) {
          return null;
        }

        return index - emptyDaysBeforeAugust + 1;
      },
    );
  }, []);

  const slots =
    availableSlots[selectedDay] ?? [];

  function selectDay(day: number) {
    const daySlots = availableSlots[day];

    if (!daySlots) {
      return;
    }

    setSelectedDay(day);
    setSelectedTime(daySlots[0]);
    setNotice(null);
  }

  function confirmDemo() {
    setNotice(
      `Demo selected for ${selectedDay} August 2026 at ${selectedTime} IST. This is currently a frontend preview, so the booking has not been saved yet.`,
    );
  }

  return (
    <>
      {/* =====================================================
          SIMPLE DEMO HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container-shell flex h-[72px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/tutors/${tutor.id}`}
              aria-label="Back to tutor profile"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-700 transition hover:bg-slate-100"
            >
              ←
            </Link>

            <Logo />
          </div>

          <span className="hidden text-sm font-semibold text-slate-500 sm:block">
            Free Online Demo
          </span>
        </div>
      </header>

      <main
        id="main-content"
        className="min-h-[calc(100vh-72px)] bg-[#faf9ff]"
      >
        <div className="container-shell py-8 sm:py-10 lg:py-12">
          {/* =================================================
              PAGE HEADING
          ================================================== */}
          <div className="max-w-3xl">
            <span className="badge badge-blue">
              30-minute online session
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
              Book Free Online Demo
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Choose an available date and time to meet the
              tutor online before selecting a tuition
              package.
            </p>
          </div>

          {/* =================================================
              MAIN BOOKING LAYOUT
          ================================================== */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
            {/* ===============================================
                LEFT SUMMARY
            ================================================ */}
            <aside className="space-y-5">
              {/* TUTOR CARD */}
              <article className="tc-card p-6">
                <div className="flex flex-col items-center text-center">
                  {tutor.profileImage ? (
                    <div
                      role="img"
                      aria-label={`${tutor.name} profile`}
                      className="h-24 w-24 rounded-full border-4 border-white bg-cover bg-center shadow-md"
                      style={{
                        backgroundImage: `url('${tutor.profileImage}')`,
                      }}
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-2xl font-extrabold text-white shadow-md">
                      {tutor.initials}
                    </div>
                  )}

                  <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
                    {tutor.name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {tutor.headline}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <div className="space-y-4 text-sm text-slate-700">
                    <p className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        ◷
                      </span>

                      <span>
                        <strong>30-minute</strong> duration
                      </span>
                    </p>

                    <p className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        ▷
                      </span>

                      <span>
                        <strong>Online</strong> demo
                      </span>
                    </p>

                    <p className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                        ₹
                      </span>

                      <span>
                        <strong>Free</strong> to attend
                      </span>
                    </p>
                  </div>
                </div>
              </article>

              {/* STUDENT */}
              <article className="tc-card p-5">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                  Student details
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white">
                    AR
                  </div>

                  <div>
                    <p className="font-extrabold text-slate-950">
                      Aarav Reddy
                    </p>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Class 9 · CBSE
                    </p>
                  </div>
                </div>
              </article>

              {/* DEMO INFO */}
              <article className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <p className="font-extrabold text-slate-950">
                  Before you continue
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The free demo is always conducted online.
                  You can choose online or home tuition later
                  after the demo.
                </p>
              </article>
            </aside>

            {/* ===============================================
                DATE + TIME
            ================================================ */}
            <section className="tc-card overflow-hidden">
              <div className="border-b border-slate-200 px-5 py-5 sm:px-7 sm:py-6">
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Select Date & Time
                </h2>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <span>◉</span>
                  Timezone: IST (Indian Standard Time)
                </p>
              </div>

              <div className="grid lg:grid-cols-[1fr_0.9fr]">
                {/* ===========================================
                    CALENDAR
                ============================================ */}
                <div className="border-b border-slate-200 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      aria-label="Previous month"
                      disabled
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300"
                    >
                      ‹
                    </button>

                    <p className="font-extrabold text-slate-950">
                      August 2026
                    </p>

                    <button
                      type="button"
                      aria-label="Next month"
                      disabled
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-300"
                    >
                      ›
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-7 gap-1 text-center">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="py-2 text-xs font-bold text-slate-400"
                      >
                        {day}
                      </div>
                    ))}

                    {calendarDays.map(
                      (day, index) => {
                        if (day === null) {
                          return (
                            <div
                              key={`empty-${index}`}
                              className="aspect-square"
                            />
                          );
                        }

                        const available =
                          Boolean(
                            availableSlots[day],
                          );

                        const selected =
                          day === selectedDay;

                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={!available}
                            onClick={() =>
                              selectDay(day)
                            }
                            aria-pressed={
                              selected
                            }
                            className={`mx-auto flex aspect-square w-full max-w-11 items-center justify-center rounded-full text-sm font-bold transition ${
                              selected
                                ? "bg-blue-600 text-white shadow-md"
                                : available
                                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                  : "cursor-default text-slate-400"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-blue-600" />
                      Selected
                    </span>

                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-blue-100" />
                      Available
                    </span>
                  </div>
                </div>

                {/* ===========================================
                    AVAILABLE TIMES
                ============================================ */}
                <div className="bg-violet-50/30 p-5 sm:p-7">
                  <p className="font-extrabold text-slate-950">
                    Available Slots for Aug {selectedDay}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose one available time
                  </p>

                  <div className="mt-5 space-y-3">
                    {slots.map((time) => {
                      const selected =
                        selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(
                              time,
                            );
                            setNotice(null);
                          }}
                          aria-pressed={
                            selected
                          }
                          className={`flex min-h-[58px] w-full items-center justify-between rounded-2xl border px-5 text-left text-base font-bold transition ${
                            selected
                              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600"
                              : "border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50/40"
                          }`}
                        >
                          <span>{time}</span>

                          {selected && (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-600 text-sm">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* =============================================
                  SUMMARY + CONFIRM
              ============================================== */}
              <div className="border-t border-slate-200 bg-white p-5 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Selected demo
                    </p>

                    <p className="mt-2 text-base font-extrabold text-slate-950">
                      {selectedDay} August 2026 · {selectedTime} IST
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      30 minutes · Online · Free
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={confirmDemo}
                    className="btn btn-primary w-full lg:w-auto"
                  >
                    Confirm Free Demo
                    <span aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotice(
                      "Cancellation and rescheduling rules will be connected to the final TutorConnect policy before production.",
                    )
                  }
                  className="mt-5 text-sm font-semibold text-slate-500 underline underline-offset-4 transition hover:text-blue-700"
                >
                  Cancellation & rescheduling policy
                </button>

                {notice && (
                  <div
                    role="status"
                    className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
                  >
                    {notice}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              SAFETY NOTE
          ================================================== */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-extrabold text-slate-950">
                No payment required
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The demo is completely free.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-extrabold text-slate-950">
                Online demo only
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Free demos are conducted online for
                safety and convenience.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-extrabold text-slate-950">
                Decide after the demo
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose a package only when you are
                satisfied with the tutor.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default function DemoBookingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
          <div className="text-center">
            <Logo />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading demo availability…
            </p>
          </div>
        </main>
      }
    >
      <DemoBookingContent />
    </Suspense>
  );
}