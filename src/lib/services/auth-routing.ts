import { createClient } from "@/lib/supabase/server";
import { sanitizeInternalRedirect } from "@/lib/utils/redirect";
import {
  getStudentJourneySummary,
  getDefaultJourneyRedirect,
  isRouteAllowedForStage,
  type StudentJourneySummary,
} from "./entitlement";

export interface PostAuthResolutionParams {
  userId: string;
  intent?: string | null;
  requestedNext?: string | null;
}

export interface PostAuthRoutingContext {
  roles: string[];
  intent?: string | null;
  requestedNext?: string | null;
  tutorProfileExists?: boolean;
  tutorApplicationStatus?: "pending" | "approved" | "rejected" | "suspended" | string | null;
  studentJourney?: StudentJourneySummary | null;
}

/**
 * Pure, deterministic post-auth destination calculator.
 * Evaluates intent, account_roles, tutor application state, and learner entitlement stage.
 */
export function calculatePostAuthDestination(context: PostAuthRoutingContext): string {
  const {
    roles,
    intent,
    requestedNext,
    tutorProfileExists = false,
    tutorApplicationStatus = null,
    studentJourney = null,
  } = context;

  const hasTutorRole = roles.includes("tutor");
  const hasLearnerRole =
    roles.includes("student") || roles.includes("parent") || roles.includes("admin");

  const normalizedIntent = intent?.toLowerCase().trim();
  const isTutorIntent = normalizedIntent === "tutor";

  // Sanitize requestedNext if provided
  const safeRequestedNext = requestedNext
    ? sanitizeInternalRedirect(requestedNext, "")
    : "";

  // ==========================================
  // BRANCH 1: TUTOR INTENT
  // ==========================================
  if (isTutorIntent) {
    // Authenticated + NO tutor role -> tutor onboarding/application
    // (Existing student/parent role must NOT override explicit tutor intent)
    if (!hasTutorRole) {
      const params = new URLSearchParams({ intent: "tutor" });
      if (safeRequestedNext && safeRequestedNext.startsWith("/dashboard/tutor")) {
        params.set("next", safeRequestedNext);
      }
      return `/auth/onboarding?${params.toString()}`;
    }

    // Authenticated + EXISTING tutor role -> read real application state
    if (!tutorProfileExists || !tutorApplicationStatus) {
      // Profile or application state row is missing; send to onboarding to complete setup
      return "/auth/onboarding?intent=tutor";
    }

    // Status: approved -> approved tutor destination
    if (tutorApplicationStatus === "approved") {
      if (safeRequestedNext && safeRequestedNext.startsWith("/dashboard/tutor/approved")) {
        return safeRequestedNext;
      }
      return "/dashboard/tutor/approved";
    }

    // Status: pending, rejected, suspended -> truthful tutor status destination
    // (Never self-approve or fabricate approved status)
    if (safeRequestedNext && safeRequestedNext.startsWith("/dashboard/tutor/pending")) {
      return safeRequestedNext;
    }
    return "/dashboard/tutor/pending";
  }

  // ==========================================
  // BRANCH 2: LEARNER INTENT (OR DEFAULT)
  // ==========================================

  // If account has zero roles assigned, route to onboarding
  if (roles.length === 0) {
    const params = new URLSearchParams();
    if (normalizedIntent === "student" || normalizedIntent === "parent") {
      params.set("intent", normalizedIntent);
    }
    if (safeRequestedNext) {
      params.set("next", safeRequestedNext);
    }
    const query = params.toString();
    return query ? `/auth/onboarding?${query}` : "/auth/onboarding";
  }

  // If user possesses a learner role (student, parent, admin)
  if (hasLearnerRole) {
    if (studentJourney) {
      const defaultRedirect = getDefaultJourneyRedirect(studentJourney);

      // If an explicit next route was requested, ensure it is entitled for this user's stage
      if (safeRequestedNext && isRouteAllowedForStage(studentJourney.stage, safeRequestedNext)) {
        return safeRequestedNext;
      }

      return defaultRedirect;
    }

    return "/tutors";
  }

  // If user has ONLY a tutor role and logged in without explicit intent:
  // Route them to their truthful tutor destination instead of dropping them
  if (hasTutorRole) {
    if (!tutorProfileExists || !tutorApplicationStatus) {
      return "/auth/onboarding?intent=tutor";
    }

    if (tutorApplicationStatus === "approved") {
      return "/dashboard/tutor/approved";
    }
    return "/dashboard/tutor/pending";
  }

  // Fallback for missing learner role when learner intent was requested
  return "/auth/onboarding?intent=student";
}

/**
 * Server-authoritative post-auth destination resolver.
 * Queries Supabase database for account_roles, tutor application state, and student journey,
 * then returns the canonical destination URL.
 */
export async function resolvePostAuthDestination({
  userId,
  intent,
  requestedNext,
}: PostAuthResolutionParams): Promise<string> {
  const supabase = await createClient();

  // 1. Fetch user's account roles
  const { data: rolesData, error: rolesError } = await supabase
    .from("account_roles")
    .select("role")
    .eq("user_id", userId);

  const roles: string[] =
    !rolesError && rolesData ? rolesData.map((r: { role: string }) => r.role) : [];

  const hasTutorRole = roles.includes("tutor");
  const hasLearnerRole =
    roles.includes("student") || roles.includes("parent") || roles.includes("admin");

  const normalizedIntent = intent?.toLowerCase().trim();
  const isTutorIntent = normalizedIntent === "tutor";

  let tutorProfileExists = false;
  let tutorApplicationStatus: string | null = null;
  let studentJourney = null;

  // 2. Fetch tutor application state if tutor role exists or tutor intent requested
  if (hasTutorRole) {
    const { data: profile } = await supabase
      .from("tutor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (profile) {
      tutorProfileExists = true;
      const { data: appState } = await supabase
        .from("tutor_application_states")
        .select("status")
        .eq("tutor_profile_id", profile.id)
        .maybeSingle();

      if (appState?.status) {
        tutorApplicationStatus = appState.status;
      }
    }
  }

  // 3. Fetch learner journey summary if user possesses a learner role and did not select tutor intent
  if (hasLearnerRole && !isTutorIntent) {
    try {
      studentJourney = await getStudentJourneySummary(userId);
    } catch {
      studentJourney = null;
    }
  }

  return calculatePostAuthDestination({
    roles,
    intent,
    requestedNext,
    tutorProfileExists,
    tutorApplicationStatus,
    studentJourney,
  });
}
