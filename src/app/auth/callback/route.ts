import { createClient } from "@/lib/supabase/server";
import { sanitizeInternalRedirect } from "@/lib/utils/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  const safeNext = sanitizeInternalRedirect(next, "/dashboard/student");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/auth?error=unconfigured`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const { data: claimsData } = await supabase.auth.getClaims();
        const userId = claimsData?.claims?.sub;

        if (userId) {
          const { data: roles } = await supabase
            .from("account_roles")
            .select("role")
            .eq("user_id", userId);

          if (!roles || roles.length === 0) {
            return NextResponse.redirect(
              `${origin}/auth/onboarding?next=${encodeURIComponent(safeNext)}`
            );
          }
        }

        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    } catch {
      // Fall through to error redirect
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=oauth_callback_failed`);
}
