import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { resolvePostAuthDestination } from "@/lib/services/auth-routing";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next");
  const intent = searchParams.get("intent") || searchParams.get("role");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/auth?error=unconfigured`);
  }

  const supabase = await createClient();
  const claims = (await supabase.auth.getClaims())?.data?.claims;
  const userId = claims && typeof claims.sub === "string" ? claims.sub : undefined;

  // Fail closed: Must be an authenticated session
  if (!userId) {
    return NextResponse.redirect(`${origin}/auth?error=unauthenticated`);
  }

  const destination = await resolvePostAuthDestination({
    userId,
    intent,
    requestedNext: next,
  });

  return NextResponse.redirect(`${origin}${destination}`);
}
