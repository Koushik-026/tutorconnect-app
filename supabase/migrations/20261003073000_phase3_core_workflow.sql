-- ============================================================================
-- Migration: 20261003073000_phase3_core_workflow.sql
-- Description: Phase 3 Core Marketplace, Demo Booking, Sessions & Class Ledger
--   1. Public Tutor Catalog (Prototype catalogue without fake auth users)
--   2. Student Profiles Role-Based Insert Hardening
--   3. Demo Bookings & Demo Feedback
--   4. Tuition Packages
--   5. Schedule Preferences
--   6. Package Purchases
--   7. Student Tutor Enrollments
--   8. Class Sessions
--   9. Class Ledger Entries (Immutable Audit Log)
--   10. Transactional RPCs:
--       - cancel_demo_booking
--       - create_demo_purchase
--       - simulate_purchase_activation
--       - mark_session_completed
--   11. Strict RLS Policies for all Phase 3 tables
--   12. Canonical Seed Data (Packages & Sample Demo Tutors)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PUBLIC TUTOR CATALOG
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.public_tutor_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  profile_image text DEFAULT '',
  headline text NOT NULL,
  bio text NOT NULL,
  subjects text[] NOT NULL DEFAULT '{}',
  classes text[] NOT NULL DEFAULT '{}',
  boards text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0,
  rating numeric(3,2),
  review_count integer NOT NULL DEFAULT 0,
  is_demo_profile boolean NOT NULL DEFAULT false,
  offers_online boolean NOT NULL DEFAULT true,
  offers_home boolean NOT NULL DEFAULT false,
  locality text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT 'Hyderabad',
  travel_radius_km integer NOT NULL DEFAULT 0,
  starting_package_price_inr integer NOT NULL DEFAULT 3200,
  verification text[] NOT NULL DEFAULT '{}',
  available_days text[] NOT NULL DEFAULT ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday'],
  available_times text[] NOT NULL DEFAULT ARRAY['4:00 PM', '5:00 PM', '6:00 PM'],
  is_approved boolean NOT NULL DEFAULT false,
  tutor_profile_id uuid REFERENCES public.tutor_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_public_tutor_catalog_slug ON public.public_tutor_catalog(slug);
CREATE INDEX IF NOT EXISTS idx_public_tutor_catalog_approved ON public.public_tutor_catalog(is_approved);

ALTER TABLE public.public_tutor_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_tutor_catalog_select"
  ON public.public_tutor_catalog
  FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "public_tutor_catalog_admin_insert"
  ON public.public_tutor_catalog
  FOR INSERT
  TO authenticated
  WITH CHECK (private.is_admin());

CREATE POLICY "public_tutor_catalog_admin_update"
  ON public.public_tutor_catalog
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "public_tutor_catalog_admin_delete"
  ON public.public_tutor_catalog
  FOR DELETE
  TO authenticated
  USING (private.is_admin());

-- ----------------------------------------------------------------------------
-- 2. STUDENT PROFILES ROLE-BASED ACCESS & INSERT HARDENING
-- ----------------------------------------------------------------------------
-- Phase 2 defined permissive 'student_profiles_owner_all' FOR ALL.
-- Drop it so the restrictive role-based INSERT policy is authoritative.
DROP POLICY IF EXISTS "student_profiles_owner_all" ON public.student_profiles;
DROP POLICY IF EXISTS "student_profiles_owner_select" ON public.student_profiles;
DROP POLICY IF EXISTS "student_profiles_owner_insert" ON public.student_profiles;
DROP POLICY IF EXISTS "student_profiles_owner_update" ON public.student_profiles;
DROP POLICY IF EXISTS "student_profiles_owner_delete" ON public.student_profiles;

CREATE POLICY "student_profiles_owner_select"
  ON public.student_profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = owner_user_id OR private.is_admin());

CREATE POLICY "student_profiles_owner_insert"
  ON public.student_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    ((select auth.uid()) = owner_user_id AND EXISTS (
      SELECT 1 FROM public.account_roles
      WHERE user_id = (select auth.uid())
        AND role IN ('parent', 'student')
    ))
    OR private.is_admin()
  );

CREATE POLICY "student_profiles_owner_update"
  ON public.student_profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = owner_user_id OR private.is_admin())
  WITH CHECK ((select auth.uid()) = owner_user_id OR private.is_admin());

CREATE POLICY "student_profiles_owner_delete"
  ON public.student_profiles
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = owner_user_id OR private.is_admin());

-- ----------------------------------------------------------------------------
-- 3. DEMO BOOKINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  tutor_slug text NOT NULL REFERENCES public.public_tutor_catalog(slug) ON DELETE RESTRICT,
  tutor_name text NOT NULL,
  subject text NOT NULL,
  session_mode text NOT NULL DEFAULT 'online' CHECK (session_mode = 'online'),
  duration_minutes integer NOT NULL DEFAULT 30 CHECK (duration_minutes = 30),
  price_inr integer NOT NULL DEFAULT 0 CHECK (price_inr = 0),
  scheduled_start_at timestamptz NOT NULL,
  scheduled_end_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled', 'no_show')),
  meeting_reference text,
  learning_goal text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT chk_demo_end_time CHECK (scheduled_end_at = scheduled_start_at + interval '30 minutes'),
  CONSTRAINT chk_demo_future CHECK (scheduled_start_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_demo_bookings_user ON public.demo_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_student ON public.demo_bookings(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_tutor_slug ON public.demo_bookings(tutor_slug);

-- Prevent active double-booking for the same tutor slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_demo_bookings_tutor_active_slot
  ON public.demo_bookings (tutor_slug, scheduled_start_at)
  WHERE (status IN ('requested', 'confirmed'));

ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_bookings_owner_or_tutor_select"
  ON public.demo_bookings
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id
    OR private.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.public_tutor_catalog c
      JOIN public.tutor_profiles tp
        ON tp.id = c.tutor_profile_id
      WHERE c.slug = demo_bookings.tutor_slug
        AND tp.user_id = (select auth.uid())
    )
  );

-- No direct owner INSERT or UPDATE policy.
-- Bookings are created exclusively via create_demo_booking RPC and cancelled via cancel_demo_booking RPC.
CREATE POLICY "demo_bookings_admin_manage"
  ON public.demo_bookings
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ----------------------------------------------------------------------------
-- 4. DEMO FEEDBACK
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_booking_id uuid NOT NULL UNIQUE REFERENCES public.demo_bookings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  tags text[] DEFAULT '{}',
  feedback_text text,
  interested_in_tuition boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.demo_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_feedback_owner_select"
  ON public.demo_feedback
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

CREATE POLICY "demo_feedback_owner_insert"
  ON public.demo_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.demo_bookings
      WHERE id = demo_booking_id
        AND user_id = (select auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- 5. TUITION PACKAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tuition_packages (
  id text PRIMARY KEY,
  title text NOT NULL,
  rhythm_name text NOT NULL,
  intensity text NOT NULL,
  total_classes integer NOT NULL CHECK (total_classes > 0),
  price_inr integer NOT NULL CHECK (price_inr >= 0),
  class_duration_minutes integer NOT NULL DEFAULT 60 CHECK (class_duration_minutes > 0),
  validity_days integer NOT NULL DEFAULT 45 CHECK (validity_days > 0),
  pace_description text NOT NULL,
  best_for text NOT NULL,
  is_recommended boolean DEFAULT false,
  features text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tuition_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tuition_packages_select"
  ON public.tuition_packages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "tuition_packages_admin_manage"
  ON public.tuition_packages
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ----------------------------------------------------------------------------
-- 6. SCHEDULE PREFERENCES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schedule_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  tutor_slug text NOT NULL REFERENCES public.public_tutor_catalog(slug) ON DELETE RESTRICT,
  package_id text NOT NULL REFERENCES public.tuition_packages(id) ON DELETE RESTRICT,
  tuition_mode text NOT NULL CHECK (tuition_mode IN ('online', 'home')),
  preferred_days text[] NOT NULL DEFAULT '{}',
  preferred_time text NOT NULL,
  timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  initial_subject text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_schedule_pref_user ON public.schedule_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_pref_student ON public.schedule_preferences(student_profile_id);

ALTER TABLE public.schedule_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schedule_preferences_owner_select"
  ON public.schedule_preferences
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

CREATE POLICY "schedule_preferences_admin_manage"
  ON public.schedule_preferences
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ----------------------------------------------------------------------------
-- 7. PACKAGE PURCHASES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.package_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE RESTRICT,
  package_id text NOT NULL REFERENCES public.tuition_packages(id) ON DELETE RESTRICT,
  schedule_preference_id uuid REFERENCES public.schedule_preferences(id) ON DELETE SET NULL,
  tutor_slug text NOT NULL REFERENCES public.public_tutor_catalog(slug) ON DELETE RESTRICT,
  tutor_name text NOT NULL,
  tuition_mode text NOT NULL DEFAULT 'online' CHECK (tuition_mode IN ('online', 'home')),
  amount_inr integer NOT NULL CHECK (amount_inr >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'activated', 'failed', 'cancelled', 'refunded')),
  payment_method text DEFAULT 'UPI',
  transaction_reference text NOT NULL UNIQUE,
  is_demo_simulation boolean NOT NULL DEFAULT false,
  activated_at timestamptz,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_package_purchases_user ON public.package_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_package_purchases_student ON public.package_purchases(student_profile_id);

ALTER TABLE public.package_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "package_purchases_owner_select"
  ON public.package_purchases
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

CREATE POLICY "package_purchases_admin_manage"
  ON public.package_purchases
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ----------------------------------------------------------------------------
-- 8. STUDENT TUTOR ENROLLMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_tutor_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  package_purchase_id uuid REFERENCES public.package_purchases(id) ON DELETE SET NULL,
  schedule_preference_id uuid REFERENCES public.schedule_preferences(id) ON DELETE SET NULL,
  tutor_slug text NOT NULL REFERENCES public.public_tutor_catalog(slug) ON DELETE RESTRICT,
  tutor_name text NOT NULL,
  initial_subject text,
  tuition_mode text NOT NULL DEFAULT 'online' CHECK (tuition_mode IN ('online', 'home')),
  total_classes integer NOT NULL CHECK (total_classes >= 0),
  remaining_classes integer NOT NULL CHECK (remaining_classes >= 0 AND remaining_classes <= total_classes),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
  started_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  valid_until timestamptz NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.student_tutor_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.student_tutor_enrollments(student_profile_id);

-- Enforce: One package purchase activates at most one enrollment
CREATE UNIQUE INDEX IF NOT EXISTS idx_enrollments_unique_purchase
  ON public.student_tutor_enrollments(package_purchase_id)
  WHERE package_purchase_id IS NOT NULL;

ALTER TABLE public.student_tutor_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enrollments_owner_select"
  ON public.student_tutor_enrollments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

CREATE POLICY "enrollments_admin_manage"
  ON public.student_tutor_enrollments
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ----------------------------------------------------------------------------
-- 9. CLASS SESSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.student_tutor_enrollments(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tutor_slug text NOT NULL REFERENCES public.public_tutor_catalog(slug) ON DELETE RESTRICT,
  tutor_name text NOT NULL,
  subject text NOT NULL,
  session_mode text NOT NULL CHECK (session_mode IN ('online', 'home')),
  scheduled_start_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'student_no_show', 'tutor_no_show')),
  meeting_provider text,
  meeting_reference text,
  locality text,
  notes text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT chk_home_session_no_meeting CHECK (
    session_mode != 'home' OR (meeting_provider IS NULL AND meeting_reference IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.class_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_enrollment ON public.class_sessions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled ON public.class_sessions(scheduled_start_at);

ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "class_sessions_owner_or_tutor_select"
  ON public.class_sessions
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id
    OR private.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.public_tutor_catalog c
      JOIN public.tutor_profiles tp
        ON tp.id = c.tutor_profile_id
      WHERE c.slug = class_sessions.tutor_slug
        AND tp.user_id = (select auth.uid())
    )
  );

-- No direct owner INSERT or UPDATE policy. Sessions are created and updated via secure RPCs.
CREATE POLICY "class_sessions_admin_manage"
  ON public.class_sessions
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ----------------------------------------------------------------------------
-- 10. CLASS LEDGER ENTRIES (Immutable Audit Log)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.student_tutor_enrollments(id) ON DELETE CASCADE,
  class_session_id uuid REFERENCES public.class_sessions(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type text NOT NULL CHECK (entry_type IN ('class_completed', 'class_credit', 'class_adjustment')),
  classes_delta integer NOT NULL,
  balance_after integer NOT NULL CHECK (balance_after >= 0),
  notes text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ledger_enrollment ON public.class_ledger_entries(enrollment_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ledger_session_completed
  ON public.class_ledger_entries(class_session_id)
  WHERE entry_type = 'class_completed';

ALTER TABLE public.class_ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "class_ledger_owner_select"
  ON public.class_ledger_entries
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

-- Ledger is immutable: no direct INSERT, UPDATE, or DELETE policies exist for any client role.
-- Mutations occur exclusively through constrained SECURITY DEFINER RPCs (mark_session_completed).

-- ----------------------------------------------------------------------------
-- 11. TRANSACTIONAL SECURITY DEFINER RPCs
-- ----------------------------------------------------------------------------

-- A1. Create Demo Booking (Canonical validation & server-side integrity)
CREATE OR REPLACE FUNCTION public.create_demo_booking(
  p_student_profile_id uuid,
  p_tutor_slug text,
  p_subject text,
  p_scheduled_start_at timestamptz,
  p_learning_goal text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
DECLARE
  v_user_id uuid;
  v_student record;
  v_tutor record;
  v_booking_id uuid;
  v_start_kolkata timestamp;
  v_day_name text;
  v_meeting_ref text;
  v_end_at timestamptz;
BEGIN
  v_user_id := (select auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- 1. Require parent or student role (or admin)
  IF NOT EXISTS (
    SELECT 1 FROM public.account_roles
    WHERE user_id = v_user_id AND role IN ('parent', 'student', 'admin')
  ) THEN
    RAISE EXCEPTION 'Only parent or student accounts can book demo sessions';
  END IF;

  -- 2. Verify student_profile belongs to caller
  SELECT * INTO v_student
  FROM public.student_profiles
  WHERE id = p_student_profile_id AND owner_user_id = v_user_id;

  IF NOT FOUND AND NOT private.is_admin() THEN
    RAISE EXCEPTION 'Student profile not found or not owned by user';
  END IF;

  -- 3. Verify tutor exists and is approved
  SELECT * INTO v_tutor
  FROM public.public_tutor_catalog
  WHERE slug = p_tutor_slug AND is_approved = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Approved tutor not found';
  END IF;

  -- 4. Verify selected subject exists in tutor.subjects
  IF NOT (p_subject = ANY(v_tutor.subjects)) THEN
    RAISE EXCEPTION 'Selected subject % is not taught by this tutor', p_subject;
  END IF;

  -- 5. Require scheduled_start_at > now()
  IF p_scheduled_start_at <= timezone('utc'::text, now()) THEN
    RAISE EXCEPTION 'Demo booking time must be in the future';
  END IF;

  -- 6. Compute end_at strictly 30 minutes later
  v_end_at := p_scheduled_start_at + interval '30 minutes';

  -- 7. Reject tutor/time active-slot conflicts
  IF EXISTS (
    SELECT 1 FROM public.demo_bookings
    WHERE tutor_slug = p_tutor_slug
      AND scheduled_start_at = p_scheduled_start_at
      AND status IN ('requested', 'confirmed')
  ) THEN
    RAISE EXCEPTION 'This time slot is no longer available for tutor %', p_tutor_slug;
  END IF;

  -- 8. Validate against tutor available_days in Asia/Kolkata
  v_start_kolkata := p_scheduled_start_at AT TIME ZONE 'Asia/Kolkata';
  v_day_name := trim(to_char(v_start_kolkata, 'Day'));
  IF v_tutor.available_days IS NOT NULL AND array_length(v_tutor.available_days, 1) > 0 THEN
    IF NOT (v_day_name = ANY(v_tutor.available_days)) THEN
      RAISE EXCEPTION 'Tutor does not accept bookings on %', v_day_name;
    END IF;
  END IF;

  -- Generate server-side meeting reference
  v_meeting_ref := 'demo-' || v_tutor.slug || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);

  -- 9. Insert forced canonical parameters (session_mode = 'online', duration_minutes = 30, price_inr = 0, status = 'confirmed')
  INSERT INTO public.demo_bookings (
    user_id,
    student_profile_id,
    tutor_slug,
    tutor_name,
    subject,
    session_mode,
    duration_minutes,
    price_inr,
    scheduled_start_at,
    scheduled_end_at,
    status,
    meeting_reference,
    learning_goal
  ) VALUES (
    v_user_id,
    p_student_profile_id,
    v_tutor.slug,
    v_tutor.name,
    p_subject,
    'online',
    30,
    0,
    p_scheduled_start_at,
    v_end_at,
    'confirmed',
    v_meeting_ref,
    p_learning_goal
  ) RETURNING id INTO v_booking_id;

  RETURN jsonb_build_object(
    'booking_id', v_booking_id,
    'tutor_slug', v_tutor.slug,
    'tutor_name', v_tutor.name,
    'subject', p_subject,
    'scheduled_start_at', p_scheduled_start_at,
    'scheduled_end_at', v_end_at,
    'status', 'confirmed',
    'meeting_reference', v_meeting_ref
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_demo_booking(uuid, text, text, timestamptz, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_demo_booking(uuid, text, text, timestamptz, text) TO authenticated;

-- A2. Cancel Demo Booking (Constrained cancellation RPC)
CREATE OR REPLACE FUNCTION public.cancel_demo_booking(p_booking_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
DECLARE
  v_user_id uuid;
  v_booking record;
BEGIN
  v_user_id := (select auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO v_booking
  FROM public.demo_bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Demo booking not found';
  END IF;

  IF v_booking.user_id <> v_user_id AND NOT private.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized to cancel this booking';
  END IF;

  IF v_booking.status NOT IN ('requested', 'confirmed') THEN
    RAISE EXCEPTION 'Cannot cancel demo booking in status %', v_booking.status;
  END IF;

  UPDATE public.demo_bookings
  SET status = 'cancelled',
      updated_at = timezone('utc'::text, now())
  WHERE id = p_booking_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_demo_booking(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_demo_booking(uuid) TO authenticated;

-- B. Save Schedule Preference (Constrained secure RPC)
CREATE OR REPLACE FUNCTION public.save_schedule_preference(
  p_student_profile_id uuid,
  p_tutor_slug text,
  p_package_id text,
  p_tuition_mode text,
  p_preferred_days text[],
  p_preferred_time text,
  p_initial_subject text DEFAULT NULL,
  p_timezone text DEFAULT 'Asia/Kolkata'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
DECLARE
  v_user_id uuid;
  v_student record;
  v_tutor record;
  v_pkg record;
  v_pref_id uuid;
  v_pref_time time;
  v_day text;
  v_valid_days text[] := ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
BEGIN
  v_user_id := (select auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- 1. Validate student profile belongs to caller
  SELECT * INTO v_student
  FROM public.student_profiles
  WHERE id = p_student_profile_id AND owner_user_id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student profile not found or not owned by user';
  END IF;

  -- 2. Validate package exists
  SELECT * INTO v_pkg
  FROM public.tuition_packages
  WHERE id = p_package_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tuition package not found';
  END IF;

  -- 3. Validate tutor exists and is approved
  SELECT * INTO v_tutor
  FROM public.public_tutor_catalog
  WHERE slug = p_tutor_slug AND is_approved = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Approved tutor not found';
  END IF;

  -- 4. Validate tuition mode is supported by tutor
  IF p_tuition_mode NOT IN ('online', 'home') THEN
    RAISE EXCEPTION 'Invalid tuition mode: %', p_tuition_mode;
  END IF;

  IF p_tuition_mode = 'home' AND NOT v_tutor.offers_home THEN
    RAISE EXCEPTION 'Home tuition is not offered by this tutor';
  END IF;

  IF p_tuition_mode = 'online' AND NOT v_tutor.offers_online THEN
    RAISE EXCEPTION 'Online tuition is not offered by this tutor';
  END IF;

  -- 5. Validate preferred_days is non-empty and contains valid weekdays only
  IF p_preferred_days IS NULL OR array_length(p_preferred_days, 1) IS NULL OR array_length(p_preferred_days, 1) = 0 THEN
    RAISE EXCEPTION 'preferred_days must not be empty';
  END IF;

  FOREACH v_day IN ARRAY p_preferred_days LOOP
    IF NOT (v_day = ANY(v_valid_days)) THEN
      RAISE EXCEPTION 'Invalid weekday: %', v_day;
    END IF;
  END LOOP;

  -- 6. Validate preferred_time parses cleanly to time without exception (no silent fallback)
  IF p_preferred_time IS NULL OR trim(p_preferred_time) = '' THEN
    RAISE EXCEPTION 'preferred_time must not be empty';
  END IF;

  BEGIN
    v_pref_time := p_preferred_time::time;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid preferred_time format: %. Must be a valid time string.', p_preferred_time;
  END;

  -- 7. Validate initial_subject if provided
  IF p_initial_subject IS NOT NULL AND trim(p_initial_subject) <> '' THEN
    IF NOT (p_initial_subject = ANY(v_tutor.subjects)) THEN
      RAISE EXCEPTION 'Initial subject % is not taught by this tutor', p_initial_subject;
    END IF;
  END IF;

  -- Insert preference with canonical Asia/Kolkata timezone
  INSERT INTO public.schedule_preferences (
    user_id,
    student_profile_id,
    tutor_slug,
    package_id,
    tuition_mode,
    preferred_days,
    preferred_time,
    timezone,
    initial_subject
  ) VALUES (
    v_user_id,
    p_student_profile_id,
    p_tutor_slug,
    p_package_id,
    p_tuition_mode,
    p_preferred_days,
    p_preferred_time,
    'Asia/Kolkata',
    NULLIF(trim(p_initial_subject), '')
  ) RETURNING id INTO v_pref_id;

  RETURN v_pref_id;
END;
$$;

REVOKE ALL ON FUNCTION public.save_schedule_preference(uuid, text, text, text, text[], text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_schedule_preference(uuid, text, text, text, text[], text, text, text) TO authenticated;

-- C. Create Pending Demo Purchase (Canonical pricing & validation)
CREATE OR REPLACE FUNCTION public.create_demo_purchase(
  p_student_profile_id uuid,
  p_package_id text,
  p_tutor_slug text,
  p_tuition_mode text,
  p_schedule_preference_id uuid DEFAULT NULL,
  p_payment_method text DEFAULT 'UPI'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
DECLARE
  v_user_id uuid;
  v_student record;
  v_pkg record;
  v_tutor record;
  v_pref record;
  v_purchase_id uuid;
  v_tx_ref text;
BEGIN
  v_user_id := (select auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Verify student profile belongs to user
  SELECT * INTO v_student
  FROM public.student_profiles
  WHERE id = p_student_profile_id AND owner_user_id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid student profile';
  END IF;

  -- Verify package and fetch canonical price
  SELECT * INTO v_pkg
  FROM public.tuition_packages
  WHERE id = p_package_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tuition package not found';
  END IF;

  -- Verify tutor exists and is approved
  SELECT * INTO v_tutor
  FROM public.public_tutor_catalog
  WHERE slug = p_tutor_slug AND is_approved = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Approved tutor not found';
  END IF;

  -- Verify tuition mode is offered by tutor
  IF p_tuition_mode = 'home' AND NOT v_tutor.offers_home THEN
    RAISE EXCEPTION 'Home tuition is not offered by this tutor';
  END IF;

  IF p_tuition_mode = 'online' AND NOT v_tutor.offers_online THEN
    RAISE EXCEPTION 'Online tuition is not offered by this tutor';
  END IF;

  -- Validate schedule preference if supplied
  IF p_schedule_preference_id IS NOT NULL THEN
    SELECT * INTO v_pref
    FROM public.schedule_preferences
    WHERE id = p_schedule_preference_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Schedule preference not found';
    END IF;

    IF v_pref.user_id <> v_user_id THEN
      RAISE EXCEPTION 'Schedule preference does not belong to authenticated user';
    END IF;

    IF v_pref.student_profile_id <> p_student_profile_id THEN
      RAISE EXCEPTION 'Schedule preference student profile mismatch';
    END IF;

    IF v_pref.tutor_slug <> p_tutor_slug THEN
      RAISE EXCEPTION 'Schedule preference tutor mismatch';
    END IF;

    IF v_pref.package_id <> p_package_id THEN
      RAISE EXCEPTION 'Schedule preference package mismatch';
    END IF;

    IF v_pref.tuition_mode <> p_tuition_mode THEN
      RAISE EXCEPTION 'Schedule preference tuition mode mismatch';
    END IF;
  END IF;

  -- Generate high-entropy transaction reference
  v_tx_ref := 'TC-SIM-' || upper(replace(gen_random_uuid()::text, '-', ''));

  INSERT INTO public.package_purchases (
    user_id,
    student_profile_id,
    package_id,
    schedule_preference_id,
    tutor_slug,
    tutor_name,
    tuition_mode,
    amount_inr,
    status,
    payment_method,
    transaction_reference,
    is_demo_simulation
  ) VALUES (
    v_user_id,
    p_student_profile_id,
    v_pkg.id,
    p_schedule_preference_id,
    v_tutor.slug,
    v_tutor.name,
    p_tuition_mode,
    v_pkg.price_inr,
    'pending',
    COALESCE(p_payment_method, 'UPI'),
    v_tx_ref,
    true
  ) RETURNING id INTO v_purchase_id;

  RETURN jsonb_build_object(
    'purchase_id', v_purchase_id,
    'transaction_reference', v_tx_ref,
    'amount_inr', v_pkg.price_inr,
    'package_id', v_pkg.id,
    'tutor_slug', v_tutor.slug
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_demo_purchase(uuid, text, text, text, uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_demo_purchase(uuid, text, text, text, uuid, text) TO authenticated;

-- D. Simulate Development Purchase Activation
CREATE OR REPLACE FUNCTION public.simulate_purchase_activation(p_purchase_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
DECLARE
  v_user_id uuid;
  v_purchase record;
  v_pkg record;
  v_tutor record;
  v_pref record;
  v_enrollment_id uuid;
  v_initial_subject text;
  v_locality text;
  v_pref_time time;
  v_curr_date date;
  v_candidate_date date;
  v_day_name text;
  v_session_time timestamptz;
  v_sessions_count integer := 0;
  v_day_offset integer;
BEGIN
  v_user_id := (select auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock purchase row
  SELECT * INTO v_purchase
  FROM public.package_purchases
  WHERE id = p_purchase_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Purchase not found';
  END IF;

  -- Check ownership or admin
  IF v_purchase.user_id <> v_user_id AND NOT private.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized purchase activation';
  END IF;

  -- Must be demo simulation
  IF NOT v_purchase.is_demo_simulation THEN
    RAISE EXCEPTION 'Live gateway purchases cannot be activated via simulation RPC';
  END IF;

  -- Idempotent check
  IF v_purchase.status = 'activated' THEN
    SELECT id INTO v_enrollment_id
    FROM public.student_tutor_enrollments
    WHERE package_purchase_id = p_purchase_id;
    RETURN v_enrollment_id;
  END IF;

  IF v_purchase.status <> 'pending' THEN
    RAISE EXCEPTION 'Purchase cannot be activated from status %', v_purchase.status;
  END IF;

  -- Verify student profile still belongs to purchase owner
  IF NOT EXISTS (
    SELECT 1 FROM public.student_profiles
    WHERE id = v_purchase.student_profile_id AND owner_user_id = v_purchase.user_id
  ) THEN
    RAISE EXCEPTION 'Student profile does not belong to purchase owner';
  END IF;

  -- Fetch package specs and verify canonical price
  SELECT * INTO v_pkg
  FROM public.tuition_packages
  WHERE id = v_purchase.package_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tuition package % not found', v_purchase.package_id;
  END IF;

  IF v_purchase.amount_inr <> v_pkg.price_inr THEN
    RAISE EXCEPTION 'Purchase amount mismatch against canonical package price';
  END IF;

  -- Fetch tutor
  SELECT * INTO v_tutor
  FROM public.public_tutor_catalog
  WHERE slug = v_purchase.tutor_slug AND is_approved = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Approved tutor not found';
  END IF;

  -- Validate mode capability
  IF v_purchase.tuition_mode = 'home' AND NOT v_tutor.offers_home THEN
    RAISE EXCEPTION 'Home tuition is not offered by this tutor';
  END IF;

  IF v_purchase.tuition_mode = 'online' AND NOT v_tutor.offers_online THEN
    RAISE EXCEPTION 'Online tuition is not offered by this tutor';
  END IF;

  v_locality := CASE WHEN v_purchase.tuition_mode = 'home' THEN v_tutor.locality ELSE NULL END;

  -- Explicit branching for schedule preference: NEVER access uninitialized v_pref if NULL
  IF v_purchase.schedule_preference_id IS NOT NULL THEN
    SELECT * INTO v_pref
    FROM public.schedule_preferences
    WHERE id = v_purchase.schedule_preference_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Linked schedule preference not found';
    END IF;

    IF v_pref.user_id <> v_purchase.user_id THEN
      RAISE EXCEPTION 'Schedule preference user mismatch';
    END IF;

    IF v_pref.student_profile_id <> v_purchase.student_profile_id THEN
      RAISE EXCEPTION 'Schedule preference student profile mismatch';
    END IF;

    IF v_pref.tutor_slug <> v_purchase.tutor_slug THEN
      RAISE EXCEPTION 'Schedule preference tutor mismatch';
    END IF;

    IF v_pref.package_id <> v_purchase.package_id THEN
      RAISE EXCEPTION 'Schedule preference package mismatch';
    END IF;

    IF v_pref.tuition_mode <> v_purchase.tuition_mode THEN
      RAISE EXCEPTION 'Schedule preference tuition mode mismatch';
    END IF;

    -- Determine initial subject from preference if valid
    IF v_pref.initial_subject IS NOT NULL AND v_pref.initial_subject = ANY(v_tutor.subjects) THEN
      v_initial_subject := v_pref.initial_subject;
    ELSE
      v_initial_subject := 'To be confirmed';
    END IF;

    -- Validate preferred_time in preference (never fallback)
    BEGIN
      v_pref_time := v_pref.preferred_time::time;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid preferred_time in schedule preference: %', v_pref.preferred_time;
    END;

    -- Create active enrollment
    INSERT INTO public.student_tutor_enrollments (
      user_id,
      student_profile_id,
      package_purchase_id,
      schedule_preference_id,
      tutor_slug,
      tutor_name,
      initial_subject,
      tuition_mode,
      total_classes,
      remaining_classes,
      status,
      started_at,
      valid_until
    ) VALUES (
      v_purchase.user_id,
      v_purchase.student_profile_id,
      v_purchase.id,
      v_purchase.schedule_preference_id,
      v_purchase.tutor_slug,
      v_purchase.tutor_name,
      v_initial_subject,
      v_purchase.tuition_mode,
      v_pkg.total_classes,
      v_pkg.total_classes,
      'active',
      timezone('utc'::text, now()),
      timezone('utc'::text, now()) + (v_pkg.validity_days || ' days')::interval
    ) RETURNING id INTO v_enrollment_id;

    -- Generate sessions from preference
    IF v_pref.preferred_days IS NOT NULL AND array_length(v_pref.preferred_days, 1) > 0 THEN
      v_curr_date := (timezone('utc'::text, now()) AT TIME ZONE 'Asia/Kolkata')::date;

      FOR v_day_offset IN 0..60 LOOP
        v_candidate_date := v_curr_date + v_day_offset;
        v_day_name := trim(to_char(v_candidate_date, 'Day'));

        IF v_day_name = ANY(v_pref.preferred_days) THEN
          v_session_time := (v_candidate_date + v_pref_time) AT TIME ZONE 'Asia/Kolkata';

          IF v_session_time > timezone('utc'::text, now()) AND v_session_time <= (timezone('utc'::text, now()) + (v_pkg.validity_days || ' days')::interval) THEN
            v_sessions_count := v_sessions_count + 1;

            INSERT INTO public.class_sessions (
              enrollment_id,
              student_profile_id,
              user_id,
              tutor_slug,
              tutor_name,
              subject,
              session_mode,
              scheduled_start_at,
              duration_minutes,
              status,
              locality,
              meeting_provider,
              meeting_reference
            ) VALUES (
              v_enrollment_id,
              v_purchase.student_profile_id,
              v_purchase.user_id,
              v_purchase.tutor_slug,
              v_purchase.tutor_name,
              v_initial_subject,
              v_purchase.tuition_mode,
              v_session_time,
              60,
              'scheduled',
              v_locality,
              CASE WHEN v_purchase.tuition_mode = 'online' THEN 'demo_room' ELSE NULL END,
              CASE WHEN v_purchase.tuition_mode = 'online' THEN 'room-' || v_purchase.tutor_slug || '-' || v_sessions_count ELSE NULL END
            );

            IF v_sessions_count >= 3 THEN
              EXIT;
            END IF;
          END IF;
        END IF;
      END LOOP;
    END IF;

  ELSE
    -- No schedule preference supplied: do NOT reference v_pref!
    v_initial_subject := 'To be confirmed';

    INSERT INTO public.student_tutor_enrollments (
      user_id,
      student_profile_id,
      package_purchase_id,
      schedule_preference_id,
      tutor_slug,
      tutor_name,
      initial_subject,
      tuition_mode,
      total_classes,
      remaining_classes,
      status,
      started_at,
      valid_until
    ) VALUES (
      v_purchase.user_id,
      v_purchase.student_profile_id,
      v_purchase.id,
      NULL,
      v_purchase.tutor_slug,
      v_purchase.tutor_name,
      v_initial_subject,
      v_purchase.tuition_mode,
      v_pkg.total_classes,
      v_pkg.total_classes,
      'active',
      timezone('utc'::text, now()),
      timezone('utc'::text, now()) + (v_pkg.validity_days || ' days')::interval
    ) RETURNING id INTO v_enrollment_id;

    -- Zero sessions pre-generated (schedule confirmation required)
  END IF;

  -- Update purchase status
  UPDATE public.package_purchases
  SET status = 'activated',
      activated_at = timezone('utc'::text, now()),
      updated_at = timezone('utc'::text, now())
  WHERE id = p_purchase_id;

  RETURN v_enrollment_id;
END;
$$;

REVOKE ALL ON FUNCTION public.simulate_purchase_activation(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.simulate_purchase_activation(uuid) TO authenticated;

-- D. Mark Session Completed & Decrement Class Ledger
CREATE OR REPLACE FUNCTION public.mark_session_completed(
  p_session_id uuid,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, private
AS $$
DECLARE
  v_user_id uuid;
  v_session record;
  v_enrollment record;
  v_new_balance integer;
  v_ledger_id uuid;
BEGIN
  v_user_id := (select auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock session row
  SELECT * INTO v_session
  FROM public.class_sessions
  WHERE id = p_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Class session not found';
  END IF;

  -- Verify authorization (owner or admin)
  IF v_session.user_id <> v_user_id AND NOT private.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized to complete this session';
  END IF;

  -- Lock associated enrollment
  SELECT * INTO v_enrollment
  FROM public.student_tutor_enrollments
  WHERE id = v_session.enrollment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enrollment not found for session';
  END IF;

  -- Verify explicit relationship between session and enrollment
  IF v_enrollment.user_id <> v_session.user_id THEN
    RAISE EXCEPTION 'Session user_id does not match enrollment user_id';
  END IF;

  IF v_enrollment.student_profile_id <> v_session.student_profile_id THEN
    RAISE EXCEPTION 'Session student_profile_id does not match enrollment student_profile_id';
  END IF;

  IF v_enrollment.tutor_slug <> v_session.tutor_slug THEN
    RAISE EXCEPTION 'Session tutor_slug does not match enrollment tutor_slug';
  END IF;

  -- Verify enrollment is active and not expired
  IF v_enrollment.status <> 'active' THEN
    RAISE EXCEPTION 'Enrollment is not active (status: %)', v_enrollment.status;
  END IF;

  IF v_enrollment.valid_until < timezone('utc'::text, now()) THEN
    RAISE EXCEPTION 'Enrollment validity period has expired';
  END IF;

  -- Idempotency check: if session already completed and ledger exists, return current state
  IF v_session.status = 'completed' THEN
    SELECT id INTO v_ledger_id
    FROM public.class_ledger_entries
    WHERE class_session_id = p_session_id AND entry_type = 'class_completed';

    IF v_ledger_id IS NOT NULL THEN
      RETURN jsonb_build_object(
        'status', 'already_completed',
        'session_id', p_session_id,
        'remaining_classes', v_enrollment.remaining_classes
      );
    END IF;
  END IF;

  -- Only transition scheduled or in_progress sessions to completed
  IF v_session.status NOT IN ('scheduled', 'in_progress') THEN
    RAISE EXCEPTION 'Cannot complete session in status %', v_session.status;
  END IF;

  -- Balance check
  IF v_enrollment.remaining_classes <= 0 THEN
    RAISE EXCEPTION 'No remaining classes available in enrollment to complete session';
  END IF;

  v_new_balance := v_enrollment.remaining_classes - 1;

  -- Write immutable audit ledger entry
  INSERT INTO public.class_ledger_entries (
    enrollment_id,
    class_session_id,
    user_id,
    entry_type,
    classes_delta,
    balance_after,
    notes
  ) VALUES (
    v_enrollment.id,
    p_session_id,
    v_session.user_id,
    'class_completed',
    -1,
    v_new_balance,
    COALESCE(p_notes, 'Class session completed and ledger charged')
  ) RETURNING id INTO v_ledger_id;

  -- Decrement enrollment
  UPDATE public.student_tutor_enrollments
  SET remaining_classes = v_new_balance,
      status = CASE WHEN v_new_balance = 0 THEN 'completed' ELSE status END,
      updated_at = timezone('utc'::text, now())
  WHERE id = v_enrollment.id;

  -- Update session status
  UPDATE public.class_sessions
  SET status = 'completed',
      updated_at = timezone('utc'::text, now())
  WHERE id = p_session_id;

  RETURN jsonb_build_object(
    'status', 'success',
    'session_id', p_session_id,
    'ledger_id', v_ledger_id,
    'remaining_classes', v_new_balance
  );
END;
$$;

REVOKE ALL ON FUNCTION public.mark_session_completed(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_session_completed(uuid, text) TO authenticated;

-- ----------------------------------------------------------------------------
-- 12. CANONICAL SEED DATA (Packages & Public Tutor Catalog)
-- ----------------------------------------------------------------------------
INSERT INTO public.tuition_packages (
  id, title, rhythm_name, intensity, total_classes, price_inr,
  class_duration_minutes, validity_days, pace_description, best_for,
  is_recommended, features
) VALUES
(
  'package-8',
  'Starter Plan',
  'Steady Start',
  'Foundation Rhythm',
  8,
  3200,
  60,
  45,
  '2 classes / week',
  'Ideal for concept reinforcement, targeted doubt clearing, and bridging specific subject gaps.',
  false,
  ARRAY[
    '8 1-on-1 personalized sessions (60 min each)',
    '45-day validity from first session',
    'Digital lesson notes when shared by tutor',
    'Online or eligible Home tuition',
    'Flexible weekly learning rhythm'
  ]
),
(
  'package-12',
  'Regular Plan',
  'Consistent Momentum',
  'Balanced Rhythm',
  12,
  4500,
  60,
  45,
  '3 classes / week',
  'Recommended for continuous syllabus coverage, exam preparation, and building problem-solving velocity.',
  true,
  ARRAY[
    '12 1-on-1 personalized sessions (60 min each)',
    '45-day validity from first session',
    'Digital lesson notes when shared by tutor',
    'Online or eligible Home tuition',
    'Flexible weekly learning rhythm'
  ]
),
(
  'package-15',
  'Intensive Plan',
  'Complete Mastery',
  'Accelerated Rhythm',
  15,
  5400,
  60,
  45,
  '3 to 4 classes / week',
  'Comprehensive coverage for dual-subject learners and accelerated exam preparation.',
  false,
  ARRAY[
    '15 1-on-1 personalized sessions (60 min each)',
    '45-day validity from first session',
    'Digital lesson notes when shared by tutor',
    'Online or eligible Home tuition',
    'Flexible weekly learning rhythm'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  rhythm_name = EXCLUDED.rhythm_name,
  intensity = EXCLUDED.intensity,
  total_classes = EXCLUDED.total_classes,
  price_inr = EXCLUDED.price_inr,
  class_duration_minutes = EXCLUDED.class_duration_minutes,
  validity_days = EXCLUDED.validity_days,
  pace_description = EXCLUDED.pace_description,
  best_for = EXCLUDED.best_for,
  is_recommended = EXCLUDED.is_recommended,
  features = EXCLUDED.features;

-- Public Tutor Catalog Seeds (Fictional Sample Personas - Not real KYC verified professionals)
INSERT INTO public.public_tutor_catalog (
  slug, name, profile_image, headline, bio, subjects, classes, boards,
  languages, experience_years, rating, review_count, is_demo_profile,
  offers_online, offers_home, locality, city, travel_radius_km,
  starting_package_price_inr, verification, available_days, available_times, is_approved
) VALUES
(
  'ananya-sharma',
  'Ananya Sharma',
  '',
  'Mathematics & Science Educator',
  'Concept-first educator who focuses on intuitive reasoning. Guiding CBSE & ICSE learners across Classes 6 to 12 in foundation and exam preparation.',
  ARRAY['Mathematics', 'Science'],
  ARRAY['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  ARRAY['CBSE', 'ICSE'],
  ARRAY['English', 'Hindi', 'Telugu'],
  8,
  NULL,
  0,
  true,
  true,
  true,
  'B.N. Reddy Nagar',
  'Hyderabad',
  5,
  3200,
  ARRAY[]::text[],
  ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday'],
  ARRAY['4:00 PM', '5:00 PM', '6:00 PM'],
  true
),
(
  'rahul-verma',
  'Rahul Verma',
  '',
  'Physics & Mathematics Specialist',
  'Engaging problem-solver who breaks down numerical difficulties into structured analytical steps. Specializes in secondary school Physics and Higher Mathematics.',
  ARRAY['Physics', 'Mathematics'],
  ARRAY['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  ARRAY['CBSE', 'State Board'],
  ARRAY['English', 'Hindi'],
  6,
  NULL,
  0,
  true,
  true,
  true,
  'Madhapur',
  'Hyderabad',
  7,
  3200,
  ARRAY[]::text[],
  ARRAY['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
  ARRAY['4:30 PM', '5:30 PM', '7:00 PM'],
  true
),
(
  'priya-nair',
  'Priya Nair',
  '',
  'Chemistry & Biology Mentor',
  'Dedicated science educator specializing in organic mechanisms, cell biology, and diagrammatic clarity for ICSE & CBSE boards.',
  ARRAY['Chemistry', 'Biology', 'Science'],
  ARRAY['Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  ARRAY['ICSE', 'CBSE'],
  ARRAY['English', 'Telugu'],
  5,
  NULL,
  0,
  true,
  true,
  false,
  'Gachibowli',
  'Hyderabad',
  0,
  3200,
  ARRAY[]::text[],
  ARRAY['Monday', 'Tuesday', 'Thursday', 'Friday'],
  ARRAY['5:00 PM', '6:00 PM', '7:30 PM'],
  true
),
(
  'vikram-reddy',
  'Vikram Reddy',
  '',
  'Computer Science & English Instructor',
  'Focuses on systematic coding fundamentals in Python/Java and precise communicative English for middle and high school students.',
  ARRAY['Computer Science', 'English'],
  ARRAY['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
  ARRAY['CBSE', 'ICSE', 'State Board'],
  ARRAY['English', 'Telugu'],
  4,
  NULL,
  0,
  true,
  true,
  true,
  'Kukatpally',
  'Hyderabad',
  6,
  3200,
  ARRAY[]::text[],
  ARRAY['Monday', 'Wednesday', 'Friday', 'Sunday'],
  ARRAY['3:30 PM', '5:00 PM', '6:30 PM'],
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  subjects = EXCLUDED.subjects,
  classes = EXCLUDED.classes,
  boards = EXCLUDED.boards,
  languages = EXCLUDED.languages,
  experience_years = EXCLUDED.experience_years,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  is_demo_profile = EXCLUDED.is_demo_profile,
  offers_online = EXCLUDED.offers_online,
  offers_home = EXCLUDED.offers_home,
  locality = EXCLUDED.locality,
  city = EXCLUDED.city,
  travel_radius_km = EXCLUDED.travel_radius_km,
  starting_package_price_inr = EXCLUDED.starting_package_price_inr,
  verification = EXCLUDED.verification,
  available_days = EXCLUDED.available_days,
  available_times = EXCLUDED.available_times,
  is_approved = EXCLUDED.is_approved;
