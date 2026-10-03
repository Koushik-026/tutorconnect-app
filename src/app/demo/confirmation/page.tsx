"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DemoBookingRow } from "@/lib/types/database";
import {
  IconCheck,
  IconShieldCheck,
  IconArrowRight,
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
  const bookingId = searchParams.get("booking_id");
  const tutorId = searchParams.get("tutor") || "ananya-sharma";
  const queryDate = searchParams.get("date") || "2026-10-05";
  const queryTime = searchParams.get("time") || "04:30 PM";
  const queryStudent = searchParams.get("student") || "Aarav Mehta";

  const [booking, setBooking] = useState<DemoBookingRow | null>(null);
  const tutor = tutors.find((t) => t.id === (booking?.tutor_slug || tutorId)) || tutors[0];

  useEffect(() => {
    if (!bookingId || !isSupabaseConfigured()) return;

    const supabase = createClient();
    supabase
      .from("demo_bookings")
      .select("*")
      .eq("id", bookingId)
      .single()
      .then(({ data }) => {
        if (data) {
          setBooking(data as DemoBookingRow);
        }
      });
  }, [bookingId]);

  let displayDate = queryDate;
  let displayTime = queryTime;
  let displayEndTime = getEndTime(queryTime);
  const displayStudent = queryStudent;

  if (booking) {
    const start = new Date(booking.scheduled_start_at);
    const end = new Date(booking.scheduled_end_at);
    displayDate = start.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    displayTime = start.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    displayEndTime = end.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition"
          >
            Go to Student Workspace &rarr;
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-2xl mx-auto">
          {/* Dominant Appointment Card */}
          <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)] text-center">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E3EADD] px-4 py-1.5 text-xs font-bold text-[#244A40] mb-6">
              <IconCheck size={14} />
              <span>Demo Session Confirmed &bull; ₹0 Paid</span>
            </div>

            <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-[#25231F]">
              You&apos;re Scheduled with {booking?.tutor_name || tutor.name}
            </h1>
            <p className="mt-2 text-sm text-[#6F6A62]">
              We have reserved your free 30-minute 1-on-1 online trial.
            </p>

            {/* Appointment Details Highlight */}
            <div className="mt-8 rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-6 text-left space-y-4">
              <div className="flex items-start justify-between border-b border-[rgba(55,48,40,0.06)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E4EEE9] text-sm font-extrabold text-[#244A40]">
                    {(booking?.tutor_name || tutor.name)
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-[#25231F]">{booking?.tutor_name || tutor.name}</p>
                      <span className="text-[#315F52]"><IconShieldCheck size={15} /></span>
                    </div>
                    <p className="text-xs text-[#6F6A62]">{tutor.headline}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#E4EEE9] px-2.5 py-0.5 text-xs font-bold text-[#244A40]">
                  1-on-1 Online
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#9B958C] font-bold block mb-0.5">DATE &amp; TIME</span>
                  <p className="font-bold text-[#25231F] text-sm">{displayDate}</p>
                  <p className="text-[#6F6A62]">{displayTime} &ndash; {displayEndTime}</p>
                </div>
                <div>
                  <span className="text-[#9B958C] font-bold block mb-0.5">STUDENT &amp; SUBJECT</span>
                  <p className="font-bold text-[#25231F] text-sm">
                    {displayStudent} &bull; {booking?.subject || "Mathematics & Science"}
                  </p>
                  <p className="text-[#6F6A62]">Interactive Digital Classroom</p>
                </div>
              </div>
            </div>

            {/* Preparation Checklist */}
            <div className="mt-8 text-left space-y-2.5 border-t border-[rgba(55,48,40,0.08)] pt-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62] block mb-2">
                Quick Preparation Checklist
              </span>
              <div className="flex items-center gap-2.5 text-xs text-[#25231F]">
                <IconCheck size={14} className="text-[#315F52] shrink-0" />
                <span>Test your device microphone and camera 5 minutes prior to session.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#25231F]">
                <IconCheck size={14} className="text-[#315F52] shrink-0" />
                <span>Keep notebook and recent syllabus questions ready for discussion.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#25231F]">
                <IconCheck size={14} className="text-[#315F52] shrink-0" />
                <span>Join the waiting room directly using the button below at scheduled time.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/demo/waiting-room?tutor=${tutor.id}&date=${displayDate}&time=${encodeURIComponent(displayTime)}`}
                className="btn btn-primary min-h-[48px] px-8 rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
              >
                <span>Enter Demo Waiting Room</span>
                <IconArrowRight size={15} />
              </Link>

              <Link
                href="/dashboard/student"
                className="btn btn-outline min-h-[48px] px-6 rounded-full text-xs font-bold justify-center"
              >
                <span>View Workspace</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DemoConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF5]" />}>
      <DemoConfirmationInner />
    </Suspense>
  );
}
