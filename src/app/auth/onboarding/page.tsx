"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { IconArrowRight, IconShieldCheck, IconCheck } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";

type ChosenRole = "parent" | "student" | "tutor";

function OnboardingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/dashboard/student";

  const [selectedRole, setSelectedRole] = useState<ChosenRole>("parent");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        // If unauthenticated or runtime not connected, route safely
        router.push(nextParam);
        return;
      }

      const userId = userData.user.id;

      // Update profile display name if provided
      if (displayName.trim()) {
        await supabase
          .from("profiles")
          .update({ display_name: displayName.trim() })
          .eq("id", userId);
      }

      // Assign initial role (parent, student, or tutor)
      const { error: roleError } = await supabase.from("account_roles").insert({
        user_id: userId,
        role: selectedRole,
      });

      if (roleError && !roleError.message.includes("duplicate")) {
        setErrorMsg(roleError.message || "Failed to set role.");
        setIsSubmitting(false);
        return;
      }

      // If tutor, create initial pending application foundation
      if (selectedRole === "tutor") {
        const slug = (displayName || "tutor").toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + userId.slice(0, 6);
        const { data: tutorProfile } = await supabase
          .from("tutor_profiles")
          .insert({
            user_id: userId,
            slug,
            display_name: displayName.trim() || "Educator",
            headline: "Tuition Educator",
          })
          .select("id")
          .single();

        if (tutorProfile?.id) {
          await supabase.from("tutor_application_states").insert({
            tutor_profile_id: tutorProfile.id,
            status: "pending",
          });
        }
      }

      router.push(nextParam);
    } catch {
      setErrorMsg("An error occurred during onboarding.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition"
          >
            Skip for now
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-xl mx-auto">
          <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(55,48,40,0.04)]">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#315F52]/20 bg-[#E4EEE9] px-3.5 py-1 text-xs font-bold text-[#244A40] mb-3">
                <IconShieldCheck size={14} className="text-[#315F52]" />
                <span>Account Setup</span>
              </span>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                How will you be using TutorConnect?
              </h1>
              <p className="mt-2 text-xs text-[#6F6A62]">
                Choose your primary role to configure your personalized workspace.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 rounded-2xl border border-[#C84B31]/25 bg-[#FCEEEA] p-4 text-xs font-medium text-[#A6361E]">
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
                    desc: "Apply to offer verified 1-on-1 online or home tuition in Hyderabad.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRole(item.id as ChosenRole)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all flex items-start justify-between ${
                      selectedRole === item.id
                        ? "border-[#315F52] bg-[#E4EEE9]/30 shadow-xs"
                        : "border-[rgba(55,48,40,0.10)] bg-[#FFF7ED] hover:border-[#315F52]/30"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-[#25231F]">{item.title}</div>
                      <div className="text-xs text-[#6F6A62] mt-0.5">{item.desc}</div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedRole === item.id
                          ? "border-[#315F52] bg-[#315F52] text-white"
                          : "border-[rgba(55,48,40,0.20)] bg-white"
                      }`}
                    >
                      {selectedRole === item.id && <IconCheck size={12} />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Optional Display Name */}
              <div className="pt-2">
                <label htmlFor="display-name" className="text-xs font-bold text-[#6F6A62] block mb-1">
                  Your Full Name
                </label>
                <input
                  id="display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Srikrishna Rao"
                  className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-2.5 text-sm font-semibold text-[#25231F] placeholder:text-[#9B958C] focus:border-[#315F52] focus:outline-hidden"
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
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF5]" />}>
      <OnboardingInner />
    </Suspense>
  );
}
