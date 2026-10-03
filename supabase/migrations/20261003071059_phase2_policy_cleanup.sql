-- ============================================================================
-- Migration: 20261003071059_phase2_policy_cleanup.sql
-- Description: Phase 2 Policy Cleanup
--   Eliminates duplicate broad SELECT policies on tutor_profiles and
--   tutor_subjects by replacing them with distinct anon and authenticated
--   policies, removing multiple permissive policy performance warnings.
-- ============================================================================

-- 1. Tutor Profiles Policy Cleanup
DROP POLICY IF EXISTS "tutor_profiles_select" ON public.tutor_profiles;
DROP POLICY IF EXISTS "tutor_profiles_anon_select" ON public.tutor_profiles;
DROP POLICY IF EXISTS "tutor_profiles_auth_select" ON public.tutor_profiles;

CREATE POLICY "tutor_profiles_anon_select"
  ON public.tutor_profiles
  FOR SELECT
  TO anon
  USING (private.is_tutor_approved(id));

CREATE POLICY "tutor_profiles_auth_select"
  ON public.tutor_profiles
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id
    OR private.is_tutor_approved(id)
    OR private.is_admin()
  );

-- 2. Tutor Subjects Policy Cleanup
DROP POLICY IF EXISTS "tutor_subjects_select" ON public.tutor_subjects;
DROP POLICY IF EXISTS "tutor_subjects_anon_select" ON public.tutor_subjects;
DROP POLICY IF EXISTS "tutor_subjects_auth_select" ON public.tutor_subjects;

CREATE POLICY "tutor_subjects_anon_select"
  ON public.tutor_subjects
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_subjects.tutor_profile_id
        AND private.is_tutor_approved(id)
    )
  );

CREATE POLICY "tutor_subjects_auth_select"
  ON public.tutor_subjects
  FOR SELECT
  TO authenticated
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
