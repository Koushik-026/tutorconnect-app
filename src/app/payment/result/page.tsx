"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/logo";

type PaymentStatus =
  | "success"
  | "failed";

function formatPrice(value: number) {
  return value.toLocaleString("en-IN");
}

function PaymentResultContent() {
  const searchParams = useSearchParams();

  const status: PaymentStatus =
    searchParams.get("status") === "failed"
      ? "failed"
      : "success";

  const tutorId =
    searchParams.get("tutor") ??
    "ananya-sharma";

  const classes =
    Number(searchParams.get("classes")) ||
    15;

  const amount =
    Number(searchParams.get("amount")) ||
    5400;

  const paymentMethod =
    searchParams.get("method") ??
    "UPI";

  const transactionId =
    searchParams.get("transaction") ??
    "TC-DEMO-20260810";

  const activeDashboardHref =
    `/dashboard/student?state=active&classes=${classes}&amount=${amount}`;

  const retryParams =
    new URLSearchParams({
      tutor: tutorId,
      classes: String(classes),
      price: String(amount),
    });

  /* =========================================================
     SUCCESS
  ========================================================== */

  if (status === "success") {
    return (
      <main
        id="main-content"
        className="relative min-h-screen overflow-hidden bg-[#faf9ff]"
      >
        {/* Background */}
        <div
          aria-hidden="true"
          className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-teal-200/25 blur-3xl"
        />

        {/* Header */}
        <header className="relative z-10 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
          <div className="container-shell flex h-[72px] items-center justify-between">
            <Logo />

            <span className="badge badge-teal">
              Payment confirmed
            </span>
          </div>
        </header>

        {/* Main */}
        <div className="container-shell relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center py-10 sm:py-14">
          <section className="w-full max-w-[620px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(20,184,166,0.13)]">
            <div className="px-5 py-9 text-center sm:px-9 sm:py-11">
              {/* Success icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-11 w-11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path d="m8 12 2.5 2.5L16 9" />
                </svg>
              </div>

              <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Payment Successful!
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
                Your{" "}
                <strong className="text-slate-900">
                  {classes}-class package
                </strong>{" "}
                with Ananya Sharma is now
                active.
              </p>

              {/* Tutor */}
              <div className="mt-7 flex items-center gap-4 rounded-2xl bg-indigo-50/80 p-4 text-left">
                <div
                  role="img"
                  aria-label="Ananya Sharma"
                  className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center shadow-sm"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA')",
                  }}
                />

                <div>
                  <p className="font-extrabold text-slate-950">
                    Ananya Sharma
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Mathematics & Science Tutor
                  </p>
                </div>
              </div>

              {/* Payment details */}
              <div className="mt-7 border-y border-slate-200 py-5 text-left">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Amount paid
                  </span>

                  <strong className="text-lg text-slate-950">
                    ₹{formatPrice(amount)}
                  </strong>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Package
                  </span>

                  <strong className="text-sm text-slate-950">
                    {classes} Classes
                  </strong>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Date
                  </span>

                  <strong className="text-sm text-slate-950">
                    10 August 2026
                  </strong>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Payment method
                  </span>

                  <strong className="text-sm text-slate-950">
                    {paymentMethod}
                  </strong>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Transaction ID
                  </span>

                  <strong className="text-right text-xs text-slate-700 sm:text-sm">
                    {transactionId}
                  </strong>
                </div>
              </div>

              {/* Activation */}
              <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 p-4 text-left">
                <p className="font-extrabold text-teal-900">
                  ✓ Package activated
                </p>

                <p className="mt-1 text-sm leading-6 text-teal-800">
                  Aarav&apos;s tuition package
                  and learning dashboard are
                  ready.
                </p>
              </div>

              {/* IMPORTANT CONNECTION */}
              <Link
                href={activeDashboardHref}
                className="btn btn-primary mt-7 w-full"
              >
                Go to Active Dashboard

                <span aria-hidden="true">
                  →
                </span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  window.alert(
                    "Receipt download will be generated from the verified payment record during backend integration.",
                  );
                }}
                className="btn btn-secondary mt-3 w-full"
              >
                ↓ Download Receipt
              </button>

              {/* Prototype note */}
              <p className="mt-6 text-xs leading-5 text-slate-400">
                Frontend preview: package
                activation is simulated. In
                production, TutorConnect will
                activate the package only after
                server-side payment verification.
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* =========================================================
     FAILED
  ========================================================== */

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[#faf9ff]"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-red-200/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl"
      />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="container-shell flex h-[72px] items-center justify-between">
          <Logo />

          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700">
            Payment failed
          </span>
        </div>
      </header>

      <div className="container-shell relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center py-10 sm:py-14">
        <section className="w-full max-w-[620px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(239,68,68,0.10)]">
          <div className="px-5 py-9 text-center sm:px-9 sm:py-11">
            {/* Failure icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />

                <path d="m9 9 6 6" />
                <path d="m15 9-6 6" />
              </svg>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Payment Unsuccessful
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              Your payment could not be
              completed.
              <strong className="text-slate-900">
                {" "}
                No tuition package has been
                activated.
              </strong>
            </p>

            {/* Failure info */}
            <div className="mt-7 rounded-2xl border border-red-100 bg-red-50/70 p-5 text-left">
              <p className="font-extrabold text-red-900">
                Your booking is not confirmed
                yet
              </p>

              <p className="mt-2 text-sm leading-6 text-red-800">
                Retry the payment or choose a
                different payment method.
              </p>
            </div>

            {/* Package */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-extrabold text-slate-950">
                    {classes}-Class Package
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Ananya Sharma
                  </p>
                </div>

                <p className="text-xl font-extrabold text-slate-950">
                  ₹{formatPrice(amount)}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-500">
                  Attempted using
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {paymentMethod}
                </p>
              </div>
            </div>

            {/* Retry */}
            <Link
              href={`/payment/checkout?${retryParams.toString()}`}
              className="btn btn-primary mt-7 w-full"
            >
              Retry Payment

              <span aria-hidden="true">
                →
              </span>
            </Link>

            <Link
              href={`/payment/checkout?${retryParams.toString()}&changeMethod=true`}
              className="btn btn-secondary mt-3 w-full"
            >
              Try Another Payment Method
            </Link>

            {/* IMPORTANT:
                Failed payment returns to normal dashboard,
                NOT active dashboard.
            */}
            <Link
              href="/dashboard/student"
              className="mt-5 inline-flex text-sm font-bold text-slate-500 transition hover:text-blue-700"
            >
              Return to Dashboard
            </Link>

            <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-left">
              <p className="text-xs leading-5 text-slate-600">
                If money was debited but the
                payment appears unsuccessful,
                TutorConnect will verify the
                gateway status before asking
                the user to pay again.
              </p>
            </div>

            <p className="mt-6 text-xs leading-5 text-slate-400">
              Frontend preview: no real
              payment has occurred.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
          <div className="text-center">
            <Logo />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Verifying payment…
            </p>
          </div>
        </main>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}