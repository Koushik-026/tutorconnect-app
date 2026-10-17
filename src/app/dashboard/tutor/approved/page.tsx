import { redirect } from "next/navigation";
import Link from "next/link";
import { getVerifiedAuth, getAccountRoles } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Logo } from "@/components/logo";
import { IconCheck, IconArrowRight } from "@/components/ui/icons";
import type { TutorApplicationState, TutorProfile } from "@/lib/types/database";

export default async function TutorApprovedPage() {
  // Fail closed: Never synthesize or fabricate tutor status when Supabase is unconfigured
  if (!isSupabaseConfigured()) {
    redirect("/auth?error=unconfigured");
  }

  // 1. Authenticated user required
  const auth = await getVerifiedAuth();
  if (!auth.isAuthenticated || !auth.userId) {
    redirect("/auth?intent=tutor&next=/dashboard/tutor/approved");
  }

  // 2. account_roles contains tutor
  const roles = await getAccountRoles(auth.userId);
  if (!roles.includes("tutor")) {
    redirect("/auth/onboarding?intent=tutor");
  }

  // 3. tutor_profile belongs to auth user
  const supabase = await createClient();
  const { data: profileData, error: profileErr } = await supabase
    .from("tutor_profiles")
    .select("*")
    .eq("user_id", auth.userId)
    .single();

  if (profileErr || !profileData) {
    redirect("/auth/onboarding?intent=tutor");
  }
  const tutorProfile = profileData as TutorProfile;

  // 4. corresponding tutor_application_states row - must exist and have status === "approved"
  const { data: stateData, error: stateErr } = await supabase
    .from("tutor_application_states")
    .select("*")
    .eq("tutor_profile_id", tutorProfile.id)
    .single();

  // Fail closed: Missing or errored application state cannot access approved view
  if (stateErr || !stateData) {
    redirect("/auth/onboarding?intent=tutor");
  }

  const appState = stateData as TutorApplicationState;
  if (appState.status !== "approved") {
    // If not approved in the real database row, redirect to pending
    redirect("/dashboard/tutor/pending");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] transition-colors text-[var(--tc-text-primary)]">
      <header className="border-b border-[var(--tc-border)] bg-[var(--tc-surface)]/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <form method="POST" action="/auth/signout">
            <button
              type="submit"
              className="text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[#DE765D] transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-xl mx-auto w-full">
          <div className="rounded-3xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-7 sm:p-10 shadow-xs text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tc-soft-primary)] px-4 py-1.5 text-xs font-bold text-[var(--tc-primary)]">
              <IconCheck size={14} />
              <span>Application Status: Approved</span>
            </div>

            <div>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[var(--tc-text-primary)]">
                Educator Application Approved
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[var(--tc-text-secondary)] leading-relaxed">
                Your educator application has been approved.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-bg)] transition-colors p-5 text-left text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--tc-text-secondary)]">Educator:</span>
                <span className="font-bold text-[var(--tc-text-primary)]">{tutorProfile.display_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--tc-text-secondary)]">Account:</span>
                <span className="font-bold text-[var(--tc-text-primary)]">Approved Educator</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--tc-text-secondary)]">Status:</span>
                <span className="font-bold text-[var(--tc-primary)]">Approved</span>
              </div>
              <div className="border-t border-[var(--tc-border)] pt-3 text-[11px] text-[var(--tc-text-secondary)]">
                Tutor workspace features are not enabled in this build yet.
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              <Link
                href="/tutors"
                className="btn btn-outline min-h-[44px] rounded-full text-xs font-bold justify-center"
              >
                <span>Browse Marketplace</span>
              </Link>
              <Link
                href="/"
                className="btn btn-primary min-h-[44px] rounded-full text-xs font-bold justify-center"
              >
                <span>Return to Home</span>
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}