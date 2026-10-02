import { createClient } from "./server";

export interface VerifiedAuthResult {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isConfigured: boolean;
}

/**
 * Validates authenticated user claims on the server side using official Supabase getClaims().
 * Does not trust unverified getSession() calls.
 */
export async function getVerifiedAuth(): Promise<VerifiedAuthResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      userId: null,
      email: null,
      isAuthenticated: false,
      isConfigured: false,
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();

    if (error || !data?.claims?.sub) {
      return {
        userId: null,
        email: null,
        isAuthenticated: false,
        isConfigured: true,
      };
    }

    return {
      userId: data.claims.sub,
      email: (data.claims.email as string) || null,
      isAuthenticated: true,
      isConfigured: true,
    };
  } catch {
    return {
      userId: null,
      email: null,
      isAuthenticated: false,
      isConfigured: true,
    };
  }
}
