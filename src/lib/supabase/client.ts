import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

/**
 * Creates Supabase browser client.
 * Throws a clear error if invoked when Supabase environment variables are missing.
 * Handlers should check isSupabaseConfigured() before calling this function.
 */
export function createClient() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase client cannot be initialized because NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured."
    );
  }

  return createBrowserClient(config.url, config.publishableKey);
}
