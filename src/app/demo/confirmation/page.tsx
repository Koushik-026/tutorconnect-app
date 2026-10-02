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
} from "@/components/ui/icons";

function getEndTime(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);
  if (!match) return time;

  let hour = Number(match[1]);
  let minute = Number(match[2]);
  const period = match[3];

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  minute += 30;
  if (minute >= 60) {
    hour += 1;
    minute -= 60;
  }
  hour %= 24;

  const outputPeriod = hour >= 12 ? "PM" : "AM";
  let outputHour = hour % 12;
  if (outputHour === 0) outputHour = 12;

  return `${outputHour}:${String(minute).padStart(2, "0")} ${outputPeriod}`;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();

  const tutorId = searchParams.get("tutor") ?? "ananya-sharma";
  const tutor = tutors.find((t) => t.id === tutorId) ?? tutors[0];
  const day = Number(searchParams.get("day")) || 4;
  const time = searchParams.get("time") || "4:00 PM";
  const endTime = getEndTime(time);

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            Go to Dashboard &rarr;
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            {/* Top Calm Success Header */}
            <div className="border-b border-slate-100 bg-gradient-to-b from-blue-50/70 to-white px-6 py-8 text-center sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <IconCheck size={28} />
              </div>

              <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200/60">
                <IconVideo size={13} />
                Free 30-Minute Online Demo
              </span>

              <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Demo Session Confirmed
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Your online evaluation with <strong className="text-slate-900">{tutor.name}</strong> is scheduled.
              </p>
            </div>

            {/* Schedule & Tutor Card */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Date & Time Callout */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
                    <IconCalendar size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Scheduled Date &amp; Time
                    </span>
                    <div className="font-[family-name:var(--font-manrope)] text-base font-extrabold text-slate-900">
                      {day} August 2026 &bull; {time} – {endTime} IST
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-xs font-bold text-emerald-800 shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>30 Min &bull; Free</span>
                </div>
              </div>

              {/* Educator & Student Overview */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200/80 bg-[#f8fafc] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Educator
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <h2 className="font-bold text-slate-900 text-sm">{tutor.name}</h2>
                    <IconShieldCheck size={14} className="text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-500">{tutor.headline}</p>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-[#f8fafc] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Student
                  </span>
                  <h2 className="mt-1 font-bold text-slate-900 text-sm">Aarav Reddy</h2>
                  <p className="text-xs text-slate-500">Class 9 &bull; CBSE Curriculum</p>
                </div>
              </div>

              {/* Preparation Checklist */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2">
                  <IconChecklist size={16} className="text-blue-600" />
                  <span>Pre-Session Checklist</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <IconCheck size={13} className="text-emerald-600 shrink-0" />
                    <span>Join on a laptop or tablet with working camera &amp; mic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck size={13} className="text-emerald-600 shrink-0" />
                    <span>Have student notebook and questions ready</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconCheck size={13} className="text-emerald-600 shrink-0" />
                    <span>Join link activates 10 minutes prior to session start</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <Link
                  href="/demo/waiting-room"
                  className="btn btn-primary w-full min-h-[46px] text-xs font-bold shadow-xs"
                >
                  <span>Enter Waiting Room</span>
                  <IconArrowRight size={14} />
                </Link>

                <Link
                  href="/dashboard/student"
                  className="btn btn-secondary w-full min-h-[46px] text-xs font-bold"
                >
                  <span>Go to Student Dashboard</span>
                </Link>
              </div>

              <p className="text-center text-[11px] text-slate-400">
                Frontend preview &bull; Simulated demo confirmation
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DemoConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbfc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
