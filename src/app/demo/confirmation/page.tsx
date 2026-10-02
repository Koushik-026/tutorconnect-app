"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import {
  IconCheck,
  IconCalendar,
  IconVideo,
  IconShieldCheck,
  IconArrowRight,
  IconChecklist,
  IconClock,
} from "@/components/ui/icons";

function getEndTime(time: string) {
  if (time.includes("10:00")) return "10:30 AM";
  if (time.includes("02:00")) return "02:30 PM";
  if (time.includes("04:30")) return "05:00 PM";
  if (time.includes("06:00")) return "06:30 PM";
  if (time.includes("11:30")) return "12:00 PM";
  if (time.includes("03:00")) return "03:30 PM";
  if (time.includes("05:00")) return "05:30 PM";
  if (time.includes("07:00")) return "07:30 PM";
  return "30 mins after start";
}

function DemoConfirmationInner() {
  const searchParams = useSearchParams();
  const tutorId = searchParams.get("tutor") || "ananya-sharma";
  const date = searchParams.get("date") || "2026-10-05";
  const time = searchParams.get("time") || "04:30 PM";
  const student = searchParams.get("student") || "Aarav Mehta";

  const tutor =
    tutors.find((item) => item.id === tutorId) ||
    tutors.find((item) => item.id === "ananya-sharma") ||
    tutors[0];

  const endTime = getEndTime(time);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
      {/* Header */}
      <header className="border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-[#676B64] hover:text-[#66518A] transition-colors"
          >
            Go to Student Dashboard &rarr;
          </Link>
        </div>
      </header>

      {/* Main Ticket Container */}
      <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl">
          {/* Appointment Ticket Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] shadow-sm">
            {/* Top decorative perforated header */}
            <div className="bg-[#EFEAF8] px-6 py-6 border-b border-[#E4DED4] text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#66518A] text-white shadow-xs mb-3">
                <IconCheck size={24} />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFEFB] px-3 py-1 text-xs font-bold text-[#66518A]">
                Appointment Confirmed &bull; Free Demo
              </span>
              <h1 className="mt-2 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520] sm:text-3xl">
                You&apos;re All Set for Your Demo
              </h1>
              <p className="mt-1 text-xs text-[#676B64]">
                Session details and schedule timing are confirmed in your TutorConnect workspace.
              </p>
            </div>

            {/* Ticket Body with Details */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Tutor & Schedule Row */}
              <div className="grid gap-4 rounded-2xl border border-[#E4DED4] bg-[#F7F4EE]/60 p-4 sm:grid-cols-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#676B64]">
                    Instructor
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    {tutor.profileImage ? (
                      <div
                        role="img"
                        aria-label={tutor.name}
                        className="h-9 w-9 rounded-xl bg-cover bg-center border border-[#E4DED4]"
                        style={{ backgroundImage: `url('${tutor.profileImage}')` }}
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFEAF8] text-xs font-bold text-[#66518A] border border-[#B7A5DE]/40">
                        {tutor.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1">
                        <strong className="text-xs font-bold text-[#232520]">
                          {tutor.name}
                        </strong>
                        <IconShieldCheck size={14} className="text-[#4F7867]" />
                      </div>
                      <p className="text-[11px] text-[#676B64]">{tutor.subjects[0]}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#676B64]">
                    Student Learner
                  </span>
                  <p className="mt-1 text-xs font-bold text-[#232520]">{student}</p>
                  <p className="text-[11px] text-[#676B64]">1-on-1 Personalized Session</p>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-[#E4DED4]/60 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#676B64] flex items-center gap-1">
                      <IconCalendar size={13} className="text-[#66518A]" />
                      Date
                    </span>
                    <p className="mt-1 text-xs font-bold text-[#232520]">{date}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#676B64] flex items-center gap-1">
                      <IconClock size={13} className="text-[#66518A]" />
                      Time Window
                    </span>
                    <p className="mt-1 text-xs font-bold text-[#232520]">
                      {time} – {endTime} (30 min)
                    </p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h3 className="font-[family-name:var(--font-manrope)] text-xs font-bold uppercase tracking-wider text-[#676B64] mb-3 flex items-center gap-1.5">
                  <IconChecklist size={14} className="text-[#4F7867]" />
                  <span>Session Preparation Checklist</span>
                </h3>
                <ul className="space-y-2 text-xs text-[#232520]">
                  <li className="flex items-start gap-2">
                    <IconCheck size={13} className="mt-0.5 text-[#4F7867] shrink-0" />
                    <span>Join 5 minutes early to test microphone and video output.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck size={13} className="mt-0.5 text-[#4F7867] shrink-0" />
                    <span>Keep your notebook and previous test or chapter doubts ready.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck size={13} className="mt-0.5 text-[#4F7867] shrink-0" />
                    <span>Parents are welcome to attend the final 5 minutes for study planning.</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/demo/waiting-room"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#66518A] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
                >
                  <IconVideo size={16} />
                  <span>Enter Waiting Room (Demo Simulation)</span>
                  <IconArrowRight size={15} />
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/dashboard/student"
                    className="inline-flex items-center justify-center rounded-xl border border-[#E4DED4] bg-[#FFFEFB] py-2.5 px-3 text-xs font-bold text-[#232520] hover:bg-[#F7F4EE] transition-colors"
                  >
                    View Student Dashboard
                  </Link>
                  <Link
                    href="/tutors"
                    className="inline-flex items-center justify-center rounded-xl border border-[#E4DED4] bg-[#FFFEFB] py-2.5 px-3 text-xs font-bold text-[#676B64] hover:text-[#232520] hover:bg-[#F7F4EE] transition-colors"
                  >
                    Browse Other Tutors
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DemoConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE] text-xs font-bold text-[#676B64]">
          Loading confirmation ticket...
        </div>
      }
    >
      <DemoConfirmationInner />
    </Suspense>
  );
}
