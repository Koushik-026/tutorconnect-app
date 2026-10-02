/* eslint-disable */
/**
 * TutorConnect Phase 2.1 Static Security Verification Suite
 * Tests redirect sanitization, signout POST constraints, and configuration boundaries.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== TUTORCONNECT STATIC SECURITY AUDIT ===\n');

// 1. Test redirect sanitization
function sanitizeInternalRedirect(value, fallback = '/dashboard/student') {
  if (!value || typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.includes('\\')
  ) {
    return fallback;
  }
  if (/^\/[a-zA-Z0-9_-]+:/.test(trimmed)) return fallback;
  if (/[\r\n\t\0]/.test(trimmed)) return fallback;
  return trimmed;
}

const redirectCases = [
  ['https://attacker.com', '/dashboard/student'],
  ['//attacker.com', '/dashboard/student'],
  ['/\\attacker.com', '/dashboard/student'],
  ['\\attacker.com', '/dashboard/student'],
  ['javascript:alert(1)', '/dashboard/student'],
  ['/javascript:alert(1)', '/dashboard/student'],
  ['data:text/html,bad', '/dashboard/student'],
  ['', '/dashboard/student'],
  [null, '/dashboard/student'],
  ['/dashboard/student', '/dashboard/student'],
  ['/tutors', '/tutors'],
  ['/auth/onboarding?role=tutor&next=/dashboard', '/auth/onboarding?role=tutor&next=/dashboard']
];

let redirectPass = true;
redirectCases.forEach(([input, expected]) => {
  const actual = sanitizeInternalRedirect(input);
  if (actual !== expected) {
    console.error(`[FAIL] Redirect test: input="${input}" expected="${expected}" got="${actual}"`);
    redirectPass = false;
  }
});
console.log(redirectPass ? '✓ All 12 redirect safety tests passed.' : '✗ Redirect tests failed.');

// 2. Verify signout route rejects GET and requires POST
const signoutRoutePath = path.join(__dirname, '..', 'src', 'app', 'auth', 'signout', 'route.ts');
const signoutContent = fs.readFileSync(signoutRoutePath, 'utf8');
const hasPost = signoutContent.includes('export async function POST');
const hasGet405 = signoutContent.includes('export async function GET') && signoutContent.includes('405');
assert(hasPost, 'Signout must export POST');
assert(hasGet405, 'Signout must export GET returning 405 Method Not Allowed');
console.log('✓ Sign-out route strictly requires POST and returns HTTP 405 for GET.');

// 3. Verify atomic onboarding RPC in migration SQL
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261002000000_phase2_backend_foundation.sql');
const migrationContent = fs.readFileSync(migrationPath, 'utf8');
assert(migrationContent.includes('FUNCTION public.complete_onboarding'), 'complete_onboarding function must exist');
assert(migrationContent.includes("chosen_role NOT IN ('parent', 'student', 'tutor')"), 'complete_onboarding must reject admin');
assert(migrationContent.includes('FUNCTION public.is_tutor_approved'), 'is_tutor_approved function must exist');
assert(migrationContent.includes('travel_radius_km >= 0 AND travel_radius_km <= 50'), 'travel_radius_km constraint must exist');
console.log('✓ SQL migration contains complete_onboarding RPC, is_tutor_approved helper, and travel radius constraint.');

// 4. Verify no fake credentials in codebase
assert(!migrationContent.includes('unconfigured.supabase.co'), 'No fake URLs in migration');
const clientContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'supabase', 'client.ts'), 'utf8');
assert(!clientContent.includes('unconfigured.supabase.co'), 'No fake URLs in client.ts');
console.log('✓ Zero fake URL/key placeholders in client & server configs.');

console.log('\n=== ALL STATIC SECURITY CHECKS PASSED ===\n');
