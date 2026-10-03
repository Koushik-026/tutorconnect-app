/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');

const url = 'https://veiwcumnykvgtszdkpix.supabase.co';
const key = 'sb_publishable_83o1t8Qt7AIwabmJfWI0AA_G7eJDl29';
const supabase = createClient(url, key);

async function runLiveVerification() {
  console.log('=== RUNNING LIVE SUPABASE RLS & SECURITY MATRIX ===\n');
  const results = [];

  // TEST 1: Anonymous cannot read private profiles
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  const t1 = !pErr && Array.isArray(profiles) && profiles.length === 0;
  console.log(t1 ? '✓ TEST 1 PASS' : '✗ TEST 1 FAIL', 'Anonymous cannot read private profiles (count = ' + (profiles ? profiles.length : 'error') + ')');
  results.push({ test: 'Anonymous cannot read private profiles', pass: t1 });

  // TEST 2: Anonymous can read catalogue subjects
  const { data: subjects, error: sErr } = await supabase.from('subjects').select('name, slug');
  const t2 = !sErr && Array.isArray(subjects) && subjects.length === 7;
  console.log(t2 ? '✓ TEST 2 PASS' : '✗ TEST 2 FAIL', 'Anonymous can read catalogue subjects (count = ' + (subjects ? subjects.length : 'error') + ')');
  if (subjects) {
    console.log('   Catalogue subjects:', subjects.map(s => s.name).join(', '));
  }
  results.push({ test: 'Anonymous can read catalogue subjects', pass: t2 });

  // TEST 3: Anonymous cannot see pending or unapproved tutors
  const { data: tutors, error: tErr } = await supabase.from('tutor_profiles').select('*');
  const t3 = !tErr && Array.isArray(tutors) && tutors.length === 0;
  console.log(t3 ? '✓ TEST 3 PASS' : '✗ TEST 3 FAIL', 'Anonymous cannot see pending tutors (count = ' + (tutors ? tutors.length : 'error') + ')');
  results.push({ test: 'Anonymous cannot see pending tutors', pass: t3 });

  // TEST 4: Anonymous cannot read tutor application states
  const { data: appStates, error: aErr } = await supabase.from('tutor_application_states').select('*');
  const t4 = !aErr && Array.isArray(appStates) && appStates.length === 0;
  console.log(t4 ? '✓ TEST 4 PASS' : '✗ TEST 4 FAIL', 'Anonymous cannot read tutor application states (count = ' + (appStates ? appStates.length : 'error') + ')');
  results.push({ test: 'Anonymous cannot read tutor application states', pass: t4 });

  // TEST 5: Anonymous cannot read student profiles
  const { data: studentProfs, error: spErr } = await supabase.from('student_profiles').select('*');
  const t5 = !spErr && Array.isArray(studentProfs) && studentProfs.length === 0;
  console.log(t5 ? '✓ TEST 5 PASS' : '✗ TEST 5 FAIL', 'Anonymous cannot read student profiles (count = ' + (studentProfs ? studentProfs.length : 'error') + ')');
  results.push({ test: 'Anonymous cannot read student profiles', pass: t5 });

  // TEST 6: Anonymous cannot read account roles
  const { data: roles, error: rErr } = await supabase.from('account_roles').select('*');
  const t6 = !rErr && Array.isArray(roles) && roles.length === 0;
  console.log(t6 ? '✓ TEST 6 PASS' : '✗ TEST 6 FAIL', 'Anonymous cannot read account roles (count = ' + (roles ? roles.length : 'error') + ')');
  results.push({ test: 'Anonymous cannot read account roles', pass: t6 });

  // TEST 7: Anonymous cannot insert into profiles
  const { error: insProfErr } = await supabase.from('profiles').insert({ id: '00000000-0000-0000-0000-000000000001', display_name: 'Attacker' });
  const t7 = Boolean(insProfErr);
  console.log(t7 ? '✓ TEST 7 PASS' : '✗ TEST 7 FAIL', 'Anonymous cannot insert into profiles (rejected with code: ' + (insProfErr ? insProfErr.code : 'allowed') + ')');
  results.push({ test: 'Anonymous cannot insert into profiles', pass: t7 });

  // TEST 8: Anonymous cannot insert into account_roles
  const { error: insRoleErr } = await supabase.from('account_roles').insert({ user_id: '00000000-0000-0000-0000-000000000001', role: 'admin' });
  const t8 = Boolean(insRoleErr);
  console.log(t8 ? '✓ TEST 8 PASS' : '✗ TEST 8 FAIL', 'Anonymous cannot insert into account_roles (rejected with code: ' + (insRoleErr ? insRoleErr.code : 'allowed') + ')');
  results.push({ test: 'Anonymous cannot insert into account_roles', pass: t8 });

  // TEST 9: Anonymous cannot call complete_onboarding
  const { error: rpcErr } = await supabase.rpc('complete_onboarding', { chosen_role: 'student' });
  const t9 = Boolean(rpcErr && (rpcErr.code === '42501' || rpcErr.message.includes('permission denied')));
  console.log(t9 ? '✓ TEST 9 PASS' : '✗ TEST 9 FAIL', 'Anonymous cannot execute complete_onboarding RPC (code: ' + (rpcErr ? rpcErr.code : 'none') + ')');
  results.push({ test: 'Anonymous cannot execute complete_onboarding RPC', pass: t9 });

  // TEST 10: Helper functions are NOT exposed in public schema
  const helperRes = await fetch(url + '/rest/v1/rpc/is_admin', {
    method: 'POST',
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: '{}'
  });
  const t10 = helperRes.status === 404;
  console.log(t10 ? '✓ TEST 10 PASS' : '✗ TEST 10 FAIL', 'Internal helper is_admin() is not exposed in public schema (HTTP ' + helperRes.status + ')');
  results.push({ test: 'is_admin() not exposed in public schema', pass: t10 });

  // TEST 11: is_tutor_approved is NOT exposed in public schema
  const approvedRes = await fetch(url + '/rest/v1/rpc/is_tutor_approved', {
    method: 'POST',
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: '{}'
  });
  const t11 = approvedRes.status === 404;
  console.log(t11 ? '✓ TEST 11 PASS' : '✗ TEST 11 FAIL', 'Internal helper is_tutor_approved() is not exposed in public schema (HTTP ' + approvedRes.status + ')');
  results.push({ test: 'is_tutor_approved() not exposed in public schema', pass: t11 });

  // Summary
  const allPass = results.every(r => r.pass);
  console.log('\n=== LIVE VERIFICATION SUMMARY: ' + (allPass ? 'ALL TESTS PASSED' : 'TESTS FAILED') + ' ===\n');
  process.exit(allPass ? 0 : 1);
}

runLiveVerification();
