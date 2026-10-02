"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import {
  IconClock,
  IconVideo,
  IconHomeTuition,
  IconArrowRight,
  IconArrowLeft,
  IconAlertCircle,
} from "@/components/ui/icons";

type TuitionMode = "online" | "home";

const availableDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const availableTimes = ["4:00 PM", "5:00 PM", "6:00 PM", "6:30 PM"];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId = searchParams.get("tutor") ?? "ananya-sharma";
  const tutor = tutors.find((t) => t.id === tutorId) ?? tutors[0];

  const classes = Number(searchParams.get("classes")) || 15;
  const price = Number(searchParams.get("price")) || 5400;

  const [mode, setMode] = useState<TuitionMode>("online");
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Monday",
    "Wednesday",
    "Friday",
  ]);
  const [selectedTime, setSelectedTime] = useState("4:00 PM");

  function toggleDay(day: string) {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  }

  function handleContinue() {
    const query = new URLSearchParams({
      tutor: tutor.id,
      classes: String(classes),
      price: String(price),
      mode,
      days: selectedDays.join(","),
      time: selectedTime,
    });
    router.push(`/payment/checkout?${query.toString()}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <Link
            href={`/packages/select?tutor=${tutor.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <IconArrowLeft size={14} />
            <span>Change Package</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 py-8 sm:py-12 pb-32">
        <div className="container-shell max-w-4xl">
          {/* Step indicator */}
          <div className="mb-6 flex items-center gap-2 text-xs font-bold text-blue-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              2
            </span>
            <span>Confirm Routine &amp; Mode</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-400">Step 2 of 3</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left: Schedule Form (7 cols) */}
            <div className="space-y-6 lg:col-span-7">
              {/* Teaching Mode Selector */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900 mb-1">
                  1. Choose Teaching Mode
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Select how you want {tutor.name} to conduct your regular classes.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("online")}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                      mode === "online"
                        ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 mb-2">
                      <IconVideo size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-900">1-on-1 Online Class</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Interactive digital classroom</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("home")}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                      mode === "home"
                        ? "border-teal-600 bg-teal-50/70 ring-1 ring-teal-600 text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700 mb-2">
                      <IconHomeTuition size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-900">In-Person Home Tuition</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Tutor visits student residence</span>
                  </button>
                </div>

                {/* Home Tuition Eligibility Notice */}
                {mode === "home" && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                    <IconAlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Locality Check:</span>
                      <p className="mt-0.5 text-amber-800">
                        {tutor.name} offers home tuition within a {tutor.travelRadiusKm} km travel radius from {tutor.locality}, Hyderabad. Please verify your address meets this range before proceeding.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Weekly Days Selector */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900 mb-1">
                  2. Select Weekly Days
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Choose the days of the week that fit the student&apos;s routine.
                </p>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {availableDays.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl border text-xs font-bold transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span>{day.slice(0, 3)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Time Slot */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900 mb-1">
                  3. Preferred Class Time
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Each session is 60 minutes long.
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {availableTimes.map((t) => {
                    const isSelected = selectedTime === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <IconClock size={13} className={isSelected ? "text-blue-600" : "text-slate-400"} />
                        <span>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Summary Card (5 cols) */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-slate-900 mb-4">
                  Schedule Overview
                </h3>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Educator</span>
                    <span className="font-bold text-slate-900">{tutor.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Package</span>
                    <span className="font-bold text-slate-900">{classes} Classes Bundle</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Tuition Mode</span>
                    <span className="font-bold text-blue-700">
                      {mode === "online" ? "Online Class" : "Home Tuition"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Weekly Days</span>
                    <span className="font-bold text-slate-900">{selectedDays.join(", ")}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Class Timing</span>
                    <span className="font-bold text-slate-900">{selectedTime} IST (60m)</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400">Package Total</span>
                    <span className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-slate-900">
                      {formatCurrency(price)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold shadow-sm gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <IconArrowRight size={15} />
                  </button>
                  <p className="mt-2 text-center text-[11px] text-slate-400">
                    You can reschedule individual sessions anytime from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ScheduleConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbfc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading schedule...</div>}>
      <ScheduleContent />
    </Suspense>
  );
}
