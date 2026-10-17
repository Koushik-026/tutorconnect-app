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
  const queryTutor = searchParams.get("tutor") || "ananya-sharma";
  const queryClasses = searchParams.get("classes") || "12";
  const queryAmount = Number(searchParams.get("amount")) || 4500;
  const queryTransaction = searchParams.get("transaction") || "TC-DEMO-849201";

  const [purchase, setPurchase] = useState<PackagePurchaseRow | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!purchaseId || !isSupabaseConfigured()) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: authData }) => {
      const user = authData?.user;
      if (!user) return;
      setCurrentUserId(user.id);

      // Defense-in-depth: Enforce both client query filtering by user_id and Supabase RLS
      supabase
        .from("package_purchases")
        .select("*")
        .eq("id", purchaseId)
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setPurchase(data as PackagePurchaseRow);
          }
        });
    });
  }, [purchaseId]);

  // Authoritative: Success strictly requires BOTH verified authenticated user ownership AND database status === "activated"
  const isSuccess = Boolean(
    purchase &&
    currentUserId &&
    purchase.user_id === currentUserId &&
    purchase.status === "activated"
  );
  const status: PaymentStatus = isSuccess ? "success" : "failed";

  const tutor =
    tutors.find((t) => t.id === (purchase?.tutor_slug || queryTutor)) || tutors[0];
  const classes = purchase?.package_id === "package-8" ? "8" : purchase?.package_id === "package-15" ? "15" : queryClasses;
  const amount = purchase?.amount_inr || queryAmount;
  const transaction = purchase?.transaction_reference || queryTransaction;
  const method = purchase?.payment_method || "UPI";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] text-[var(--tc-text-primary)] transition-colors">
      <header className="border-b border-[var(--tc-border)] bg-[var(--tc-surface)]/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          {status === "success" ? (
            <Link
              href="/dashboard/student"
              className="text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition"
            >
              Go to Workspace &rarr;
            </Link>
          ) : (
            <Link
              href="/tutors"
              className="text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition"
            >
              Explore Tutors &rarr;
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-lg mx-auto w-full">
          {/* Centered Receipt/Status Object */}
          <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-7 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)] text-center">
            {status === "success" ? (
              <>
                {/* Sage Tinted Status Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-teal)]/10 border border-[var(--tc-teal)]/20 px-4 py-1.5 text-xs font-bold text-[var(--tc-teal)] mb-5">
                  <IconCheck size={14} />
                  <span>Tuition Package Activated</span>
                </div>

                <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[var(--tc-text-primary)]">
                  Payment Received
                </h1>
                <p className="mt-2 text-xs text-[var(--tc-text-secondary)]">
                  Your learning package with <strong className="text-[var(--tc-text-primary)]">{purchase?.tutor_name || tutor.name}</strong> is now active in your student workspace.
                </p>

                {/* Receipt Card */}
                <div className="mt-6 rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] p-5 text-left space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--tc-text-secondary)]">Package:</span>
                    <span className="font-bold text-[var(--tc-text-primary)]">{classes} Classes (60m each)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--tc-text-secondary)]">Validity:</span>
                    <span className="font-bold text-[var(--tc-text-primary)]">45 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--tc-text-secondary)]">Amount Paid:</span>
                    <span className="font-bold text-[var(--tc-text-primary)]">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--tc-text-secondary)]">Method:</span>
                    <span className="font-bold text-[var(--tc-text-primary)]">{method}</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--tc-border)] pt-2">
                    <span className="text-[var(--tc-text-secondary)]">Transaction Ref:</span>
                    <span className="font-mono text-[var(--tc-text-secondary)]">{transaction}</span>
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
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-danger)]/10 border border-[var(--tc-danger)]/20 px-4 py-1.5 text-xs font-bold text-[var(--tc-danger)] mb-5">
                  <IconX size={14} />
                  <span>Payment Simulation Incomplete</span>
                </div>

                <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[var(--tc-text-primary)]">
                  Transaction Incomplete
                </h1>
                <p className="mt-2 text-xs text-[var(--tc-text-secondary)]">
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
                    href="/tutors"
                    className="text-xs font-semibold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition"
                  >
                    Explore Other Educators
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
    <Suspense fallback={<div className="min-h-screen bg-[var(--tc-bg)]" />}>
      <PaymentResultContent />
    </Suspense>
  );
}
