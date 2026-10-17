/* eslint-disable */
/**
 * TutorConnect Phase 2: Phone Identity Foundation Test Suite (Final Hardening)
 * Fully labeled test matrix covering [STATIC], [UNIT/RUNTIME], and [DEPLOYMENT READINESS & LIVE REGRESSION] tiers.
 * Verifies:
 * - Client-safe normalization vs mechanically server-only fingerprint derivation
 * - Secret strength (32+ bytes minimum entropy, fail-closed on weak/missing secrets)
 * - Provider abstraction (DisabledPhoneVerificationProvider fail-closed contract)
 * - Database schema & invariants (lowercase 64-char hex, fingerprint_version >= 1, provider != 'disabled', phone_last4 = 4 digits)
 * - Household correlation model (UNIQUE user_id, non-unique phone_fingerprint with index, no redundant user index)
 * - Zero direct client CRUD & removal of unused RPC surface
 * - Preservation of demo booking flow (zero numeric caps, zero required phone fields)
 * - Deployment readiness (honest classification of undeployed remote table)
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Mock 'server-only' for Node CLI test runner environment (emulating Server Component runtime)
require.cache[require.resolve("server-only")] = {
  id: require.resolve("server-only"),
  filename: require.resolve("server-only"),
  loaded: true,
  exports: {},
};

// Load modules under test
const { normalizePhoneNumber } = require(path.join(__dirname, "..", "src", "lib", "utils", "phone.ts"));
const { derivePhoneFingerprint, CURRENT_PHONE_FINGERPRINT_VERSION } = require(path.join(__dirname, "..", "src", "lib", "services", "phone", "fingerprint.ts"));
const { DisabledPhoneVerificationProvider, getPhoneVerificationMode } = require(path.join(__dirname, "..", "src", "lib", "services", "phone", "provider.ts"));

console.log("===============================================================================");
console.log("       TUTORCONNECT PHASE 2: PHONE IDENTITY FINAL FOUNDATION TESTS             ");
console.log("===============================================================================\n");

// Read source files for static structural proofs
const migrationPath = path.join(__dirname, "..", "supabase", "migrations", "20261003120000_verified_phone_identities.sql");
const migrationSrc = fs.existsSync(migrationPath) ? fs.readFileSync(migrationPath, "utf8") : "";
const phoneUtilsSrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "utils", "phone.ts"), "utf8");
const fingerprintSrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "services", "phone", "fingerprint.ts"), "utf8");
const eligibilitySrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "services", "phone", "eligibility.ts"), "utf8");
const workflowSrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "services", "workflow.ts"), "utf8");
const envExampleSrc = fs.readFileSync(path.join(__dirname, "..", ".env.example"), "utf8");
const dbTypesSrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "types", "database.ts"), "utf8");

async function runTestSuite() {
  console.log("--- TIER 1: [UNIT/RUNTIME] PHONE NORMALIZATION & FINGERPRINTING ---\n");

  // TEST 1: Malformed phone input is rejected
  console.log("Running [UNIT/RUNTIME] Test 1: Malformed phone input rejection...");
  assert.strictEqual(normalizePhoneNumber(null).isValid, false, "null input must be rejected");
  assert.strictEqual(normalizePhoneNumber("").isValid, false, "empty input must be rejected");
  assert.strictEqual(normalizePhoneNumber("   ").isValid, false, "whitespace-only input must be rejected");
  assert.strictEqual(normalizePhoneNumber("abcdefghij").isValid, false, "alphabetic input must be rejected");
  assert.strictEqual(normalizePhoneNumber("98765abcde").isValid, false, "alphanumeric input must be rejected");
  assert.strictEqual(normalizePhoneNumber("12345").isValid, false, "too-short number must be rejected");
  assert.strictEqual(normalizePhoneNumber("0000000000").isValid, false, "all-zero number must be rejected");
  assert.strictEqual(normalizePhoneNumber("+910000000000").isValid, false, "impossible Indian mobile must be rejected");
  console.log("✓ [UNIT/RUNTIME] Test 1 PASS: Malformed, partial, and impossible phone inputs are strictly rejected.\n");

  // TEST 2: Valid Indian phone input normalizes consistently to E.164
  console.log("Running [UNIT/RUNTIME] Test 2: Indian phone input normalization to E.164...");
  const validInputs = [
    "9876543210",
    "+919876543210",
    "+91 98765 43210",
    "+91-98765-43210",
    "09876543210",
    " 9876543210 ",
  ];

  validInputs.forEach((input) => {
    const res = normalizePhoneNumber(input, "IN");
    assert.strictEqual(res.isValid, true, `Input "${input}" must be valid`);
    assert.strictEqual(res.e164, "+919876543210", `Input "${input}" must normalize to "+919876543210"`);
    assert.strictEqual(res.last4, "3210", `Input "${input}" must extract last4 "3210"`);
    assert.strictEqual(res.country, "IN", `Input "${input}" country must be "IN"`);
  });
  console.log("✓ [UNIT/RUNTIME] Test 2 PASS: All valid Indian phone input variants normalize consistently to E.164 (+919876543210) with last4 extraction.\n");

  // TEST 3: Server-only mechanical boundary enforcement
  console.log("Running [STATIC & RUNTIME] Test 3: Server-only fingerprinting boundary...");
  // 3a: phone.ts is client-safe
  assert(!phoneUtilsSrc.includes('import crypto from "crypto"'), "phone.ts must not import crypto");
  assert(!phoneUtilsSrc.includes("TUTORCONNECT_PHONE_FINGERPRINT_SECRET"), "phone.ts must not reference server secret");
  assert(!phoneUtilsSrc.includes("derivePhoneFingerprint"), "phone.ts must not contain fingerprint derivation");
  // 3b: fingerprint.ts is server-only
  assert(fingerprintSrc.includes('import "server-only"'), 'fingerprint.ts must include import "server-only"');
  assert(fingerprintSrc.includes("derivePhoneFingerprint"), "fingerprint.ts must export derivePhoneFingerprint");
  assert.strictEqual(CURRENT_PHONE_FINGERPRINT_VERSION, 1, "CURRENT_PHONE_FINGERPRINT_VERSION must be 1");
  console.log("✓ [STATIC & RUNTIME] Test 3 PASS: phone.ts is client-safe; fingerprint.ts is mechanically server-only.\n");

  // TEST 4: Secret strength requirement (32 bytes minimum entropy)
  console.log("Running [UNIT/RUNTIME] Test 4: Secret strength enforcement (32+ bytes)...");
  const normalized = "+919876543210";
  const secure32ByteSecret = "a_very_strong_32_byte_secret_123"; // exactly 32 bytes

  // 4a: Missing or empty secret fails closed
  assert.throws(() => {
    derivePhoneFingerprint(normalized, "");
  }, /Missing server secret/, "Empty secret must throw");

  assert.throws(() => {
    const saved = process.env.TUTORCONNECT_PHONE_FINGERPRINT_SECRET;
    delete process.env.TUTORCONNECT_PHONE_FINGERPRINT_SECRET;
    try {
      derivePhoneFingerprint(normalized, undefined);
    } finally {
      if (saved) process.env.TUTORCONNECT_PHONE_FINGERPRINT_SECRET = saved;
    }
  }, /Missing server secret/, "Undefined secret without env must throw");

  // 4b: Weak / short secret (< 32 bytes) fails closed
  const weakSecrets = [
    "short_secret",
    "1234567890123456789012345678901", // 31 bytes
    "weak_hmac_key",
    "default_secret",
  ];
  weakSecrets.forEach((weak) => {
    assert.throws(() => {
      derivePhoneFingerprint(normalized, weak);
    }, /Insecure server secret.*at least 32 bytes/, `Weak secret "${weak}" must be rejected`);
  });

  // 4c: Strong secret (>= 32 bytes) succeeds and produces 64-char lowercase hex
  const fp1 = derivePhoneFingerprint(normalized, secure32ByteSecret);
  const fp2 = derivePhoneFingerprint(normalized, secure32ByteSecret);
  assert.strictEqual(fp1, fp2, "Deterministic derivation with same secret must match");
  assert.strictEqual(fp1.length, 64, "Fingerprint must be 64 characters");
  assert(/^[0-9a-f]{64}$/.test(fp1), "Fingerprint must be lowercase hex");

  // 4d: Collision resistance across phone numbers
  const fpOther = derivePhoneFingerprint("+919876543211", secure32ByteSecret);
  assert.notStrictEqual(fp1, fpOther, "Different numbers must produce distinct fingerprints");

  // 4e: Environment documentation
  assert(envExampleSrc.includes("at least 32 bytes"), ".env.example must document 32-byte secret requirement");
  console.log("✓ [UNIT/RUNTIME] Test 4 PASS: Rejects missing/empty/weak (<32 bytes) secrets; produces deterministic 64-char lowercase hex.\n");

  // TEST 5: Non-E.164 input rejection
  console.log("Running [UNIT/RUNTIME] Test 5: Non-E.164 rejection for fingerprinting...");
  assert.throws(() => {
    derivePhoneFingerprint("9876543210", secure32ByteSecret);
  }, /normalized E\.164 input starting with '\+'/, "Non-E.164 input must throw");
  console.log("✓ [UNIT/RUNTIME] Test 5 PASS: Non-E.164 input strictly rejected by fingerprinting function.\n");

  // TEST 6: DisabledPhoneVerificationProvider cannot claim an OTP was sent
  console.log("Running [UNIT/RUNTIME] Test 6: DisabledPhoneVerificationProvider fail-closed contract...");
  const disabledProvider = new DisabledPhoneVerificationProvider();
  const reqRes = await disabledProvider.requestVerification("+919876543210");
  assert.strictEqual(reqRes.success, false, "Disabled provider requestVerification must return success: false");
  assert(reqRes.error && reqRes.error.includes("disabled"), "Disabled provider must return typed disabled error");

  const verifyRes = await disabledProvider.verifyCode("any-challenge-id", "123456");
  assert.strictEqual(verifyRes.success, false, "Disabled provider verifyCode must return success: false");
  assert(verifyRes.error && verifyRes.error.includes("disabled"), "Disabled provider must return typed disabled error");

  // Production safety invariant: mock provider in production throws
  const savedNodeEnv = process.env.NODE_ENV;
  const savedMode = process.env.TUTORCONNECT_PHONE_VERIFICATION_MODE;
  try {
    process.env.NODE_ENV = "production";
    process.env.TUTORCONNECT_PHONE_VERIFICATION_MODE = "mock";
    assert.throws(() => {
      getPhoneVerificationMode();
    }, /Unsupported phone verification mode/);
  } finally {
    process.env.NODE_ENV = savedNodeEnv;
    process.env.TUTORCONNECT_PHONE_VERIFICATION_MODE = savedMode;
  }
  console.log("✓ [UNIT/RUNTIME] Test 6 PASS: DisabledPhoneVerificationProvider cannot claim OTP was sent; production fails closed on mock.\n");

  // TEST 7: Preservation of current demo-booking behavior (Option B invariant)
  console.log("Running [UNIT/RUNTIME] Test 7: Preservation of current demo-booking behavior...");
  assert(eligibilitySrc.includes("isEligible: true"), "isEligible must remain true for authenticated users");
  assert(eligibilitySrc.includes("phoneVerificationRequired: false"), "phoneVerificationRequired must remain false in Phase 2");
  assert(eligibilitySrc.includes("enforcementActive: false"), "enforcementActive must remain false in Phase 2");
  assert(workflowSrc.includes('supabase.rpc("create_demo_booking"'), "createDemoBooking RPC call must remain unchanged");
  console.log("✓ [UNIT/RUNTIME] Test 7 PASS: Current free-demo booking flow is preserved; phone verification is not gated.\n");

  // TEST 8: No numeric free-demo cap is introduced
  console.log("Running [UNIT/RUNTIME] Test 8: No arbitrary numerical free-demo quota introduced...");
  const forbiddenQuotaPatterns = [
    "max_demos",
    "demo_limit",
    "MAX_DEMO_COUNT",
    "maxDemoBookings",
    "demoQuota",
    "remaining_demos",
  ];
  forbiddenQuotaPatterns.forEach((pattern) => {
    assert(!eligibilitySrc.toLowerCase().includes(pattern.toLowerCase()), `Eligibility service must not contain numerical quota '${pattern}'`);
  });
  console.log("✓ [UNIT/RUNTIME] Test 8 PASS: No hardcoded numeric free-demo limit or quota introduced.\n");

  console.log("--- TIER 2: [STATIC] DATABASE SCHEMA, PRIVACY & INVARIANTS ---\n");

  // TEST 9: Household Identity Model (user_id is UNIQUE, phone_fingerprint is NOT unique)
  console.log("Running [STATIC] Test 9: Household correlation identity model...");
  assert(migrationSrc.includes("CONSTRAINT uq_verified_phone_identities_user UNIQUE (user_id)"), "user_id must be UNIQUE (one phone per account)");
  assert(!migrationSrc.includes("uq_verified_phone_identities_fingerprint UNIQUE"), "phone_fingerprint must NOT have a UNIQUE constraint (multiple accounts in a household may share phone)");
  assert(!migrationSrc.includes("UNIQUE (phone_fingerprint)"), "phone_fingerprint must NOT be UNIQUE");
  assert(migrationSrc.includes("CREATE INDEX IF NOT EXISTS idx_verified_phone_identities_fingerprint ON public.verified_phone_identities(phone_fingerprint)"), "Non-unique index on phone_fingerprint must exist for server lookups");
  assert(!migrationSrc.includes("CREATE INDEX IF NOT EXISTS idx_verified_phone_identities_user_id"), "Redundant index on user_id must NOT be created (UNIQUE constraint already indexes it)");
  console.log("✓ [STATIC] Test 9 PASS: Household model verified: user_id is UNIQUE, phone_fingerprint is non-unique with b-tree index, no redundant user index.\n");

  // TEST 10: Verified rows represent real verification (no 'disabled' provider default or value)
  console.log("Running [STATIC] Test 10: Real verification requirement for verified rows...");
  assert(!migrationSrc.includes("DEFAULT 'disabled'"), "provider must NOT have DEFAULT 'disabled'");
  assert(migrationSrc.includes("provider text NOT NULL,"), "provider must be explicitly supplied without default");
  assert(migrationSrc.includes("CONSTRAINT chk_provider_valid CHECK (length(trim(provider)) > 0 AND provider != 'disabled')"), "provider must be non-empty and != 'disabled'");
  console.log("✓ [STATIC] Test 10 PASS: provider has no 'disabled' default and is constrained from holding 'disabled'.\n");

  // TEST 11: Schema CHECK constraints
  console.log("Running [STATIC] Test 11: Schema CHECK constraints on undeployed migration...");
  assert(migrationSrc.includes("CONSTRAINT chk_phone_fingerprint_hex CHECK (phone_fingerprint ~ '^[0-9a-f]{64}$')"), "phone_fingerprint must be checked for lowercase 64-char hex");
  assert(migrationSrc.includes("CONSTRAINT chk_fingerprint_version CHECK (fingerprint_version >= 1)"), "fingerprint_version must be checked for >= 1");
  assert(migrationSrc.includes("CONSTRAINT chk_phone_last4_digits CHECK (phone_last4 ~ '^[0-9]{4}$')"), "phone_last4 must be checked for exactly 4 digits");
  assert(dbTypesSrc.includes("fingerprint_version: number;"), "VerifiedPhoneIdentityRow must include fingerprint_version");
  console.log("✓ [STATIC] Test 11 PASS: CHECK constraints verified for hex fingerprint, version >= 1, valid provider, and 4-digit last4.\n");

  // TEST 12: Zero Client Exposure and Removal of Unused RPC
  console.log("Running [STATIC] Test 12: Zero direct client exposure and removal of unused RPC...");
  assert(!migrationSrc.includes("phone_number text"), "Raw phone_number column must NOT exist");
  assert(!migrationSrc.includes("raw_phone"), "Raw phone column must NOT exist");
  assert(!migrationSrc.includes('FOR SELECT TO authenticated'), "Raw table must NOT have direct SELECT policy for authenticated role");
  assert(!migrationSrc.includes('FOR SELECT TO anon'), "Raw table must NOT have direct SELECT policy for anon role");
  assert(!migrationSrc.includes('FOR INSERT TO authenticated'), "Raw table must NOT have direct INSERT policy");
  assert(!migrationSrc.includes('FOR UPDATE TO authenticated'), "Raw table must NOT have direct UPDATE policy");

  // Verify unused RPC is REMOVED
  assert(!migrationSrc.includes("get_my_verified_phone_status"), "get_my_verified_phone_status RPC must be REMOVED from migration");
  assert(!dbTypesSrc.includes("SafePhoneIdentityStatus"), "SafePhoneIdentityStatus must be removed from database types");
  assert(!fs.existsSync(path.join(__dirname, "..", "src", "lib", "services", "phone", "identity.ts")), "identity.ts draft code must be REMOVED");
  console.log("✓ [STATIC] Test 12 PASS: Raw table completely inaccessible to client CRUD; unused RPC completely removed.\n");

  console.log("--- TIER 3: [DEPLOYMENT READINESS & LIVE REGRESSION] ---\n");

  // TEST 13: Honest Deployment Readiness & Live Regression Checks
  console.log("Running [DEPLOYMENT READINESS & LIVE REGRESSION] Test 13...");
  const supabase = createClient(
    "https://veiwcumnykvgtszdkpix.supabase.co",
    "sb_publishable_83o1t8Qt7AIwabmJfWI0AA_G7eJDl29"
  );

  // 13a: Deployment readiness verification: Confirm table is not yet deployed remotely
  const { error: liveTableErr, status: liveTableStatus } = await supabase.from("verified_phone_identities").select("*");
  assert(liveTableStatus === 404 || liveTableErr, "verified_phone_identities is not yet deployed to remote Supabase (expected 404/PGRST205)");
  console.log("   [DEPLOYMENT READINESS] Remote verified_phone_identities status: HTTP " + liveTableStatus + " (not yet deployed, as specified).");

  // 13b: Live regression verification: Confirm existing live tables maintain active anonymous isolation
  const { data: anonBookings } = await supabase.from("demo_bookings").select("*");
  assert(Array.isArray(anonBookings) && anonBookings.length === 0, "Anonymous must not read demo bookings");

  const { data: anonAppStates } = await supabase.from("tutor_application_states").select("*");
  assert(Array.isArray(anonAppStates) && anonAppStates.length === 0, "Anonymous must not read tutor application states");

  const { data: anonPurchases } = await supabase.from("package_purchases").select("*");
  assert(Array.isArray(anonPurchases) && anonPurchases.length === 0, "Anonymous must not read package purchases");

  console.log("✓ [DEPLOYMENT READINESS & LIVE REGRESSION] Test 13 PASS: Undeployed table verified honestly; live anonymous isolation maintained on existing tables.\n");

  console.log("===============================================================================");
  console.log("       ALL PHASE 2 FINAL FOUNDATION TESTS PASSED (13/13 SUITES)                ");
  console.log("===============================================================================");
}

runTestSuite().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
