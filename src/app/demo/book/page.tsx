"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import {
  IconClock,
  IconVideo,
  IconShieldCheck,
  IconArrowRight,
  IconArrowLeft,
} from "@/components/ui/icons";

const availableSlots: Record<number, string[]> = {
  4: ["2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
  5: ["11:30 AM", "3:00 PM", "4:30 PM"],
  6: ["4:00 PM", "5:00 PM", "6:30 PM"],
  7: ["10:00 AM", "11:30 AM", "5:00 PM"],
  8: ["10:00 AM", "11:30 AM", "4:00 PM"],
  10: ["3:00 PM", "4:00 PM", "5:30 PM"],
  11: ["4:00 PM", "5:00 PM", "6:00 PM"],
};

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function DemoBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tutorId = searchParams.get("tutor") ?? "ananya-sharma";
  const tutor = tutors.find((t) => t.id === tutorId) ?? tutors[0];

  const [selectedDay, setSelectedDay] = useState(4);
  const [selectedTime, setSelectedTime] = useState("4:00 PM");

  const calendarDays = useMemo(() => {
    const emptyDaysBeforeAugust = 6; // Aug 2026 starts on Saturday
    const totalDays = 31;
    return Array.from({ length: emptyDaysBeforeAugust + totalDays }, (_, index) => {
      if (index < emptyDaysBeforeAugust) return null;
      return index - emptyDaysBeforeAugust + 1;
    });
  }, []);

  const currentSlots = availableSlots[selectedDay] ?? [
    "10:00 AM",
    "11:30 AM",
    "4:00 PM",
    "5:30 PM",
  ];

  function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      `/demo/confirmation?tutor=${tutor.id}&day=${selectedDay}&time=${encodeURIComponent(selectedTime)}`
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <Link
            href={`/tutors/${tutor.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <IconArrowLeft size={14} />
            <span>Cancel</span>
          </Link>
        </div>
      </header>

      {/* Main Booking Container */}
      <main id="main-content" className="flex-1 py-8 sm:py-12">
        <div className="container-shell max-w-4xl">
          {/* Progress Indicator */}
          <div className="mb-6 flex items-center gap-2 text-xs font-bold text-blue-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              1
            </span>
            <span>Schedule Free Online Demo</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-400">Step 1 of 2</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Interactive Calendar + Slot Selection (8 cols) */}
            <div className="space-y-6 lg:col-span-7">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-slate-900">
                      Select Demo Date
                    </h1>
                    <p className="text-xs text-slate-500">August 2026 (IST)</p>
                  </div>
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    30-min Session
                  </span>
                </div>

                {/* Calendar Grid */}
                <div className="mt-4">
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                    {weekDays.map((d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarDays.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="h-10" />;
                      }

                      const isAvailable = Boolean(availableSlots[day]);
                      const isSelected = selectedDay === day;

                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => {
                            setSelectedDay(day);
                            const slots = availableSlots[day] ?? [];
                            if (slots.length > 0) setSelectedTime(slots[0]);
                          }}
                          className={`flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-xs"
                              : isAvailable
                              ? "bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-700"
                              : "text-slate-300 cursor-not-allowed"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots for Selected Day */}
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Available Time Slots for {selectedDay} August
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {currentSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition ${
                            isSelected
                              ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <IconClock size={13} className={isSelected ? "text-blue-600" : "text-slate-400"} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Session Summary Card (5 cols) */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <h2 className="font-[family-name:var(--font-manrope)] text-base font-bold text-slate-900 mb-4">
                  Booking Summary
                </h2>

                {/* Tutor Info */}
                <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-[#f8fafc] p-3.5">
                  {tutor.profileImage ? (
                    <div
                      role="img"
                      aria-label={tutor.name}
                      className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-cover bg-center"
                      style={{ backgroundImage: `url('${tutor.profileImage}')` }}
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-extrabold text-white text-sm">
                      {tutor.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="truncate font-bold text-slate-900 text-sm">{tutor.name}</h3>
                      <IconShieldCheck size={14} className="text-emerald-600" />
                    </div>
                    <p className="truncate text-xs text-slate-500">{tutor.headline}</p>
                  </div>
                </div>

                {/* Details List */}
                <div className="mt-4 space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date &amp; Time</span>
                    <span className="font-bold text-slate-900">
                      {selectedDay} Aug 2026 &bull; {selectedTime} IST
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Class Mode</span>
                    <span className="font-bold text-blue-700 flex items-center gap-1">
                      <IconVideo size={13} />
                      1-on-1 Online Class
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duration</span>
                    <span className="font-bold text-slate-900">30 Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cost</span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Free (â‚¹0)
                    </span>
                  </div>
                </div>

                {/* Student Info */}
                <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  <div className="font-bold text-slate-800">Student Profile:</div>
                  <div className="mt-0.5 text-slate-600">Aarav Reddy &bull; Class 9 &bull; CBSE</div>
                </div>

                {/* Submit Action */}
                <form onSubmit={handleBooking} className="mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold shadow-sm"
                  >
                    <span>Confirm Free Demo</span>
                    <IconArrowRight size={15} />
                  </button>
                  <p className="mt-2 text-center text-[11px] text-slate-400">
                    No payment details required &bull; Instant confirmation
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DemoBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbfc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading booking calendar...</div>}>
      <DemoBookingContent />
    </Suspense>
  );
}
