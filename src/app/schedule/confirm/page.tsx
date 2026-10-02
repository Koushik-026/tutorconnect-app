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
  IconShieldCheck,
  IconCalendar,
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
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href={`/packages/select?tutor=${tutor.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#676B64] hover:text-[#66518A] transition-colors"
          >
            <IconArrowLeft size={14} />
            <span>Change Package</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 py-8 sm:py-12 pb-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Header */}
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B7A5DE]/40 bg-[#EFEAF8] px-3 py-1 text-xs font-bold tracking-wide text-[#66518A]">
              Step 2 of 3 &bull; Weekly Rhythm Planner
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-extrabold tracking-tight text-[#232520] sm:text-3xl">
              Plan Your Class Rhythm with {tutor.name}
            </h1>
            <p className="mt-2 text-sm text-[#676B64] leading-relaxed">
              Set your preferred weekly learning days, convenient time window, and tuition delivery format.
            </p>
          </div>

          <div className="space-y-6">
            {/* Delivery Mode Choice */}
            <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#676B64] block mb-3">
                1. Select Learning Mode
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("online")}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                    mode === "online"
                      ? "border-[#66518A] bg-[#EFEAF8] shadow-xs ring-1 ring-[#66518A]/30"
                      : "border-[#E4DED4] bg-[#FFFEFB] hover:border-[#66518A]/40"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    mode === "online" ? "bg-[#66518A] text-white" : "bg-[#F7F4EE] text-[#676B64]"
                  }`}>
                    <IconVideo size={20} />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-[#232520]">Online 1-on-1 Interactive</strong>
                    <p className="mt-0.5 text-[11px] text-[#676B64] leading-relaxed">
                      Live video with interactive whiteboard and digital notes sharing.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("home")}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all ${
                    mode === "home"
                      ? "border-[#4F7867] bg-[#E6F0EA] shadow-xs ring-1 ring-[#4F7867]/30"
                      : "border-[#E4DED4] bg-[#FFFEFB] hover:border-[#4F7867]/40"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    mode === "home" ? "bg-[#4F7867] text-white" : "bg-[#F7F4EE] text-[#676B64]"
                  }`}>
                    <IconHomeTuition size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs font-bold text-[#232520]">Home Tuition (In-Person)</strong>
                      <span className="rounded bg-[#4F7867]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#4F7867]">
                        Verified
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#676B64] leading-relaxed">
                      Tutor visits student residence in verified Hyderabad areas (B.N. Reddy Nagar, LB Nagar, Dilsukhnagar).
                    </p>
                  </div>
                </button>
              </div>

              {mode === "home" && (
                <div className="mt-4 rounded-xl border border-[#4F7867]/30 bg-[#E6F0EA]/60 p-3.5 text-xs text-[#232520] flex items-center gap-2">
                  <IconShieldCheck size={16} className="text-[#4F7867] shrink-0" />
                  <span>
                    Home tuition eligibility verified for student address in <strong>B.N. Reddy Nagar, Hyderabad</strong>. Zero commute for student.
                  </span>
                </div>
              )}
            </div>

            {/* Weekly Days Timeline Selector */}
            <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#676B64] flex items-center gap-2">
                  <IconCalendar size={15} className="text-[#66518A]" />
                  <span>2. Preferred Class Days ({selectedDays.length} days selected)</span>
                </label>
                <span className="text-xs font-semibold text-[#66518A]">
                  Target: {classes === 8 ? "2 days/wk" : classes === 12 ? "3 days/wk" : "3-4 days/wk"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
                {availableDays.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "border-[#66518A] bg-[#66518A] text-white shadow-xs font-bold"
                          : "border-[#E4DED4] bg-[#FFFEFB] text-[#232520] hover:border-[#66518A]/40 font-semibold"
                      }`}
                    >
                      <span className="text-xs">{day.slice(0, 3)}</span>
                      <span className="block text-[11px] opacity-80 font-normal">{day}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Class Timing Selector */}
            <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#676B64] flex items-center gap-2 mb-4">
                <IconClock size={15} className="text-[#66518A]" />
                <span>3. Daily Time Window (60 Minutes)</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {availableTimes.map((t) => {
                  const isSelected = selectedTime === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        isSelected
                          ? "border-[#66518A] bg-[#EFEAF8] text-[#66518A] shadow-xs"
                          : "border-[#E4DED4] bg-[#FFFEFB] text-[#232520] hover:border-[#66518A]/40"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4DED4] bg-[#FFFEFB]/95 px-4 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#676B64] font-bold">Planned Schedule</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-xs sm:text-sm font-extrabold text-[#232520]">
                {selectedDays.map((d) => d.slice(0, 3)).join(", ")} @ {selectedTime} ({mode.toUpperCase()})
              </strong>
              <span className="text-xs font-bold text-[#66518A]">
                {formatCurrency(price)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-[#66518A] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
          >
            <span>Proceed to Checkout</span>
            <IconArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE] text-xs font-bold text-[#676B64]">
          Loading schedule planner...
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
