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
  IconArrowRight,
} from "@/components/ui/icons";

function formatKolkataTime(isoString: string) {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return "Scheduled Time";
  }
}

function formatKolkataDate(isoString: string) {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return "Scheduled Date";
  }
}

function DemoConfirmationInner() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const [booking, setBooking] = useState<DemoBookingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfirmation() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      if (!bookingId) {
        setError("No demo booking identifier provided.");
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error: bErr } = await supabase
          .from("demo_bookings")
          .select("*")
          .eq("id", bookingId)
          .single();

        setLoading(false);
        if (bErr || !data) {
          setError("Demo booking not found or unauthorized. Please verify your reservation.");
        } else {
          setBooking(data as DemoBookingRow);
        }
      } catch {
        setLoading(false);
        setError("Unable to load booking details.");
      }
    }

    loadConfirmation();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#315F52] border-t-transparent mb-3" />
        <p className="text-xs text-[#6F6A62]">Verifying reservation details...</p>
      </div>
    );
  }

  // When Supabase is configured, reject missing/unauthorized booking
  if (isSupabaseConfigured() && (error || !booking)) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-[rgba(55,48,40,0.10)] p-8 shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FDE8E4] text-[#BA5945] mb-4 text-xl font-bold">
          !
        </div>
        <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[#25231F]">
          Reservation Not Found
        </h2>
        <p className="mt-2 text-xs text-[#6F6A62] leading-relaxed">
          {error || "We could not find an authorized demo booking matching this link."}
        </p>
        <div className="mt-6">
          <Link href="/tutors" className="btn btn-primary min-h-[44px] px-6 text-xs font-bold rounded-full">
            Browse Educators &amp; Book Demo
          </Link>
        </div>
      </div>
    );
  }

  // Display fields
  const displayTutor = booking?.tutor_name || tutors[0].name;
  const displaySubject = booking?.subject || "Mathematics";
  const displayDate = booking ? formatKolkataDate(booking.scheduled_start_at) : "Mon, Oct 6, 2026";
  const displayTime = booking ? formatKolkataTime(booking.scheduled_start_at) : "04:30 PM";

  return (
    <div className="container-shell max-w-2xl mx-auto py-10 md:py-16">
      <div className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-7 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.03)] text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E4EEE9] text-[#244A40] shadow-2xs">
          <IconCheck size={32} />
        </div>

        <div>
          <span className="rounded-full bg-[#E3EADD] px-3.5 py-1 text-xs font-bold text-[#244A40]">
            Free 30-Min Demo Confirmed
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
            Your 1-on-1 Demo is Scheduled
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#6F6A62]">
            We have reserved your introductory evaluation session with{" "}
            <strong className="text-[#25231F]">{displayTutor}</strong>.
          </p>
        </div>

        {/* Schedule Dossier */}
        <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-5 text-left text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[rgba(55,48,40,0.06)] pb-2.5">
            <span className="text-[#9B958C]">Educator:</span>
            <span className="font-bold text-[#25231F]">{displayTutor}</span>
          </div>

          <div className="flex items-center justify-between border-b border-[rgba(55,48,40,0.06)] pb-2.5">
            <span className="text-[#9B958C]">Subject Focus:</span>
            <span className="font-bold text-[#25231F]">{displaySubject}</span>
          </div>

          <div className="flex items-center justify-between border-b border-[rgba(55,48,40,0.06)] pb-2.5">
            <span className="text-[#9B958C]">Date &amp; Time:</span>
            <span className="font-bold text-[#25231F]">{displayDate} &bull; {displayTime}</span>
          </div>

          <div className="flex items-center justify-between border-b border-[rgba(55,48,40,0.06)] pb-2.5">
            <span className="text-[#9B958C]">Duration &amp; Format:</span>
            <span className="font-bold text-[#25231F]">30 Minutes &bull; Online Room</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[#9B958C]">Amount:</span>
            <span className="font-extrabold text-[#315F52]">₹0 Demo</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          <Link
            href={bookingId ? "/demo/waiting-room?booking_id=" + bookingId : "/demo/waiting-room"}
            className="btn btn-primary min-h-[48px] rounded-full text-xs font-bold justify-center shadow-xs"
          >
            <span>Test Audio &amp; Video (Waiting Room)</span>
            <IconArrowRight size={14} />
          </Link>

          <Link
            href="/dashboard/student"
            className="btn btn-outline min-h-[48px] rounded-full text-xs font-bold justify-center border-[rgba(55,48,40,0.15)] hover:border-[#25231F]"
          >
            <span>Go to Student Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DemoConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition-colors min-h-[44px] flex items-center"
          >
            Student Workspace &rarr;
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <Suspense fallback={<div className="text-center py-20 text-xs text-[#6F6A62]">Loading confirmation...</div>}>
          <DemoConfirmationInner />
        </Suspense>
      </main>
    </div>
  );
}
