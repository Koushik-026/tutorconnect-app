import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Graceful no-op if Supabase runtime is unconfigured
  }
  return NextResponse.redirect(`${origin}/auth`);
}

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Graceful no-op if Supabase runtime is unconfigured
  }
  return NextResponse.redirect(`${origin}/auth`);
}
