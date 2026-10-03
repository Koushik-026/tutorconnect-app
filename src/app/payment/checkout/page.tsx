"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { StudentProfile } from "@/lib/types/database";
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
  const tutor = tutors.find((t) => t.id === tutorId) ?? tutors[0];

  const classes = Number(searchParams.get("classes")) || 12;
  const price = Number(searchParams.get("price")) || 4500;
  const mode = (searchParams.get("mode") ?? "online") as "online" | "home";
  const days = searchParams.get("days") ?? "Monday, Wednesday, Friday";
  const time = searchParams.get("time") ?? "5:00 PM";

  const packageId =
    classes === 8 ? "package-8" : classes === 15 ? "package-15" : "package-12";

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
  }, []);

  async function handleProcessPayment() {
    setErrorMessage("");
    setIsProcessing(true);

    if (!isSupabaseConfigured()) {
      // Offline fallback
      const query = new URLSearchParams({
        status: simulateOutcome,
        tutor: tutor.id,
        classes: String(classes),
        amount: String(price),
        method: paymentMethod.toUpperCase(),
        transaction: `TC-OFFLINE-${Date.now().toString().slice(-4)}`,
        mode,
      });
      router.push(`/payment/result?${query.toString()}`);
      return;
    }

    // Call server-side development action
    try {
      const res = await createAndActivatePurchaseAction({
        studentProfileId: selectedProfileId || "00000000-0000-0000-0000-000000000000",
        packageId,
        tutorSlug: tutor.id,
        tutorName: tutor.name,
        tuitionMode: mode,
        amountInr: price,
        paymentMethod: paymentMethod.toUpperCase(),
        simulateFailure: simulateOutcome === "failed",
      });

      setIsProcessing(false);

      if (res.success && res.purchaseId) {
        router.push(
          `/payment/result?purchase_id=${res.purchaseId}&status=success&transaction=${encodeURIComponent(
            res.transactionReference || ""
          )}&tutor=${tutor.id}&classes=${classes}&amount=${price}&mode=${mode}`
        );
      } else {
        router.push(
          `/payment/result?status=failed&tutor=${tutor.id}&classes=${classes}&amount=${price}&reason=${encodeURIComponent(
            res.error || "Simulation failed"
          )}`
        );
      }
    } catch (e: unknown) {
      setIsProcessing(false);
      const msg = e instanceof Error ? e.message : "Payment simulation error";
      setErrorMessage(msg);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      {/* Quiet Header */}
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6F6A62]">
            <IconLock size={14} className="text-[#315F52]" />
            <span>Development Sandbox Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16">
        <div className="container-shell max-w-4xl mx-auto">
          {/* Development Sandbox Notice Banner */}
          <div className="mb-6 rounded-2xl border border-[#315F52]/20 bg-[#E4EEE9]/50 p-4 text-xs font-semibold text-[#244A40] flex items-center gap-3">
            <IconShieldCheck size={18} className="shrink-0" />
            <div>
              <span className="font-extrabold">Development Sandbox Mode:</span> No real financial transaction will occur. This simulator activates database records and provisions tuition sessions.
            </div>
          </div>

          <div className="mb-8">
            <Link
              href={`/schedule/confirm?tutor=${tutor.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition mb-3"
            >
              <IconArrowLeft size={13} />
              <span>Back to Schedule Selection</span>
            </Link>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
              Checkout &amp; Tuition Confirmation
            </h1>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-2xl bg-[#FEE2E2] p-4 text-xs font-bold text-[#DC2626]">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Payment Method & Simulation Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Learner Profile Selector if multiple */}
              {profiles.length > 1 && (
                <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62] block">
                    Learner Profile
                  </span>
                  <select
                    value={selectedProfileId}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-2.5 text-xs font-bold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.display_name} ({p.class_level})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Payment Method Selector */}
              <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62] block">
                  Select Simulated Payment Method
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "upi", label: "UPI" },
                    { id: "card", label: "Card" },
                    { id: "netbanking", label: "NetBanking" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`rounded-2xl border py-2.5 text-center text-xs font-bold transition ${
                        paymentMethod === m.id
                          ? "border-[#315F52] bg-[#E4EEE9]/60 text-[#244A40] shadow-xs"
                          : "border-[rgba(55,48,40,0.10)] bg-[#FFF7ED] text-[#6F6A62] hover:text-[#25231F]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6F6A62] block">
                      UPI ID (Virtual Payment Address)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-2.5 text-xs font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                    />
                    <p className="text-[11px] text-[#9B958C]">
                      Google Pay, PhonePe, Paytm, or BHIM simulation
                    </p>
                  </div>
                )}

                {/* Simulation Selector */}
                <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-4 space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6F6A62] block">
                    Sandbox Outcome Control:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulateOutcome("success")}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                        simulateOutcome === "success"
                          ? "bg-[#E3EADD] text-[#244A40] border border-[#315F52]/30"
                          : "bg-white text-[#6F6A62] border border-[rgba(55,48,40,0.10)]"
                      }`}
                    >
                      Simulate Success
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimulateOutcome("failed")}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                        simulateOutcome === "failed"
                          ? "bg-[#FCEEEA] text-[#A6361E] border border-[#C84B31]/30"
                          : "bg-white text-[#6F6A62] border border-[rgba(55,48,40,0.10)]"
                      }`}
                    >
                      Simulate Failure
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2 disabled:opacity-50"
                >
                  <span>
                    {isProcessing
                      ? "Authorizing Simulation..."
                      : `Authorize Development Payment (${formatCurrency(price)})`}
                  </span>
                  <IconArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right: Package Summary Order Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62] block">
                  Tuition Order Summary
                </span>

                <div className="flex items-center gap-3 border-b border-[rgba(55,48,40,0.06)] pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E4EEE9] text-sm font-bold text-[#244A40]">
                    {tutor.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#25231F]">{tutor.name}</p>
                    <p className="text-xs text-[#6F6A62]">{tutor.headline}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[#6F6A62]">
                    <span>Class Package:</span>
                    <span className="font-bold text-[#25231F]">{classes} Classes (60m each)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6F6A62]">
                    <span>Validity Window:</span>
                    <span className="font-bold text-[#25231F]">45 Days from first class</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6F6A62]">
                    <span>Tuition Mode:</span>
                    <span className="font-bold text-[#25231F]">
                      {mode === "online" ? "1-on-1 Online" : "Home (" + tutor.locality + ")"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#6F6A62]">
                    <span>Weekly Rhythm:</span>
                    <span className="font-bold text-[#25231F]">{days} @ {time}</span>
                  </div>
                </div>

                <div className="border-t border-[rgba(55,48,40,0.08)] pt-4 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#25231F]">Total Package Fee:</span>
                  <span className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#25231F]">
                    {formatCurrency(price)}
                  </span>
                </div>
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
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF5]" />}>
      <CheckoutContent />
    </Suspense>
  );
}
