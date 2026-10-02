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
  IconCalendar,
  IconCheck,
} from "@/components/ui/icons";

const availableSlots: Record<string, string[]> = {
  "2026-10-05": ["10:00 AM", "02:00 PM", "04:30 PM", "06:00 PM"],
  "2026-10-06": ["11:30 AM", "03:00 PM", "05:00 PM", "07:00 PM"],
  "2026-10-07": ["09:30 AM", "01:00 PM", "04:00 PM", "06:30 PM"],
  "2026-10-08": ["10:00 AM", "02:30 PM", "05:00 PM"],
  "2026-10-09": ["11:00 AM", "03:30 PM", "06:00 PM", "07:30 PM"],
};

const dateOptions = [
  { date: "2026-10-05", label: "Mon, Oct 5", note: "4 slots" },
  { date: "2026-10-06", label: "Tue, Oct 6", note: "4 slots" },
  { date: "2026-10-07", label: "Wed, Oct 7", note: "4 slots" },
  { date: "2026-10-08", label: "Thu, Oct 8", note: "3 slots" },
  { date: "2026-10-09", label: "Fri, Oct 9", note: "4 slots" },
];

function DemoBookInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tutorParam = searchParams.get("tutor") || "ananya-sharma";

  const tutor = useMemo(() => {
    return (
      tutors.find((item) => item.id === tutorParam) ||
      tutors.find((item) => item.id === "ananya-sharma") ||
      tutors[0]
    );
  }, [tutorParam]);

  const [selectedDate, setSelectedDate] = useState("2026-10-05");
  const [selectedSlot, setSelectedSlot] = useState("04:30 PM");
  const [studentName, setStudentName] = useState("Aarav Mehta");
  const [studentGrade, setStudentGrade] = useState("Class 9");
  const [parentPhone, setParentPhone] = useState("+91 98765 43210");
  const [learningGoal, setLearningGoal] = useState(
    "Clarify core concept fundamentals and build exam problem-solving confidence."
  );

  const currentSlots = availableSlots[selectedDate] || [
    "10:00 AM",
    "02:00 PM",
    "05:00 PM",
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams({
      tutor: tutor.id,
      date: selectedDate,
      time: selectedSlot,
      student: studentName,
      grade: studentGrade,
      phone: parentPhone,
      goal: learningGoal,
    });
    router.push(`/demo/confirmation?${query.toString()}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF8]">
      <header className="border-b border-[rgba(54,48,60,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href={`/tutors/${tutor.id}`}
            className="text-xs font-bold text-[#6D706A] hover:text-[#20221F] transition"
          >
            &larr; Back to Tutor
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16">
        <div className="container-shell max-w-4xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E5F0EA] px-3.5 py-1 text-xs font-bold text-[#3D5A4D]">
              <IconVideo size={13} />
              <span>Free 30-Minute Online Trial &bull; ₹0 Payment</span>
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20221F]">
              Schedule Your Free Demo
            </h1>
            <p className="mt-2 text-sm text-[#6D706A]">
              Connect 1-on-1 with <strong className="text-[#20221F]">{tutor.name}</strong> to evaluate teaching rapport before choosing any package.
            </p>
          </div>

          {/* Primary Focal Scheduling Object */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[rgba(54,48,60,0.12)] bg-white p-6 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-8"
          >
            {/* 1. Date Selection Pills */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A] block mb-3">
                1. Select Preferred Date
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.date}
                    type="button"
                    onClick={() => {
                      setSelectedDate(opt.date);
                      setSelectedSlot(availableSlots[opt.date]?.[0] || "10:00 AM");
                    }}
                    className={`rounded-2xl border p-3.5 text-center transition-all ${
                      selectedDate === opt.date
                        ? "border-[#7257A5] bg-[#EEE7FF]/50 shadow-xs"
                        : "border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] hover:border-[#7257A5]/40"
                    }`}
                  >
                    <p className={`text-xs font-bold ${selectedDate === opt.date ? "text-[#594282]" : "text-[#20221F]"}`}>
                      {opt.label}
                    </p>
                    <span className="text-[10px] font-semibold text-[#6D706A] mt-0.5 block">
                      {opt.note}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Time Slot Selection */}
            <div>
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A] block mb-3">
                2. Select 30-Minute Online Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currentSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex items-center justify-center gap-1.5 rounded-2xl border py-3 px-4 text-xs font-bold transition-all ${
                      selectedSlot === slot
                        ? "border-[#7257A5] bg-[#7257A5] text-white shadow-xs"
                        : "border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] text-[#20221F] hover:border-[#7257A5]/40"
                    }`}
                  >
                    <IconClock size={13} />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Student & Parent Context */}
            <div className="border-t border-[rgba(54,48,60,0.08)] pt-6">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A] block mb-3">
                3. Student Details &amp; Learning Goals
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-bold text-[#6D706A] block mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(54,48,60,0.12)] bg-[#FFFDF9] px-3.5 py-2.5 text-xs font-semibold text-[#20221F] focus:border-[#7257A5] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#6D706A] block mb-1">
                    Class / Grade
                  </label>
                  <input
                    type="text"
                    required
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(54,48,60,0.12)] bg-[#FFFDF9] px-3.5 py-2.5 text-xs font-semibold text-[#20221F] focus:border-[#7257A5] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#6D706A] block mb-1">
                    Parent Contact Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(54,48,60,0.12)] bg-[#FFFDF9] px-3.5 py-2.5 text-xs font-semibold text-[#20221F] focus:border-[#7257A5] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold text-[#6D706A] block mb-1">
                  Focus Topics for Demo
                </label>
                <textarea
                  rows={2}
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  className="w-full rounded-2xl border border-[rgba(54,48,60,0.12)] bg-[#FFFDF9] p-3 text-xs font-semibold text-[#20221F] focus:border-[#7257A5] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Trial Note & Submit CTA */}
            <div className="border-t border-[rgba(54,48,60,0.08)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#5D806F] font-semibold">
                <IconCheck size={16} />
                <span>Zero charge &bull; Exactly 30 minutes &bull; Online 1-on-1</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto min-h-[48px] px-8 rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(114,87,165,0.22)] justify-center gap-2"
              >
                <span>Confirm Free Demo</span>
                <IconArrowRight size={15} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function DemoBookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFBF8]" />}>
      <DemoBookInner />
    </Suspense>
  );
}
