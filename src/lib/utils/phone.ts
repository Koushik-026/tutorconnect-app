import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

export interface PhoneNormalizationResult {
  isValid: boolean;
  e164?: string;
  last4?: string;
  country?: string;
  error?: string;
}

/**
 * Normalizes phone numbers to standard E.164 format with country validation.
 * Rejects malformed numbers, impossible inputs, and alphabetic characters.
 * Defaults to Indian standard country code ('IN').
 *
 * This utility contains ZERO secrets, ZERO privileged logic, and is safe for
 * shared client/server consumption.
 */
export function normalizePhoneNumber(
  rawInput: string | null | undefined,
  defaultCountry: CountryCode = "IN"
): PhoneNormalizationResult {
  if (!rawInput || typeof rawInput !== "string" || !rawInput.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }

  const trimmed = rawInput.trim();

  // Basic sanity check to reject alphabetic characters
  if (/[a-zA-Z]/.test(trimmed)) {
    return { isValid: false, error: "Phone number must not contain alphabetic characters" };
  }

  try {
    const parsed = parsePhoneNumberFromString(trimmed, defaultCountry);
    if (!parsed || !parsed.isValid()) {
      return { isValid: false, error: "Invalid phone number format" };
    }

    const e164 = parsed.format("E.164");
    const last4 = e164.slice(-4);
    const country = parsed.country;

    return {
      isValid: true,
      e164,
      last4,
      country,
    };
  } catch {
    return { isValid: false, error: "Malformed phone number input" };
  }
}
