import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

/**
 * Creates Supabase server client using official Next.js 16 cookies API.
 * Throws a clear error if invoked when Supabase environment variables are missing.
 */
export async function createClient() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase server client cannot be initialized because NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if middleware or proxy is refreshing sessions.
        }
      },
    },
  });
}
