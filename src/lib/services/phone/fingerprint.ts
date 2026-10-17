import "server-only";
import crypto from "crypto";

export const CURRENT_PHONE_FINGERPRINT_VERSION = 1;

/**
 * Derives a deterministic keyed HMAC-SHA256 phone fingerprint from a normalized E.164 number.
 * Mechanically protected with 'server-only'.
 *
 * Secret Requirements:
 * - Must be defined via server environment variable TUTORCONNECT_PHONE_FINGERPRINT_SECRET or argument.
 * - Must contain at least 32 bytes of secret material.
 * - Shorter or empty secrets fail closed.
 *
 * Rotation & Versioning Invariant:
 * - Secret must remain stable for a given fingerprint_version.
 * - Rotating requires incrementing fingerprint_version. Raw phone numbers are NEVER stored.
 */
export function derivePhoneFingerprint(
  normalizedE164: string,
  serverSecret?: string
): string {
  const secret = (serverSecret ?? process.env.TUTORCONNECT_PHONE_FINGERPRINT_SECRET ?? "").trim();

  if (!secret) {
    throw new Error(
      "Missing server secret for phone fingerprinting (TUTORCONNECT_PHONE_FINGERPRINT_SECRET required)"
    );
  }

  const secretBytes = Buffer.byteLength(secret, "utf8");
  if (secretBytes < 32) {
    throw new Error(
      `Insecure server secret for phone fingerprinting: expected at least 32 bytes of entropy, received ${secretBytes} bytes`
    );
  }

  if (!normalizedE164 || typeof normalizedE164 !== "string" || !normalizedE164.startsWith("+")) {
    throw new Error("Phone fingerprint derivation requires normalized E.164 input starting with '+'");
  }

  return crypto.createHmac("sha256", secret).update(normalizedE164).digest("hex").toLowerCase();
}
