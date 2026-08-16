"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";

export default function DemoFeedbackPage() {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] =
    useState(0);
  const [feedback, setFeedback] =
    useState("");

  function continueToPackages() {
    const query = new URLSearchParams({
      tutor: "ananya-sharma",
    });

    if (rating > 0) {
      query.set("rating", String(rating));
    }

    router.push(
      `/packages/select?${query.toString()}`,
    );
  }

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[#eef1ff]"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-200/25 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="dot-grid absolute inset-0 opacity-[0.12]"
      />

      {/* Header */}
      <header className="relative z-10 border-b border-white/60 bg-white/50 backdrop-blur-xl">
        <div className="container-shell flex h-[72px] items-center justify-between">
          <Logo />

          <span className="hidden text-sm font-semibold text-slate-500 sm:block">
            Demo completed
          </span>
        </div>
      </header>

      <div className="container-shell relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center py-10 sm:py-14">
        <section className="w-full max-w-[620px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(37,99,235,0.12)]">
          {/* Accent line */}
          <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500" />

          <div className="px-5 py-8 sm:px-9 sm:py-10">
            {/* Tutor */}
            <div
              role="img"
              aria-label="Ananya Sharma"
              className="mx-auto h-20 w-20 rounded-full border-4 border-white bg-cover bg-center shadow-md"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA')",
              }}
            />

            <div className="mt-6 text-center">
              <span className="badge badge-blue">
                Demo completed
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Demo Feedback
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-600">
                How was your demo with{" "}
                <strong className="text-slate-900">
                  Ananya Sharma
                </strong>
                ?
              </p>
            </div>

            {/* Rating */}
            <div className="mt-8">
              <p className="text-center text-sm font-bold text-slate-700">
                Rate your demo experience
              </p>

              <div
                className="mt-4 flex justify-center gap-3"
                onMouseLeave={() =>
                  setHoveredRating(0)
                }
              >
                {[1, 2, 3, 4, 5].map(
                  (star) => {
                    const active =
                      star <=
                      (hoveredRating || rating);

                    return (
                      <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} out of 5`}
                        aria-pressed={
                          rating === star
                        }
                        onMouseEnter={() =>
                          setHoveredRating(
                            star,
                          )
                        }
                        onClick={() =>
                          setRating(star)
                        }
                        className={`text-4xl transition duration-150 hover:scale-110 sm:text-5xl ${
                          active
                            ? "text-amber-400"
                            : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    );
                  },
                )}
              </div>

              {rating > 0 && (
                <p className="mt-3 text-center text-sm font-semibold text-slate-500">
                  {rating} out of 5 selected
                </p>
              )}
            </div>

            {/* Written feedback */}
            <div className="mt-8">
              <label
                htmlFor="demo-feedback"
                className="form-label"
              >
                Optional feedback
              </label>

              <textarea
                id="demo-feedback"
                value={feedback}
                onChange={(event) =>
                  setFeedback(
                    event.target.value,
                  )
                }
                placeholder="What did you like? What could be improved?"
                maxLength={1000}
                className="form-input min-h-[145px]"
              />

              <div className="mt-2 flex items-center justify-between gap-4 text-xs text-slate-400">
                <span>
                  Your feedback helps improve the
                  TutorConnect experience.
                </span>

                <span>
                  {feedback.length}/1000
                </span>
              </div>
            </div>

            {/* Primary action */}
            <button
              type="button"
              onClick={continueToPackages}
              className="btn btn-primary mt-8 w-full"
            >
              Continue to Select Package
              <span aria-hidden="true">
                →
              </span>
            </button>

            {/* Skip */}
            <button
              type="button"
              onClick={continueToPackages}
              className="mt-5 w-full text-center text-sm font-extrabold text-blue-700 transition hover:text-blue-800"
            >
              Skip for now
            </button>

            {/* Backend honesty */}
            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
              Frontend preview: ratings and written
              feedback are not stored yet. They will be
              saved securely after the authenticated
              database is connected.
            </div>
          </div>
        </section>
      </div>

      <footer className="relative z-10 pb-7 text-center text-xs text-slate-500">
        © 2026 TutorConnect. All rights reserved.
      </footer>
    </main>
  );
}