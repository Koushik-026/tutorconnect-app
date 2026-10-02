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
  const [studentGrade, setStudentGrade] = useState("Grade 10");
  const [parentPhone, setParentPhone] = useState("+91 98765 43210");
  const [learningGoal, setLearningGoal] = useState(
    "Clarify calculus fundamentals and build exam problem-solving confidence."
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
    });
    router.push(`/demo/confirmation?${query.toString()}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
      {/* Editorial Header */}
      <header className="sticky top-0 z-30 border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href={`/tutors/${tutor.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#676B64] hover:text-[#66518A] transition-colors"
          >
            <IconArrowLeft size={14} />
            <span>Back to Tutor Profile</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Header anchor */}
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B7A5DE]/40 bg-[#EFEAF8] px-3 py-1 text-xs font-bold tracking-wide text-[#66518A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#66518A]" />
              Free 30-Minute 1-on-1 Demo Session
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-extrabold tracking-tight text-[#232520] sm:text-3xl">
              Schedule Your Free Demo with {tutor.name}
            </h1>
            <p className="mt-2 text-sm text-[#676B64] leading-relaxed">
              Experience personalized live teaching online with no payment commitment.
              Confirm your convenient time slot below.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left 7 cols: Scheduler Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              {/* Step 1: Select Date */}
              <div className="rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#676B64] flex items-center gap-2">
                    <IconCalendar size={15} className="text-[#66518A]" />
                    <span>1. Choose Demo Date</span>
                  </label>
                  <span className="text-xs font-semibold text-[#66518A]">October 2026</span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {dateOptions.map((item) => {
                    const isSelected = selectedDate === item.date;
                    return (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => {
                          setSelectedDate(item.date);
                          setSelectedSlot(availableSlots[item.date]?.[0] || "10:00 AM");
                        }}
                        className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-[#66518A] bg-[#EFEAF8] shadow-xs"
                            : "border-[#E4DED4] bg-[#FFFEFB] hover:border-[#66518A]/40"
                        }`}
                      >
                        <span className={`text-xs font-bold ${isSelected ? "text-[#66518A]" : "text-[#232520]"}`}>
                          {item.label}
                        </span>
                        <span className="mt-1 text-[11px] text-[#676B64] font-medium">
                          {item.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Time */}
              <div className="rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#676B64] flex items-center gap-2">
                    <IconClock size={15} className="text-[#66518A]" />
                    <span>2. Select Time Slot (30 mins)</span>
                  </label>
                  <span className="text-xs text-[#676B64]">IST (Indian Standard Time)</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {currentSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          isSelected
                            ? "border-[#66518A] bg-[#66518A] text-white shadow-xs"
                            : "border-[#E4DED4] bg-[#FFFEFB] text-[#232520] hover:border-[#66518A]/40"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Student Details */}
              <div className="rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-5 sm:p-6 shadow-xs space-y-4">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#676B64] block">
                  3. Learner Profile &amp; Goals
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="student-name" className="block text-xs font-bold text-[#676B64] mb-1.5">
                      Student Full Name
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label htmlFor="student-grade" className="block text-xs font-bold text-[#676B64] mb-1.5">
                      Current Grade / Curriculum
                    </label>
                    <select
                      id="student-grade"
                      value={studentGrade}
                      onChange={(e) => setStudentGrade(e.target.value)}
                      className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                    >
                      <option value="Grade 8">Grade 8 (CBSE/ICSE)</option>
                      <option value="Grade 9">Grade 9 (CBSE/ICSE)</option>
                      <option value="Grade 10">Grade 10 (Board Prep)</option>
                      <option value="Grade 11">Grade 11 (Science Stream)</option>
                      <option value="Grade 12">Grade 12 (Board + Entrance)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="parent-phone" className="block text-xs font-bold text-[#676B64] mb-1.5">
                    Parent / Contact WhatsApp Number
                  </label>
                  <input
                    id="parent-phone"
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="learning-goal" className="block text-xs font-bold text-[#676B64] mb-1.5">
                    Primary Topic or Learning Focus
                  </label>
                  <textarea
                    id="learning-goal"
                    rows={2}
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#66518A] px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
              >
                <span>Confirm &amp; Book Free Demo</span>
                <IconArrowRight size={16} />
              </button>
            </form>

            {/* Right 5 cols: Dossier Snapshot & Trust */}
            <div className="lg:col-span-5 space-y-5">
              {/* Tutor Card */}
              <div className="rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-5 shadow-xs">
                <div className="flex items-start gap-4">
                  {tutor.profileImage ? (
                    <div
                      role="img"
                      aria-label={tutor.name}
                      className="h-16 w-16 shrink-0 rounded-2xl bg-cover bg-center border border-[#E4DED4]"
                      style={{ backgroundImage: `url('${tutor.profileImage}')` }}
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EFEAF8] text-base font-extrabold text-[#66518A] border border-[#B7A5DE]/40">
                      {tutor.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#232520]">
                        {tutor.name}
                      </h3>
                      <IconShieldCheck size={16} className="text-[#4F7867]" />
                    </div>
                    <p className="text-xs text-[#676B64]">{tutor.headline}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tutor.subjects.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-[#EFEAF8] px-2 py-0.5 text-[10px] font-bold text-[#66518A]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#E4DED4]/60 pt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#676B64]">
                    <span>Format:</span>
                    <span className="font-bold text-[#232520] flex items-center gap-1">
                      <IconVideo size={13} className="text-[#66518A]" />
                      Online 1-on-1 Interactive
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#676B64]">
                    <span>Duration:</span>
                    <span className="font-bold text-[#232520]">30 Minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-[#676B64]">
                    <span>Fee:</span>
                    <span className="font-bold text-[#4F7867]">Free (Zero payment)</span>
                  </div>
                </div>
              </div>

              {/* Demo Session Guarantee / Checklist */}
              <div className="rounded-2xl border border-[#E4DED4] bg-[#E6F0EA]/50 p-5">
                <h4 className="font-[family-name:var(--font-manrope)] text-xs font-extrabold uppercase tracking-wider text-[#4F7867] mb-3">
                  What happens during the demo:
                </h4>
                <ul className="space-y-2.5 text-xs text-[#232520]">
                  <li className="flex items-start gap-2">
                    <IconCheck size={14} className="mt-0.5 text-[#4F7867] shrink-0" />
                    <span>Live concept evaluation and diagnostic problem-solving.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck size={14} className="mt-0.5 text-[#4F7867] shrink-0" />
                    <span>Experience teaching pace and interactive visual whiteboard.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck size={14} className="mt-0.5 text-[#4F7867] shrink-0" />
                    <span>Customized weekly learning study plan recommendation.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DemoBookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE] text-xs font-bold text-[#676B64]">
          Loading scheduler...
        </div>
      }
    >
      <DemoBookInner />
    </Suspense>
  );
}
