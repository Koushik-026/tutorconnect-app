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

  const classes = Number(searchParams.get("classes")) || 15;
  const price = Number(searchParams.get("price")) || 5400;
  const mode = searchParams.get("mode") ?? "online";
  const days = searchParams.get("days") ?? "Mon, Wed, Fri";
  const time = searchParams.get("time") ?? "4:00 PM";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("student@oksbi");

  function handleSuccessPayment() {
    const query = new URLSearchParams({
      status: "success",
      tutor: tutor.id,
      classes: String(classes),
      amount: String(price),
      method: paymentMethod.toUpperCase(),
      transaction: `TC-${Date.now().toString().slice(-8)}`,
    });
    router.push(`/payment/result?${query.toString()}`);
  }

  function handleFailedPayment() {
    const query = new URLSearchParams({
      status: "failed",
      tutor: tutor.id,
      classes: String(classes),
      amount: String(price),
    });
    router.push(`/payment/result?${query.toString()}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
            <IconLock size={12} />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout View */}
      <main id="main-content" className="flex-1 py-8 sm:py-12">
        <div className="container-shell max-w-4xl">
          {/* Progress Indicator */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
                3
              </span>
              <span>Secure Payment</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-slate-400">Final Step</span>
            </div>

            <Link
              href={`/schedule/confirm?tutor=${tutor.id}&classes=${classes}&price=${price}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600"
            >
              <IconArrowLeft size={13} />
              <span>Back to Schedule</span>
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left: Payment Method Selection (7 cols) */}
            <div className="space-y-6 lg:col-span-7">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
                <h1 className="font-[family-name:var(--font-manrope)] text-xl font-bold text-slate-900 mb-1">
                  Select Payment Method
                </h1>
                <p className="text-xs text-slate-500 mb-5">
                  Choose how you want to pay for this monthly tuition package.
                </p>

                {/* Method Options */}
                <div className="space-y-3">
                  {/* UPI */}
                  <label
                    className={`flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition ${
                      paymentMethod === "upi"
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">UPI (Instant)</span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Fastest
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Google Pay, PhonePe, Paytm, or BHIM UPI
                      </p>

                      {paymentMethod === "upi" && (
                        <div className="mt-3">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter your UPI ID"
                            className="form-input text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Card */}
                  <label
                    className={`flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition ${
                      paymentMethod === "card"
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">Credit / Debit Card</span>
                        <IconCreditCard size={18} className="text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Visa, Mastercard, RuPay, Maestro
                      </p>

                      {paymentMethod === "card" && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-200">
                          Mock card gateway ready. Simulated payment processing.
                        </div>
                      )}
                    </div>
                  </label>

                  {/* NetBanking */}
                  <label
                    className={`flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition ${
                      paymentMethod === "netbanking"
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="netbanking"
                      checked={paymentMethod === "netbanking"}
                      onChange={() => setPaymentMethod("netbanking")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-900">Net Banking</span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        SBI, HDFC, ICICI, Axis, Kotak &amp; 50+ other Indian banks
                      </p>
                    </div>
                  </label>
                </div>

                {/* Simulated Payment Notice */}
                <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-xs text-blue-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <IconShieldCheck size={16} className="text-blue-700" />
                    <span>Safe Prototype Simulation</span>
                  </div>
                  <p className="leading-relaxed text-blue-800">
                    No real bank transaction will occur. Clicking the button below will simulate an approved transaction and immediately activate your student dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Order Breakdown (5 cols) */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <h2 className="font-[family-name:var(--font-manrope)] text-base font-bold text-slate-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Educator</span>
                    <span className="font-bold text-slate-900">{tutor.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Package</span>
                    <span className="font-bold text-slate-900">{classes} Classes Bundle</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Tuition Mode</span>
                    <span className="font-bold text-slate-900 capitalize">
                      {mode === "online" ? "Online Class" : "Home Tuition"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Routine</span>
                    <span className="font-bold text-slate-900">{days} &bull; {time}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-bold text-slate-900">{formatCurrency(price)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Platform &amp; Convenience Fee</span>
                    <span className="font-bold text-emerald-700">â‚¹0 (Free)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-slate-900 text-sm">Total Due</span>
                    <span className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-blue-700">
                      {formatCurrency(price)}
                    </span>
                  </div>
                </div>

                {/* Primary Button: Success */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handleSuccessPayment}
                    className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold shadow-sm gap-2"
                  >
                    <span>Pay {formatCurrency(price)}</span>
                    <IconArrowRight size={15} />
                  </button>

                  {/* Test Failure Link for Prototype Completeness */}
                  <button
                    type="button"
                    onClick={handleFailedPayment}
                    className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition"
                  >
                    Test payment failure path &rarr;
                  </button>
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
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbfc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
