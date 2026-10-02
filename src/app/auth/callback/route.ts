import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") || "/dashboard/student";

  // Sanitize next redirect to prevent open redirect vulnerabilities
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard/student";

  const supabase = await createClient();

  if (code) {
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
  }

  if (token_hash && type) {
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
          return NextResponse.redirect(
            `${origin}/auth/onboarding?next=${encodeURIComponent(safeNext)}`
          );
        }
      }

      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}
