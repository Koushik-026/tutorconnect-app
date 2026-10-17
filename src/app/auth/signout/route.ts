import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Graceful no-op if session already expired or client throws
    }
  }

  return NextResponse.redirect(`${origin}/auth`, { status: 303 });
}

export async function GET() {
  return new NextResponse("Method Not Allowed. Sign out requires a POST request.", {
    status: 405,
    headers: {
      Allow: "POST",
    },
  });
}
