"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { IconArrowRight, IconShieldCheck, IconCheck } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sanitizeInternalRedirect } from "@/lib/utils/redirect";

type ChosenRole = "parent" | "student" | "tutor";

function OnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intentParam = searchParams.get("intent") || searchParams.get("role");
  const defaultFallback = intentParam === "tutor" ? "/dashboard/tutor/pending" : "/tutors";
  const nextParam = searchParams.get("next") || defaultFallback;
  const initialRole: ChosenRole =
    intentParam === "tutor" ? "tutor" : intentParam === "student" ? "student" : "parent";
  const [selectedRole, setSelectedRole] = useState<ChosenRole>(initialRole);
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Client created inside action handler

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const safeNext = sanitizeInternalRedirect(nextParam, defaultFallback);

    if (!isSupabaseConfigured()) {
      // In preview mode without Supabase connection, route cleanly to destination
      router.push(safeNext);
      return;
    }

    try {
      const supabase = createClient();
      // Atomic onboarding via secure PostgreSQL RPC
      const { error: rpcError } = await supabase.rpc("complete_onboarding", {
        chosen_role: selectedRole,
        p_display_name: displayName.trim() || null,
      });

      if (rpcError) {
        setErrorMsg(rpcError.message || "Failed to complete account setup.");
        setIsSubmitting(false);
        return;
      }

      router.push(safeNext);
    } catch {
      setErrorMsg("An unexpected error occurred during onboarding.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] text-[var(--tc-text-primary)] transition-colors">
      <header className="border-b border-[var(--tc-border)] bg-[var(--tc-surface)]/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition"
          >
            Skip for now
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-xl mx-auto">
          <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-7 sm:p-10 shadow-xs">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tc-primary)]/20 bg-[var(--tc-soft-primary)] px-3.5 py-1 text-xs font-bold text-[var(--tc-primary)] mb-3">
                <IconShieldCheck size={14} className="text-[var(--tc-primary)]" />
                <span>Account Setup</span>
              </span>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[var(--tc-text-primary)]">
                How will you be using TutorConnect?
              </h1>
              <p className="mt-2 text-xs text-[var(--tc-text-secondary)]">
                Choose your primary role to configure your personalized workspace.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 rounded-2xl border border-[var(--tc-danger)]/20 bg-[var(--tc-danger)]/10 p-4 text-xs font-medium text-[var(--tc-danger)]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleComplete} className="space-y-4">
              {/* Role Cards */}
              <div className="space-y-3">
                {[
                  {
                    id: "parent",
                    title: "I am a Parent",
                    desc: "Managing 1-on-1 tuition routines and progress for my child.",
                  },
                  {
                    id: "student",
                    title: "I am a Student",
                    desc: "Organizing my personal learning schedule, classes, and notes.",
                  },
                  {
                    id: "tutor",
                    title: "I want to teach as a Tutor",
                    desc: "Apply to offer 1-on-1 online or home tuition in Hyderabad.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRole(item.id as ChosenRole)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all flex items-start justify-between ${
                      selectedRole === item.id
                        ? "border-[var(--tc-primary)] bg-[var(--tc-soft-primary)] shadow-xs"
                        : "border-[var(--tc-border)] bg-[var(--tc-surface-muted)] hover:border-[var(--tc-primary)]/40"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-[var(--tc-text-primary)]">{item.title}</div>
                      <div className="text-xs text-[var(--tc-text-secondary)] mt-0.5">{item.desc}</div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedRole === item.id
                          ? "border-[var(--tc-primary)] bg-[var(--tc-primary)] text-white"
                          : "border-[var(--tc-border)] bg-[var(--tc-surface)]"
                      }`}
                    >
                      {selectedRole === item.id && <IconCheck size={12} />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Optional Display Name */}
              <div className="pt-2">
                <label htmlFor="display-name" className="text-xs font-bold text-[var(--tc-text-secondary)] block mb-1">
                  Your Full Name
                </label>
                <input
                  id="display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Srikrishna Rao"
                  className="w-full rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--tc-text-primary)] placeholder:text-[var(--tc-text-secondary)] focus:border-[var(--tc-primary)] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2 mt-4"
              >
                <span>{isSubmitting ? "Setting up..." : "Complete Setup & Continue"}</span>
                <IconArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--tc-bg)]" />}>
      <OnboardingInner />
    </Suspense>
  );
}
