import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getVerifiedAuth, getAccountRoles } from "@/lib/supabase/auth";
import {
  getStudentJourneySummary,
  getDefaultJourneyRedirect,
} from "@/lib/services/entitlement";

export default async function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getVerifiedAuth();

  // If Supabase runtime is configured and the user is not authenticated, redirect to /auth
  if (auth.isConfigured && !auth.isAuthenticated) {
    redirect("/auth?next=/dashboard/student");
  }

  // If authenticated, check roles and entitlement
  if (auth.isConfigured && auth.isAuthenticated && auth.userId) {
    const roles = await getAccountRoles(auth.userId);

    // If account has no roles assigned yet, route to onboarding
    if (roles.length === 0) {
      redirect("/auth/onboarding?next=/dashboard/student");
    }

    // Must possess 'parent' or 'student' role
    const hasLearnerAccess = roles.some((r) => r === "parent" || r === "student");
    if (!hasLearnerAccess) {
      // User is authenticated as tutor only
      redirect("/dashboard/tutor/pending");
    }

    // Deep Entitlement Check:
    // Role alone is NOT enrollment. Require active enrollment OR historical enrollment.
    const journey = await getStudentJourneySummary(auth.userId);

    if (journey.stage !== "active_enrollment" && journey.stage !== "completed") {
      // User is not enrolled. Redirect to their canonical journey stage.
      const destination = getDefaultJourneyRedirect(journey);
      redirect(destination);
    }
  }

  return (
    <>
      {!auth.isConfigured && (
        <div
          role="status"
          className="bg-[var(--tc-surface-muted)] border-b border-[var(--tc-border)] px-4 py-2 text-center text-xs text-[var(--tc-text-secondary)] font-semibold"
        >
          <span className="text-[var(--tc-primary)] font-bold">Workspace Preview:</span> Connect Supabase in{" "}
          <code className="bg-[var(--tc-surface)] text-[var(--tc-text-primary)] px-1.5 py-0.5 rounded border border-[var(--tc-border)]">.env.local</code> to activate live account authorization.
        </div>
      )}
      {children}
    </>
  );
}
