import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { resolvePostAuthDestination } from "@/lib/services/auth-routing";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const intent = searchParams.get("intent") || searchParams.get("role");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/auth?error=unconfigured`);
  }

  // Flow A: Token Hash Flow (verifyOtp with token_hash & type)
  if (token_hash && type) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        // Recovery routing must remain strictly isolated from normal onboarding
        if (type === "recovery") {
          return NextResponse.redirect(`${origin}/auth/reset-password`);
        }

        const claims = (await supabase.auth.getClaims())?.data?.claims;
        const subClaim = claims && typeof claims.sub === "string" ? claims.sub : undefined;
        const userId = data?.user?.id || subClaim;

        if (typeof userId === "string" && userId) {
          const destination = await resolvePostAuthDestination({
            userId,
            intent,
            requestedNext: next,
          });
          return NextResponse.redirect(`${origin}${destination}`);
        }

        return NextResponse.redirect(`${origin}/auth?error=auth_confirm_failed`);
      }
    } catch {
      // Fall through to error redirect
    }
  } else if (code) {
    // Flow B: PKCE Code Flow (exchangeCodeForSession with code)
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Recovery routing via PKCE code (e.g. redirect URL carrying type=recovery)
        if (type === "recovery") {
          return NextResponse.redirect(`${origin}/auth/reset-password`);
        }

        const claims = (await supabase.auth.getClaims())?.data?.claims;
        const subClaim = claims && typeof claims.sub === "string" ? claims.sub : undefined;
        const userId = data?.user?.id || subClaim;

        if (typeof userId === "string" && userId) {
          const destination = await resolvePostAuthDestination({
            userId,
            intent,
            requestedNext: next,
          });
          return NextResponse.redirect(`${origin}${destination}`);
        }

        return NextResponse.redirect(`${origin}/auth?error=auth_confirm_failed`);
      }
    } catch {
      // Fall through to error redirect
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=auth_confirm_failed`);
}
