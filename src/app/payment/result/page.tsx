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
  IconShieldCheck,
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
      <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
        <header className="border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Logo />
            <Link
              href={activeDashboardHref}
              className="text-xs font-bold text-[#66518A] hover:text-[#4E3C70] transition-colors"
            >
              Dashboard &rarr;
            </Link>
          </div>
        </header>

        <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-lg">
            <div className="overflow-hidden rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] shadow-xs">
              {/* Top Banner: Warm light confirmation */}
              <div className="border-b border-[#E4DED4] bg-[#E6F0EA]/50 p-6 sm:p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F7867] text-white shadow-xs">
                  <IconCheck size={28} />
                </div>
                <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520]">
                  Payment Successful
                </h1>
                <p className="mt-1 text-xs text-[#676B64]">
                  Your simulated learning package has been activated for this demo.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="rounded-2xl border border-[#E4DED4] bg-[#F7F4EE]/60 p-4 space-y-2.5 text-xs text-[#676B64]">
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="font-mono font-bold text-[#232520]">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Educator</span>
                    <span className="font-bold text-[#232520]">{tutor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package Activated</span>
                    <span className="font-bold text-[#232520]">{classes} Classes Bundle</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="font-bold text-[#232520]">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E4DED4] pt-2 text-sm font-bold text-[#232520]">
                    <span>Amount Paid</span>
                    <span className="text-[#66518A]">{formatCurrency(amount)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={activeDashboardHref}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#66518A] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
                  >
                    <span>Enter Student Learning Space</span>
                    <IconArrowRight size={15} />
                  </Link>
                </div>

                <p className="text-center text-[11px] text-[#676B64] flex items-center justify-center gap-1">
                  <IconShieldCheck size={13} className="text-[#4F7867]" />
                  <span>Payment receipt available in your account &bull; Prototype simulation</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Failed State: Light, Reassuring
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
      <header className="border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href="/tutors"
            className="text-xs font-bold text-[#676B64] hover:text-[#232520] transition-colors"
          >
            Find Tutors
          </Link>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-lg">
          <div className="overflow-hidden rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] shadow-xs">
            <div className="border-b border-[#E4DED4] bg-rose-50/60 p-6 sm:p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xs">
                <IconX size={28} />
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520]">
                Payment Unsuccessful
              </h1>
              <p className="mt-1 text-xs text-[#676B64]">
                The simulated transaction was cancelled or declined.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="rounded-2xl border border-[#E4DED4] bg-[#F7F4EE]/60 p-4 text-xs text-[#676B64] space-y-1.5">
                <p className="font-bold text-[#232520]">This simulated payment was not completed.</p>
                <p>
                  No real payment is processed in prototype mode. You can retry the simulated checkout or explore other options.
                </p>
              </div>

              <div className="pt-2 space-y-2.5">
                <Link
                  href={retryHref}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#66518A] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
                >
                  <span>Retry Payment</span>
                  <IconArrowRight size={15} />
                </Link>

                <Link
                  href="/tutors"
                  className="w-full inline-flex items-center justify-center rounded-xl border border-[#E4DED4] bg-[#FFFEFB] py-2.5 px-3 text-xs font-bold text-[#676B64] hover:text-[#232520] hover:bg-[#F7F4EE] transition-colors"
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE] text-xs font-bold text-[#676B64]">
          Loading payment status...
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
