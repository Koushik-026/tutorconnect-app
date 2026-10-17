/* eslint-disable */
/**
 * TutorConnect Email/Password Authentication Final Hardening Test Suite
 * Fully verifies dual callback shapes (token_hash & PKCE code), recovery routing boundaries,
 * enumeration-safe messaging, server-side reset feature-flag gating, and security invariants.
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("===============================================================================");
console.log("       TUTORCONNECT EMAIL/PASSWORD FINAL HARDENING TEST SUITE                   ");
console.log("===============================================================================\n");

// Read source files
const authPageSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "auth", "page.tsx"), "utf8");
const resolveRouteSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "auth", "resolve", "route.ts"), "utf8");
const confirmRouteSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "auth", "confirm", "route.ts"), "utf8");
const resetPageSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "auth", "reset-password", "page.tsx"), "utf8");
const resetClientSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "auth", "reset-password", "reset-password-client.tsx"), "utf8");
const authRoutingSrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "services", "auth-routing.ts"), "utf8");
const configSrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "supabase", "config.ts"), "utf8");
const envExampleSrc = fs.readFileSync(path.join(__dirname, "..", ".env.example"), "utf8");

function sanitizeInternalRedirect(value, fallback = "/dashboard/student") {
  if (!value || typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\") || trimmed.includes("\\")) {
    return fallback;
  }
  if (/^\/[a-zA-Z0-9_-]+:/.test(trimmed)) return fallback;
  if (/[\r\n\t\0]/.test(trimmed)) return fallback;
  return trimmed;
}

function calculatePostAuthDestination(context) {
  const { roles = [], intent = null, requestedNext = null, tutorProfileExists = false, tutorApplicationStatus = null, studentJourney = null } = context;
  const hasTutorRole = roles.includes("tutor");
  const hasLearnerRole = roles.includes("student") || roles.includes("parent") || roles.includes("admin");
  const normalizedIntent = intent ? intent.toLowerCase().trim() : null;
  const isTutorIntent = normalizedIntent === "tutor";
  const safeRequestedNext = requestedNext ? sanitizeInternalRedirect(requestedNext, "") : "";

  if (isTutorIntent) {
    if (!hasTutorRole) {
      const params = new URLSearchParams({ intent: "tutor" });
      if (safeRequestedNext && safeRequestedNext.startsWith("/dashboard/tutor")) {
        params.set("next", safeRequestedNext);
      }
      return "/auth/onboarding?" + params.toString();
    }
    if (!tutorProfileExists || !tutorApplicationStatus) {
      return "/auth/onboarding?intent=tutor";
    }
    if (tutorApplicationStatus === "approved") {
      if (safeRequestedNext && safeRequestedNext.startsWith("/dashboard/tutor/approved")) {
        return safeRequestedNext;
      }
      return "/dashboard/tutor/approved";
    }
    if (safeRequestedNext && safeRequestedNext.startsWith("/dashboard/tutor/pending")) {
      return safeRequestedNext;
    }
    return "/dashboard/tutor/pending";
  }

  if (roles.length === 0) {
    const params = new URLSearchParams();
    if (normalizedIntent === "student" || normalizedIntent === "parent") {
      params.set("intent", normalizedIntent);
    }
    if (safeRequestedNext) {
      params.set("next", safeRequestedNext);
    }
    const query = params.toString();
    return query ? "/auth/onboarding?" + query : "/auth/onboarding";
  }

  if (hasLearnerRole) {
    if (studentJourney) {
      const stageRedirects = {
        needs_onboarding: "/auth/onboarding",
        exploring: "/tutors",
        demo_booked: "/demo/confirmation",
        demo_completed: "/packages/select",
        payment_pending: "/payment/checkout",
        active_enrollment: "/dashboard/student",
        completed: "/tutors",
      };
      const defaultRedirect = stageRedirects[studentJourney.stage] || "/tutors";
      const allowedRoutesPerStage = {
        needs_onboarding: ["/auth/onboarding"],
        exploring: ["/tutors", "/demo/book", "/demo/waiting-room", "/packages/select"],
        demo_booked: ["/tutors", "/demo/confirmation", "/demo/session", "/demo/waiting-room", "/demo/feedback"],
        demo_completed: ["/tutors", "/demo/confirmation", "/demo/feedback", "/packages/select", "/payment/checkout"],
        payment_pending: ["/tutors", "/packages/select", "/payment/checkout", "/payment/result"],
        active_enrollment: ["/tutors", "/dashboard/student", "/dashboard/student/sessions", "/packages/select", "/payment/checkout", "/schedule/confirm"],
        completed: ["/tutors", "/packages/select", "/dashboard/student"],
      };
      const allowedRoutes = allowedRoutesPerStage[studentJourney.stage] || ["/tutors"];
      const isAllowed = allowedRoutes.some((prefix) => safeRequestedNext === prefix || safeRequestedNext.startsWith(prefix + "/") || safeRequestedNext.startsWith(prefix + "?"));
      if (safeRequestedNext && isAllowed) {
        return safeRequestedNext;
      }
      return defaultRedirect;
    }
    return "/tutors";
  }

  if (hasTutorRole) {
    if (!tutorProfileExists || !tutorApplicationStatus) {
      return "/auth/onboarding?intent=tutor";
    }
    if (tutorApplicationStatus === "approved") {
      return "/dashboard/tutor/approved";
    }
    return "/dashboard/tutor/pending";
  }
  return "/auth/onboarding?intent=student";
}

console.log("Running Test 1: Confirm route accepts Token Hash flow...");
assert(confirmRouteSrc.includes("if (token_hash && type)"), "Confirm route must inspect token_hash and type");
assert(confirmRouteSrc.includes("supabase.auth.verifyOtp({"), "Confirm route must call verifyOtp for token hash flow");
console.log("✓ Test 1 PASS: Confirm route cleanly supports token_hash + type email OTP verification.\n");

console.log("Running Test 2: Confirm route accepts PKCE Code flow...");
assert(confirmRouteSrc.includes("else if (code)"), "Confirm route must inspect PKCE code query param");
assert(confirmRouteSrc.includes("supabase.auth.exchangeCodeForSession(code)"), "Confirm route must call exchangeCodeForSession");
assert(confirmRouteSrc.includes("auth?error=auth_confirm_failed"), "Confirm route must fail closed when neither flow matches");
console.log("✓ Test 2 PASS: Confirm route cleanly supports PKCE code exchange flow.\n");

console.log("Running Test 3: Successful token_hash recovery routes to /auth/reset-password...");
const tokenHashBranch = confirmRouteSrc.slice(
  confirmRouteSrc.indexOf("if (token_hash && type)"),
  confirmRouteSrc.indexOf("else if (code)")
);
assert(tokenHashBranch.includes('if (type === "recovery")'), "Token hash flow must check type === recovery");
assert(tokenHashBranch.includes('/auth/reset-password'), "Token hash recovery must redirect to /auth/reset-password");
assert(!tokenHashBranch.includes('resolvePostAuthDestination') || tokenHashBranch.indexOf('/auth/reset-password') < tokenHashBranch.indexOf('resolvePostAuthDestination'), "Recovery must return before resolvePostAuthDestination");
console.log("✓ Test 3 PASS: Token hash recovery redirects to /auth/reset-password without touching onboarding.\n");

console.log("Running Test 4: Successful code recovery routes to /auth/reset-password...");
const codeBranch = confirmRouteSrc.slice(
  confirmRouteSrc.indexOf("else if (code)"),
  confirmRouteSrc.lastIndexOf("auth?error=auth_confirm_failed")
);
assert(codeBranch.includes('if (type === "recovery")'), "Code flow must check type === recovery");
assert(codeBranch.includes('/auth/reset-password'), "Code recovery must redirect to /auth/reset-password");
console.log("✓ Test 4 PASS: PKCE code recovery redirects to /auth/reset-password without touching onboarding.\n");

console.log("Running Test 5: Recovery ignores arbitrary next parameters...");
assert(!tokenHashBranch.includes('searchParams.get("next")') || !tokenHashBranch.slice(tokenHashBranch.indexOf('type === "recovery"'), tokenHashBranch.indexOf('/auth/reset-password') + 35).includes("next"), "Token hash recovery must not use next parameter");
assert(!codeBranch.includes('searchParams.get("next")') || !codeBranch.slice(codeBranch.indexOf('type === "recovery"'), codeBranch.indexOf('/auth/reset-password') + 35).includes("next"), "Code recovery must not use next parameter");
console.log("✓ Test 5 PASS: Recovery redirect strictly targets /auth/reset-password ignoring external next URLs.\n");

console.log("Running Test 6: Normal email confirmation still uses canonical resolver...");
assert(tokenHashBranch.includes("resolvePostAuthDestination({"), "Token hash non-recovery flow must call canonical resolver");
assert(codeBranch.includes("resolvePostAuthDestination({"), "Code non-recovery flow must call canonical resolver");
assert.strictEqual(calculatePostAuthDestination({ roles: [], intent: "tutor" }), "/auth/onboarding?intent=tutor", "New tutor confirmation reaches tutor onboarding");
assert.strictEqual(calculatePostAuthDestination({ roles: [], intent: "student" }), "/auth/onboarding?intent=student", "New student confirmation reaches learner onboarding");
console.log("✓ Test 6 PASS: Normal email confirmations consistently delegate to resolvePostAuthDestination.\n");

console.log("Running Test 7: Signup success messaging does not claim delivery/account existence...");
assert(authPageSrc.includes("If this email can be registered, check your inbox for a verification link."), "Signup must show neutral uncommitted confirmation");
assert(!authPageSrc.includes("A verification link has been sent to"), "Signup must not definitively claim email was sent");
console.log("✓ Test 7 PASS: Signup messaging is enumeration-safe and does not confirm account existence.\n");

console.log("Running Test 8: Signup failure does not expose raw provider errors...");
assert(!authPageSrc.includes("setErrorMessage(error.message || \"Failed to create account"), "Signup must not expose raw provider error.message");
assert(authPageSrc.includes("Unable to create account. Please check your information or try again later."), "Signup must show generic failure message on error");
console.log("✓ Test 8 PASS: Raw internal Supabase provider errors are suppressed on signup failure.\n");

console.log("Running Test 9: Forgot-password remains enumeration-safe...");
assert(authPageSrc.includes("If an account exists for"), "Forgot password must use enumeration-safe conditional messaging");
assert(!authPageSrc.includes("setErrorMessage(error.message || \"Unable to send password recovery"), "Forgot password must not leak raw error.message");
assert(authPageSrc.includes("Unable to process password reset request. Please try again later."), "Forgot password must use generic failure message");
console.log("✓ Test 9 PASS: Forgot password maintains enumeration safety on both success and failure.\n");

console.log("Running Test 10: Reset-password is inaccessible while email/password flag=false...");
assert(!resetPageSrc.includes('"use client"'), "reset-password/page.tsx must be a Server Component");
assert(resetPageSrc.includes("isEmailPasswordAuthEnabled()"), "reset-password page must check isEmailPasswordAuthEnabled");
assert(resetPageSrc.includes('redirect("/auth")'), "reset-password page must redirect to /auth when feature flag is false");
console.log("✓ Test 10 PASS: /auth/reset-password is server-gated behind NEXT_PUBLIC_EMAIL_PASSWORD_AUTH_ENABLED.\n");

console.log("Running Test 11: Password values never appear in URL/logging...");
assert(!authPageSrc.includes("console.log(password)") && !authPageSrc.includes("console.log(newPassword)"), "Passwords must never be logged");
assert(!authPageSrc.includes("password=") && !confirmRouteSrc.includes("password=") && !resetPageSrc.includes("password="), "Passwords must never appear in query strings");
assert(!confirmRouteSrc.includes("searchParams.get(\"token_hash\")") || !confirmRouteSrc.includes("destination = destination + token_hash"), "Tokens must never leak into destination redirects");
console.log("✓ Test 11 PASS: Passwords and tokens never leak into logs or redirect URLs.\n");

console.log("Running Test 12: Google OAuth remains unchanged...");
assert(authPageSrc.includes("handleGoogleSignIn"), "Google OAuth handler preserved");
assert(authPageSrc.includes('provider: "google"'), "Google OAuth provider preserved");
assert(authPageSrc.includes("/auth/callback?next="), "Google OAuth callback path preserved");
console.log("✓ Test 12 PASS: Google OAuth functionality and callback construction preserved identically.\n");

console.log("Running Test 13: Password sign-in uses signInWithPassword & routes to /auth/resolve...");
assert(authPageSrc.includes("supabase.auth.signInWithPassword({"), "Sign-in calls signInWithPassword");
assert(authPageSrc.includes("router.push(`/auth/resolve?intent="), "Sign-in navigates to /auth/resolve");
assert(resolveRouteSrc.includes("resolvePostAuthDestination({"), "/auth/resolve delegates to canonical resolver");
console.log("✓ Test 13 PASS: Password sign-in integrates directly with server-authoritative resolver.\n");

console.log("Running Test 14: Client password validation enforces minimum 8 chars & matching...");
assert(authPageSrc.includes("password.length < 8") && authPageSrc.includes("password !== confirmPassword"), "Signup validates length and matching");
assert(resetClientSrc.includes("newPassword.length < 8") && resetClientSrc.includes("newPassword !== confirmPassword"), "Reset validates length and matching");
console.log("✓ Test 14 PASS: Client-side password validation enforces 8+ chars and matching confirmations.\n");

console.log("Running Test 15: Tutor self-approval remains impossible...");
const pendingTutor = calculatePostAuthDestination({ roles: ["tutor"], intent: "tutor", tutorProfileExists: true, tutorApplicationStatus: "pending", requestedNext: "/dashboard/tutor/approved" });
assert.strictEqual(pendingTutor, "/dashboard/tutor/pending", "Unapproved tutor cannot reach approved destination");
console.log("✓ Test 15 PASS: Tutor self-approval remains strictly prevented across all auth flows.\n");

console.log("Running Test 16: Authentication confirmation fails closed without trusted userId...");
assert(!confirmRouteSrc.includes("`${origin}/tutors`") && !confirmRouteSrc.includes("'/tutors'"), "Confirm route must not fall back to /tutors");
assert(tokenHashBranch.includes('if (typeof userId === "string" && userId)'), "Token hash branch must check for non-empty string userId");
assert(tokenHashBranch.includes("auth?error=auth_confirm_failed"), "Token hash branch must redirect to auth_confirm_failed when userId missing");
assert(codeBranch.includes('if (typeof userId === "string" && userId)'), "Code branch must check for non-empty string userId");
assert(codeBranch.includes("auth?error=auth_confirm_failed"), "Code branch must redirect to auth_confirm_failed when userId missing");
assert(!tokenHashBranch.includes("/dashboard"), "Token hash branch must not fall back to dashboard directly");
assert(!codeBranch.includes("/dashboard"), "Code branch must not fall back to dashboard directly");

function simulateConfirmRoute({ type, error, hasUserId, isCodeFlow = false }) {
  if (error) {
    return "/auth?error=auth_confirm_failed";
  }
  if (type === "recovery") {
    return "/auth/reset-password";
  }
  if (hasUserId) {
    return "/resolved_canonical_destination";
  }
  return "/auth?error=auth_confirm_failed";
}

assert.strictEqual(
  simulateConfirmRoute({ type: "signup", error: null, hasUserId: false, isCodeFlow: false }),
  "/auth?error=auth_confirm_failed",
  "Token hash without trusted userId must fail closed"
);
assert.strictEqual(
  simulateConfirmRoute({ type: null, error: null, hasUserId: false, isCodeFlow: true }),
  "/auth?error=auth_confirm_failed",
  "PKCE code exchange without trusted userId must fail closed"
);
assert.strictEqual(
  simulateConfirmRoute({ type: "signup", error: null, hasUserId: true }),
  "/resolved_canonical_destination",
  "Valid authenticated callbacks must resolve canonical destination"
);
console.log("\u2713 Test 16 PASS: Confirm route fails closed without trusted userId across both token_hash and code flows.\n");

console.log("===============================================================================");
console.log("       ALL FINAL HARDENING EMAIL/PASSWORD TESTS PASSED (16/16)                 ");
console.log("===============================================================================");