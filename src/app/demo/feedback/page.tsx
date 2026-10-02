"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  IconStar,
  IconCheck,
  IconArrowRight,
  IconSparkles,
} from "@/components/ui/icons";

const feedbackTags = [
  "Clear Concept Explanations",
  "Patient & Encouraging",
  "Effective Problem Solving",
  "Good Learning Pace",
  "Helpful Whiteboard Notes",
  "Strong Subject Mastery",
];

export default function DemoFeedbackPage() {
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Clear Concept Explanations",
    "Patient & Encouraging",
  ]);
  const [feedbackText, setFeedbackText] = useState("");

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function continueToPackages() {
    const query = new URLSearchParams({
      tutor: "ananya-sharma",
      rating: String(rating),
    });
    router.push(`/packages/select?${query.toString()}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE] text-[#232520]">
      {/* Header */}
      <header className="border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-[#676B64] hover:text-[#66518A] transition-colors"
          >
            Skip to Dashboard &rarr;
          </Link>
        </div>
      </header>

      {/* Main Feedback Form */}
      <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl">
          <div className="overflow-hidden rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 sm:p-8 shadow-xs">
            {/* Tutor Snapshot Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFEAF8] text-[#66518A] shadow-xs mb-3">
                <IconSparkles size={26} />
              </div>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-[#232520] sm:text-3xl">
                How was your demo session?
              </h1>
              <p className="mt-1.5 text-xs text-[#676B64] sm:text-sm">
                Your feedback with <strong className="text-[#232520]">Ananya Sharma</strong> helps personalize your learning recommendations.
              </p>
            </div>

            {/* Star Rating Interaction */}
            <div className="mt-6 flex flex-col items-center">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoveredRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-1 transition-transform hover:scale-110 active:scale-95"
                    >
                      <IconStar
                        size={32}
                        className={
                          active
                            ? "text-[#D9B85F] drop-shadow-xs"
                            : "text-[#E4DED4]"
                        }
                      />
                    </button>
                  );
                })}
              </div>
              <span className="mt-2 text-xs font-bold text-[#676B64]">
                {rating === 5 && "Exceptional • Highly recommended"}
                {rating === 4 && "Great • Very helpful"}
                {rating === 3 && "Good • Met expectations"}
                {rating === 2 && "Fair • Needs improvement"}
                {rating === 1 && "Not satisfied"}
              </span>
            </div>

            {/* Tag Selection */}
            <div className="mt-6 border-t border-[#E4DED4]/60 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#676B64] mb-3 text-center sm:text-left">
                What went well?
              </label>
              <div className="flex flex-wrap gap-2">
                {feedbackTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        isSelected
                          ? "border-[#66518A] bg-[#EFEAF8] text-[#66518A] font-bold"
                          : "border-[#E4DED4] bg-[#FFFEFB] text-[#676B64] hover:border-[#66518A]/40"
                      }`}
                    >
                      {isSelected && <IconCheck size={12} />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comments Field */}
            <div className="mt-5">
              <label htmlFor="feedback-comment" className="block text-xs font-bold text-[#676B64] mb-1.5">
                Additional Comments (Optional)
              </label>
              <textarea
                id="feedback-comment"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share any specific learning goals or subject topics discussed..."
                className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] p-3 text-xs text-[#232520] placeholder:text-[#676B64] focus:outline-hidden focus:border-[#66518A] min-h-[80px]"
              />
            </div>

            {/* Primary Action */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={continueToPackages}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#66518A] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#4E3C70] transition-colors"
              >
                <span>Continue to Class Packages</span>
                <IconArrowRight size={15} />
              </button>

              <Link
                href="/dashboard/student"
                className="w-full inline-flex items-center justify-center rounded-xl border border-[#E4DED4] bg-[#FFFEFB] py-2.5 px-3 text-xs font-bold text-[#676B64] hover:text-[#232520] hover:bg-[#F7F4EE] transition-colors"
              >
                <span>Save &amp; View Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
