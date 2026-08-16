"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Suspense,
  useMemo,
  useState,
} from "react";
import { Logo } from "@/components/logo";

type TuitionMode = "home" | "online";

const packageDetails: Record<
  number,
  {
    price: number;
    mathematics: number;
    science: number;
  }
> = {
  8: {
    price: 3200,
    mathematics: 4,
    science: 4,
  },
  12: {
    price: 4500,
    mathematics: 6,
    science: 6,
  },
  15: {
    price: 5400,
    mathematics: 8,
    science: 7,
  },
};

const availableDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const availableTimes = [
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "6:30 PM",
];

function formatPrice(value: number) {
  return value.toLocaleString("en-IN");
}

function shortDay(day: string) {
  const names: Record<string, string> = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  };

  return names[day] ?? day;
}

function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId =
    searchParams.get("tutor") ??
    "ananya-sharma";

  const requestedClasses =
    Number(searchParams.get("classes")) || 15;

  const classes =
    packageDetails[requestedClasses]
      ? requestedClasses
      : 15;

  const selectedPackage =
    packageDetails[classes];

  const [mode, setMode] =
    useState<TuitionMode>("home");

  const [days, setDays] = useState<string[]>([
    "Monday",
    "Wednesday",
    "Friday",
  ]);

  const [time, setTime] =
    useState("5:00 PM");

  const [startDate, setStartDate] =
    useState("2026-08-10");

  const [notice, setNotice] =
    useState<string | null>(null);

  const formattedDays = useMemo(
    () =>
      days.map((day) => shortDay(day)).join(" / "),
    [days],
  );

  function toggleDay(day: string) {
    setNotice(null);

    setDays((current) => {
      if (current.includes(day)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter(
          (item) => item !== day,
        );
      }

      return [...current, day];
    });
  }

  function continueToPayment() {
    if (days.length === 0) {
      setNotice(
        "Please select at least one regular tuition day.",
      );
      return;
    }

    const query = new URLSearchParams({
      tutor: tutorId,
      package: `${classes}-classes`,
      classes: String(classes),
      price: String(selectedPackage.price),
      mode,
      days: days.join(","),
      time,
      start: startDate,
    });

    router.push(
      `/payment/checkout?${query.toString()}`,
    );
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#faf9ff] pb-28"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container-shell flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/packages/select?tutor=${tutorId}`}
              aria-label="Back to packages"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-700 transition hover:bg-slate-100"
            >
              ←
            </Link>

            <Logo />
          </div>

          <span className="hidden text-sm font-semibold text-slate-500 sm:block">
            Step 2 of 3
          </span>
        </div>
      </header>

      <div className="container-shell py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[950px]">
          {/* =================================================
              HEADING
          ================================================== */}
          <section>
            <span className="badge badge-blue">
              Step 2 of 3
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Confirm Schedule Details
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Choose the tuition mode and confirm
              Aarav&apos;s regular class schedule before
              payment.
            </p>
          </section>

          {/* =================================================
              TUTOR ↔ STUDENT
          ================================================== */}
          <section className="tc-card mt-8 p-5 sm:p-7">
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
              {/* Tutor */}
              <div className="flex items-center gap-4">
                <div
                  role="img"
                  aria-label="Ananya Sharma"
                  className="h-14 w-14 shrink-0 rounded-full border-2 border-blue-600 bg-cover bg-center shadow-sm"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA')",
                  }}
                />

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                    Tutor
                  </p>

                  <p className="mt-1 font-extrabold text-slate-950">
                    Ananya Sharma
                  </p>
                </div>
              </div>

              {/* Connection */}
              <div className="hidden text-3xl font-light text-slate-300 sm:block">
                ⇄
              </div>

              {/* Student */}
              <div className="flex items-center gap-4 sm:flex-row-reverse sm:text-right">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-lg font-extrabold text-blue-700">
                  AR
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                    Student
                  </p>

                  <p className="mt-1 font-extrabold text-slate-950">
                    Aarav Reddy
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              MODE + PACKAGE
          ================================================== */}
          <section className="mt-6 grid gap-5 md:grid-cols-2">
            {/* MODE */}
            <article className="tc-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  ◇
                </span>

                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Tuition Mode
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose how regular classes happen.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode("home");
                    setNotice(null);
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    mode === "home"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <span className="text-xl">⌂</span>

                  <p className="mt-3 font-extrabold text-slate-950">
                    Home Tuition
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Tutor visits the student.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("online");
                    setNotice(null);
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    mode === "online"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <span className="text-xl">▣</span>

                  <p className="mt-3 font-extrabold text-slate-950">
                    Online
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Attend classes online.
                  </p>
                </button>
              </div>
            </article>

            {/* PACKAGE */}
            <article className="tc-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  ▣
                </span>

                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Package Details
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Selected after the demo.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Classes
                  </span>

                  <strong className="text-slate-950">
                    {classes}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Duration
                  </span>

                  <strong className="text-slate-950">
                    60 mins per session
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Validity
                  </span>

                  <strong className="text-slate-950">
                    45 days
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                  <span className="text-slate-500">
                    Package total
                  </span>

                  <strong className="text-lg text-blue-700">
                    ₹
                    {formatPrice(
                      selectedPackage.price,
                    )}
                  </strong>
                </div>
              </div>
            </article>
          </section>

          {/* =================================================
              SUBJECT ALLOCATION
          ================================================== */}
          <section className="tc-card mt-5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-extrabold text-slate-950">
                  Subject Allocation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Classes included in this package.
                </p>
              </div>

              <span className="badge badge-blue">
                {classes} classes total
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <p className="text-sm font-semibold text-slate-600">
                  Mathematics
                </p>

                <p className="mt-2 text-3xl font-extrabold text-blue-700">
                  {
                    selectedPackage.mathematics
                  }
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  classes
                </p>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
                <p className="text-sm font-semibold text-slate-600">
                  Science
                </p>

                <p className="mt-2 text-3xl font-extrabold text-teal-700">
                  {selectedPackage.science}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  classes
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              SCHEDULE
          ================================================== */}
          <section className="tc-card mt-5 p-6 sm:p-7">
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">
                Regular Schedule
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Choose the preferred recurring days,
                start date and time.
              </p>
            </div>

            {/* DAYS */}
            <div className="mt-6">
              <p className="form-label">
                Preferred days
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {availableDays.map((day) => {
                  const selected =
                    days.includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() =>
                        toggleDay(day)
                      }
                      aria-pressed={selected}
                      className={`min-h-12 rounded-xl border px-3 text-sm font-extrabold transition ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                      }`}
                    >
                      {shortDay(day)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* START */}
              <div>
                <label
                  htmlFor="start-date"
                  className="form-label"
                >
                  Start date
                </label>

                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  min="2026-08-10"
                  onChange={(event) => {
                    setStartDate(
                      event.target.value,
                    );
                    setNotice(null);
                  }}
                  className="form-input"
                />
              </div>

              {/* TIME */}
              <div>
                <label
                  htmlFor="schedule-time"
                  className="form-label"
                >
                  Preferred time
                </label>

                <select
                  id="schedule-time"
                  value={time}
                  onChange={(event) => {
                    setTime(
                      event.target.value,
                    );
                    setNotice(null);
                  }}
                  className="form-input"
                >
                  {availableTimes.map(
                    (slot) => (
                      <option
                        key={slot}
                        value={slot}
                      >
                        {slot}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          </section>

          {/* =================================================
              LOCATION
          ================================================== */}
          {mode === "home" && (
            <section className="tc-card mt-5 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                  ⌖
                </span>

                <div>
                  <h2 className="font-extrabold text-slate-950">
                    Home Tuition Location
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Final address verification happens
                    before home tuition begins.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <p className="font-extrabold text-slate-950">
                  B.N. Reddy Nagar
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Hyderabad, Telangana
                </p>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Ananya offers home tuition within her
                  configured 5 km travel radius. Real
                  distance validation will use location
                  coordinates during backend integration.
                </p>
              </div>
            </section>
          )}

          {/* =================================================
              SUMMARY
          ================================================== */}
          <section className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/60 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-teal-700">
              Schedule Summary
            </p>

            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-slate-500">
                  Mode
                </p>

                <p className="mt-1 font-extrabold text-slate-950">
                  {mode === "home"
                    ? "Home Tuition"
                    : "Online Tuition"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Days
                </p>

                <p className="mt-1 font-extrabold text-slate-950">
                  {formattedDays}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Time
                </p>

                <p className="mt-1 font-extrabold text-slate-950">
                  {time}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Start
                </p>

                <p className="mt-1 font-extrabold text-slate-950">
                  10 August 2026
                </p>
              </div>
            </div>
          </section>

          {notice && (
            <div
              role="status"
              className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {notice}
            </div>
          )}

          {/* FRONTEND STATUS */}
          <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            Frontend preview: schedule availability is
            currently mock data. Before real payment,
            TutorConnect will re-check tutor availability,
            home-tuition radius and package validity on
            the server.
          </section>
        </div>
      </div>

      {/* =====================================================
          STICKY FOOTER
      ====================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="container-shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/packages/select?tutor=${tutorId}`}
            className="btn btn-secondary w-full sm:w-auto"
          >
            Edit Package
          </Link>

          <button
            type="button"
            onClick={continueToPayment}
            className="btn btn-primary w-full sm:min-w-[250px] sm:w-auto"
          >
            Continue to Payment
            <span aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </footer>
    </main>
  );
}

export default function ConfirmSchedulePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
          <div className="text-center">
            <Logo />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading schedule…
            </p>
          </div>
        </main>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}