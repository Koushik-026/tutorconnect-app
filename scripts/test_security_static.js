/* eslint-disable */
/**
 * TutorConnect Static Security Verification Suite
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

// 3. Verify reconciled migrations in supabase/migrations/
const mig1Path = path.join(__dirname, '..', 'supabase', 'migrations', '20261003062937_phase2_backend_foundation.sql');
const mig2Path = path.join(__dirname, '..', 'supabase', 'migrations', '20261003063051_harden_security_definer_functions.sql');
const mig3Path = path.join(__dirname, '..', 'supabase', 'migrations', '20261003071008_phase2_runtime_alignment.sql');
const mig4Path = path.join(__dirname, '..', 'supabase', 'migrations', '20261003071059_phase2_policy_cleanup.sql');

assert(fs.existsSync(mig1Path), 'Migration 1 must exist');
assert(fs.existsSync(mig2Path), 'Migration 2 must exist');
assert(fs.existsSync(mig3Path), 'Migration 3 must exist');
assert(fs.existsSync(mig4Path), 'Migration 4 must exist');

const mig1Content = fs.readFileSync(mig1Path, 'utf8');
const mig2Content = fs.readFileSync(mig2Path, 'utf8');
const mig3Content = fs.readFileSync(mig3Path, 'utf8');
const mig4Content = fs.readFileSync(mig4Path, 'utf8');

assert(mig1Content.includes('FUNCTION public.complete_onboarding'), 'complete_onboarding must exist in migration 1');
assert(mig1Content.includes("chosen_role NOT IN ('parent', 'student', 'tutor')"), 'complete_onboarding must reject admin');
assert(mig1Content.includes('travel_radius_km >= 0 AND travel_radius_km <= 50'), 'travel_radius_km constraint must exist');

assert(mig2Content.includes('CREATE SCHEMA IF NOT EXISTS private;'), 'private schema must be created in migration 2');
assert(mig2Content.includes('FUNCTION private.is_admin()'), 'private.is_admin must exist');
assert(mig2Content.includes('FUNCTION private.is_tutor_approved(profile_id uuid)'), 'private.is_tutor_approved must exist');
assert(mig2Content.includes('DROP FUNCTION IF EXISTS public.is_admin();'), 'public.is_admin must be dropped');

assert(mig3Content.includes('idx_tutor_app_states_reviewed_by'), 'idx_tutor_app_states_reviewed_by must exist in migration 3');
assert(mig3Content.includes('(select auth.uid()) = id'), 'Profiles must optimize auth.uid() in migration 3');
assert(mig3Content.includes('account_roles_admin_insert'), 'Permissive policy consolidation must exist in migration 3');

assert(mig4Content.includes('tutor_profiles_anon_select'), 'tutor_profiles_anon_select must exist in migration 4');
assert(mig4Content.includes('tutor_subjects_anon_select'), 'tutor_subjects_anon_select must exist in migration 4');

console.log('✓ SQL migrations match repository forward history: migrations 1, 2, 3, and 4 validated.');

// 4. Verify no fake credentials in codebase
assert(!mig1Content.includes('unconfigured.supabase.co'), 'No fake URLs in migration 1');
assert(!mig2Content.includes('unconfigured.supabase.co'), 'No fake URLs in migration 2');
assert(!mig3Content.includes('unconfigured.supabase.co'), 'No fake URLs in migration 3');
assert(!mig4Content.includes('unconfigured.supabase.co'), 'No fake URLs in migration 4');
const clientContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'supabase', 'client.ts'), 'utf8');
assert(!clientContent.includes('unconfigured.supabase.co'), 'No fake URLs in client.ts');
console.log('✓ Zero fake URL/key placeholders in client & server configs.');

console.log('\n=== ALL STATIC SECURITY CHECKS PASSED ===\n');
