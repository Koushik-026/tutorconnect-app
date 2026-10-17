import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";

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
  if (!isSupabaseConfigured()) {
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

/**
 * Retrieves account roles for a verified user using server client.
 */
export async function getAccountRoles(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured() || !userId) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("account_roles")
      .select("role")
      .eq("user_id", userId);

    if (error || !data) {
      return [];
    }

    return data.map((r: { role: string }) => r.role);
  } catch {
    return [];
  }
}

/**
 * Checks whether the verified user has any of the permitted roles.
 */
export async function hasAnyRole(
  userId: string,
  allowedRoles: string[]
): Promise<boolean> {
  const roles = await getAccountRoles(userId);
  return roles.some((role) => allowedRoles.includes(role));
}
