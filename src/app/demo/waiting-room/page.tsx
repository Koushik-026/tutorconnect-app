"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DemoBookingRow } from "@/lib/types/database";
import {
  evaluateDemoJoinWindow,
  type DemoJoinWindowEvaluation,
} from "@/lib/utils/timing";
import {
  IconVideo,
  IconVideoOff,
  IconMic,
  IconMicOff,
  IconCheck,
  IconArrowRight,
  IconClock,
  IconArrowLeft,
  IconLock,
} from "@/components/ui/icons";

function WaitingRoomInner() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const [booking, setBooking] = useState<DemoBookingRow | null>(null);
  const [studentName, setStudentName] = useState<string>("Student");
  const [joinEvaluation, setJoinEvaluation] = useState<DemoJoinWindowEvaluation | null>(null);

  const [microphoneOn, setMicrophoneOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

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
          const row = data as DemoBookingRow;
          setBooking(row);

          const evaluation = evaluateDemoJoinWindow(row.scheduled_start_at, row.scheduled_end_at);
          setJoinEvaluation(evaluation);

          // Fetch student name
          supabase
            .from("student_profiles")
            .select("display_name")
            .eq("id", row.student_profile_id)
            .single()
            .then(({ data: sp }) => {
              if (sp?.display_name) {
                setStudentName(sp.display_name);
              }
            });
        }
      });
  }, [bookingId]);

  // Periodic refresh to update countdown & enable button as window approaches
  useEffect(() => {
    if (!booking) return;
    const interval = setInterval(() => {
      const evaluation = evaluateDemoJoinWindow(booking.scheduled_start_at, booking.scheduled_end_at);
      setJoinEvaluation(evaluation);
    }, 10000);
    return () => clearInterval(interval);
  }, [booking]);

  const tutorName = booking?.tutor_name || "Assigned Educator";
  const subjectName = booking?.subject || "Subject Diagnostic";

  // Countdown text derivation
  let timingLabel = "Demo Room Check";
  if (joinEvaluation) {
    if (joinEvaluation.canJoin) {
      timingLabel = "Demo Room Open - Ready to Enter";
    } else if (joinEvaluation.reason === "too_early") {
      timingLabel = "Demo starts in " + joinEvaluation.minutesUntilStart + "m (Room opens 10m before)";
    } else if (joinEvaluation.reason === "expired") {
      timingLabel = "Scheduled demo time has concluded";
    } else if (joinEvaluation.reason === "invalid_timing") {
      timingLabel = "Demo schedule details unavailable";
    }
  }

  return (
    <div className="container-shell max-w-4xl mx-auto w-full py-8">
      {/* Simulation Warning Banner */}
      <div className="mb-6 rounded-2xl bg-[#FFF7ED] border border-[rgba(55,48,40,0.10)] px-4 py-2.5 text-xs text-[#6F6A62] text-center">
        <span className="font-bold text-[#25231F]">Demo Room Preview:</span> Testing audio &amp; camera hardware locally. No external video streaming service is active during this preview.
      </div>

      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EADD] px-3.5 py-1 text-xs font-bold text-[#244A40] mb-3">
          <IconClock size={13} />
          <span>{timingLabel}</span>
        </span>
        <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
          Online Demo Waiting Room
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#6F6A62]">
          Verify your camera and microphone preview before entering the demo room with{" "}
          <strong className="text-[#25231F]">{tutorName}</strong>.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-center">
        {/* Large Camera Preview */}
        <div className="lg:col-span-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-[rgba(55,48,40,0.12)] bg-[#25231F] shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#315F52] animate-pulse" />
                <span>Local Camera Preview: {cameraOn ? "Active" : "Disabled"}</span>
              </div>

              <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold">
                30-Min Free Demo
              </span>
            </div>

            {cameraOn ? (
              <div className="text-center my-auto">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-2xl font-bold text-white border border-white/20">
                  {studentName.slice(0, 2).toUpperCase()}
                </div>
                <p className="mt-3 text-sm font-semibold text-white/90">{studentName} (Student View)</p>
                <p className="text-xs text-white/60">Simulated local camera preview</p>
              </div>
            ) : (
              <div className="text-center my-auto">
                <p className="text-sm font-semibold text-white/80">Camera is turned off</p>
              </div>
            )}

            {/* Device Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setMicrophoneOn((p) => !p)}
                className={"flex items-center gap-2 rounded-full px-4 min-h-[44px] text-xs font-bold backdrop-blur-md transition-all " + (
                  microphoneOn
                    ? "bg-white/20 hover:bg-white/30 text-white"
                    : "bg-[#C84B31] text-white"
                )}
              >
                {microphoneOn ? <IconMic size={16} /> : <IconMicOff size={16} />}
                <span>{microphoneOn ? "Mic On" : "Mic Muted"}</span>
              </button>

              <button
                type="button"
                onClick={() => setCameraOn((p) => !p)}
                className={"flex items-center gap-2 rounded-full px-4 min-h-[44px] text-xs font-bold backdrop-blur-md transition-all " + (
                  cameraOn
                    ? "bg-white/20 hover:bg-white/30 text-white"
                    : "bg-[#C84B31] text-white"
                )}
              >
                {cameraOn ? <IconVideo size={16} /> : <IconVideoOff size={16} />}
                <span>{cameraOn ? "Camera On" : "Camera Off"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Educator Info & Join Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4EEE9] text-sm font-extrabold text-[#244A40]">
                {tutorName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[#25231F]">
                  {tutorName}
                </h3>
                <p className="text-xs text-[#6F6A62]">{subjectName}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-[rgba(55,48,40,0.08)] pt-4 text-xs text-[#6F6A62]">
              <div className="flex items-center justify-between">
                <span>Duration:</span>
                <span className="font-bold text-[#25231F]">30 Minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subject:</span>
                <span className="font-bold text-[#25231F]">{subjectName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Format:</span>
                <span className="font-bold text-[#25231F]">Online Classroom</span>
              </div>
            </div>

            {/* Canonical Join Window Action */}
            {joinEvaluation?.canJoin ? (
              <Link
                href={bookingId ? "/demo/session?booking_id=" + bookingId : "/demo/session"}
                className="btn btn-primary w-full min-h-[50px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2 mt-2"
              >
                <span>Enter Demo Room</span>
                <IconArrowRight size={16} />
              </Link>
            ) : joinEvaluation?.reason === "expired" ? (
              <div className="space-y-2 mt-2">
                <button
                  type="button"
                  disabled
                  className="btn btn-primary w-full min-h-[50px] rounded-full text-sm font-bold opacity-60 cursor-not-allowed justify-center gap-2"
                >
                  <span>Demo Room Closed (Expired)</span>
                </button>
                <Link
                  href={bookingId ? "/demo/confirmation?booking_id=" + bookingId : "/demo/confirmation"}
                  className="block text-center text-xs font-bold text-[#315F52] hover:underline"
                >
                  View Demo Details &rarr;
                </Link>
              </div>
            ) : joinEvaluation?.reason === "invalid_timing" ? (
              <div className="space-y-2 mt-2">
                <button
                  type="button"
                  disabled
                  className="btn btn-primary w-full min-h-[50px] rounded-full text-sm font-bold opacity-60 cursor-not-allowed justify-center gap-2"
                >
                  <IconLock size={15} />
                  <span>Scheduling Verification Issue</span>
                </button>
                <p className="text-[11px] text-center text-[#9B958C]">
                  Unable to verify demo schedule. Please check demo confirmation or contact support.
                </p>
                <Link
                  href={bookingId ? "/demo/confirmation?booking_id=" + bookingId : "/demo/confirmation"}
                  className="block text-center text-xs font-bold text-[#315F52] hover:underline"
                >
                  View Demo Details &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5 mt-2">
                <button
                  type="button"
                  disabled
                  className="btn btn-primary w-full min-h-[50px] rounded-full text-sm font-bold opacity-60 cursor-not-allowed justify-center gap-2"
                >
                  <IconLock size={15} />
                  <span>Enter Demo Room</span>
                </button>
                <p className="text-[11px] text-center text-[#9B958C]">
                  Room opens exactly 10 minutes before start time
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFF7ED] p-4 text-xs text-[#6F6A62]">
            <div className="flex items-center gap-2 font-bold text-[#25231F] mb-1">
              <IconCheck size={14} className="text-[#315F52]" />
              <span>No payment required</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Evaluate teaching clarity during this 30-minute free demo. You will have full opportunity to choose a package afterwards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoWaitingRoomPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/tutors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition-colors min-h-[44px]"
          >
            <IconArrowLeft size={14} />
            <span>Exit Waiting Room</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <Suspense fallback={<div className="text-center py-20 text-xs text-[#6F6A62]">Loading waiting room...</div>}>
          <WaitingRoomInner />
        </Suspense>
      </main>
    </div>
  );
}