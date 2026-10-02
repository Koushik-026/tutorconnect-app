"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import { tutors } from "@/lib/data";
import {
  IconCheck,
  IconArrowRight,
  IconShieldCheck,
  IconArrowLeft,
  IconSparkles,
} from "@/components/ui/icons";

interface LearningPackage {
  id: string;
  rhythmName: string;
  intensity: string;
  classes: number;
  price: number;
  perClassPrice: number;
  validityDays: number;
  paceDescription: string;
  bestFor: string;
  highlight?: boolean;
  features: string[];
}

const packages: LearningPackage[] = [
  {
    id: "package-8",
    rhythmName: "Steady Start",
    intensity: "Foundation Rhythm",
    classes: 8,
    price: 3200,
    perClassPrice: 400,
    validityDays: 45,
    paceDescription: "2 classes / week",
    bestFor: "Ideal for concept reinforcement, targeted doubt clearing, and bridging specific subject gaps.",
    features: [
      "8 1-on-1 personalized sessions (60 min each)",
      "45-day validity from first session",
      "Digital lesson notes when shared by the tutor",
      "Online or eligible Home tuition",
      "Flexible weekly learning rhythm",
    ],
  },
  {
    id: "package-12",
    rhythmName: "Consistent Momentum",
    intensity: "Balanced Rhythm",
    classes: 12,
    price: 4500,
    perClassPrice: 375,
    validityDays: 45,
    paceDescription: "3 classes / week",
    bestFor: "Recommended for continuous syllabus coverage, regular chapter review, and consistent academic rhythm.",
    features: [
      "12 1-on-1 personalized sessions (60 min each)",
      "45-day validity from first session",
      "Digital lesson notes when shared by the tutor",
      "Online or eligible Home tuition",
      "Consistent 3-class weekly learning rhythm",
    ],
  },
  {
    id: "package-15",
    rhythmName: "Focused Progress",
    intensity: "Accelerated Rhythm",
    classes: 15,
    price: 5400,
    perClassPrice: 360,
    validityDays: 45,
    paceDescription: "3 to 4 classes / week",
    bestFor: "Comprehensive syllabus coverage, thorough chapter review, and intensive learning rhythm.",
    highlight: true,
    features: [
      "15 1-on-1 personalized sessions (60 min each)",
      "45-day validity from first session",
      "Digital lesson notes when shared by the tutor",
      "Online or eligible Home tuition",
      "Highest per-class value (₹360/class)",
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
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href={`/tutors/${tutor.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#676B64] hover:text-[#66518A] transition-colors"
          >
            <IconArrowLeft size={14} />
            <span>Tutor Dossier</span>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main id="main-content" className="flex-1 py-8 sm:py-12 pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header intro */}
          <div className="max-w-3xl mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#B7A5DE]/40 bg-[#EFEAF8] px-3 py-1 text-xs font-bold tracking-wide text-[#66518A]">
              Step 1 of 3 &bull; Learning Rhythm Selection
            </span>
            <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-extrabold tracking-tight text-[#232520] sm:text-3xl lg:text-4xl">
              Choose Your Learning Intensity with {tutor.name}
            </h1>
            <p className="mt-2 text-sm text-[#676B64] leading-relaxed">
              Every learner progresses differently. Select the weekly rhythm that matches your goals.
              All packages include 60-minute classes, 45-day validity, and zero recurring lock-in.
            </p>
          </div>

          {/* Asymmetric Learning Rhythm Stack (NOT standard 3 SaaS cards) */}
          <div className="space-y-4">
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`relative cursor-pointer rounded-3xl border transition-all ${
                    isSelected
                      ? "border-[#66518A] bg-[#FFFEFB] shadow-md ring-2 ring-[#66518A]/20"
                      : "border-[#E4DED4] bg-[#FFFEFB]/80 hover:bg-[#FFFEFB] hover:border-[#66518A]/40"
                  } p-5 sm:p-7`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Rhythm Identity & Description */}
                    <div className="space-y-2 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-full bg-[#EFEAF8] px-3 py-0.5 text-xs font-extrabold text-[#66518A]">
                          {pkg.classes} Classes Bundle
                        </span>
                        <span className="text-xs font-bold text-[#676B64]">
                          {pkg.paceDescription}
                        </span>
                        {pkg.highlight && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F0EA] px-2.5 py-0.5 text-[11px] font-bold text-[#4F7867]">
                            <IconSparkles size={12} />
                            Recommended Rhythm
                          </span>
                        )}
                      </div>

                      <h2 className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-[#232520]">
                        {pkg.rhythmName}
                      </h2>
                      <p className="text-xs text-[#676B64] leading-relaxed">
                        {pkg.bestFor}
                      </p>

                      {/* Feature chips */}
                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#232520]">
                        <span className="flex items-center gap-1.5">
                          <IconCheck size={13} className="text-[#4F7867]" />
                          60 mins/class
                        </span>
                        <span className="flex items-center gap-1.5">
                          <IconCheck size={13} className="text-[#4F7867]" />
                          45 days validity
                        </span>
                        <span className="flex items-center gap-1.5">
                          <IconCheck size={13} className="text-[#4F7867]" />
                          Online or Home mode
                        </span>
                      </div>
                    </div>

                    {/* Right: Price & Selector Button */}
                    <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E4DED4]">
                      <div className="lg:text-right">
                        <div className="flex items-baseline gap-1.5 lg:justify-end">
                          <span className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#232520]">
                            {formatCurrency(pkg.price)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#676B64]">
                          ₹{pkg.perClassPrice} per 60-min class &bull; One-time
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "border-[#66518A] bg-[#66518A]"
                              : "border-[#E4DED4] bg-white"
                          }`}
                        >
                          {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-bold text-[#66518A] lg:hidden">
                          {isSelected ? "Selected" : "Select"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Class Package Support Note */}
          <div className="mt-8 rounded-2xl border border-[#E4DED4] bg-[#EFEAF8]/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFEAF8] text-[#66518A]">
                <IconShieldCheck size={20} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#232520]">Class Package Support &bull; Package Details</p>
                <p className="text-[#676B64]">
                  Classes happen at your agreed schedule. Class Package valid for 45 days. One-time payment with no recurring subscription.
                </p>
              </div>
            </div>
            <div className="text-xs text-[#676B64] sm:text-right shrink-0">
              <span className="font-bold text-[#232520]">Need help with your tuition arrangement?</span>
              <br />
              TutorConnect support can assist.
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4DED4] bg-[#FFFEFB]/95 px-4 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#676B64] font-bold">Selected Rhythm</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-sm font-extrabold text-[#232520]">
                {selectedPackage.classes} Classes ({selectedPackage.rhythmName})
              </strong>
              <span className="text-xs font-bold text-[#66518A]">
                {formatCurrency(selectedPackage.price)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={continueToSchedule}
            className="inline-flex items-center gap-2 rounded-xl bg-[#66518A] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
          >
            <span>Proceed to Schedule Rhythm</span>
            <IconArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PackageSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE] text-xs font-bold text-[#676B64]">
          Loading learning packages...
        </div>
      }
    >
      <PackageSelectionContent />
    </Suspense>
  );
}
