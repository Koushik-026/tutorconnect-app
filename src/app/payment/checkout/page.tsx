"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors as mockTutors, tuitionPackages as mockPackages } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { StudentProfile, TuitionPackageRow } from "@/lib/types/database";
import type { Tutor } from "@/lib/types";
import { createAndActivatePurchaseAction } from "@/app/actions/workflow";
import {
  IconLock,
  IconArrowRight,
  IconArrowLeft,
  IconShieldCheck,
} from "@/components/ui/icons";

type PaymentMethod = "upi" | "card" | "netbanking";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId = searchParams.get("tutor") ?? "ananya-sharma";
  const packageId = searchParams.get("package") ?? "package-12";
  const mode = (searchParams.get("mode") ?? "online") as "online" | "home";
  const daysStr = searchParams.get("days") ?? "Monday, Wednesday, Friday";
  const time = searchParams.get("time") ?? "5:00 PM";

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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("student@oksbi");
  const [simulateOutcome, setSimulateOutcome] = useState<"success" | "failed">("success");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    // Fetch canonical tutor
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
            availableDays: data.available_days || [],
            availableTimes: data.available_times || [],
          });
        }
      });

    // Fetch canonical package
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

    // Fetch student profiles
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        supabase
          .from("student_profiles")
          .select("*")
          .eq("owner_user_id", data.user.id)
          .then(({ data: profs }) => {
            if (profs && profs.length > 0) {
              setProfiles(profs as StudentProfile[]);
              setSelectedProfileId(profs[0].id);
            }
          });
      }
    });
  }, [tutorId, packageId]);

  async function handleProcessPayment() {
    setErrorMessage("");
    setIsProcessing(true);

    if (!isSupabaseConfigured()) {
      // Offline fallback
      const query = new URLSearchParams({
        status: simulateOutcome,
        tutor: tutor.id,
        classes: String(pkg.total_classes),
        amount: String(pkg.price_inr),
        method: paymentMethod.toUpperCase(),
        transaction: "TC-OFFLINE-" + Date.now().toString().slice(-4),
        mode,
      });
      router.push("/payment/result?" + query.toString());
      return;
    }

    if (!selectedProfileId) {
      setIsProcessing(false);
      setErrorMessage("Please select a student profile for this enrollment.");
      return;
    }

    // Call server-side development action
    try {
      const preferredDays = daysStr.split(",").map((s) => s.trim());
      const res = await createAndActivatePurchaseAction({
        studentProfileId: selectedProfileId,
        packageId: pkg.id,
        tutorSlug: tutor.id,
        tuitionMode: mode,
        preferredDays,
        preferredTime: time,
        initialSubject: tutor.subjects[0] || "General Tuition",
        paymentMethod: paymentMethod.toUpperCase(),
        simulateFailure: simulateOutcome === "failed",
      });

      setIsProcessing(false);

      if (res.success && res.purchaseId) {
        router.push(
          "/payment/result?purchase_id=" + res.purchaseId +
          "&status=success&transaction=" + encodeURIComponent(res.transactionReference || "") +
          "&tutor=" + tutor.id +
          "&classes=" + pkg.total_classes +
          "&amount=" + pkg.price_inr +
          "&mode=" + mode
        );
      } else {
        router.push(
          "/payment/result?status=failed&tutor=" + tutor.id +
          "&classes=" + pkg.total_classes +
          "&amount=" + pkg.price_inr +
          "&reason=" + encodeURIComponent(res.error || "Simulated payment declined.")
        );
      }
    } catch (e: unknown) {
      setIsProcessing(false);
      const msg = e instanceof Error ? e.message : "Payment processing error";
      setErrorMessage(msg);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] transition-colors text-[var(--tc-text-primary)]">
      <header className="border-b border-[var(--tc-border)] bg-[var(--tc-surface)]/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href={"/schedule/confirm?tutor=" + tutor.id + "&package=" + pkg.id}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition-colors min-h-[44px]"
          >
            <IconArrowLeft size={14} />
            <span>Back to Routine</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16">
        <div className="container-shell max-w-4xl mx-auto">
          {/* Prominent Sandbox Notice Banner */}
          <div className="mb-8 rounded-2xl bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] p-4 text-xs text-[var(--tc-text-secondary)]">
            <div className="flex items-center gap-2 font-bold text-[var(--tc-text-primary)] mb-1">
              <span className="rounded-full bg-[var(--tc-soft-primary)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--tc-primary)]">
                DEMO SANDBOX SIMULATION
              </span>
              <span>No Real Money Movement</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              This checkout simulates payment authorization in development/demo mode. No actual debit occurs and no secret payment credentials are used.
            </p>
          </div>

          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-soft-primary)] px-3.5 py-1 text-xs font-bold text-[var(--tc-primary)] mb-3">
              <IconLock size={13} />
              <span>Step 3 of 3 &bull; Sandbox Checkout</span>
            </span>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[var(--tc-text-primary)]">
              Confirm Tuition Enrollment
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[var(--tc-text-secondary)]">
              One-time class package &bull; 45-day validity &bull; No recurring billing
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Payment Simulation Form */}
            <div className="lg:col-span-8 bg-[var(--tc-surface)] rounded-2xl border border-[var(--tc-border)] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
              {/* Learner Profile Selection */}
              {profiles.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-secondary)] block mb-2">
                    Enrolling Learner
                  </label>
                  <select
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    className="w-full min-h-[44px] rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface)] px-3 py-2 text-xs font-bold text-[var(--tc-text-primary)] focus:border-[var(--tc-primary)] focus:outline-hidden"
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.display_name} ({p.class_level} &bull; {p.board})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Simulated Method */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-secondary)] block mb-3">
                  Simulated Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["upi", "card", "netbanking"] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={"min-h-[44px] p-3 rounded-xl border text-xs font-bold capitalize transition-all " + (
                        paymentMethod === m
                          ? "bg-[var(--tc-primary)] text-white border-[var(--tc-primary)]"
                          : "bg-[var(--tc-bg)] transition-colors text-[var(--tc-text-primary)] border-[var(--tc-border)] hover:border-[var(--tc-primary)]"
                      )}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div className="mt-3">
                    <label className="block text-[11px] font-bold text-[var(--tc-text-secondary)] mb-1">
                      Virtual Payment Address (Demo VPA)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. learner@okhdfc"
                      className="w-full min-h-[44px] rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface)] px-3 py-2 text-xs text-[var(--tc-text-primary)] focus:border-[var(--tc-primary)] focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Simulation Outcome Switcher */}
              <div className="border-t border-[var(--tc-border)] pt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-secondary)] block mb-2">
                  Sandbox Outcome Simulation
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSimulateOutcome("success")}
                    className={"min-h-[44px] p-3 rounded-xl border text-xs font-bold transition-all " + (
                      simulateOutcome === "success"
                        ? "bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] border-[var(--tc-primary)] font-extrabold shadow-2xs"
                        : "bg-[var(--tc-bg)] transition-colors text-[var(--tc-text-primary)] border-[var(--tc-border)]"
                    )}
                  >
                    Simulate Successful Activation
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulateOutcome("failed")}
                    className={"min-h-[44px] p-3 rounded-xl border text-xs font-bold transition-all " + (
                      simulateOutcome === "failed"
                        ? "bg-[var(--tc-danger)]/10 text-[var(--tc-danger)] border-[var(--tc-danger)] font-extrabold shadow-2xs"
                        : "bg-[var(--tc-bg)] transition-colors text-[var(--tc-text-primary)] border-[var(--tc-border)]"
                    )}
                  >
                    Simulate Payment Decline
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl bg-[var(--tc-danger)]/10 p-4 text-xs font-semibold text-[var(--tc-danger)] border border-[var(--tc-danger)]/20">
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="btn btn-primary w-full min-h-[50px] rounded-full text-sm font-extrabold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
              >
                <span>{isProcessing ? "Processing Simulation..." : "Simulate Payment (" + formatCurrency(pkg.price_inr) + ")"}</span>
                <IconArrowRight size={15} />
              </button>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
                <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[var(--tc-text-primary)] border-b border-[var(--tc-border)] pb-3">
                  Enrollment Summary
                </h3>

                <div className="space-y-2 text-xs text-[var(--tc-text-secondary)]">
                  <div className="flex items-center justify-between">
                    <span>Educator:</span>
                    <span className="font-bold text-[var(--tc-text-primary)]">{tutor.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Package:</span>
                    <span className="font-bold text-[var(--tc-text-primary)]">{pkg.total_classes} Classes ({pkg.rhythm_name})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery Mode:</span>
                    <span className="font-bold capitalize text-[var(--tc-text-primary)]">{mode} Tuition</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Schedule Rhythm:</span>
                    <span className="font-bold text-[var(--tc-text-primary)]">{daysStr} &bull; {time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Package Validity:</span>
                    <span className="font-bold text-[var(--tc-text-primary)]">45 Days</span>
                  </div>
                </div>

                <div className="border-t border-[var(--tc-border)] pt-3 flex items-baseline justify-between">
                  <span className="font-bold text-[var(--tc-text-primary)]">Total Amount:</span>
                  <div className="text-right">
                    <span className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-[var(--tc-primary)]">
                      {formatCurrency(pkg.price_inr)}
                    </span>
                    <div className="text-[10px] text-[var(--tc-text-secondary)]">One-time class package</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] p-4 text-xs text-[var(--tc-text-secondary)] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[var(--tc-text-primary)]">
                  <IconShieldCheck size={14} className="text-[var(--tc-primary)]" />
                  <span>Class Ledger Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Your package balance decrements only after completed class sessions are recorded in the durable Class Ledger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-[var(--tc-text-secondary)]">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
