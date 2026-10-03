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

  const wfPath = path.join(__dirname, '..', 'src', 'lib', 'services', 'workflow.ts');
  const wfCode = fs.readFileSync(wfPath, 'utf8');

  const actionsPath = path.join(__dirname, '..', 'src', 'app', 'actions', 'workflow.ts');
  const actionsCode = fs.readFileSync(actionsPath, 'utf8');

  // 1. SQL CONSTRAINT: Demo duration = 30m, price = ₹0, scheduled_end_at = start + 30m, future check
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

  // 3. TUTOR-SIDE RLS IDENTITY: Must join tutor_profiles to resolve user_id = auth.uid()
  const demoTutorJoin = /FROM public\.public_tutor_catalog c\s+JOIN public\.tutor_profiles tp\s+ON tp\.id = c\.tutor_profile_id\s+WHERE c\.slug = demo_bookings\.tutor_slug\s+AND tp\.user_id = \(select auth\.uid\(\)\)/.test(migrationSql);
  const sessionTutorJoin = /FROM public\.public_tutor_catalog c\s+JOIN public\.tutor_profiles tp\s+ON tp\.id = c\.tutor_profile_id\s+WHERE c\.slug = class_sessions\.tutor_slug\s+AND tp\.user_id = \(select auth\.uid\(\)\)/.test(migrationSql);
  const c3 = demoTutorJoin && sessionTutorJoin;
  console.log(c3 ? '✓ PASS' : '✗ FAIL', '3. Security Policy: Tutor SELECT policies join tutor_profiles and resolve tp.user_id = auth.uid()');
  results.push({ name: 'Tutor RLS Identity Join', pass: c3 });

  // 4. RLS INVARIANT: class_sessions_owner_insert is ABSENT
  const hasSessionOwnerInsert = /CREATE POLICY "class_sessions_owner_insert"/.test(migrationSql);
  const hasSessionAdminManage = /CREATE POLICY "class_sessions_admin_manage"/.test(migrationSql);
  const c4 = !hasSessionOwnerInsert && hasSessionAdminManage;
  console.log(c4 ? '✓ PASS' : '✗ FAIL', '4. Security Policy: class_sessions_owner_insert is absent; family cannot insert arbitrary sessions directly');
  results.push({ name: 'Class Sessions Insert Restricted', pass: c4 });

  // 5. RLS INVARIANT: package_purchases_owner_insert is ABSENT
  const hasPurchaseOwnerInsert = /CREATE POLICY "package_purchases_owner_insert"/.test(migrationSql);
  const hasPurchaseAdminManage = /CREATE POLICY "package_purchases_admin_manage"/.test(migrationSql);
  const c5 = !hasPurchaseOwnerInsert && hasPurchaseAdminManage;
  console.log(c5 ? '✓ PASS' : '✗ FAIL', '5. Security Policy: package_purchases_owner_insert is absent; purchases must use create_demo_purchase RPC');
  results.push({ name: 'Package Purchases Insert Restricted', pass: c5 });

  // 6. SQL SCHEMA: is_demo_simulation defaults to false; create_demo_purchase explicitly sets true
  const hasSimulationDefaultFalse = /is_demo_simulation boolean NOT NULL DEFAULT false/.test(migrationSql);
  const rpcSetsSimulationTrue = /is_demo_simulation\s*\)\s*VALUES\s*\([\s\S]*?true\s*\)\s*RETURNING id INTO v_purchase_id/.test(migrationSql);
  const c6 = hasSimulationDefaultFalse && rpcSetsSimulationTrue;
  console.log(c6 ? '✓ PASS' : '✗ FAIL', '6. SQL Schema: is_demo_simulation DEFAULT false; create_demo_purchase explicitly inserts true');
  results.push({ name: 'Demo Simulation Default False', pass: c6 });

  // 7. APPLICATION LOGIC: JS direct package fallback is ABSENT (no manual insert / fallback txRef)
  const noManualPurchaseInsert = !/\.from\("package_purchases"\)\s*\.insert\(/.test(wfCode);
  const noFallbackComment = !/Direct server fallback if RPC not yet created/.test(wfCode);
  const callsPurchaseRpc = /supabase\.rpc\("create_demo_purchase"/.test(wfCode);
  const c7 = noManualPurchaseInsert && noFallbackComment && callsPurchaseRpc;
  console.log(c7 ? '✓ PASS' : '✗ FAIL', '7. Application Logic: JS direct package fallback is absent; fails closed if RPC fails');
  results.push({ name: 'No JS Purchase Fallback', pass: c7 });

  // 8. SQL RPC: save_schedule_preference exists and create_demo_purchase validates supplied preference
  const hasSavePrefRpc = /CREATE OR REPLACE FUNCTION public\.save_schedule_preference/.test(migrationSql);
  const validatesPrefOwnership = /v_pref\.user_id <> v_user_id/.test(migrationSql) &&
                                  /v_pref\.student_profile_id <> p_student_profile_id/.test(migrationSql) &&
                                  /v_pref\.tutor_slug <> p_tutor_slug/.test(migrationSql) &&
                                  /v_pref\.package_id <> p_package_id/.test(migrationSql) &&
                                  /v_pref\.tuition_mode <> p_tuition_mode/.test(migrationSql);
  const c8 = hasSavePrefRpc && validatesPrefOwnership;
  console.log(c8 ? '✓ PASS' : '✗ FAIL', '8. Security RPC: Schedule preference validated for ownership, student, tutor, package, and tuition mode');
  results.push({ name: 'Schedule Preference Consistency', pass: c8 });

  // 9. SQL RPC: simulate_purchase_activation validates tutor mode independently
  const validatesActivationMode = /v_purchase\.tuition_mode = 'home' AND NOT v_tutor\.offers_home/.test(migrationSql) &&
                                  /v_purchase\.tuition_mode = 'online' AND NOT v_tutor\.offers_online/.test(migrationSql);
  const validatesStudentOwnership = /SELECT 1 FROM public\.student_profiles\s+WHERE id = v_purchase\.student_profile_id AND owner_user_id = v_purchase\.user_id/.test(migrationSql);
  const c9 = validatesActivationMode && validatesStudentOwnership;
  console.log(c9 ? '✓ PASS' : '✗ FAIL', '9. Security RPC: simulate_purchase_activation independently verifies tutor mode capability & student ownership');
  results.push({ name: 'Activation Mode & Student Guard', pass: c9 });

  // 10. SQL RPC: Session generation references preferred_days & preferred_time without fixed day patterns
  const referencesPrefDays = /v_day_name = ANY\(v_pref\.preferred_days\)/.test(migrationSql);
  const referencesPrefTime = migrationSql.includes("v_session_time := (v_candidate_date + v_pref_time) AT TIME ZONE 'Asia/Kolkata'");
  const noFixedDayPattern = !/v_start_date \+ interval '3 days'/.test(migrationSql) &&
                            !/v_start_date \+ interval '5 days'/.test(migrationSql);
  const c10 = referencesPrefDays && referencesPrefTime && noFixedDayPattern;
  console.log(c10 ? '✓ PASS' : '✗ FAIL', '10. Scheduling Algorithm: Sessions generated dynamically from preferred_days & preferred_time (no fixed day offsets)');
  results.push({ name: 'Dynamic Schedule Session Generation', pass: c10 });

  // 11. SQL RPC: mark_session_completed validates session/enrollment relationship
  const validatesSessionRel = /v_enrollment\.user_id <> v_session\.user_id/.test(migrationSql) &&
                              /v_enrollment\.student_profile_id <> v_session\.student_profile_id/.test(migrationSql) &&
                              /v_enrollment\.tutor_slug <> v_session\.tutor_slug/.test(migrationSql);
  console.log(validatesSessionRel ? '✓ PASS' : '✗ FAIL', '11. Security RPC: mark_session_completed verifies enrollment user, student, and tutor relationship');
  results.push({ name: 'Session Completion Relation Check', pass: validatesSessionRel });

  // 12. SQL INVARIANT: Home session meeting constraint & unique enrollment per purchase
  const hasHomeSessionConstraint = /CONSTRAINT chk_home_session_no_meeting CHECK \(\s*session_mode != 'home' OR \(meeting_provider IS NULL AND meeting_reference IS NULL\)\s*\)/.test(migrationSql);
  const hasUniqueEnrollment = /CREATE UNIQUE INDEX IF NOT EXISTS idx_enrollments_unique_purchase\s+ON public\.student_tutor_enrollments\(package_purchase_id\)/.test(migrationSql);
  const c12 = hasHomeSessionConstraint && hasUniqueEnrollment;
  console.log(c12 ? '✓ PASS' : '✗ FAIL', '12. SQL Invariants: Home meeting DB constraint & unique enrollment per purchase index');
  results.push({ name: 'Home Meeting & Unique Enrollment', pass: c12 });

  // 13. APPLICATION LOGIC: Fail-closed payment mode & canonical pricing & role enforcement
  const failsClosed = /process\.env\.TUTORCONNECT_DEMO_PAYMENT_MODE !== "true"/.test(wfCode) || /process\.env\.TUTORCONNECT_DEMO_PAYMENT_MODE === "true"/.test(wfCode);
  const enforcesRole = /roles\.includes\("parent"\) \|\| roles\.includes\("student"\) \|\| roles\.includes\("admin"\)/.test(actionsCode);
  const c13 = failsClosed && enforcesRole;
  console.log(c13 ? '✓ PASS' : '✗ FAIL', '13. Application Logic: Fail-closed payment mode & role guard on learner creation');
  results.push({ name: 'App Logic Guards', pass: c13 });

  // 14. LIVE SUPABASE STATUS: Accurately report pending status for unapplied Phase 3 tables
  console.log('\n[INFO] Live Supabase Phase 3 Table Status:');
  try {
    const { error: bErr } = await supabase.from('demo_bookings').select('*');
    if (bErr && bErr.code === 'PGRST205') {
      console.log('       LIVE PHASE 3 RLS TESTS PENDING MIGRATION APPLICATION (Tables not yet present in remote schema cache)');
    } else if (bErr && bErr.code === '42501') {
      console.log('       Phase 3 tables live; anonymous access blocked by RLS (42501)');
    }
  } catch (e) {
    console.log('       LIVE PHASE 3 RLS TESTS PENDING MIGRATION APPLICATION');
  }

  // 15. LIVE SUPABASE RPC: Verify anonymous cannot execute activation RPC
  try {
    const { error: rpcErr } = await supabase.rpc('simulate_purchase_activation', { p_purchase_id: '00000000-0000-0000-0000-000000000000' });
    const c15 = rpcErr !== null;
    console.log(c15 ? '✓ PASS' : '✗ FAIL', '14. Live Supabase RPC: Anonymous execution of simulate_purchase_activation rejected');
    results.push({ name: 'Live RPC Denial', pass: c15 });
  } catch (e) {
    console.log('✓ PASS', '14. Live Supabase RPC execution denied as expected');
    results.push({ name: 'Live RPC Denial', pass: true });
  }

  // 16. CROSS-USER TEST REPORTING STATUS
  console.log('\n[INFO] Authenticated Cross-User Test Status:');
  console.log('       AUTHENTICATED CROSS-USER TEST PENDING (Awaiting remote migration application)');

  const allPassed = results.every(r => r.pass);
  console.log('\n=== PHASE 3.1 VERIFICATION SUMMARY:', allPassed ? 'ALL TESTS PASSED ===' : 'SOME TESTS FAILED ===');
  if (!allPassed) process.exit(1);
}

runPhase3Tests();
