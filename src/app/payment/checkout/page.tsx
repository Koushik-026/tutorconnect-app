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
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
      {/* Header */}
      <header className="border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F7867] bg-[#E6F0EA] px-3 py-1 rounded-full border border-[#4F7867]/30">
            <IconLock size={12} />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout View: Calm, High Contrast, Warm White */}
      <main id="main-content" className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Progress Indicator */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#66518A]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#66518A] text-white text-[10px]">
                3
              </span>
              <span>Final Step &bull; Review &amp; Payment Confirmation</span>
            </div>
            <Link
              href={`/schedule/confirm?tutor=${tutor.id}&classes=${classes}&price=${price}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#676B64] hover:text-[#232520] transition-colors"
            >
              <IconArrowLeft size={13} />
              <span>Back to Schedule</span>
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left 7 cols: Payment Method Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs space-y-6">
                <h1 className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-[#232520]">
                  Payment Method
                </h1>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === "upi"
                        ? "border-[#66518A] bg-[#EFEAF8] text-[#66518A] font-bold shadow-xs"
                        : "border-[#E4DED4] bg-[#FFFEFB] text-[#676B64] hover:border-[#66518A]/40"
                    }`}
                  >
                    <span className="text-xs font-bold block">UPI</span>
                    <span className="text-[10px] text-[#676B64]">GPay / PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === "card"
                        ? "border-[#66518A] bg-[#EFEAF8] text-[#66518A] font-bold shadow-xs"
                        : "border-[#E4DED4] bg-[#FFFEFB] text-[#676B64] hover:border-[#66518A]/40"
                    }`}
                  >
                    <span className="text-xs font-bold block">Cards</span>
                    <span className="text-[10px] text-[#676B64]">Debit / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === "netbanking"
                        ? "border-[#66518A] bg-[#EFEAF8] text-[#66518A] font-bold shadow-xs"
                        : "border-[#E4DED4] bg-[#FFFEFB] text-[#676B64] hover:border-[#66518A]/40"
                    }`}
                  >
                    <span className="text-xs font-bold block">Net Banking</span>
                    <span className="text-[10px] text-[#676B64]">All Indian Banks</span>
                  </button>
                </div>

                {/* Method Details */}
                {paymentMethod === "upi" && (
                  <div className="space-y-3 pt-2">
                    <label htmlFor="upi-id" className="block text-xs font-bold text-[#676B64]">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <input
                      id="upi-id"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                    />
                    <p className="text-[11px] text-[#676B64]">
                      A test payment request simulation will be authorized without real charge.
                    </p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label htmlFor="card-number" className="block text-xs font-bold text-[#676B64] mb-1">
                        Card Number (Simulated)
                      </label>
                      <div className="relative">
                        <input
                          id="card-number"
                          type="text"
                          defaultValue="•••• •••• •••• 4242"
                          className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                        />
                        <IconCreditCard size={16} className="absolute right-3 top-3 text-[#676B64]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="card-expiry" className="block text-xs font-bold text-[#676B64] mb-1">
                          Expiry
                        </label>
                        <input
                          id="card-expiry"
                          type="text"
                          defaultValue="12/28"
                          className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label htmlFor="card-cvv" className="block text-xs font-bold text-[#676B64] mb-1">
                          CVV
                        </label>
                        <input
                          id="card-cvv"
                          type="password"
                          defaultValue="•••"
                          className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="space-y-3 pt-2">
                    <label htmlFor="bank-select" className="block text-xs font-bold text-[#676B64]">
                      Select Bank
                    </label>
                    <select
                      id="bank-select"
                      className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3.5 py-2.5 text-xs text-[#232520] focus:border-[#66518A] focus:outline-hidden"
                    >
                      <option>State Bank of India (SBI)</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                )}

                {/* Primary Simulated Payment Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    type="button"
                    onClick={handleSuccessPayment}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#66518A] px-6 py-4 text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
                  >
                    <span>Pay {formatCurrency(price)} &amp; Activate Package</span>
                    <IconArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleFailedPayment}
                    className="w-full text-center text-xs font-bold text-[#676B64] hover:text-rose-700 py-2 transition-colors"
                  >
                    Simulate Payment Decline (Test Edge Case)
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Order Summary */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs space-y-4">
                <h2 className="font-[family-name:var(--font-manrope)] text-base font-extrabold text-[#232520] border-b border-[#E4DED4] pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#676B64]">
                    <span>Tutor</span>
                    <span className="font-bold text-[#232520]">{tutor.name}</span>
                  </div>

                  <div className="flex justify-between text-[#676B64]">
                    <span>Package</span>
                    <span className="font-bold text-[#232520]">{classes} Classes Bundle</span>
                  </div>

                  <div className="flex justify-between text-[#676B64]">
                    <span>Class Duration</span>
                    <span className="font-bold text-[#232520]">60 min / session</span>
                  </div>

                  <div className="flex justify-between text-[#676B64]">
                    <span>Tuition Format</span>
                    <span className="font-bold text-[#232520] uppercase">{mode}</span>
                  </div>

                  <div className="flex justify-between text-[#676B64]">
                    <span>Schedule Rhythm</span>
                    <span className="font-bold text-[#232520]">{days} @ {time}</span>
                  </div>

                  <div className="flex justify-between text-[#676B64]">
                    <span>Package Validity</span>
                    <span className="font-bold text-[#232520]">45 Days</span>
                  </div>

                  <div className="border-t border-[#E4DED4] pt-3 flex justify-between text-base font-extrabold text-[#232520]">
                    <span>Total Amount</span>
                    <span className="text-[#66518A]">{formatCurrency(price)}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-[#676B64] space-y-1.5 border-t border-[#E4DED4]/60">
                  <p className="flex items-center gap-1.5 text-[#4F7867] font-semibold">
                    <IconShieldCheck size={14} />
                    <span>No recurring automatic charges</span>
                  </p>
                  <p>Classes can be rescheduled anytime with 12h notice directly with your educator.</p>
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE] text-xs font-bold text-[#676B64]">
          Loading secure checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
