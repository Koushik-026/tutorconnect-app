/**
 * Sanitizes return URLs to prevent open-redirect vulnerabilities.
 * Allows only relative paths starting with a single '/' followed by valid path characters.
 * Rejects external protocols, protocol-relative '//', backslashes, control characters, javascript:, data:.
 */
export function sanitizeInternalRedirect(
  value: string | null | undefined,
  fallback = "/dashboard/student"
): string {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  // Must start with exactly one '/' and not followed by another '/' or '\'
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    trimmed.includes("\\")
  ) {
    return fallback;
  }

  // Reject dangerous pseudo-protocols like /javascript: or /data:
  if (/^\/[a-zA-Z0-9_-]+:/.test(trimmed)) {
    return fallback;
  }

  // Reject CR, LF, null bytes
  if (/[\r\n\t\0]/.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}
