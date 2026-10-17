-- ==============================================================================
-- TUTORCONNECT — HARDEN SECURITY DEFINER FUNCTIONS & PRIVATE SCHEMA
-- Migration: 20261003063051_harden_security_definer_functions.sql
-- ==============================================================================

-- 1. Create Private Schema (Non-exposed schema for internal security helpers)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- 2. Move Helper Functions to Private Schema
CREATE OR REPLACE FUNCTION private.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.account_roles
    WHERE user_id = (select auth.uid())
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION private.is_tutor_approved(profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tutor_application_states
    WHERE tutor_profile_id = profile_id
      AND status = 'approved'
  );
$$;

-- 3. Repoint Database Triggers to Private Schema Functions
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION private.handle_updated_at();

DROP TRIGGER IF EXISTS set_student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER set_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION private.handle_updated_at();

DROP TRIGGER IF EXISTS set_tutor_profiles_updated_at ON public.tutor_profiles;
CREATE TRIGGER set_tutor_profiles_updated_at
  BEFORE UPDATE ON public.tutor_profiles
  FOR EACH ROW EXECUTE FUNCTION private.handle_updated_at();

DROP TRIGGER IF EXISTS set_tutor_app_states_updated_at ON public.tutor_application_states;
CREATE TRIGGER set_tutor_app_states_updated_at
  BEFORE UPDATE ON public.tutor_application_states
  FOR EACH ROW EXECUTE FUNCTION private.handle_updated_at();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

-- 4. Rewrite RLS Policies with Private Helpers and (select auth.uid()) Optimization

-- A. Profiles
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

-- B. Account Roles
DROP POLICY IF EXISTS "account_roles_select_own_or_admin" ON public.account_roles;
CREATE POLICY "account_roles_select_own_or_admin"
  ON public.account_roles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

DROP POLICY IF EXISTS "account_roles_admin_manage" ON public.account_roles;
CREATE POLICY "account_roles_admin_manage"
  ON public.account_roles
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- C. Student Profiles
DROP POLICY IF EXISTS "student_profiles_owner_all" ON public.student_profiles;
CREATE POLICY "student_profiles_owner_all"
  ON public.student_profiles
  FOR ALL
  TO authenticated
  USING ((select auth.uid()) = owner_user_id OR private.is_admin())
  WITH CHECK ((select auth.uid()) = owner_user_id OR private.is_admin());

-- D. Tutor Profiles
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

-- E. Tutor Application States
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
CREATE POLICY "tutor_app_states_admin_manage"
  ON public.tutor_application_states
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- Covering index on reviewed_by foreign key
CREATE INDEX IF NOT EXISTS idx_tutor_app_states_reviewed_by
  ON public.tutor_application_states(reviewed_by);

-- F. Subjects
DROP POLICY IF EXISTS "subjects_public_read" ON public.subjects;
CREATE POLICY "subjects_public_read"
  ON public.subjects
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "subjects_admin_manage" ON public.subjects;
CREATE POLICY "subjects_admin_manage"
  ON public.subjects
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- G. Tutor Subjects
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

-- 5. Restrict Execution of complete_onboarding to Authenticated Users
REVOKE ALL ON FUNCTION public.complete_onboarding(public.account_role, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_onboarding(public.account_role, text) TO authenticated;

-- 6. Remove Old Exposed Helper Functions from Public Schema
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_tutor_approved(uuid);
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();
