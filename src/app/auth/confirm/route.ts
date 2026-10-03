import { createClient } from "@/lib/supabase/server";
import { sanitizeInternalRedirect } from "@/lib/utils/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");
  const intent = searchParams.get("intent") || searchParams.get("role");

  const safeNext = sanitizeInternalRedirect(next, "/dashboard/student");

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

          if (!roles || roles.length === 0) {
            const onboardingParams = new URLSearchParams();
            if (intent === "tutor" || intent === "student" || intent === "parent") {
              onboardingParams.set("intent", intent);
            }
            onboardingParams.set("next", safeNext);
            return NextResponse.redirect(
              `${origin}/auth/onboarding?${onboardingParams.toString()}`
            );
          }
        }

        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    } catch {
      // Fall through to error redirect
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_confirm_failed`);
}
