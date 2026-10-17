import { createClient } from "@/lib/supabase/server";
import { sanitizeInternalRedirect } from "@/lib/utils/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getStudentJourneySummary,
  getDefaultJourneyRedirect,
  isRouteAllowedForStage,
} from "@/lib/services/entitlement";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");
  const intent = searchParams.get("intent") || searchParams.get("role");

  const defaultFallback = intent === "tutor" ? "/dashboard/tutor/pending" : "/tutors";
  const rawSafeNext = next ? sanitizeInternalRedirect(next, defaultFallback) : null;

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/auth?error=unconfigured`);
  }

  if (token_hash && type) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        const { data: claimsData } = await supabase.auth.getClaims();
        const userId = claimsData?.claims?.sub;

        if (userId) {
          const { data: roles } = await supabase
            .from("account_roles")
            .select("role")
            .eq("user_id", userId);

          // 1. Needs onboarding
          if (!roles || roles.length === 0) {
            const onboardingParams = new URLSearchParams();
            if (intent === "tutor" || intent === "student" || intent === "parent") {
              onboardingParams.set("intent", intent);
            }
            if (rawSafeNext) {
              onboardingParams.set("next", rawSafeNext);
            }
            return NextResponse.redirect(
              `${origin}/auth/onboarding?${onboardingParams.toString()}`
            );
          }

          const roleList = roles.map((r: { role: string }) => r.role);
          const hasLearnerRole =
            roleList.includes("student") ||
            roleList.includes("parent") ||
            roleList.includes("admin");

          // 2. Tutor intent or tutor-only account (preserves role intent through auth)
          if (roleList.includes("tutor") && (intent === "tutor" || !hasLearnerRole)) {
            const tutorDest = rawSafeNext?.startsWith("/dashboard/tutor")
              ? rawSafeNext
              : "/dashboard/tutor/pending";
            return NextResponse.redirect(`${origin}${tutorDest}`);
          }

          // 3. Learner account - resolve canonical entitlement
          const journey = await getStudentJourneySummary(userId);
          const defaultRedirect = getDefaultJourneyRedirect(journey);

          if (rawSafeNext && isRouteAllowedForStage(journey.stage, rawSafeNext)) {
            return NextResponse.redirect(`${origin}${rawSafeNext}`);
          }

          return NextResponse.redirect(`${origin}${defaultRedirect}`);
        }

        return NextResponse.redirect(`${origin}/tutors`);
      }
    } catch {
      // Fall through to error redirect
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_confirm_failed`);
}
