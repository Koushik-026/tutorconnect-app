-- ==============================================================================
-- TutorConnect Phase 2: Secure Backend Foundation Migration
-- PostgreSQL Schema, Enums, Roles, Profiles, RLS Policies, Functions & Triggers
-- ==============================================================================

-- 1. Enums
DO $$ BEGIN
  CREATE TYPE public.account_role AS ENUM ('parent', 'student', 'tutor', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.tutor_approval_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Helper function: updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- 3. Profiles Table (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Account Roles Table (Supports multi-role, e.g. tutor who is also parent)
CREATE TABLE IF NOT EXISTS public.account_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.account_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_account_roles_user_id ON public.account_roles(user_id);

-- 5. Helper function: is_admin() (SECURITY DEFINER with safe search_path to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.account_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- 6. Student Profiles Table (Parent or student owns one or more learner profiles)
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  class_level TEXT,
  board TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_owner ON public.student_profiles(owner_user_id);

CREATE TRIGGER set_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. Tutor Profiles Table (Foundational application / educator profile)
CREATE TABLE IF NOT EXISTS public.tutor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE CONSTRAINT unique_tutor_user UNIQUE,
  slug TEXT NOT NULL CONSTRAINT unique_tutor_slug UNIQUE,
  display_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  years_experience INTEGER NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
  boards TEXT[] DEFAULT '{}',
  offers_online BOOLEAN NOT NULL DEFAULT true,
  offers_home BOOLEAN NOT NULL DEFAULT false,
  locality TEXT,
  travel_radius_km INTEGER DEFAULT 5 CHECK (travel_radius_km >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_tutor_profiles_user ON public.tutor_profiles(user_id);

CREATE TRIGGER set_tutor_profiles_updated_at
  BEFORE UPDATE ON public.tutor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Tutor Application States Table (Privileged separation: applicant cannot approve self)
CREATE TABLE IF NOT EXISTS public.tutor_application_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_profile_id UUID NOT NULL REFERENCES public.tutor_profiles(id) ON DELETE CASCADE CONSTRAINT unique_tutor_app_state UNIQUE,
  status public.tutor_approval_status NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_tutor_app_states_updated_at
  BEFORE UPDATE ON public.tutor_application_states
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Subjects Table (Public Catalogue)
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CONSTRAINT unique_subject_name UNIQUE,
  slug TEXT NOT NULL CONSTRAINT unique_subject_slug UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Tutor Subjects Junction Table
CREATE TABLE IF NOT EXISTS public.tutor_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_profile_id UUID NOT NULL REFERENCES public.tutor_profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_tutor_subject UNIQUE (tutor_profile_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_tutor_subjects_profile ON public.tutor_subjects(tutor_profile_id);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_subject ON public.tutor_subjects(subject_id);

-- 11. Auth User Bootstrap Trigger
-- Safely inserts profile row on signup without granting elevated roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- A. Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- B. Account Roles RLS
ALTER TABLE public.account_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "account_roles_select_own_or_admin"
  ON public.account_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- Self-service onboarding allowed only for parent, student, or tutor (NEVER admin)
CREATE POLICY "account_roles_insert_onboarding"
  ON public.account_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND role IN ('parent', 'student', 'tutor')
  );

CREATE POLICY "account_roles_admin_all"
  ON public.account_roles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- C. Student Profiles RLS
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student_profiles_owner_all"
  ON public.student_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_user_id OR public.is_admin())
  WITH CHECK (auth.uid() = owner_user_id OR public.is_admin());

-- D. Tutor Profiles RLS
ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;

-- Tutor can view own profile; public can view approved profiles; admin can view all
CREATE POLICY "tutor_profiles_select"
  ON public.tutor_profiles
  FOR SELECT
  TO public
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM public.tutor_application_states
      WHERE tutor_profile_id = tutor_profiles.id
        AND status = 'approved'
    )
    OR public.is_admin()
  );

CREATE POLICY "tutor_profiles_insert_own"
  ON public.tutor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tutor_profiles_update_own"
  ON public.tutor_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- E. Tutor Application States RLS
ALTER TABLE public.tutor_application_states ENABLE ROW LEVEL SECURITY;

-- Tutor can view own application status; admin can view all
CREATE POLICY "tutor_app_states_select"
  ON public.tutor_application_states
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_application_states.tutor_profile_id
        AND user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- Tutor applicant can only create a pending state upon initial application
CREATE POLICY "tutor_app_states_insert_pending"
  ON public.tutor_application_states
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_application_states.tutor_profile_id
        AND user_id = auth.uid()
    )
    AND status = 'pending'
  );

-- Only privileged admin/server can update application status (approve, reject, suspend)
CREATE POLICY "tutor_app_states_admin_update"
  ON public.tutor_application_states
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- F. Subjects RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subjects_public_read"
  ON public.subjects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "subjects_admin_manage"
  ON public.subjects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- G. Tutor Subjects Junction RLS
ALTER TABLE public.tutor_subjects ENABLE ROW LEVEL SECURITY;

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
          user_id = auth.uid()
          OR EXISTS (
            SELECT 1
            FROM public.tutor_application_states
            WHERE tutor_profile_id = tutor_profiles.id
              AND status = 'approved'
          )
        )
    )
    OR public.is_admin()
  );

CREATE POLICY "tutor_subjects_owner_insert"
  ON public.tutor_subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_subjects.tutor_profile_id
        AND user_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY "tutor_subjects_owner_delete"
  ON public.tutor_subjects
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tutor_profiles
      WHERE id = tutor_subjects.tutor_profile_id
        AND user_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ==============================================================================
-- 13. SEED CATALOGUE DATA
-- ==============================================================================
INSERT INTO public.subjects (name, slug) VALUES
  ('Mathematics', 'mathematics'),
  ('Science', 'science'),
  ('Physics', 'physics'),
  ('Chemistry', 'chemistry'),
  ('Biology', 'biology'),
  ('English', 'english'),
  ('Computer Science', 'computer-science')
ON CONFLICT (name) DO NOTHING;
