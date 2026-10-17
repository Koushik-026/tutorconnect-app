import { redirect } from "next/navigation";
import Link from "next/link";
import { getVerifiedAuth, getAccountRoles } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStudentJourneySummary, getDefaultJourneyRedirect } from "@/lib/services/entitlement";
import { Logo } from "@/components/logo";
import { IconClock, IconArrowRight, IconX } from "@/components/ui/icons";
import type { TutorApplicationState, TutorProfile } from "@/lib/types/database";

export default async function TutorPendingPage() {
  // Fail closed: Never synthesize or fabricate tutor status when Supabase is unconfigured
  if (!isSupabaseConfigured()) {
    redirect("/auth?error=unconfigured");
  }

  // 1. Authenticated user required
  const auth = await getVerifiedAuth();
  if (!auth.isAuthenticated || !auth.userId) {
    redirect("/auth?intent=tutor&next=/dashboard/tutor/pending");
  }

  // 2. account_roles contains tutor
  const roles = await getAccountRoles(auth.userId);
  if (!roles.includes("tutor")) {
    if (roles.includes("student") || roles.includes("parent") || roles.includes("admin")) {
      const summary = await getStudentJourneySummary(auth.userId);
      redirect(getDefaultJourneyRedirect(summary));
    }
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

  // 4. corresponding tutor_application_states row belongs to that profile
  const { data: stateData, error: stateErr } = await supabase
    .from("tutor_application_states")
    .select("*")
    .eq("tutor_profile_id", tutorProfile.id)
    .single();

  // Fail closed: A missing or errored application state row must NEVER synthesize "pending"
  if (stateErr || !stateData) {
    redirect("/auth/onboarding?intent=tutor");
  }

  const appState = stateData as TutorApplicationState;
  const status = appState.status;

  // Behavior: approved -> redirect to safe approved destination (never pretend pending)
  if (status === "approved") {
    redirect("/dashboard/tutor/approved");
  }

  // Behavior: rejected -> render truthful rejected status messaging
  if (status === "rejected") {
    return renderRejectedUI(tutorProfile.display_name, appState.admin_notes || null);
  }

  // Behavior: suspended
  if (status === "suspended") {
    return renderSuspendedUI(tutorProfile.display_name, appState.admin_notes || null);
  }

  // Behavior: pending -> render neutral, truthful status only when row.status === "pending"
  if (status === "pending") {
    return renderPendingUI(
      tutorProfile.display_name,
      appState.admin_notes || null
    );
  }

  // Fail closed on any unknown status
  redirect("/auth/onboarding?intent=tutor");
}

function renderPendingUI(displayName: string, notes: string | null) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <form method="POST" action="/auth/signout">
            <button
              type="submit"
              className="text-xs font-bold text-[#6F6A62] hover:text-[#DE765D] transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-xl mx-auto w-full">
          <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(55,48,40,0.04)] text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7ED] border border-[rgba(55,48,40,0.10)] px-4 py-1.5 text-xs font-bold text-[#C84B31]">
              <IconClock size={14} />
              <span>Application Status: Pending Review</span>
            </div>

            <div>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                Educator Application Under Review
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[#6F6A62] leading-relaxed">
                Your educator application has been submitted and is awaiting review.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-5 text-left text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#6F6A62]">Educator:</span>
                <span className="font-bold text-[#25231F]">{displayName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6F6A62]">Role:</span>
                <span className="font-bold text-[#25231F]">Tuition Educator</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6F6A62]">Current State:</span>
                <span className="font-bold text-[#C84B31]">Pending Review</span>
              </div>
              {notes && (
                <div className="border-t border-[rgba(55,48,40,0.06)] pt-3 text-[11px] text-[#6F6A62]">
                  <strong className="text-[#25231F]">Reviewer Note:</strong> {notes}
                </div>
              )}
              <div className="border-t border-[rgba(55,48,40,0.06)] pt-3 text-[11px] text-[#9B958C]">
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

function renderRejectedUI(displayName: string, notes: string | null) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <form method="POST" action="/auth/signout">
            <button
              type="submit"
              className="text-xs font-bold text-[#6F6A62] hover:text-[#DE765D] transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-xl mx-auto w-full">
          <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(55,48,40,0.04)] text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FCEEEA] border border-[rgba(55,48,40,0.10)] px-4 py-1.5 text-xs font-bold text-[#A6361E]">
              <IconX size={14} />
              <span>Application Status: Not Approved</span>
            </div>

            <div>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                Application Status Update
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[#6F6A62] leading-relaxed">
                Your educator application cannot be approved at this time.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-5 text-left text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#6F6A62]">Educator:</span>
                <span className="font-bold text-[#25231F]">{displayName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6F6A62]">Decision:</span>
                <span className="font-bold text-[#A6361E]">Application Declined</span>
              </div>
              {notes && (
                <div className="border-t border-[rgba(55,48,40,0.06)] pt-3 text-[11px] text-[#6F6A62]">
                  <strong className="text-[#25231F]">Feedback Note:</strong> {notes}
                </div>
              )}
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

function renderSuspendedUI(displayName: string, notes: string | null) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <form method="POST" action="/auth/signout">
            <button
              type="submit"
              className="text-xs font-bold text-[#6F6A62] hover:text-[#DE765D] transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-xl mx-auto w-full">
          <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-10 shadow-[0_12px_40px_rgba(55,48,40,0.04)] text-center space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FCEEEA] border border-[rgba(55,48,40,0.10)] px-4 py-1.5 text-xs font-bold text-[#A6361E]">
              <IconX size={14} />
              <span>Account Status: Suspended</span>
            </div>

            <div>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl sm:text-3xl font-extrabold text-[#25231F]">
                Account Access Suspended
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[#6F6A62] leading-relaxed">
                Your educator account has been temporarily suspended.
              </p>
            </div>

            {notes && (
              <div className="rounded-2xl border border-[rgba(55,48,40,0.08)] bg-[#FFFBF5] p-4 text-left text-xs text-[#6F6A62]">
                <strong className="text-[#25231F]">Notice:</strong> {notes}
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/"
                className="btn btn-primary min-h-[44px] rounded-full text-xs font-bold justify-center"
              >
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}