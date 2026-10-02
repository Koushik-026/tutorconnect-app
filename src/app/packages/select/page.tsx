"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import {
  IconCheck,
  IconShieldCheck,
  IconArrowRight,
  IconArrowLeft,
} from "@/components/ui/icons";

type PackageOption = {
  id: string;
  title: string;
  classes: number;
  price: number;
  validityDays: number;
  weeklyPace: string;
  description: string;
  recommended?: boolean;
  features: string[];
};

const packages: PackageOption[] = [
  {
    id: "package-8",
    title: "Starter Plan",
    classes: 8,
    price: 3200,
    validityDays: 45,
    weeklyPace: "2 classes / week",
    description: "Ideal for steady homework guidance and regular doubt resolution.",
    features: [
      "8 1-on-1 tutoring sessions (60 min each)",
      "Valid for 45 days from first class",
      "Digital whiteboard notes after each session",
      "Online or verified home tuition mode",
    ],
  },
  {
    id: "package-12",
    title: "Regular Plan",
    classes: 12,
    price: 4500,
    validityDays: 45,
    weeklyPace: "3 classes / week",
    description: "Recommended for continuous learning, regular quizzes, and revision.",
    features: [
      "12 1-on-1 tutoring sessions (60 min each)",
      "Valid for 45 days from first class",
      "Bi-weekly practice quizzes & assessments",
      "Direct parent progress updates",
      "Online or verified home tuition mode",
    ],
  },
  {
    id: "package-15",
    title: "Intensive Plan",
    classes: 15,
    price: 5400,
    validityDays: 45,
    weeklyPace: "3 to 4 classes / week",
    description: "Comprehensive multi-subject support and focused board exam readiness.",
    recommended: true,
    features: [
      "15 1-on-1 tutoring sessions (60 min each)",
      "Valid for 45 days from first class",
      "Complete syllabus coverage & past paper review",
      "Dedicated doubt clearing on demand",
      "Priority scheduling flexibility",
    ],
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function PackageSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId = searchParams.get("tutor") ?? "ananya-sharma";
  const tutor = tutors.find((t) => t.id === tutorId) ?? tutors[0];

  const [selectedPackageId, setSelectedPackageId] = useState("package-15");

  const selectedPackage =
    packages.find((item) => item.id === selectedPackageId) ?? packages[2];

  function continueToSchedule() {
    const query = new URLSearchParams({
      tutor: tutor.id,
      package: selectedPackage.id,
      classes: String(selectedPackage.classes),
      price: String(selectedPackage.price),
    });
    router.push(`/schedule/confirm?${query.toString()}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <Link
            href={`/tutors/${tutor.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <IconArrowLeft size={14} />
            <span>Back to Tutor Profile</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 py-8 sm:py-12 pb-32">
        <div className="container-shell max-w-5xl">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Transparent Tuition
            </span>
            <h1 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Choose your class package
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Selected Educator: <strong className="text-slate-900">{tutor.name}</strong> ({tutor.headline}).
              Packages are one-time class bundles with zero automatic renewals.
            </p>
          </div>

          {/* Package Comparison Grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              const perClass = Math.round(pkg.price / pkg.classes);

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-blue-600 ring-2 ring-blue-600/20 shadow-md"
                      : "border-slate-200/85 hover:border-blue-200 hover:shadow-xs"
                  }`}
                >
                  {pkg.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-extrabold text-white shadow-xs">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                        {pkg.weeklyPace}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {pkg.validityDays} days validity
                      </span>
                    </div>

                    <h2 className="mt-4 font-[family-name:var(--font-manrope)] text-xl font-extrabold text-slate-900">
                      {pkg.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed min-h-[32px]">
                      {pkg.description}
                    </p>

                    {/* Price Block */}
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-slate-950">
                          {formatCurrency(pkg.price)}
                        </span>
                        <span className="text-xs text-slate-500">/ package</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {formatCurrency(perClass)} per 60-min class
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <IconCheck size={14} className="text-blue-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      className={`btn w-full text-xs font-bold ${
                        isSelected ? "btn-primary shadow-xs" : "btn-secondary"
                      }`}
                    >
                      {isSelected ? "Selected Package" : "Select Package"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Support Assistance Strip */}
          <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                <IconShieldCheck size={20} />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900">Support Assistance</span>
                <p className="text-xs text-slate-500">Support available if you need help with your tuition arrangement or scheduling assistance.</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400 shrink-0">No Hidden Commitments</span>
          </div>
        </div>

        {/* Sticky Mobile/Desktop Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="container-shell max-w-5xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Selected: {selectedPackage.title} ({selectedPackage.classes} Classes)
              </span>
              <div className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-slate-900">
                {formatCurrency(selectedPackage.price)}
                <span className="text-xs font-normal text-slate-500"> / one-time bundle</span>
              </div>
            </div>

            <button
              type="button"
              onClick={continueToSchedule}
              className="btn btn-primary min-h-[48px] px-6 text-sm font-extrabold shadow-sm gap-2"
            >
              <span>Continue to Schedule</span>
              <IconArrowRight size={15} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PackageSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbfc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading class packages...</div>}>
      <PackageSelectionContent />
    </Suspense>
  );
}