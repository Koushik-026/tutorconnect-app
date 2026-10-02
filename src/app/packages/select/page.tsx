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
  IconClock,
  IconCalendar,
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
      "Digital lesson notes when shared by tutor",
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
    bestFor: "Recommended for continuous syllabus coverage, exam preparation, and building problem-solving velocity.",
    highlight: true,
    features: [
      "12 1-on-1 personalized sessions (60 min each)",
      "45-day validity from first session",
      "Digital lesson notes when shared by tutor",
      "Online or eligible Home tuition",
      "Flexible weekly learning rhythm",
    ],
  },
  {
    id: "package-15",
    rhythmName: "Comprehensive Mastery",
    intensity: "Intensive Rhythm",
    classes: 15,
    price: 5400,
    perClassPrice: 360,
    validityDays: 45,
    paceDescription: "3-4 classes / week",
    bestFor: "Designed for in-depth curriculum mastery, board exam drills, and high-frequency subject support.",
    features: [
      "15 1-on-1 personalized sessions (60 min each)",
      "45-day validity from first session",
      "Digital lesson notes when shared by tutor",
      "Online or eligible Home tuition",
      "Flexible weekly learning rhythm",
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

function PackagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tutorId = searchParams.get("tutor") || "ananya-sharma";
  const tutor = tutors.find((t) => t.id === tutorId) || tutors[0];

  const [selectedPackageId, setSelectedPackageId] = useState<string>("package-12");

  const handleSelectPackage = (pkg: LearningPackage) => {
    setSelectedPackageId(pkg.id);
    const query = new URLSearchParams({
      tutor: tutor.id,
      package: pkg.id,
      classes: String(pkg.classes),
      amount: String(pkg.price),
    });
    router.push(`/schedule/confirm?${query.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF8] text-[#20221F]">
      <header className="border-b border-[rgba(54,48,60,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href={`/tutors/${tutor.id}`}
            className="text-xs font-bold text-[#6D706A] hover:text-[#20221F] transition"
          >
            &larr; Back to {tutor.name}&apos;s Profile
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20">
        <div className="container-shell max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEE7FF] px-3.5 py-1 text-xs font-bold text-[#594282] mb-3">
              <IconSparkles size={13} />
              <span>Learning Rhythms with {tutor.name}</span>
            </span>
            <h1 className="font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#20221F]">
              Choose Your Class Package
            </h1>
            <p className="mt-2 text-sm text-[#6D706A]">
              Simple, transparent class packages. Every package includes 60-minute classes and 45-day validity. No recurring subscriptions.
            </p>
          </div>

          {/* Spacious Horizontal Stacked Rhythm Bands */}
          <div className="space-y-6">
            {packages.map((pkg) => {
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl border transition-all duration-200 p-6 sm:p-8 ${
                    pkg.highlight
                      ? "border-[#7257A5] bg-white shadow-[0_12px_40px_rgba(114,87,165,0.08)] ring-2 ring-[#7257A5]/10"
                      : "border-[rgba(54,48,60,0.10)] bg-white hover:border-[#7257A5]/30 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  {pkg.highlight && (
                    <span className="absolute -top-3 left-8 rounded-full bg-[#7257A5] px-3.5 py-0.5 text-[11px] font-extrabold text-white shadow-xs">
                      Most Popular Rhythm
                    </span>
                  )}

                  <div className="grid gap-6 lg:grid-cols-12 items-center">
                    {/* Left: Package Info */}
                    <div className="lg:col-span-5 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#EEE7FF] px-2.5 py-0.5 text-xs font-bold text-[#594282]">
                          {pkg.intensity}
                        </span>
                        <span className="text-xs font-semibold text-[#6D706A]">
                          {pkg.paceDescription}
                        </span>
                      </div>

                      <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#20221F]">
                        {pkg.rhythmName}
                      </h2>
                      <p className="text-xs text-[#6D706A] leading-relaxed">
                        {pkg.bestFor}
                      </p>
                    </div>

                    {/* Middle: Features List */}
                    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[rgba(54,48,60,0.08)] pt-4 lg:pt-0 lg:pl-6 space-y-2 text-xs text-[#20221F]">
                      <div className="flex items-center gap-2">
                        <IconCheck size={14} className="text-[#5D806F] shrink-0" />
                        <span className="font-semibold">{pkg.classes} Classes (60m each)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCheck size={14} className="text-[#5D806F] shrink-0" />
                        <span>45-day package validity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCheck size={14} className="text-[#5D806F] shrink-0" />
                        <span>Digital lesson notes when shared by tutor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconCheck size={14} className="text-[#5D806F] shrink-0" />
                        <span>Flexible weekly learning rhythm</span>
                      </div>
                    </div>

                    {/* Right: Pricing & CTA */}
                    <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-[rgba(54,48,60,0.08)] pt-4 lg:pt-0 lg:pl-6">
                      <div className="text-left lg:text-right">
                        <span className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-[#20221F]">
                          {formatCurrency(pkg.price)}
                        </span>
                        <p className="text-xs text-[#6D706A] font-medium">
                          {formatCurrency(pkg.perClassPrice)} / class
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectPackage(pkg)}
                        className={`btn w-full sm:w-auto min-h-[46px] px-6 rounded-full text-xs font-bold justify-center gap-2 ${
                          pkg.highlight
                            ? "btn-primary shadow-[0_4px_16px_rgba(114,87,165,0.22)]"
                            : "btn-outline"
                        }`}
                      >
                        <span>Select Rhythm</span>
                        <IconArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Trust Note */}
          <div className="mt-12 rounded-2xl border border-[rgba(54,48,60,0.08)] bg-[#FFFDF9] p-5 text-center text-xs text-[#6D706A] space-y-1">
            <p className="font-bold text-[#20221F]">
              Direct 1-on-1 Tuition &bull; No Auto-Renewal &bull; 45-Day Validity
            </p>
            <p>
              Your schedule and preferred dates will be selected on the next screen before proceeding to simulated checkout.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PackagesSelectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFBF8]" />}>
      <PackagesContent />
    </Suspense>
  );
}
