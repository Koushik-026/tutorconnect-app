"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { submitDemoFeedbackAction } from "@/app/actions/workflow";
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

function DemoFeedbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const tutorSlug = searchParams.get("tutor") || "ananya-sharma";

  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Clear Concept Explanations",
    "Patient & Encouraging",
  ]);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    if (bookingId) {
      try {
        await submitDemoFeedbackAction({
          bookingId,
          rating,
          tags: selectedTags,
          feedbackText,
          interestedInTuition: true,
        });
      } catch {
        // Non-blocking for demo flow
      }
    }

    setIsSubmitting(false);
    router.push(`/packages/select?tutor=${encodeURIComponent(tutorSlug)}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard/student"
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition"
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
            className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)] text-center space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E3EADD] px-3.5 py-1 text-xs font-bold text-[#244A40]">
              <IconCheck size={14} />
              <span>Demo Session Completed</span>
            </div>

            <div>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                How was your demo session?
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#6F6A62]">
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
                        ? "text-[#F1B777] fill-[#D4A328]"
                        : "text-[rgba(55,48,40,0.18)]"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            {/* Quick Feedback Tags */}
            <div className="text-left space-y-2 border-t border-[rgba(55,48,40,0.08)] pt-5">
              <span className="text-xs font-bold text-[#6F6A62] block">
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
                          ? "bg-[#315F52] text-white shadow-xs"
                          : "bg-[#FFFBF5] border border-[rgba(55,48,40,0.10)] text-[#6F6A62] hover:text-[#25231F]"
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
              <label className="text-xs font-bold text-[#6F6A62] block mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share any specific syllabus topics or questions..."
                className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] p-3 text-xs text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
              />
            </div>

            {/* Clear Transition to Class Packages */}
            <div className="pt-2 border-t border-[rgba(55,48,40,0.08)]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2"
              >
                <span>{isSubmitting ? "Saving..." : "Continue to Class Packages"}</span>
                <IconArrowRight size={15} />
              </button>
              <p className="mt-2.5 text-[11px] text-[#9B958C]">
                Establish your steady weekly learning rhythm with 8, 12, or 15 classes
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function DemoFeedbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF5]" />}>
      <DemoFeedbackInner />
    </Suspense>
  );
}
