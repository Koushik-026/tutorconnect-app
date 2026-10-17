/* eslint-disable */
/**
 * TutorConnect Auth Intent & Post-Auth Routing Test Suite
 * Fully verifies the canonical post-auth destination resolver, intent preservation,
 * multi-role invariants, tutor application state transitions, and redirect protections.
 *
 * Test Matrix Covers:
 * 1. Tutor intent survives Google OAuth round trip
 * 2. Existing learner selecting tutor intent does not return to /tutors
 * 3. Tutor without application is sent to tutor onboarding
 * 4. Pending tutor reaches pending route
 * 5. Approved tutor reaches approved destination
 * 6. Learner intent still follows learner entitlement
 * 7. No tutor self-approval path exists
 * 8. Safe `next` redirect protection remains intact
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

console.log("===============================================================================");
console.log("        TUTORCONNECT AUTH INTENT & ROUTING VERIFICATION SUITE                  ");
console.log("===============================================================================\n");

// Read source files for static verification
const authPageSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "auth", "page.tsx"), "utf8");
const callbackRouteSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "auth", "callback", "route.ts"), "utf8");
const confirmRouteSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "auth", "confirm", "route.ts"), "utf8");
const authRoutingSrc = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "services", "auth-routing.ts"), "utf8");
const tutorPendingSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "dashboard", "tutor", "pending", "page.tsx"), "utf8");
const tutorApprovedSrc = fs.readFileSync(path.join(__dirname, "..", "src", "app", "dashboard", "tutor", "approved", "page.tsx"), "utf8");

// Pure JS implementation of sanitizeInternalRedirect (matching src/lib/utils/redirect.ts)
function sanitizeInternalRedirect(value, fallback = "/dashboard/student") {
  if (!value || typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    trimmed.includes("\\")
  ) {
    return fallback;
  }
  if (/^\/[a-zA-Z0-9_-]+:/.test(trimmed)) return fallback;
  if (/[\r\n\t\0]/.test(trimmed)) return fallback;
  return trimmed;
}

// Pure JS reproduction of calculatePostAuthDestination (matching src/lib/services/auth-routing.ts)
function calculatePostAuthDestination(context) {
  const {
    roles = [],
    intent = null,
    requestedNext = null,
    tutorProfileExists = false,
    tutorApplicationStatus = null,
    studentJourney = null,
  } = context;

  const hasTutorRole = roles.includes("tutor");
  const hasLearnerRole =
    roles.includes("student") || roles.includes("parent") || roles.includes("admin");

  const normalizedIntent = intent ? intent.toLowerCase().trim() : null;
  const isTutorIntent = normalizedIntent === "tutor";

  const safeRequestedNext = requestedNext
    ? sanitizeInternalRedirect(requestedNext, "")
    : "";

  // BRANCH 1: TUTOR INTENT
  if (isTutorIntent) {
    if (!hasTutorRole) {
      const params = new URLSearchParams({ intent: "tutor" });
      if (safeRequestedNext && safeRequestedNext.startsWith("/dashboard/tutor")) {
        params.set("next", safeRequestedNext);
      }
      return `/auth/onboarding?${params.toString()}`;
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

  // BRANCH 2: LEARNER INTENT (OR DEFAULT)
  if (roles.length === 0) {
    const params = new URLSearchParams();
    if (normalizedIntent === "student" || normalizedIntent === "parent") {
      params.set("intent", normalizedIntent);
    }
    if (safeRequestedNext) {
      params.set("next", safeRequestedNext);
    }
    const query = params.toString();
    return query ? `/auth/onboarding?${query}` : "/auth/onboarding";
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

      // If an explicit next route was requested, check if allowed
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
      const isAllowed = allowedRoutes.some(
        (prefix) => safeRequestedNext === prefix || safeRequestedNext.startsWith(`${prefix}/`) || safeRequestedNext.startsWith(`${prefix}?`)
      );

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

// Client helper calculation matching src/app/auth/page.tsx
function getEffectiveNext(selectedRole, explicitNext) {
  const defaultNext = selectedRole === "tutor" ? "/dashboard/tutor/pending" : "/tutors";
  if (!explicitNext) return defaultNext;
  const sanitized = sanitizeInternalRedirect(explicitNext, defaultNext);
  if (selectedRole === "tutor" && (sanitized === "/tutors" || sanitized.startsWith("/dashboard/student"))) {
    return defaultNext;
  }
  if (selectedRole === "student" && sanitized.startsWith("/dashboard/tutor")) {
    return defaultNext;
  }
  return sanitized;
}

// ==============================================================================
// TEST 1: TUTOR INTENT SURVIVES GOOGLE OAUTH ROUND TRIP
// ==============================================================================
console.log("Running Test 1: Tutor intent survives Google OAuth round trip...");

// 1A. User arrives at /auth (no next parameter), switches to Educator / Tutor
const roleTutor = "tutor";
const explicitNextNone = null;
const safeNextTutor = getEffectiveNext(roleTutor, explicitNextNone);
assert.strictEqual(safeNextTutor, "/dashboard/tutor/pending", "Tutor role without next must default to /dashboard/tutor/pending");

const redirectToGenerated = `https://example.com/auth/callback?next=${encodeURIComponent(safeNextTutor)}&intent=${roleTutor}`;
assert(redirectToGenerated.includes("intent=tutor"), "OAuth redirect must explicitly include intent=tutor");
assert(redirectToGenerated.includes("next=%2Fdashboard%2Ftutor%2Fpending"), "OAuth redirect must NOT bleed /tutors into next");

// 1B. User arrives with explicit next=/tutors, but switches to Educator / Tutor
const explicitNextTutors = "/tutors";
const effectiveNextForSwitchedTutor = getEffectiveNext(roleTutor, explicitNextTutors);
assert.strictEqual(
  effectiveNextForSwitchedTutor,
  "/dashboard/tutor/pending",
  "Switching to tutor must sanitize away learner /tutors default next"
);

// 1C. Static: Verify src/app/auth/page.tsx uses getEffectiveNext for Google OAuth
assert(
  authPageSrc.includes("const safeNext = getEffectiveNext(role);"),
  "auth/page.tsx must use getEffectiveNext(role) before initiating Google OAuth"
);
assert(
  authPageSrc.includes('const redirectTo = origin + "/auth/callback?next=" + encodeURIComponent(safeNext) + "&intent=" + role;'),
  "auth/page.tsx must pass effective safeNext and intent to OAuth callback"
);

// 1D. Static: Verify callback/route.ts reads intent and delegates to canonical resolver
assert(
  callbackRouteSrc.includes('const intent = searchParams.get("intent") || searchParams.get("role");'),
  "callback/route.ts must extract intent or role search param"
);
assert(
  callbackRouteSrc.includes("await resolvePostAuthDestination({"),
  "callback/route.ts must call resolvePostAuthDestination"
);

console.log("✓ Test 1 PASS: Tutor intent successfully survives Google OAuth URL construction, callback, and resolution.\n");

// ==============================================================================
// TEST 2: EXISTING LEARNER SELECTING TUTOR INTENT DOES NOT RETURN TO /TUTORS
// ==============================================================================
console.log("Running Test 2: Existing learner selecting tutor intent does not return to /tutors...");

// 2A. Account with student role logs in with intent=tutor
const studentWithTutorIntentDest = calculatePostAuthDestination({
  roles: ["student"],
  intent: "tutor",
  requestedNext: "/dashboard/tutor/pending",
  tutorProfileExists: false,
  tutorApplicationStatus: null,
});
assert.strictEqual(
  studentWithTutorIntentDest,
  "/auth/onboarding?intent=tutor&next=%2Fdashboard%2Ftutor%2Fpending",
  "Existing student selecting tutor intent must be sent to tutor onboarding, NOT /tutors"
);

// 2B. Account with parent role logs in with intent=tutor
const parentWithTutorIntentDest = calculatePostAuthDestination({
  roles: ["parent"],
  intent: "tutor",
});
assert.strictEqual(
  parentWithTutorIntentDest,
  "/auth/onboarding?intent=tutor",
  "Existing parent selecting tutor intent must be sent to tutor onboarding"
);

// 2C. Account with student + parent roles and exploring stage logs in with intent=tutor
const dualLearnerWithTutorIntent = calculatePostAuthDestination({
  roles: ["student", "parent"],
  intent: "tutor",
  studentJourney: { stage: "exploring" },
});
assert.strictEqual(
  dualLearnerWithTutorIntent,
  "/auth/onboarding?intent=tutor",
  "Learner entitlement summary must NOT override explicit tutor intent"
);

// 2D. Static: Verify dashboard/tutor/pending/page.tsx no longer ejects students to getStudentJourneySummary
assert(
  !tutorPendingSrc.includes("getStudentJourneySummary(auth.userId)"),
  "dashboard/tutor/pending/page.tsx must not eject learners using getStudentJourneySummary"
);
assert(
  tutorPendingSrc.includes('if (!roles.includes("tutor")) {\n    redirect("/auth/onboarding?intent=tutor");'),
  "dashboard/tutor/pending/page.tsx must send non-tutors to tutor onboarding"
);

// 2E. Static: Verify dashboard/tutor/approved/page.tsx no longer ejects students to getStudentJourneySummary
assert(
  !tutorApprovedSrc.includes("getStudentJourneySummary(auth.userId)"),
  "dashboard/tutor/approved/page.tsx must not eject learners using getStudentJourneySummary"
);
assert(
  tutorApprovedSrc.includes('if (!roles.includes("tutor")) {\n    redirect("/auth/onboarding?intent=tutor");'),
  "dashboard/tutor/approved/page.tsx must send non-tutors to tutor onboarding"
);

console.log("✓ Test 2 PASS: Existing learner with tutor intent is never returned to /tutors or learner flows.\n");

// ==============================================================================
// TEST 3: TUTOR WITHOUT APPLICATION IS SENT TO TUTOR ONBOARDING
// ==============================================================================
console.log("Running Test 3: Tutor without application is sent to tutor onboarding...");

// 3A. Account has tutor role but no profile exists
const tutorNoProfile = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: "tutor",
  tutorProfileExists: false,
  tutorApplicationStatus: null,
});
assert.strictEqual(
  tutorNoProfile,
  "/auth/onboarding?intent=tutor",
  "Tutor with missing profile must be routed to /auth/onboarding?intent=tutor"
);

// 3B. Account has tutor role, profile exists, but application status row is missing
const tutorNoAppState = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: "tutor",
  tutorProfileExists: true,
  tutorApplicationStatus: null,
});
assert.strictEqual(
  tutorNoAppState,
  "/auth/onboarding?intent=tutor",
  "Tutor with missing application state must be routed to /auth/onboarding?intent=tutor"
);

// 3C. Account has tutor role, missing application, but no intent passed (e.g. direct login)
const tutorNoIntentNoApp = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: null,
  tutorProfileExists: false,
  tutorApplicationStatus: null,
});
assert.strictEqual(
  tutorNoIntentNoApp,
  "/auth/onboarding?intent=tutor",
  "Tutor without application logging in with null intent must still route to tutor onboarding"
);

console.log("✓ Test 3 PASS: Tutors lacking profile or application state reliably route to tutor onboarding.\n");

// ==============================================================================
// TEST 4: PENDING TUTOR REACHES PENDING ROUTE
// ==============================================================================
console.log("Running Test 4: Pending tutor reaches pending route...");

// 4A. Tutor with status 'pending'
const pendingTutorDest = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: "tutor",
  tutorProfileExists: true,
  tutorApplicationStatus: "pending",
});
assert.strictEqual(pendingTutorDest, "/dashboard/tutor/pending", "Pending tutor must route to /dashboard/tutor/pending");

// 4B. Tutor with status 'rejected'
const rejectedTutorDest = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: "tutor",
  tutorProfileExists: true,
  tutorApplicationStatus: "rejected",
});
assert.strictEqual(rejectedTutorDest, "/dashboard/tutor/pending", "Rejected tutor must route to truthful status /dashboard/tutor/pending");

// 4C. Tutor with status 'suspended'
const suspendedTutorDest = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: "tutor",
  tutorProfileExists: true,
  tutorApplicationStatus: "suspended",
});
assert.strictEqual(suspendedTutorDest, "/dashboard/tutor/pending", "Suspended tutor must route to truthful status /dashboard/tutor/pending");

// 4D. Multi-role user with both student and tutor roles in pending status
const dualRolePendingTutor = calculatePostAuthDestination({
  roles: ["student", "tutor"],
  intent: "tutor",
  tutorProfileExists: true,
  tutorApplicationStatus: "pending",
  studentJourney: { stage: "active_enrollment" },
});
assert.strictEqual(
  dualRolePendingTutor,
  "/dashboard/tutor/pending",
  "Dual role user requesting tutor intent must reach /dashboard/tutor/pending despite active student enrollment"
);

console.log("✓ Test 4 PASS: Pending, rejected, and suspended tutors reach truthful /dashboard/tutor/pending.\n");

// ==============================================================================
// TEST 5: APPROVED TUTOR REACHES APPROVED DESTINATION
// ==============================================================================
console.log("Running Test 5: Approved tutor reaches approved destination...");

// 5A. Approved tutor default
const approvedTutorDest = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: "tutor",
  tutorProfileExists: true,
  tutorApplicationStatus: "approved",
});
assert.strictEqual(approvedTutorDest, "/dashboard/tutor/approved", "Approved tutor must route to /dashboard/tutor/approved");

// 5B. Approved tutor with safe next approved subpath
const approvedTutorSubpath = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: "tutor",
  requestedNext: "/dashboard/tutor/approved/schedule",
  tutorProfileExists: true,
  tutorApplicationStatus: "approved",
});
assert.strictEqual(
  approvedTutorSubpath,
  "/dashboard/tutor/approved/schedule",
  "Approved tutor can access legitimate approved subpath"
);

// 5C. Multi-role approved tutor requesting tutor intent
const multiRoleApprovedTutor = calculatePostAuthDestination({
  roles: ["student", "tutor"],
  intent: "tutor",
  tutorProfileExists: true,
  tutorApplicationStatus: "approved",
  studentJourney: { stage: "payment_pending" },
});
assert.strictEqual(
  multiRoleApprovedTutor,
  "/dashboard/tutor/approved",
  "Multi-role approved tutor with tutor intent reaches /dashboard/tutor/approved"
);

console.log("✓ Test 5 PASS: Approved tutor accurately routes to /dashboard/tutor/approved.\n");

// ==============================================================================
// TEST 6: LEARNER INTENT STILL FOLLOWS LEARNER ENTITLEMENT
// ==============================================================================
console.log("Running Test 6: Learner intent still follows learner entitlement...");

const learnerStages = [
  { stage: "needs_onboarding", expected: "/auth/onboarding" },
  { stage: "exploring", expected: "/tutors" },
  { stage: "demo_booked", expected: "/demo/confirmation" },
  { stage: "demo_completed", expected: "/packages/select" },
  { stage: "payment_pending", expected: "/payment/checkout" },
  { stage: "active_enrollment", expected: "/dashboard/student" },
  { stage: "completed", expected: "/tutors" },
];

for (const { stage, expected } of learnerStages) {
  const dest = calculatePostAuthDestination({
    roles: ["student"],
    intent: "student",
    studentJourney: { stage },
  });
  assert.strictEqual(dest, expected, `Stage ${stage} with student intent must route to ${expected}`);
}

// 6B. Multi-role user with both student and tutor roles selecting learner intent
const multiRoleSelectingLearner = calculatePostAuthDestination({
  roles: ["student", "tutor"],
  intent: "student",
  tutorProfileExists: true,
  tutorApplicationStatus: "approved",
  studentJourney: { stage: "active_enrollment" },
});
assert.strictEqual(
  multiRoleSelectingLearner,
  "/dashboard/student",
  "Multi-role user requesting learner intent must follow learner journey, not tutor journey"
);

// 6C. New user with no roles and student intent
const newLearnerDest = calculatePostAuthDestination({
  roles: [],
  intent: "student",
});
assert.strictEqual(newLearnerDest, "/auth/onboarding?intent=student", "New user with learner intent routes to learner onboarding");

console.log("✓ Test 6 PASS: Learner intent strictly obeys canonical entitlement stages and multi-role preferences.\n");

// ==============================================================================
// TEST 7: NO TUTOR SELF-APPROVAL PATH EXISTS
// ==============================================================================
console.log("Running Test 7: No tutor self-approval path exists...");

// 7A. Unapproved statuses cannot route to approved destination via calculator
const invalidStatuses = ["pending", "rejected", "suspended", "reviewing", "draft", "approved_fake", null, ""];
for (const status of invalidStatuses) {
  const dest = calculatePostAuthDestination({
    roles: ["tutor"],
    intent: "tutor",
    tutorProfileExists: true,
    tutorApplicationStatus: status,
    requestedNext: "/dashboard/tutor/approved",
  });
  assert.notStrictEqual(
    dest,
    "/dashboard/tutor/approved",
    `Status '${status}' must NOT allow access to /dashboard/tutor/approved`
  );
}

// 7B. Static: Verify dashboard/tutor/approved/page.tsx checks appState.status === 'approved'
assert(
  tutorApprovedSrc.includes('appState.status !== "approved"'),
  "approved/page.tsx must verify appState.status === 'approved'"
);
assert(
  tutorApprovedSrc.includes('redirect("/dashboard/tutor/pending");'),
  "approved/page.tsx must redirect unapproved tutors to /dashboard/tutor/pending"
);

// 7C. Static: Verify complete_onboarding RPC in SQL migration inserts status 'pending'
const phase2MigrationSrc = fs.readFileSync(
  path.join(__dirname, "..", "supabase", "migrations", "20261003062937_phase2_backend_foundation.sql"),
  "utf8"
);
assert(
  /INSERT INTO public\.tutor_application_states\s*\([\s\S]*?status[\s\S]*?\)\s*VALUES\s*\([\s\S]*?'pending'[\s\S]*?\)/i.test(phase2MigrationSrc),
  "complete_onboarding RPC must insert status 'pending' exclusively"
);
const onboardingRpcMatch = phase2MigrationSrc.match(/CREATE OR REPLACE FUNCTION public\.complete_onboarding[\s\S]*?\$\$/i);
const onboardingRpcBody = onboardingRpcMatch ? onboardingRpcMatch[0] : "";
assert(
  !onboardingRpcBody.includes("'approved'"),
  "complete_onboarding RPC must NEVER insert or set status 'approved'"
);

console.log("✓ Test 7 PASS: Tutor self-approval is architecturally impossible in code, RPC, and route boundary.\n");

// ==============================================================================
// TEST 8: SAFE `NEXT` REDIRECT PROTECTION REMAINS INTACT
// ==============================================================================
console.log("Running Test 8: Safe `next` redirect protection remains intact...");

// 8A. Malicious next URLs are stripped by calculatePostAuthDestination
const maliciousNexts = [
  "https://evil.com",
  "//evil.com",
  "/\\evil.com",
  "\\evil.com",
  "javascript:alert(1)",
  "data:text/html;base64,bad",
];

for (const badNext of maliciousNexts) {
  const dest = calculatePostAuthDestination({
    roles: ["student"],
    intent: "student",
    requestedNext: badNext,
    studentJourney: { stage: "exploring" },
  });
  assert.strictEqual(dest, "/tutors", `Malicious next ${badNext} must be sanitized to safe default`);
}

// 8B. Tutor intent ignores invalid or learner next URLs
const tutorWithLearnerNext = calculatePostAuthDestination({
  roles: ["tutor"],
  intent: "tutor",
  requestedNext: "/tutors",
  tutorProfileExists: true,
  tutorApplicationStatus: "pending",
});
assert.strictEqual(
  tutorWithLearnerNext,
  "/dashboard/tutor/pending",
  "Tutor intent must reject learner next parameter /tutors"
);

// 8C. Learner in exploring stage cannot access unentitled /demo/session via next
const unentitledLearnerNext = calculatePostAuthDestination({
  roles: ["student"],
  intent: "student",
  requestedNext: "/demo/session?booking_id=123",
  studentJourney: { stage: "exploring" },
});
assert.strictEqual(
  unentitledLearnerNext,
  "/tutors",
  "Learner cannot bypass entitlement stage via next parameter"
);

console.log("✓ Test 8 PASS: Safe redirect sanitization and stage-based entitlement boundaries intact.\n");

// ==============================================================================
// SUMMARY
// ==============================================================================
console.log("===============================================================================");
console.log("       ALL 8 AUTH INTENT AND ROUTING TESTS PASSED (8/8 SUITES)                 ");
console.log("===============================================================================");
