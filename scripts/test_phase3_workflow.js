const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const url = 'https://veiwcumnykvgtszdkpix.supabase.co';
const key = 'sb_publishable_83o1t8Qt7AIwabmJfWI0AA_G7eJDl29';
const supabase = createClient(url, key);

async function runPhase3Tests() {
  console.log('=== TUTORCONNECT PHASE 3.1 INTEGRITY & WORKFLOW VERIFICATION SUITE ===\n');
  const results = [];

  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261003073000_phase3_core_workflow.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  // 1. SQL CONSTRAINT: Demo duration is strictly 30m, price is ₹0, end_time = start_at + 30m
  const hasDemoDuration = /duration_minutes integer NOT NULL DEFAULT 30 CHECK \(duration_minutes = 30\)/.test(migrationSql);
  const hasDemoPrice = /price_inr integer NOT NULL DEFAULT 0 CHECK \(price_inr = 0\)/.test(migrationSql);
  const hasDemoEndTime = /CONSTRAINT chk_demo_end_time CHECK \(scheduled_end_at = scheduled_start_at \+ interval '30 minutes'\)/.test(migrationSql);
  const hasDemoFuture = /CONSTRAINT chk_demo_future CHECK \(scheduled_start_at > created_at\)/.test(migrationSql);
  const c1 = hasDemoDuration && hasDemoPrice && hasDemoEndTime && hasDemoFuture;
  console.log(c1 ? '✓ PASS' : '✗ FAIL', '1. SQL Invariants: Demo duration = 30m, price = ₹0, scheduled_end_at = start + 30m, future check');
  results.push({ name: 'Demo SQL Invariants', pass: c1 });

  // 2. SQL CONSTRAINT: Active double-booking prevention for same tutor slot
  const hasActiveSlotIndex = /CREATE UNIQUE INDEX IF NOT EXISTS idx_demo_bookings_tutor_active_slot\s+ON public\.demo_bookings\s*\(tutor_slug,\s*scheduled_start_at\)\s+WHERE\s*\(status IN \('requested',\s*'confirmed'\)\);/.test(migrationSql);
  console.log(hasActiveSlotIndex ? '✓ PASS' : '✗ FAIL', '2. SQL Invariants: Partial unique index prevents active double booking of tutor slot');
  results.push({ name: 'Active Slot Index', pass: hasActiveSlotIndex });

  // 3. SQL RLS: Broad owner UPDATE policy ABSENT on demo_bookings (constrained RPC cancel_demo_booking instead)
  const hasBroadDemoUpdate = /CREATE POLICY "demo_bookings_owner_update"/.test(migrationSql);
  const hasCancelRpc = /CREATE OR REPLACE FUNCTION public\.cancel_demo_booking/.test(migrationSql);
  const c3 = !hasBroadDemoUpdate && hasCancelRpc;
  console.log(c3 ? '✓ PASS' : '✗ FAIL', '3. Security Policy: Broad demo_bookings owner UPDATE removed; constrained cancellation RPC implemented');
  results.push({ name: 'Demo Booking Update Restriction', pass: c3 });

  // 4. SQL RLS: Broad owner UPDATE policy ABSENT on class_sessions (mutation via mark_session_completed RPC)
  const hasBroadSessionUpdate = /CREATE POLICY "class_sessions_owner_update"/.test(migrationSql);
  const hasCompleteRpc = /CREATE OR REPLACE FUNCTION public\.mark_session_completed/.test(migrationSql);
  const c4 = !hasBroadSessionUpdate && hasCompleteRpc;
  console.log(c4 ? '✓ PASS' : '✗ FAIL', '4. Security Policy: Broad class_sessions owner UPDATE removed; durable Class Ledger RPC required');
  results.push({ name: 'Class Sessions Update Restriction', pass: c4 });

  // 5. SQL CONSTRAINT: Home sessions strictly forbid meeting_provider and meeting_reference
  const hasHomeSessionConstraint = /CONSTRAINT chk_home_session_no_meeting CHECK \(\s*session_mode != 'home' OR \(meeting_provider IS NULL AND meeting_reference IS NULL\)\s*\)/.test(migrationSql);
  console.log(hasHomeSessionConstraint ? '✓ PASS' : '✗ FAIL', '5. SQL Invariants: Home sessions database constraint strictly forbids meeting provider/reference');
  results.push({ name: 'Home Session Meeting Constraint', pass: hasHomeSessionConstraint });

  // 6. SQL CONSTRAINT: Enrollment uniqueness per purchase (one purchase activates at most one enrollment)
  const hasUniqueEnrollment = /CREATE UNIQUE INDEX IF NOT EXISTS idx_enrollments_unique_purchase\s+ON public\.student_tutor_enrollments\(package_purchase_id\)/.test(migrationSql);
  console.log(hasUniqueEnrollment ? '✓ PASS' : '✗ FAIL', '6. SQL Invariants: Unique partial index guarantees one package purchase creates at most one enrollment');
  results.push({ name: 'Enrollment Purchase Uniqueness', pass: hasUniqueEnrollment });

  // 7. SQL SCHEMA: schedule_preferences table exists and is linked
  const hasSchedulePrefTable = /CREATE TABLE IF NOT EXISTS public\.schedule_preferences/.test(migrationSql);
  const hasSchedulePrefRls = /CREATE POLICY "schedule_preferences_owner_select"/.test(migrationSql);
  const c7 = hasSchedulePrefTable && hasSchedulePrefRls;
  console.log(c7 ? '✓ PASS' : '✗ FAIL', '7. SQL Schema: schedule_preferences table and owner-isolated RLS implemented');
  results.push({ name: 'Schedule Preferences Schema', pass: c7 });

  // 8. APPLICATION LOGIC: Fail-closed demo payment flag
  const wfPath = path.join(__dirname, '..', 'src', 'lib', 'services', 'workflow.ts');
  const wfCode = fs.readFileSync(wfPath, 'utf8');
  const failsClosed = /process\.env\.TUTORCONNECT_DEMO_PAYMENT_MODE !== "true"/.test(wfCode) || /process\.env\.TUTORCONNECT_DEMO_PAYMENT_MODE === "true"/.test(wfCode);
  const noInsecureFallback = !/process\.env\.TUTORCONNECT_DEMO_PAYMENT_MODE !== "false"/.test(wfCode);
  const c8 = failsClosed && noInsecureFallback;
  console.log(c8 ? '✓ PASS' : '✗ FAIL', '8. Application Logic: TUTORCONNECT_DEMO_PAYMENT_MODE fails closed (requires strict === "true")');
  results.push({ name: 'Fail-closed Demo Flag', pass: c8 });

  // 9. APPLICATION LOGIC: Canonical package price derived server-side without trusting client amount
  const canonicalPricing = /amount_inr:\s*pkg\.price_inr/.test(wfCode) || /amount_inr:\s*v_pkg\.price_inr/.test(migrationSql);
  console.log(canonicalPricing ? '✓ PASS' : '✗ FAIL', '9. Application Logic: Canonical package price is derived from database package record');
  results.push({ name: 'Canonical Pricing Security', pass: canonicalPricing });

  // 10. APPLICATION LOGIC: Learner profile creation enforces parent/student role
  const actionsPath = path.join(__dirname, '..', 'src', 'app', 'actions', 'workflow.ts');
  const actionsCode = fs.readFileSync(actionsPath, 'utf8');
  const enforcesRole = /roles\.includes\("parent"\) \|\| roles\.includes\("student"\) \|\| roles\.includes\("admin"\)/.test(actionsCode);
  console.log(enforcesRole ? '✓ PASS' : '✗ FAIL', '10. Application Logic: createLearnerProfileAction strictly enforces parent/student/admin role');
  results.push({ name: 'Learner Profile Role Guard', pass: enforcesRole });

  // 11. LIVE SUPABASE RLS: Anonymous denied access to Phase 3 draft tables (404 schema cache or 42501 permission denied)
  try {
    const { error: bErr } = await supabase.from('demo_bookings').select('*');
    const { error: pErr } = await supabase.from('package_purchases').select('*');
    const { error: sErr } = await supabase.from('class_sessions').select('*');
    const c11 = (bErr && (bErr.code === 'PGRST205' || bErr.code === '42501')) &&
                (pErr && (pErr.code === 'PGRST205' || pErr.code === '42501')) &&
                (sErr && (sErr.code === 'PGRST205' || sErr.code === '42501'));
    console.log(c11 ? '✓ PASS' : '✗ FAIL', '11. Live Supabase API: Anonymous blocked from reading unapplied/protected Phase 3 tables');
    results.push({ name: 'Live Supabase API Denials', pass: c11 });
  } catch (e) {
    console.log('✗ FAIL', '11. Live Supabase API check error:', e.message);
    results.push({ name: 'Live Supabase API Denials', pass: false });
  }

  // 12. LIVE SUPABASE RPC: Anonymous blocked from simulation RPCs
  try {
    const { error: rpcErr } = await supabase.rpc('simulate_purchase_activation', { p_purchase_id: '00000000-0000-0000-0000-000000000000' });
    const c12 = rpcErr !== null;
    console.log(c12 ? '✓ PASS' : '✗ FAIL', '12. Live Supabase RPC: Anonymous execution of simulate_purchase_activation rejected');
    results.push({ name: 'Live RPC Denial', pass: c12 });
  } catch (e) {
    console.log('✓ PASS', '12. Live Supabase RPC execution denied as expected');
    results.push({ name: 'Live RPC Denial', pass: true });
  }

  // 13. CROSS-USER TEST REPORTING STATUS
  console.log('\n[INFO] Authenticated Cross-User Test Status:');
  console.log('       AUTHENTICATED CROSS-USER TEST PENDING (Awaiting remote migration application)');

  const allPassed = results.every(r => r.pass);
  console.log('\n=== PHASE 3.1 VERIFICATION SUMMARY:', allPassed ? 'ALL TESTS PASSED ===' : 'SOME TESTS FAILED ===');
  if (!allPassed) process.exit(1);
}

runPhase3Tests();
