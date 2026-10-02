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
  IconCheck,
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

function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId = searchParams.get("tutor") || "ananya-sharma";
  const tutor = tutors.find((t) => t.id === tutorId) || tutors[0];

  const packageId = searchParams.get("package") || "package-12";
  const classesCount = Number(searchParams.get("classes")) || 12;
  const packagePrice = Number(searchParams.get("amount")) || 4500;

  const [mode, setMode] = useState<TuitionMode>("online");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);
  const [selectedTime, setSelectedTime] = useState<string>("5:00 PM");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.length > 1
          ? prev.filter((d) => d !== day)
          : prev
        : [...prev, day]
    );
  };

  const handleContinue = () => {
    const query = new URLSearchParams({
      tutor: tutor.id,
      package: packageId,
      classes: String(classesCount),
      price: String(packagePrice),
      mode,
      days: selectedDays.join(", "),
      time: selectedTime,
    });
    router.push(`/payment/checkout?${query.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF8] text-[#20221F]">
      <header className="border-b border-[rgba(54,48,60,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href={`/packages/select?tutor=${tutor.id}`}
            className="text-xs font-bold text-[#6D706A] hover:text-[#20221F] transition"
          >
            &larr; Back to Packages
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20">
        <div className="container-shell max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E5F0EA] px-3.5 py-1 text-xs font-bold text-[#3D5A4D] mb-3">
              <IconCalendar size={13} />
              <span>Step 2 of 3: Weekly Rhythm</span>
            </span>
            <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-[#20221F]">
              Set Your Weekly Schedule
            </h1>
            <p className="mt-2 text-sm text-[#6D706A]">
              Choose your preferred weekly recurring slots for {classesCount} classes with <strong className="text-[#20221F]">{tutor.name}</strong>.
            </p>
          </div>

          {/* Focal Schedule Composer Object */}
          <div className="rounded-3xl border border-[rgba(54,48,60,0.12)] bg-white p-7 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-8">
            {/* Mode Switcher */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A] block mb-3">
                1. Select Tuition Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("online")}
                  className={`rounded-2xl border p-4 text-left transition-all flex items-start gap-3 ${
                    mode === "online"
                      ? "border-[#7257A5] bg-[#EEE7FF]/40 shadow-xs"
                      : "border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] hover:border-[#7257A5]/30"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEE7FF] text-[#594282]">
                    <IconVideo size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-[#20221F]">Online Classroom</p>
                      {mode === "online" && <IconCheck size={14} className="text-[#7257A5]" />}
                    </div>
                    <p className="text-xs text-[#6D706A] mt-0.5">
                      1-on-1 interactive video with shared whiteboard and lesson notes.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("home")}
                  className={`rounded-2xl border p-4 text-left transition-all flex items-start gap-3 ${
                    mode === "home"
                      ? "border-[#7257A5] bg-[#FCE7DE]/40 shadow-xs"
                      : "border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] hover:border-[#7257A5]/30"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCE7DE] text-[#A85834]">
                    <IconHomeTuition size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-[#20221F]">Eligible Home Tuition</p>
                      {mode === "home" && <IconCheck size={14} className="text-[#7257A5]" />}
                    </div>
                    <p className="text-xs text-[#6D706A] mt-0.5">
                      In-person visits in Hyderabad ({tutor.locality} radius).
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Weekly Days Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A]">
                  2. Choose Recurring Weekly Days
                </label>
                <span className="text-xs text-[#7257A5] font-semibold">
                  {selectedDays.length} days selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {availableDays.map((day) => {
                  const selected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`rounded-2xl border py-3 px-2 text-center text-xs font-bold transition-all ${
                        selected
                          ? "border-[#7257A5] bg-[#7257A5] text-white shadow-xs"
                          : "border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] text-[#20221F] hover:border-[#7257A5]/30"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A] block mb-3">
                3. Choose Preferred Class Time
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`flex items-center justify-center gap-2 rounded-2xl border py-3 px-4 text-xs font-bold transition-all ${
                      selectedTime === time
                        ? "border-[#7257A5] bg-[#EEE7FF] text-[#594282] shadow-xs"
                        : "border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] text-[#20221F] hover:border-[#7257A5]/30"
                    }`}
                  >
                    <IconClock size={13} />
                    <span>{time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary & Continue Button */}
            <div className="border-t border-[rgba(54,48,60,0.08)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#969991]">
                  Selected Rhythm Summary
                </span>
                <p className="text-xs font-bold text-[#20221F] mt-0.5">
                  {selectedDays.join(", ")} &bull; {selectedTime} &bull; {mode === "online" ? "Online" : "Home"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="btn btn-primary w-full sm:w-auto min-h-[48px] px-8 rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(114,87,165,0.22)] justify-center gap-2"
              >
                <span>Continue to Checkout</span>
                <IconArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ScheduleConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFBF8]" />}>
      <ScheduleContent />
    </Suspense>
  );
}
