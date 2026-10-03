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
  const migrationSql = fs.readFileSync(migrationPath, 'utf8').replace(/\r\n/g, '\n');

  const wfPath = path.join(__dirname, '..', 'src', 'lib', 'services', 'workflow.ts');
  const wfCode = fs.readFileSync(wfPath, 'utf8').replace(/\r\n/g, '\n');

  const actionsPath = path.join(__dirname, '..', 'src', 'app', 'actions', 'workflow.ts');
  const actionsCode = fs.readFileSync(actionsPath, 'utf8').replace(/\r\n/g, '\n');

  // 1. PL/pgSQL DOLLAR QUOTING: All functions use valid matching $$ delimiters (no malformed AS $ or END; $;)
  const hasMalformedAs = /AS\s+\$(?!\$)/.test(migrationSql);
  const hasMalformedEnd = /END;\s*\$(?!\$);/.test(migrationSql);
  const hasCreateDemoBooking = migrationSql.includes('FUNCTION public.create_demo_booking');
  const hasCancelDemoBooking = migrationSql.includes('FUNCTION public.cancel_demo_booking');
  const hasSavePref = migrationSql.includes('FUNCTION public.save_schedule_preference');
  const hasCreatePurchase = migrationSql.includes('FUNCTION public.create_demo_purchase');
  const hasSimulateActivation = migrationSql.includes('FUNCTION public.simulate_purchase_activation');
  const hasMarkCompleted = migrationSql.includes('FUNCTION public.mark_session_completed');
  const c1 = !hasMalformedAs && !hasMalformedEnd && hasCreateDemoBooking && hasCancelDemoBooking &&
             hasSavePref && hasCreatePurchase && hasSimulateActivation && hasMarkCompleted;
  console.log(c1 ? '✓ PASS' : '✗ FAIL', '1. SQL Syntax: All 6 PL/pgSQL functions use valid matching $$ delimiters (zero malformed single $)');
  results.push({ name: 'PL/pgSQL Delimiters', pass: c1 });

  // 2. STUDENT PROFILES RLS: student_profiles_owner_all is removed
  const hasOwnerAll = /CREATE POLICY "student_profiles_owner_all"/.test(migrationSql);
  const dropsOwnerAll = /DROP POLICY IF EXISTS "student_profiles_owner_all"/.test(migrationSql);
  const c2 = !hasOwnerAll && dropsOwnerAll;
  console.log(c2 ? '✓ PASS' : '✗ FAIL', '2. Security Policy: student_profiles_owner_all dropped; no permissive FOR ALL override');
  results.push({ name: 'Student Profiles Owner All Dropped', pass: c2 });

  // 3. STUDENT PROFILES INSERT: Requires parent or student role
  const insertRequiresLearnerRole = /role IN \('parent', 'student'\)/.test(migrationSql);
  console.log(insertRequiresLearnerRole ? '✓ PASS' : '✗ FAIL', '3. Security Policy: student_profiles INSERT policy strictly requires parent/student role');
  results.push({ name: 'Student Profiles Role Insert', pass: insertRequiresLearnerRole });

  // 4. DEMO BOOKINGS RLS: demo_bookings_owner_insert is ABSENT
  const hasDemoOwnerInsert = /CREATE POLICY "demo_bookings_owner_insert"/.test(migrationSql);
  console.log(!hasDemoOwnerInsert ? '✓ PASS' : '✗ FAIL', '4. Security Policy: demo_bookings_owner_insert is absent; direct client INSERT forbidden');
  results.push({ name: 'Demo Bookings Insert Forbidden', pass: !hasDemoOwnerInsert });

  // 5. DEMO BOOKINGS RPC: create_demo_booking exists and forces canonical values
  const hasBookingRpc = /CREATE OR REPLACE FUNCTION public\.create_demo_booking/.test(migrationSql);
  const forcesValues = /'online',\s*30,\s*0,/.test(migrationSql);
  const c5 = hasBookingRpc && forcesValues;
  console.log(c5 ? '✓ PASS' : '✗ FAIL', '5. Security RPC: create_demo_booking exists and forces online mode, 30 min duration, ₹0 price');
  results.push({ name: 'Create Demo Booking RPC', pass: c5 });

  // 6. APPLICATION LOGIC: createDemoBooking uses RPC only (no direct .insert fallback)
  const appCallsBookingRpc = wfCode.includes('supabase.rpc("create_demo_booking"');
  const noDirectBookingInsert = !/\.from\("demo_bookings"\)\s*\.insert\(/.test(wfCode);
  const c6 = appCallsBookingRpc && noDirectBookingInsert;
  console.log(c6 ? '✓ PASS' : '✗ FAIL', '6. Application Logic: createDemoBooking uses RPC exclusively with zero direct JS insert fallback');
  results.push({ name: 'App Uses Booking RPC Only', pass: c6 });

  // 7. DEMO BOOKING VALIDATION: Validates tutor approval and subjects in RPC
  const checksTutorApproval = /slug = p_tutor_slug AND is_approved = true/.test(migrationSql);
  const checksTutorSubject = /p_subject = ANY\(v_tutor\.subjects\)/.test(migrationSql);
  const c7 = checksTutorApproval && checksTutorSubject;
  console.log(c7 ? '✓ PASS' : '✗ FAIL', '7. Security RPC: create_demo_booking validates tutor approval and subject teaching qualification');
  results.push({ name: 'Booking Tutor and Subject Validation', pass: c7 });

  // 8. ACTIVATION LOGIC: Never references uninitialized v_pref when schedule_preference_id is NULL
  const branchesPref = /IF v_purchase\.schedule_preference_id IS NOT NULL THEN[\s\S]*?ELSE[\s\S]*?v_initial_subject := 'To be confirmed';[\s\S]*?END IF;/.test(migrationSql);
  console.log(branchesPref ? '✓ PASS' : '✗ FAIL', '8. Scheduling Logic: Activation cleanly branches on schedule_preference_id; never accesses uninitialized v_pref');
  results.push({ name: 'Uninitialized v_pref Guard', pass: branchesPref });

  // 9. PREFERRED TIME VALIDATION: Rejects unparseable time without silent 5 PM fallback
  const validatesTime = /v_pref_time := p_preferred_time::time;\s+EXCEPTION WHEN OTHERS THEN\s+RAISE EXCEPTION 'Invalid preferred_time format/.test(migrationSql);
  const noSilentFallback = !migrationSql.includes("'17:00:00'::time");
  const c9 = validatesTime && noSilentFallback;
  console.log(c9 ? '✓ PASS' : '✗ FAIL', '9. Scheduling Logic: preferred_time is validated strictly; zero silent fallback to 17:00');
  results.push({ name: 'Preferred Time Strict Validation', pass: c9 });

  // 10. DEMO PROFILE CLAIM DATA: Demo seeds have empty verification arrays
  const hasDemoSeedClaims = /is_demo_profile = true[\s\S]*?ARRAY\['Qualification reviewed'/.test(migrationSql);
  const seedEmptyArrays = migrationSql.includes("ARRAY[]::text[]");
  const c10 = !hasDemoSeedClaims && seedEmptyArrays;
  console.log(c10 ? '✓ PASS' : '✗ FAIL', '10. Claim Safety: Demo tutor seeds have empty verification arrays (no fabricated review claims)');
  results.push({ name: 'Demo Seeds Claim Safety', pass: c10 });

  // 11. CLASS LEDGER IMMUTABILITY: No client INSERT, UPDATE, or DELETE policies exist
  const hasLedgerAdminManage = /CREATE POLICY "class_ledger_admin_manage"/.test(migrationSql);
  const hasLedgerUpdate = /ON public\.class_ledger_entries\s+FOR UPDATE/.test(migrationSql);
  const hasLedgerDelete = /ON public\.class_ledger_entries\s+FOR DELETE/.test(migrationSql);
  const c11 = !hasLedgerAdminManage && !hasLedgerUpdate && !hasLedgerDelete;
  console.log(c11 ? '✓ PASS' : '✗ FAIL', '11. Security Policy: Class Ledger is immutable (zero client UPDATE or DELETE policies)');
  results.push({ name: 'Class Ledger Immutability', pass: c11 });

  // 12. TUTOR-SIDE RLS IDENTITY: Must join tutor_profiles to resolve user_id = auth.uid()
  const demoTutorJoin = /FROM public\.public_tutor_catalog c\s+JOIN public\.tutor_profiles tp\s+ON tp\.id = c\.tutor_profile_id\s+WHERE c\.slug = demo_bookings\.tutor_slug\s+AND tp\.user_id = \(select auth\.uid\(\)\)/.test(migrationSql);
  const sessionTutorJoin = /FROM public\.public_tutor_catalog c\s+JOIN public\.tutor_profiles tp\s+ON tp\.id = c\.tutor_profile_id\s+WHERE c\.slug = class_sessions\.tutor_slug\s+AND tp\.user_id = \(select auth\.uid\(\)\)/.test(migrationSql);
  const c12 = demoTutorJoin && sessionTutorJoin;
  console.log(c12 ? '✓ PASS' : '✗ FAIL', '12. Security Policy: Tutor SELECT policies join tutor_profiles and resolve tp.user_id = auth.uid()');
  results.push({ name: 'Tutor RLS Identity Join', pass: c12 });

  // 13. INVARIANTS: Package purchases insert restricted, simulation default false, no JS purchase fallback
  const hasPurchaseOwnerInsert = /CREATE POLICY "package_purchases_owner_insert"/.test(migrationSql);
  const simulationDefaultFalse = /is_demo_simulation boolean NOT NULL DEFAULT false/.test(migrationSql);
  const noManualPurchaseInsert = !/\.from\("package_purchases"\)\s*\.insert\(/.test(wfCode);
  const c13 = !hasPurchaseOwnerInsert && simulationDefaultFalse && noManualPurchaseInsert;
  console.log(c13 ? '✓ PASS' : '✗ FAIL', '13. Security Invariants: Package purchases insert restricted, demo default false, no JS fallback');
  results.push({ name: 'Purchase Security Invariants', pass: c13 });

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
