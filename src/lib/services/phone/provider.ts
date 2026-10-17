export interface VerificationRequestResult {
  success: boolean;
  challengeId?: string;
  error?: string;
}

export interface VerificationCheckResult {
  success: boolean;
  error?: string;
}

export interface PhoneVerificationProvider {
  requestVerification(phoneE164: string): Promise<VerificationRequestResult>;
  verifyCode(challengeId: string, code: string): Promise<VerificationCheckResult>;
}

export type PhoneVerificationMode = "disabled";

/**
 * Returns current server-authoritative phone verification mode.
 * In production, any mode other than 'disabled' fails closed immediately.
 */
export function getPhoneVerificationMode(): PhoneVerificationMode {
  const mode = process.env.TUTORCONNECT_PHONE_VERIFICATION_MODE || "disabled";
  if (mode !== "disabled") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Unsupported phone verification mode '${mode}' in production`);
    }
  }
  return "disabled";
}

/**
 * DisabledPhoneVerificationProvider
 * Default production-safe provider adapter when phone verification provider is not connected.
 * Always fails closed with a typed configuration error. Never claims an OTP was dispatched.
 */
export class DisabledPhoneVerificationProvider implements PhoneVerificationProvider {
  async requestVerification(phoneE164: string): Promise<VerificationRequestResult> {
    void phoneE164;
    return {
      success: false,
      error: "Phone verification provider is disabled or not connected.",
    };
  }

  async verifyCode(challengeId: string, code: string): Promise<VerificationCheckResult> {
    void challengeId;
    void code;
    return {
      success: false,
      error: "Phone verification provider is disabled or not connected.",
    };
  }
}

/**
 * Factory to resolve the active server provider adapter based on configuration.
 */
export function getPhoneVerificationProvider(): PhoneVerificationProvider {
  const mode = getPhoneVerificationMode();
  if (mode === "disabled") {
    return new DisabledPhoneVerificationProvider();
  }
  return new DisabledPhoneVerificationProvider();
}
