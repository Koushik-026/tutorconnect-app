"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PackagePurchaseRow } from "@/lib/types/database";
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
  const purchaseId = searchParams.get("purchase_id");
  const rawStatus = searchParams.get("status");
  const queryTutor = searchParams.get("tutor") || "ananya-sharma";
  const queryClasses = searchParams.get("classes") || "12";
  const queryAmount = Number(searchParams.get("amount")) || 4500;
  const queryTransaction = searchParams.get("transaction") || "TC-DEMO-849201";

  const [purchase, setPurchase] = useState<PackagePurchaseRow | null>(null);

  useEffect(() => {
    if (!purchaseId || !isSupabaseConfigured()) return;

    const supabase = createClient();
    supabase
      .from("package_purchases")
      .select("*")
      .eq("id", purchaseId)
      .single()
      .then(({ data }) => {
        if (data) {
          setPurchase(data as PackagePurchaseRow);
        }
      });
  }, [purchaseId]);

  const isSuccess =
    purchase?.status === "activated" || rawStatus === "success";
  const status: PaymentStatus = isSuccess ? "success" : "failed";

  const tutor =
    tutors.find((t) => t.id === (purchase?.tutor_slug || queryTutor)) || tutors[0];
  const classes = purchase?.package_id === "package-8" ? "8" : purchase?.package_id === "package-15" ? "15" : queryClasses;
  const amount = purchase?.amount_inr || queryAmount;
  const transaction = purchase?.transaction_reference || queryTransaction;
  const method = purchase?.payment_method || "UPI";

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition"
          >
            Go to Workspace &rarr;
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-lg mx-auto w-full">
          {/* Centered Receipt/Status Object */}
          <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)] text-center">
            {status === "success" ? (
              <>
                {/* Sage Tinted Status Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EADD] px-4 py-1.5 text-xs font-bold text-[#244A40] mb-5">
                  <IconCheck size={14} />
                  <span>Tuition Package Activated</span>
                </div>

                <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                  Payment Received
                </h1>
                <p className="mt-2 text-xs text-[#6F6A62]">
                  Your learning package with <strong className="text-[#25231F]">{purchase?.tutor_name || tutor.name}</strong> is now active in your student workspace.
                </p>

                {/* Receipt Card */}
                <div className="mt-6 rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-5 text-left space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6F6A62]">Package:</span>
                    <span className="font-bold text-[#25231F]">{classes} Classes (60m each)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6F6A62]">Validity:</span>
                    <span className="font-bold text-[#25231F]">45 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6F6A62]">Amount Paid:</span>
                    <span className="font-bold text-[#25231F]">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6F6A62]">Method:</span>
                    <span className="font-bold text-[#25231F]">{method}</span>
                  </div>
                  <div className="flex justify-between border-t border-[rgba(55,48,40,0.06)] pt-2">
                    <span className="text-[#9B958C]">Transaction Ref:</span>
                    <span className="font-mono text-[#6F6A62]">{transaction}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href="/dashboard/student"
                    className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
                  >
                    <span>Enter Student Workspace</span>
                    <IconArrowRight size={15} />
                  </Link>

                  <Link
                    href="/dashboard/student/sessions"
                    className="btn btn-outline w-full min-h-[44px] rounded-full text-xs font-bold justify-center"
                  >
                    <span>View Scheduled Sessions</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Soft Danger Tint Status Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FCEEEA] px-4 py-1.5 text-xs font-bold text-[#A6361E] mb-5">
                  <IconX size={14} />
                  <span>Payment Simulation Incomplete</span>
                </div>

                <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                  Transaction Incomplete
                </h1>
                <p className="mt-2 text-xs text-[#6F6A62]">
                  The simulated transaction was declined. No funds were charged.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href={`/payment/checkout?tutor=${tutor.id}&classes=${classes}&price=${amount}`}
                    className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-xs justify-center"
                  >
                    Try Checkout Again
                  </Link>

                  <Link
                    href="/dashboard/student"
                    className="text-xs font-semibold text-[#6F6A62] hover:text-[#25231F] transition"
                  >
                    Go to Workspace
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF5]" />}>
      <PaymentResultContent />
    </Suspense>
  );
}
