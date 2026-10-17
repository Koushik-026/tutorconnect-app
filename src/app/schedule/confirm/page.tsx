"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { tutors as mockTutors, tuitionPackages as mockPackages } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Tutor } from "@/lib/types";
import type { TuitionPackageRow } from "@/lib/types/database";
import {
    IconVideo,
  IconHomeTuition,
  IconArrowRight,
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
  const packageId = searchParams.get("package") || "package-12";

  const [tutor, setTutor] = useState<Tutor>(
    () => mockTutors.find((t) => t.id === tutorId) || mockTutors[0]
  );
  const [pkg, setPkg] = useState<TuitionPackageRow>(() => {
    const found = mockPackages.find((p) => p.id === packageId) || mockPackages[1];
    return {
      id: found.id,
      title: found.title,
      rhythm_name: found.id === "package-8" ? "Steady Start" : found.id === "package-12" ? "Consistent Momentum" : "Complete Mastery",
      intensity: "Balanced",
      total_classes: found.numberOfClasses,
      price_inr: found.price,
      class_duration_minutes: 60,
      validity_days: 45,
      pace_description: "3 classes / week",
      best_for: found.description,
      is_recommended: found.id === "package-12",
      features: [],
      created_at: new Date().toISOString(),
    };
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    // Fetch tutor
    supabase
      .from("public_tutor_catalog")
      .select("*")
      .eq("slug", tutorId)
      .eq("is_approved", true)
      .single()
      .then(({ data }) => {
        if (data) {
          const modes: ("online" | "home")[] = [];
          if (data.offers_online) modes.push("online");
          if (data.offers_home) modes.push("home");
          setTutor({
            id: data.slug,
            name: data.name,
            profileImage: data.profile_image || "",
            headline: data.headline,
            bio: data.bio,
            subjects: data.subjects || [],
            classes: data.classes || [],
            boards: data.boards || [],
            languages: data.languages || [],
            experienceYears: data.experience_years,
            rating: data.rating ? Number(data.rating) : null,
            reviewCount: data.review_count || 0,
            isDemoProfile: data.is_demo_profile ?? true,
            modes,
            locality: data.locality || "",
            city: data.city || "Hyderabad",
            travelRadiusKm: data.travel_radius_km || 0,
            startingPackagePrice: data.starting_package_price_inr || 3200,
            verification: [],
            availableDays: data.available_days || availableDays,
            availableTimes: data.available_times || availableTimes,
          });
        }
      });

    // Fetch package
    supabase
      .from("tuition_packages")
      .select("*")
      .eq("id", packageId)
      .single()
      .then(({ data }) => {
        if (data) {
          setPkg(data as TuitionPackageRow);
        }
      });
  }, [tutorId, packageId]);

  const offersHome = tutor.modes.includes("home");
  const [mode, setMode] = useState<TuitionMode>("online");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Monday", "Wednesday", "Friday"]);
  const [selectedTime, setSelectedTime] = useState<string>("5:00 PM");

  // Effective mode defaults to online if home is not offered
  const activeMode = !offersHome ? "online" : mode;

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
      package: pkg.id,
      mode: activeMode,
      days: selectedDays.join(","),
      time: selectedTime,
    });
    router.push("/payment/checkout?" + query.toString());
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] text-[var(--tc-text-primary)] transition-colors">
      <header className="border-b border-[var(--tc-border)] bg-[var(--tc-surface)]/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href={"/packages/select?tutor=" + tutor.id}
            className="text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition-colors min-h-[44px] flex items-center"
          >
            &larr; Change Package
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16">
        <div className="container-shell max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-soft-primary)] border border-[var(--tc-primary)]/20 px-3.5 py-1 text-xs font-bold text-[var(--tc-primary)] mb-3">
              <IconCalendar size={13} />
              <span>Step 2 of 3 &bull; Tuition Rhythm</span>
            </span>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[var(--tc-text-primary)]">
              Confirm Tuition Routine
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[var(--tc-text-secondary)]">
              Set preferred weekly rhythm with <strong className="text-[var(--tc-text-primary)]">{tutor.name}</strong> for your{" "}
              {pkg.total_classes}-class package.
            </p>
          </div>

          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-secondary)]">
                1. Tuition Delivery Mode
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setMode("online")}
                  className={"min-h-[48px] p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 " + (
                    activeMode === "online"
                      ? "border-[var(--tc-primary)] bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] shadow-xs"
                      : "border-[var(--tc-border)] bg-[var(--tc-surface-muted)] text-[var(--tc-text-primary)] hover:border-[var(--tc-primary)]/40"
                  )}
                >
                  <IconVideo size={20} className={activeMode === "online" ? "text-[var(--tc-primary)]" : "text-[var(--tc-text-secondary)]"} />
                  <div>
                    <div className="text-xs font-bold">1-on-1 Online Live</div>
                    <p className="text-[11px] text-[var(--tc-text-secondary)] mt-0.5">
                      Interactive digital whiteboard with video room &bull; Flexible scheduling
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!offersHome}
                  onClick={() => {
                    if (offersHome) setMode("home");
                  }}
                  className={"min-h-[48px] p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 " + (
                    !offersHome
                      ? "border-[var(--tc-border)] bg-[var(--tc-surface-muted)]/50 text-[var(--tc-text-secondary)] cursor-not-allowed opacity-60"
                      : activeMode === "home"
                      ? "border-[var(--tc-primary)] bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] shadow-xs"
                      : "border-[var(--tc-border)] bg-[var(--tc-surface-muted)] text-[var(--tc-text-primary)] hover:border-[var(--tc-primary)]/40"
                  )}
                >
                  <IconHomeTuition size={20} className={activeMode === "home" ? "text-[var(--tc-primary)]" : "text-[var(--tc-text-secondary)]"} />
                  <div>
                    <div className="text-xs font-bold">In-Home Tuition</div>
                    <p className="text-[11px] text-[var(--tc-text-secondary)] mt-0.5">
                      {offersHome
                        ? "Educator travels to student locality (" + tutor.locality + " area)"
                        : "Home tuition not offered by this educator"}
                    </p>
                  </div>
                </button>
              </div>

              <div className="text-[11px] text-[var(--tc-text-secondary)] bg-[var(--tc-bg)] p-3 rounded-xl border border-[var(--tc-border)]">
                Home tuition availability confirmed during scheduling based on locality coverage.
              </div>
            </div>

            {/* Days Selection */}
            <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-secondary)]">
                2. Preferred Weekly Learning Days
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableDays.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={"min-h-[44px] p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between " + (
                        isSelected
                          ? "bg-[var(--tc-primary)] text-white border-[var(--tc-primary)] shadow-xs"
                          : "bg-[var(--tc-surface-muted)] text-[var(--tc-text-primary)] border-[var(--tc-border)] hover:border-[#315F52]"
                      )}
                    >
                      <span>{day}</span>
                      {isSelected && <IconCheck size={14} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-secondary)]">
                3. Preferred Time Slot (Asia/Kolkata)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={"min-h-[44px] p-3 rounded-xl border text-xs font-bold transition-all text-center " + (
                      selectedTime === time
                        ? "bg-[var(--tc-primary)] text-white border-[var(--tc-primary)] shadow-xs"
                        : "bg-[var(--tc-surface-muted)] text-[var(--tc-text-primary)] border-[var(--tc-border)] hover:border-[var(--tc-primary)]"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className="btn btn-primary w-full min-h-[50px] rounded-full text-sm font-extrabold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
              >
                <span>Proceed to Sandbox Checkout</span>
                <IconArrowRight size={15} />
              </button>
              <p className="mt-2 text-center text-[11px] text-[var(--tc-text-secondary)]">
                Package: {pkg.total_classes} classes &bull; Validity: 45 days &bull; No auto-renew
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ScheduleConfirmPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-[var(--tc-text-secondary)]">Loading routine configuration...</div>}>
      <ScheduleContent />
    </Suspense>
  );
}
