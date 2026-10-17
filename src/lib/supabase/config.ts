export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

/**
 * Checks whether Supabase is configured with valid environment variables.
 * Disallows fake fallback URLs and invalid schemes.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  return Boolean(
    url &&
    key &&
    !url.includes("unconfigured") &&
    (url.startsWith("http://") || url.startsWith("https://"))
  );
}

/**
 * Retrieves valid Supabase configuration or null if unconfigured.
 */
export function getSupabaseConfig(): SupabaseConfig | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!.trim(),
  };
}

/**
 * Checks whether email/password authentication is enabled via feature flag.
 * Default is false.
 */
export function isEmailPasswordAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_EMAIL_PASSWORD_AUTH_ENABLED === "true";
}
