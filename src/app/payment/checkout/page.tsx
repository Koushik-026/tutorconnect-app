"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import {
  IconLock,
  IconShieldCheck,
  IconCreditCard,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
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
  const mode = searchParams.get("mode") ?? "online";
  const days = searchParams.get("days") ?? "Monday, Wednesday, Friday";
  const time = searchParams.get("time") ?? "5:00 PM";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("student@oksbi");
  const [simulateOutcome, setSimulateOutcome] = useState<"success" | "failed">("success");

  function handleProcessPayment() {
    const query = new URLSearchParams({
      status: simulateOutcome,
      tutor: tutor.id,
      classes: String(classes),
      amount: String(price),
      method: paymentMethod.toUpperCase(),
      transaction: `TC-${Date.now().toString().slice(-6)}`,
      mode,
    });
    router.push(`/payment/result?${query.toString()}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF8] text-[#20221F]">
      {/* Quiet Header */}
      <header className="border-b border-[rgba(54,48,60,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#5D806F]">
            <IconLock size={13} />
            <span>Simulated Prototype Checkout</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 md:py-16">
        <div className="container-shell max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href={`/schedule/confirm?tutor=${tutor.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D706A] hover:text-[#20221F] transition mb-3"
            >
              <IconArrowLeft size={13} />
              <span>Back to Schedule Selection</span>
            </Link>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#20221F]">
              Checkout &amp; Tuition Confirmation
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left: Quiet Payment Method & Simulation Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Payment Method Selector */}
              <div className="rounded-3xl border border-[rgba(54,48,60,0.12)] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A] block">
                  Select Payment Method
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
                          ? "border-[#7257A5] bg-[#EEE7FF]/60 text-[#594282] shadow-xs"
                          : "border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] text-[#6D706A] hover:text-[#20221F]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6D706A] block">
                      UPI ID (Virtual Payment Address)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full rounded-2xl border border-[rgba(54,48,60,0.12)] bg-[#FFFDF9] px-4 py-2.5 text-xs font-semibold text-[#20221F] focus:border-[#7257A5] focus:outline-hidden"
                    />
                    <p className="text-[11px] text-[#969991]">
                      Google Pay, PhonePe, Paytm, or BHIM supported
                    </p>
                  </div>
                )}

                {/* Prototype Simulation Selector */}
                <div className="rounded-2xl border border-[rgba(54,48,60,0.08)] bg-[#FCFBF8] p-4 space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6D706A] block">
                    Prototype Simulation Control:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulateOutcome("success")}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                        simulateOutcome === "success"
                          ? "bg-[#E5F0EA] text-[#3D5A4D] border border-[#5D806F]/30"
                          : "bg-white text-[#6D706A] border border-[rgba(54,48,60,0.10)]"
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
                          : "bg-white text-[#6D706A] border border-[rgba(54,48,60,0.10)]"
                      }`}
                    >
                      Simulate Failure
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(114,87,165,0.22)] justify-center gap-2"
                >
                  <span>Pay {formatCurrency(price)} &amp; Confirm Routine</span>
                  <IconArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right: Package Summary Order Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[rgba(54,48,60,0.12)] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D706A] block">
                  Tuition Order Summary
                </span>

                <div className="flex items-center gap-3 border-b border-[rgba(54,48,60,0.06)] pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE7FF] text-sm font-bold text-[#594282]">
                    AS
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#20221F]">{tutor.name}</p>
                    <p className="text-xs text-[#6D706A]">{tutor.headline}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[#6D706A]">
                    <span>Class Package:</span>
                    <span className="font-bold text-[#20221F]">{classes} Classes (60m each)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6D706A]">
                    <span>Validity Window:</span>
                    <span className="font-bold text-[#20221F]">45 Days from first class</span>
                  </div>
                  <div className="flex items-center justify-between text-[#6D706A]">
                    <span>Tuition Mode:</span>
                    <span className="font-bold text-[#20221F]">
                      {mode === "online" ? "1-on-1 Online" : "Home (" + tutor.locality + ")"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#6D706A]">
                    <span>Weekly Rhythm:</span>
                    <span className="font-bold text-[#20221F]">{days} @ {time}</span>
                  </div>
                </div>

                <div className="border-t border-[rgba(54,48,60,0.08)] pt-4 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#20221F]">Total Package Fee:</span>
                  <span className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#20221F]">
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
    <Suspense fallback={<div className="min-h-screen bg-[#FCFBF8]" />}>
      <CheckoutContent />
    </Suspense>
  );
}
