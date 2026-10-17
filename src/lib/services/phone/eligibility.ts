import { getVerifiedAuth } from "@/lib/supabase/auth";
import { getPhoneVerificationMode } from "./provider";

export interface FreeDemoEligibilityParams {
  userId: string;
  studentProfileId?: string;
  tutorSlug?: string;
}

export interface FreeDemoEligibilityResult {
  isEligible: boolean;
  phoneVerificationRequired: boolean;
  hasVerifiedPhone: boolean;
  reason?: string;
  policyMetadata: {
    phoneVerificationMode: string;
    enforcementActive: boolean;
  };
}

/**
 * Free-Demo Eligibility Service Boundary
 * Evaluates whether a learner account is eligible to book a free demo.
 * In Phase 2:
 * - Phone verification enforcement is disabled (does NOT block booking).
 * - Does NOT hardcode or enforce an arbitrary numerical free demo cap.
 * - Does NOT alter existing booking behavior.
 * - Prepares metadata and policy boundary for future trusted phone gating.
 */
export async function getFreeDemoEligibility(
  params: FreeDemoEligibilityParams
): Promise<FreeDemoEligibilityResult> {
  const auth = await getVerifiedAuth();
  const isAuthenticated = auth.isAuthenticated && auth.userId === params.userId;

  if (!isAuthenticated) {
    return {
      isEligible: false,
      phoneVerificationRequired: false,
      hasVerifiedPhone: false,
      reason: "Authentication required",
      policyMetadata: {
        phoneVerificationMode: getPhoneVerificationMode(),
        enforcementActive: false,
      },
    };
  }

  // Phase 2 Invariant: Phone verification enforcement is currently disabled.
  // Bookings are not gated on phone verification in this phase.
  // Zero numeric demo caps exist.
  return {
    isEligible: true,
    phoneVerificationRequired: false,
    hasVerifiedPhone: false,
    policyMetadata: {
      phoneVerificationMode: getPhoneVerificationMode(),
      enforcementActive: false,
    },
  };
}
