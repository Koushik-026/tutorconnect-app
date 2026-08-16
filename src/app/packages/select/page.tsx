"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";

type PackageOption = {
  id: string;
  classes: number;
  price: number;
  validityDays: number;
  description: string;
  recommended?: boolean;
};

const packages: PackageOption[] = [
  {
    id: "8-classes",
    classes: 8,
    price: 3200,
    validityDays: 45,
    description: "Focused monthly support",
  },
  {
    id: "12-classes",
    classes: 12,
    price: 4500,
    validityDays: 45,
    description: "Regular weekly learning",
  },
  {
    id: "15-classes",
    classes: 15,
    price: 5400,
    validityDays: 45,
    description: "Consistent multi-subject tuition",
    recommended: true,
  },
];

function formatPrice(value: number) {
  return value.toLocaleString("en-IN");
}

function PackageSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId =
    searchParams.get("tutor") ?? "ananya-sharma";

  const [selectedPackageId, setSelectedPackageId] =
    useState("15-classes");

  const selectedPackage =
    packages.find(
      (item) => item.id === selectedPackageId,
    ) ?? packages[2];

  function continueToSchedule() {
    const query = new URLSearchParams({
      tutor: tutorId,
      package: selectedPackage.id,
      classes: String(selectedPackage.classes),
      price: String(selectedPackage.price),
    });

    router.push(
      `/schedule/confirm?${query.toString()}`,
    );
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#faf9ff] pb-32"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container-shell flex h-[72px] items-center gap-4">
          <Link
            href="/demo/feedback"
            aria-label="Back to demo feedback"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-700 transition hover:bg-slate-100"
          >
            ←
          </Link>

          <Logo />
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="container-shell py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[940px]">
          {/* TUTOR SUMMARY */}
          <section className="border-b border-slate-200 pb-7">
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
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                  Booking classes with
                </p>

                <h1 className="mt-1 text-2xl font-extrabold text-slate-950">
                  Ananya Sharma
                </h1>
              </div>
            </div>
          </section>

          {/* PAGE HEADING */}
          <section className="pt-7">
            <span className="badge badge-blue">
              Step 1 of 3
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Select a Learning Package
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Choose the number of classes that best
              matches Aarav&apos;s learning needs.
            </p>
          </section>

          {/* =================================================
              PACKAGES
          ================================================== */}
          <section className="mt-8 grid gap-5 md:grid-cols-3">
            {packages.map((item) => {
              const selected =
                selectedPackageId === item.id;

              const perClass = Math.round(
                item.price / item.classes,
              );

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelectedPackageId(item.id)
                  }
                  aria-pressed={selected}
                  className={`relative flex min-h-[315px] w-full flex-col rounded-[24px] border p-6 text-left transition duration-200 sm:p-7 ${
                    selected
                      ? "border-2 border-blue-600 bg-blue-50/60 shadow-[0_18px_45px_rgba(37,99,235,0.12)]"
                      : "border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  {item.recommended && (
                    <span className="absolute right-0 top-0 rounded-bl-xl rounded-tr-[21px] bg-teal-700 px-4 py-2 text-xs font-extrabold text-white">
                      Recommended
                    </span>
                  )}

                  {/* SELECTOR + CLASS COUNT */}
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected
                          ? "border-blue-600"
                          : "border-slate-300"
                      }`}
                    >
                      {selected && (
                        <span className="h-3.5 w-3.5 rounded-full bg-blue-600" />
                      )}
                    </span>

                    <div className="text-right">
                      <p
                        className={`text-4xl font-extrabold ${
                          selected
                            ? "text-blue-600"
                            : "text-slate-950"
                        }`}
                      >
                        {item.classes}
                      </p>

                      <p className="mt-1 text-sm font-extrabold uppercase tracking-wide text-slate-700">
                        Classes
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-200 pt-6">
                    <p className="text-3xl font-extrabold text-slate-950">
                      ₹{formatPrice(item.price)}
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-blue-600">
                        ▣
                      </span>

                      ₹{formatPrice(perClass)} per class
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-violet-600">
                        ◷
                      </span>

                      Valid for {item.validityDays} days
                    </p>

                    <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </section>

          {/* =================================================
              PACKAGE INFO
          ================================================== */}
          <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-extrabold text-blue-700">
                i
              </span>

              <div>
                <p className="font-extrabold text-slate-900">
                  Package validity
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Classes can be scheduled during the
                  45-day validity period. The final
                  tuition mode and regular schedule are
                  selected in the next step.
                </p>
              </div>
            </div>
          </section>

          {/* STUDENT + SUBJECT SUMMARY */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="tc-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                Student
              </p>

              <p className="mt-2 font-extrabold text-slate-950">
                Aarav Reddy
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Class 9 · CBSE
              </p>
            </article>

            <article className="tc-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                Subjects
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="badge badge-blue">
                  Mathematics
                </span>

                <span className="badge badge-teal">
                  Science
                </span>
              </div>
            </article>
          </section>

          {/* FRONTEND NOTE */}
          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            Frontend preview: package selection is not
            stored yet. During backend integration, the
            chosen package will be validated against the
            database before checkout.
          </section>
        </div>
      </div>

      {/* =====================================================
          STICKY CHECKOUT SUMMARY
      ====================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-12px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="container-shell flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
              Total package
            </p>

            <div className="mt-1 flex items-end gap-2">
              <p className="text-2xl font-extrabold text-slate-950">
                ₹
                {formatPrice(
                  selectedPackage.price,
                )}
              </p>

              <p className="pb-1 text-sm font-semibold text-slate-500">
                ({selectedPackage.classes} Classes)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={continueToSchedule}
            className="btn btn-primary w-full sm:w-auto sm:min-w-[250px]"
          >
            Continue to Schedule
            <span aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </footer>
    </main>
  );
}

export default function PackageSelectionPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
          <div className="text-center">
            <Logo />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading packages…
            </p>
          </div>
        </main>
      }
    >
      <PackageSelectionContent />
    </Suspense>
  );
}