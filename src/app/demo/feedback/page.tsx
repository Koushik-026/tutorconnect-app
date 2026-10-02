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
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            Skip to Dashboard &rarr;
          </Link>
        </div>
      </header>

      {/* Main Feedback Form */}
      <main id="main-content" className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
            {/* Tutor Snapshot Header */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs mb-3">
                <IconSparkles size={28} />
              </div>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950 sm:text-3xl">
                How was your demo session?
              </h1>
              <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                Your feedback with <strong className="text-slate-900">Ananya Sharma</strong> helps personalize your learning recommendations.
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
                            ? "text-amber-400 drop-shadow-xs"
                            : "text-slate-200"
                        }
                      />
                    </button>
                  );
                })}
              </div>
              <span className="mt-2 text-xs font-bold text-slate-600">
                {rating === 5 && "Exceptional &bull; Highly recommended"}
                {rating === 4 && "Great &bull; Very helpful"}
                {rating === 3 && "Good &bull; Met expectations"}
                {rating === 2 && "Fair &bull; Needs improvement"}
                {rating === 1 && "Not satisfied"}
              </span>
            </div>

            {/* Tag Selection */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center sm:text-left">
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
                          ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
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
              <label htmlFor="feedback-comment" className="form-label text-xs">
                Additional Comments (Optional)
              </label>
              <textarea
                id="feedback-comment"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share any specific learning goals or subject topics discussed..."
                className="form-input text-xs min-h-[80px]"
              />
            </div>

            {/* Primary Action */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={continueToPackages}
                className="btn btn-primary w-full min-h-[48px] text-sm font-extrabold shadow-sm gap-2"
              >
                <span>Continue to Class Packages</span>
                <IconArrowRight size={15} />
              </button>

              <Link
                href="/dashboard/student"
                className="btn btn-secondary w-full text-xs font-bold"
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
