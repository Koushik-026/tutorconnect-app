"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  IconStar,
  IconCheck,
  IconArrowRight,
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
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/packages/select?tutor=ananya-sharma");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF8] text-[#20221F]">
      <header className="border-b border-[rgba(54,48,60,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-[#6D706A] hover:text-[#20221F] transition"
          >
            Skip to Workspace &rarr;
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-xl mx-auto w-full">
          {/* Compact Centered Feedback Object */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-[rgba(54,48,60,0.12)] bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)] text-center space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E5F0EA] px-3.5 py-1 text-xs font-bold text-[#3D5A4D]">
              <IconCheck size={14} />
              <span>Demo Session Completed</span>
            </div>

            <div>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#20221F]">
                How was your session with Ananya Sharma?
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#6D706A]">
                Your feedback helps us curate the right learning rhythm for your child.
              </p>
            </div>

            {/* Large Tactile Rating Stars */}
            <div className="py-2 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <IconStar
                    size={36}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? "text-[#D4A328] fill-[#D4A328]"
                        : "text-[rgba(54,48,60,0.18)]"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            {/* Quick Feedback Tags */}
            <div className="text-left space-y-2 border-t border-[rgba(54,48,60,0.08)] pt-5">
              <span className="text-xs font-bold text-[#6D706A] block">
                What stood out? (Select all that apply)
              </span>
              <div className="flex flex-wrap gap-2">
                {feedbackTags.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "bg-[#7257A5] text-white shadow-xs"
                          : "bg-[#FCFBF8] border border-[rgba(54,48,60,0.10)] text-[#6D706A] hover:text-[#20221F]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Note */}
            <div className="text-left">
              <label className="text-xs font-bold text-[#6D706A] block mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share any specific syllabus topics or questions..."
                className="w-full rounded-2xl border border-[rgba(54,48,60,0.12)] bg-[#FFFDF9] p-3 text-xs text-[#20221F] focus:border-[#7257A5] focus:outline-hidden"
              />
            </div>

            {/* Clear Transition to Class Packages */}
            <div className="pt-2 border-t border-[rgba(54,48,60,0.08)]">
              <button
                type="submit"
                className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(114,87,165,0.22)] justify-center gap-2"
              >
                <span>Continue to Class Packages</span>
                <IconArrowRight size={15} />
              </button>
              <p className="mt-2.5 text-[11px] text-[#969991]">
                Establish your steady weekly learning rhythm with 8, 12, or 15 classes
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
