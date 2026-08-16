"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Suspense,
  useMemo,
  useState,
} from "react";
import { Logo } from "@/components/logo";

type PaymentMethod =
  | "upi"
  | "card"
  | "netbanking";

const packagePrices: Record<number, number> = {
  8: 3200,
  12: 4500,
  15: 5400,
};

function formatPrice(value: number) {
  return value.toLocaleString("en-IN");
}

function formatMode(value: string) {
  return value === "online"
    ? "Online Tuition"
    : "Home Tuition";
}

function formatDays(value: string) {
  if (!value) {
    return "Mon, Wed, Fri";
  }

  return value
    .split(",")
    .map((day) => day.trim().slice(0, 3))
    .join(", ");
}

function addOneHour(time: string) {
  const match = time.match(
    /^(\d{1,2}):(\d{2})\s(AM|PM)$/,
  );

  if (!match) {
    return "60-minute session";
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3];

  if (period === "PM" && hour !== 12) {
    hour += 12;
  }

  if (period === "AM" && hour === 12) {
    hour = 0;
  }

  hour = (hour + 1) % 24;

  const outputPeriod =
    hour >= 12 ? "PM" : "AM";

  let outputHour = hour % 12;

  if (outputHour === 0) {
    outputHour = 12;
  }

  return `${outputHour}:${String(
    minute,
  ).padStart(2, "0")} ${outputPeriod}`;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId =
    searchParams.get("tutor") ??
    "ananya-sharma";

  const requestedClasses =
    Number(searchParams.get("classes")) ||
    15;

  const classes =
    packagePrices[requestedClasses]
      ? requestedClasses
      : 15;

  const price =
    Number(searchParams.get("price")) ||
    packagePrices[classes];

  const mode =
    searchParams.get("mode") ?? "home";

  const days =
    searchParams.get("days") ??
    "Monday,Wednesday,Friday";

  const time =
    searchParams.get("time") ??
    "5:00 PM";

  const startDate =
    searchParams.get("start") ??
    "2026-08-10";

  const changeMethodRequested =
    searchParams.get("changeMethod") ===
    "true";

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("upi");

  const [notice, setNotice] =
    useState<string | null>(
      changeMethodRequested
        ? "Choose a different payment method and try again."
        : null,
    );

  const [
    paymentTestOpen,
    setPaymentTestOpen,
  ] = useState(false);

  const formattedStartDate = useMemo(() => {
    const date = new Date(
      `${startDate}T00:00:00`,
    );

    if (Number.isNaN(date.getTime())) {
      return "10 August 2026";
    }

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    ).format(date);
  }, [startDate]);

  const perClass = Math.round(
    price / classes,
  );

  const endTime = addOneHour(time);

  const paymentMethodLabel =
    paymentMethod === "upi"
      ? "UPI"
      : paymentMethod === "card"
        ? "Card"
        : "Net Banking";

  function proceedToGateway() {
    setPaymentTestOpen(true);
    setNotice(null);
  }

  function simulatePayment(
    status: "success" | "failed",
  ) {
    const query = new URLSearchParams({
      status,
      tutor: tutorId,
      classes: String(classes),
      amount: String(price),
      method: paymentMethodLabel,
      transaction:
        status === "success"
          ? "TC-DEMO-SUCCESS-001"
          : "TC-DEMO-FAILED-001",
    });

    router.push(
      `/payment/result?${query.toString()}`,
    );
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#faf9ff]"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container-shell flex h-[72px] items-center justify-between gap-4">
          <Logo />

          <div className="hidden items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-extrabold text-teal-800 sm:flex">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
              />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>

            Secure Checkout
          </div>

          <Link
            href={`/schedule/confirm?tutor=${tutorId}&classes=${classes}&price=${price}`}
            className="text-sm font-bold text-slate-600 transition hover:text-blue-700"
          >
            × Cancel
          </Link>
        </div>
      </header>

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}
      <div className="container-shell py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1180px]">
          {/* PAGE TITLE */}
          <section>
            <span className="badge badge-blue">
              Step 3 of 3
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Complete Your Booking
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Review the package and schedule before
              continuing to secure payment.
            </p>
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            {/* =================================================
                ORDER SUMMARY
            ================================================== */}
            <section className="tc-card overflow-hidden">
              <div className="border-b border-slate-200 bg-indigo-50/50 px-6 py-5">
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* Tutor */}
                <div className="flex items-center gap-4">
                  <div
                    role="img"
                    aria-label="Ananya Sharma"
                    className="h-14 w-14 shrink-0 rounded-full border-2 border-white bg-cover bg-center shadow-sm"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA')",
                    }}
                  />

                  <div>
                    <p className="font-extrabold text-slate-950">
                      Ananya Sharma
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      <span className="font-bold text-amber-600">
                        ★ 4.9
                      </span>

                      {" · "}
                      Mathematics & Science Tutor
                    </p>
                  </div>
                </div>

                <div className="my-6 border-t border-dashed border-slate-300" />

                {/* Package */}
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-extrabold text-slate-950">
                      {classes}-Class Learning
                      Package
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-blue-700">
                        {mode === "online"
                          ? "▣"
                          : "⌂"}
                      </span>

                      {formatMode(mode)}
                    </p>
                  </div>

                  <p className="shrink-0 text-lg font-extrabold text-slate-950">
                    ₹{formatPrice(price)}
                  </p>
                </div>

                {/* Schedule */}
                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                  <div className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      ▣
                    </span>

                    <div>
                      <p className="font-extrabold text-slate-950">
                        Confirmed Schedule
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {formatDays(days)} ·{" "}
                        {time} – {endTime}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Starts{" "}
                        {formattedStartDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package facts */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Per class
                    </p>

                    <p className="mt-1 font-extrabold text-slate-900">
                      ₹{formatPrice(perClass)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Validity
                    </p>

                    <p className="mt-1 font-extrabold text-slate-900">
                      45 days
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-600">
                      Package total
                    </span>

                    <span className="font-bold text-slate-900">
                      ₹{formatPrice(price)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-dashed border-slate-300 pt-4">
                    <span className="text-xl font-extrabold text-slate-950">
                      Total
                    </span>

                    <span className="text-3xl font-extrabold text-blue-700">
                      ₹{formatPrice(price)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                PAYMENT METHOD
            ================================================== */}
            <section>
              <article className="tc-card overflow-hidden">
                <div className="border-b border-slate-200 bg-indigo-50/50 px-6 py-5">
                  <h2 className="text-2xl font-extrabold text-slate-950">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Final payment details will be
                    handled by the secure payment
                    gateway.
                  </p>
                </div>

                {/* UPI */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("upi");
                    setNotice(null);
                  }}
                  className={`flex w-full items-center gap-4 border-b border-slate-200 p-6 text-left transition ${
                    paymentMethod === "upi"
                      ? "border-l-4 border-l-blue-600 bg-blue-50/40"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMethod === "upi"
                        ? "border-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "upi" && (
                      <span className="h-3 w-3 rounded-full bg-blue-600" />
                    )}
                  </span>

                  <div className="flex-1">
                    <p className="font-extrabold text-slate-950">
                      UPI
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Google Pay, PhonePe, Paytm
                      and supported UPI apps
                    </p>
                  </div>

                  <span className="text-xl text-blue-700">
                    ▦
                  </span>
                </button>

                {/* CARD */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    setNotice(null);
                  }}
                  className={`flex w-full items-center gap-4 border-b border-slate-200 p-6 text-left transition ${
                    paymentMethod === "card"
                      ? "border-l-4 border-l-blue-600 bg-blue-50/40"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMethod === "card"
                        ? "border-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "card" && (
                      <span className="h-3 w-3 rounded-full bg-blue-600" />
                    )}
                  </span>

                  <div className="flex-1">
                    <p className="font-extrabold text-slate-950">
                      Credit / Debit Card
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Enter card details only
                      inside the payment gateway.
                    </p>
                  </div>

                  <span className="text-xl text-slate-700">
                    ▣
                  </span>
                </button>

                {/* NET BANKING */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod(
                      "netbanking",
                    );
                    setNotice(null);
                  }}
                  className={`flex w-full items-center gap-4 p-6 text-left transition ${
                    paymentMethod ===
                    "netbanking"
                      ? "border-l-4 border-l-blue-600 bg-blue-50/40"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      paymentMethod ===
                      "netbanking"
                        ? "border-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod ===
                      "netbanking" && (
                      <span className="h-3 w-3 rounded-full bg-blue-600" />
                    )}
                  </span>

                  <div className="flex-1">
                    <p className="font-extrabold text-slate-950">
                      Net Banking
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Complete bank authentication
                      through the gateway.
                    </p>
                  </div>

                  <span className="text-xl text-slate-700">
                    ◫
                  </span>
                </button>
              </article>

              {/* Security information */}
              <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    ✓
                  </span>

                  <div>
                    <p className="font-extrabold text-slate-950">
                      Secure gateway checkout
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      TutorConnect will never ask
                      you to send money directly
                      to a tutor. Payment
                      credentials are handled by
                      the payment provider rather
                      than stored in this
                      frontend.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment button */}
              <button
                type="button"
                onClick={proceedToGateway}
                className="btn btn-primary mt-5 min-h-14 w-full"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

                Proceed to Secure Payment · ₹
                {formatPrice(price)}
              </button>

              {notice && (
                <div
                  role="status"
                  className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
                >
                  {notice}
                </div>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                No payment is being
                processed in this frontend
                prototype.
              </p>
            </section>
          </div>

          {/* =================================================
              TRUST ROW
          ================================================== */}
          <section className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-500">
            <span>◇ Secure booking</span>
            <span>₹ Clear package pricing</span>
            <span>
              ✓ Server-verified payments later
            </span>
          </section>
        </div>
      </div>

      {/* =====================================================
          DEVELOPMENT PAYMENT TEST MODAL
      ====================================================== */}
      {paymentTestOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-test-title"
            className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge badge-blue">
                  Development test
                </span>

                <h2
                  id="payment-test-title"
                  className="mt-4 text-2xl font-extrabold text-slate-950"
                >
                  Simulate Payment Result
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close payment test"
                onClick={() =>
                  setPaymentTestOpen(false)
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The real payment gateway is not
              connected yet. Choose a result
              below so we can test both
              TutorConnect payment states.
            </p>

            {/* Summary */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">
                  Package
                </span>

                <strong className="text-sm text-slate-950">
                  {classes} classes
                </strong>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">
                  Amount
                </span>

                <strong className="text-lg text-slate-950">
                  ₹{formatPrice(price)}
                </strong>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">
                  Method
                </span>

                <strong className="text-sm text-slate-950">
                  {paymentMethodLabel}
                </strong>
              </div>
            </div>

            {/* Success */}
            <button
              type="button"
              onClick={() =>
                simulatePayment("success")
              }
              className="btn mt-6 w-full bg-teal-600 text-white hover:bg-teal-700"
            >
              ✓ Simulate Successful Payment
            </button>

            {/* Failed */}
            <button
              type="button"
              onClick={() =>
                simulatePayment("failed")
              }
              className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-extrabold text-red-700 transition hover:bg-red-100"
            >
              × Simulate Failed Payment
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              This test screen will disappear
              when the real payment gateway is
              connected.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
          <div className="text-center">
            <Logo />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading secure checkout…
            </p>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}