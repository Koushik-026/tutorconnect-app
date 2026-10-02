"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import {
  IconCheck,
  IconX,
  IconArrowRight,
} from "@/components/ui/icons";

type PaymentStatus = "success" | "failed";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function PaymentResultContent() {
  const searchParams = useSearchParams();

  const status: PaymentStatus =
    searchParams.get("status") === "failed" ? "failed" : "success";

  const tutorId = searchParams.get("tutor") ?? "ananya-sharma";
  const tutor = tutors.find((t) => t.id === tutorId) ?? tutors[0];

  const classes = Number(searchParams.get("classes")) || 15;
  const amount = Number(searchParams.get("amount")) || 5400;
  const paymentMethod = searchParams.get("method") ?? "UPI";
  const transactionId = searchParams.get("transaction") ?? "TC-20260810";

  const activeDashboardHref = `/dashboard/student?state=active&classes=${classes}&amount=${amount}`;
  const retryHref = `/payment/checkout?tutor=${tutor.id}&classes=${classes}&price=${amount}`;

  if (status === "success") {
    return (
      <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
        <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="container-shell flex h-16 items-center justify-between">
            <Logo />
            <Link
              href={activeDashboardHref}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Dashboard &rarr;
            </Link>
          </div>
        </header>

        <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-lg">
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
              {/* Top Banner */}
              <div className="border-b border-slate-100 bg-gradient-to-b from-emerald-50/70 to-white p-6 sm:p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
                  <IconCheck size={28} />
                </div>
                <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950">
                  Payment Successful
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Your tuition package has been activated instantly.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction ID</span>
                    <span className="font-mono font-bold text-slate-800">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Educator</span>
                    <span className="font-bold text-slate-800">{tutor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Package Activated</span>
                    <span className="font-bold text-slate-800">{classes} Classes Bundle</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Method</span>
                    <span className="font-bold text-slate-800">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/70 pt-2 text-sm font-bold text-slate-900">
                    <span>Amount Paid</span>
                    <span className="text-blue-700">{formatCurrency(amount)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={activeDashboardHref}
                    className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold shadow-sm gap-2"
                  >
                    <span>Go to Active Dashboard</span>
                    <IconArrowRight size={15} />
                  </Link>
                </div>

                <p className="text-center text-[11px] text-slate-400">
                  A receipt notification will be sent to your registered email &bull; Zero subscription lock-in
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Failed State
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <Link
            href="/tutors"
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Find Tutors
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-lg">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-b from-rose-50/70 to-white p-6 sm:p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-500/20">
                <IconX size={28} />
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950">
                Payment Unsuccessful
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                The simulated transaction was cancelled or declined.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-slate-800">Zero charges incurred</p>
                <p className="text-slate-500">
                  No amount was deducted from your account. You can retry with UPI, another debit/credit card, or choose a different package.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <Link
                  href={retryHref}
                  className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold shadow-sm gap-2"
                >
                  <span>Retry Payment</span>
                  <IconArrowRight size={15} />
                </Link>

                <Link
                  href="/tutors"
                  className="btn btn-secondary w-full text-xs font-bold"
                >
                  <span>Browse Other Tutors</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbfc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading payment status...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
