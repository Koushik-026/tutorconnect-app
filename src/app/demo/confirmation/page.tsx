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
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--tc-primary)] border-t-transparent mb-3" />
        <p className="text-xs text-[var(--tc-text-secondary)]">Verifying reservation details...</p>
      </div>
    );
  }

  // When Supabase is configured, reject missing/unauthorized booking
  if (isSupabaseConfigured() && (error || !booking)) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-[var(--tc-surface)] rounded-2xl border border-[var(--tc-border)] p-8 shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tc-danger)]/10 text-[var(--tc-danger)] mb-4 text-xl font-bold">
          !
        </div>
        <h2 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-[var(--tc-text-primary)]">
          Reservation Not Found
        </h2>
        <p className="mt-2 text-xs text-[var(--tc-text-secondary)] leading-relaxed">
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
      <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-7 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.03)] text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] shadow-2xs">
          <IconCheck size={32} />
        </div>

        <div>
          <span className="rounded-full bg-[var(--tc-teal)]/10 border border-[var(--tc-teal)]/20 px-3.5 py-1 text-xs font-bold text-[var(--tc-teal)]">
            Free 30-Min Demo Confirmed
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[var(--tc-text-primary)]">
            Your 1-on-1 Demo is Scheduled
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--tc-text-secondary)]">
            We have reserved your introductory evaluation session with{" "}
            <strong className="text-[var(--tc-text-primary)]">{displayTutor}</strong>.
          </p>
        </div>

        {/* Schedule Dossier */}
        <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] p-5 text-left text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--tc-border)] pb-2.5">
            <span className="text-[var(--tc-text-secondary)]">Educator:</span>
            <span className="font-bold text-[var(--tc-text-primary)]">{displayTutor}</span>
          </div>

          <div className="flex items-center justify-between border-b border-[var(--tc-border)] pb-2.5">
            <span className="text-[var(--tc-text-secondary)]">Subject Focus:</span>
            <span className="font-bold text-[var(--tc-text-primary)]">{displaySubject}</span>
          </div>

          <div className="flex items-center justify-between border-b border-[var(--tc-border)] pb-2.5">
            <span className="text-[var(--tc-text-secondary)]">Date &amp; Time:</span>
            <span className="font-bold text-[var(--tc-text-primary)]">{displayDate} &bull; {displayTime}</span>
          </div>

          <div className="flex items-center justify-between border-b border-[var(--tc-border)] pb-2.5">
            <span className="text-[var(--tc-text-secondary)]">Duration &amp; Format:</span>
            <span className="font-bold text-[var(--tc-text-primary)]">30 Minutes &bull; Online Room</span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[var(--tc-text-secondary)]">Amount:</span>
            <span className="font-extrabold text-[var(--tc-primary)]">₹0 Demo</span>
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
            href="/tutors"
            className="btn btn-outline min-h-[48px] rounded-full text-xs font-bold justify-center border-[var(--tc-border)] text-[var(--tc-text-primary)] hover:border-[var(--tc-primary)]"
          >
            <span>Explore Other Educators</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DemoConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] text-[var(--tc-text-primary)] transition-colors">
      <header className="border-b border-[var(--tc-border)] bg-[var(--tc-surface)]/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/tutors"
            className="text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition-colors min-h-[44px] flex items-center"
          >
            Find More Tutors &rarr;
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <Suspense fallback={<div className="text-center py-20 text-xs text-[var(--tc-text-secondary)]">Loading confirmation...</div>}>
          <DemoConfirmationInner />
        </Suspense>
      </main>
    </div>
  );
}
