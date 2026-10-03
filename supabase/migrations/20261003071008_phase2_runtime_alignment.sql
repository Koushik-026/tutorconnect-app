-- ============================================================================
-- Migration: 20261003064500_phase2_runtime_alignment.sql
-- Description: Phase 2 Runtime Alignment & Performance Optimization
--   1. Add missing index on tutor_application_states(reviewed_by)
--   2. Replace auth.uid() with (select auth.uid()) in RLS expressions
--      to eliminate auth_rls_initplan performance warnings.
--   3. Consolidate multiple permissive policies on account_roles, subjects,
--      and tutor_application_states by separating admin mutation (INSERT,
--      UPDATE, DELETE) from SELECT, preserving identical security semantics.
-- ============================================================================

-- 1. Missing Foreign Key Index
CREATE INDEX IF NOT EXISTS idx_tutor_app_states_reviewed_by
  ON public.tutor_application_states(reviewed_by);

-- 2. Profiles: Optimize auth.uid() to (select auth.uid())
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id OR private.is_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- 3. Account Roles: Optimize auth.uid() and Consolidate Permissive Policies
DROP POLICY IF EXISTS "account_roles_select_own_or_admin" ON public.account_roles;
CREATE POLICY "account_roles_select_own_or_admin"
  ON public.account_roles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

DROP POLICY IF EXISTS "account_roles_admin_manage" ON public.account_roles;
DROP POLICY IF EXISTS "account_roles_admin_insert" ON public.account_roles;
DROP POLICY IF EXISTS "account_roles_admin_update" ON public.account_roles;
DROP POLICY IF EXISTS "account_roles_admin_delete" ON public.account_roles;

CREATE POLICY "account_roles_admin_insert"
  ON public.account_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (private.is_admin());

CREATE POLICY "account_roles_admin_update"
  ON public.account_roles
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "account_roles_admin_delete"
  ON public.account_roles
  FOR DELETE
  TO authenticated
  USING (private.is_admin());

-- 4. Student Profiles: Optimize auth.uid() to (select auth.uid())
DROP POLICY IF EXISTS "student_profiles_owner_all" ON public.student_profiles;
CREATE POLICY "student_profiles_owner_all"
  ON public.student_profiles
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) = owner_user_id OR private.is_admin())
  WITH CHECK ((select auth.uid()) = owner_user_id OR private.is_admin());

-- 5. Tutor Profiles: Optimize auth.uid() to (select auth.uid())
DROP POLICY IF EXISTS "tutor_profiles_select" ON public.tutor_profiles;
CREATE POLICY "tutor_profiles_select"
  ON public.tutor_profiles
  FOR SELECT
  TO public
  USING (
    (select auth.uid()) = user_id
    OR private.is_tutor_approved(id)
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "tutor_profiles_insert_own" ON public.tutor_profiles;
CREATE POLICY "tutor_profiles_insert_own"
  ON public.tutor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id OR private.is_admin());

DROP POLICY IF EXISTS "tutor_profiles_update_own" ON public.tutor_profiles;
CREATE POLICY "tutor_profiles_update_own"
  ON public.tutor_profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin())
  WITH CHECK ((select auth.uid()) = user_id OR private.is_admin());

-- 6. Tutor Application States: Optimize auth.uid() and Consolidate Permissive Policies
DROP POLICY IF EXISTS "tutor_app_states_select" ON public.tutor_application_states;
CREATE POLICY "tutor_app_states_select"
  ON public.tutor_application_states
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_application_states.tutor_profile_id
        AND user_id = (select auth.uid())
    )
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "tutor_app_states_admin_manage" ON public.tutor_application_states;
DROP POLICY IF EXISTS "tutor_app_states_admin_insert" ON public.tutor_application_states;
DROP POLICY IF EXISTS "tutor_app_states_admin_update" ON public.tutor_application_states;
DROP POLICY IF EXISTS "tutor_app_states_admin_delete" ON public.tutor_application_states;

CREATE POLICY "tutor_app_states_admin_insert"
  ON public.tutor_application_states
  FOR INSERT
  TO authenticated
  WITH CHECK (private.is_admin());

CREATE POLICY "tutor_app_states_admin_update"
  ON public.tutor_application_states
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "tutor_app_states_admin_delete"
  ON public.tutor_application_states
  FOR DELETE
  TO authenticated
  USING (private.is_admin());

-- 7. Subjects: Consolidate Permissive Policies
DROP POLICY IF EXISTS "subjects_public_read" ON public.subjects;
CREATE POLICY "subjects_public_read"
  ON public.subjects
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "subjects_admin_manage" ON public.subjects;
DROP POLICY IF EXISTS "subjects_admin_insert" ON public.subjects;
DROP POLICY IF EXISTS "subjects_admin_update" ON public.subjects;
DROP POLICY IF EXISTS "subjects_admin_delete" ON public.subjects;

CREATE POLICY "subjects_admin_insert"
  ON public.subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (private.is_admin());

CREATE POLICY "subjects_admin_update"
  ON public.subjects
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "subjects_admin_delete"
  ON public.subjects
  FOR DELETE
  TO authenticated
  USING (private.is_admin());

-- 8. Tutor Subjects: Optimize auth.uid() to (select auth.uid())
DROP POLICY IF EXISTS "tutor_subjects_select" ON public.tutor_subjects;
CREATE POLICY "tutor_subjects_select"
  ON public.tutor_subjects
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_subjects.tutor_profile_id
        AND (
          user_id = (select auth.uid())
          OR private.is_tutor_approved(id)
        )
    )
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "tutor_subjects_owner_insert" ON public.tutor_subjects;
CREATE POLICY "tutor_subjects_owner_insert"
  ON public.tutor_subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_subjects.tutor_profile_id
        AND user_id = (select auth.uid())
    )
    OR private.is_admin()
  );

DROP POLICY IF EXISTS "tutor_subjects_owner_delete" ON public.tutor_subjects;
CREATE POLICY "tutor_subjects_owner_delete"
  ON public.tutor_subjects
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_subjects.tutor_profile_id
        AND user_id = (select auth.uid())
    )
    OR private.is_admin()
  );
