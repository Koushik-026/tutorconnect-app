-- ============================================================================
-- Migration: 20261003073000_phase3_core_workflow.sql
-- Description: Phase 3 Core Marketplace, Demo Booking, Sessions & Class Ledger
--   1. Public Tutor Catalog (Prototype catalogue without fake auth users)
--   2. Demo Bookings & Demo Feedback
--   3. Tuition Packages
--   4. Package Purchases
--   5. Student Tutor Enrollments
--   6. Class Sessions
--   7. Class Ledger Entries (Immutable Audit Log)
--   8. Transactional RPCs:
--      - simulate_purchase_activation
--      - mark_session_completed
--   9. Strict RLS Policies for all Phase 3 tables
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
  rating numeric(3,2) NOT NULL DEFAULT 5.0,
  review_count integer NOT NULL DEFAULT 0,
  offers_online boolean NOT NULL DEFAULT true,
  offers_home boolean NOT NULL DEFAULT false,
  locality text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT 'Hyderabad',
  travel_radius_km integer NOT NULL DEFAULT 0,
  starting_monthly_fee integer NOT NULL DEFAULT 3200,
  verification text[] NOT NULL DEFAULT ARRAY['Identity verified', 'Qualification verified'],
  available_days text[] NOT NULL DEFAULT ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday'],
  available_times text[] NOT NULL DEFAULT ARRAY['4:00 PM', '5:00 PM', '6:00 PM'],
  is_approved boolean NOT NULL DEFAULT true,
  tutor_profile_id uuid REFERENCES public.tutor_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
-- 2. DEMO BOOKINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.demo_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  tutor_slug text NOT NULL,
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
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_demo_bookings_user ON public.demo_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_student ON public.demo_bookings(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_tutor_slug ON public.demo_bookings(tutor_slug);

ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_bookings_owner_select"
  ON public.demo_bookings
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

CREATE POLICY "demo_bookings_owner_insert"
  ON public.demo_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.student_profiles
      WHERE id = student_profile_id
        AND owner_user_id = (select auth.uid())
    )
  );

CREATE POLICY "demo_bookings_owner_update"
  ON public.demo_bookings
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin())
  WITH CHECK ((select auth.uid()) = user_id OR private.is_admin());

-- ----------------------------------------------------------------------------
-- 3. DEMO FEEDBACK
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
-- 4. TUITION PACKAGES
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

CREATE POLICY "tuition_packages_admin_insert"
  ON public.tuition_packages
  FOR INSERT
  TO authenticated
  WITH CHECK (private.is_admin());

CREATE POLICY "tuition_packages_admin_update"
  ON public.tuition_packages
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE POLICY "tuition_packages_admin_delete"
  ON public.tuition_packages
  FOR DELETE
  TO authenticated
  USING (private.is_admin());

-- ----------------------------------------------------------------------------
-- 5. PACKAGE PURCHASES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.package_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE RESTRICT,
  package_id text NOT NULL REFERENCES public.tuition_packages(id) ON DELETE RESTRICT,
  tutor_slug text NOT NULL,
  tutor_name text NOT NULL,
  tuition_mode text NOT NULL DEFAULT 'online' CHECK (tuition_mode IN ('online', 'home')),
  amount_inr integer NOT NULL CHECK (amount_inr >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'activated', 'failed', 'cancelled', 'refunded')),
  payment_method text DEFAULT 'UPI',
  transaction_reference text NOT NULL UNIQUE,
  is_demo_simulation boolean DEFAULT true,
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

CREATE POLICY "package_purchases_owner_insert"
  ON public.package_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.student_profiles
      WHERE id = student_profile_id
        AND owner_user_id = (select auth.uid())
    )
  );

CREATE POLICY "package_purchases_admin_update"
  ON public.package_purchases
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ----------------------------------------------------------------------------
-- 6. STUDENT TUTOR ENROLLMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_tutor_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  package_purchase_id uuid REFERENCES public.package_purchases(id) ON DELETE SET NULL,
  tutor_slug text NOT NULL,
  tutor_name text NOT NULL,
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
-- 7. CLASS SESSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.student_tutor_enrollments(id) ON DELETE CASCADE,
  student_profile_id uuid NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tutor_slug text NOT NULL,
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
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.class_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_enrollment ON public.class_sessions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled ON public.class_sessions(scheduled_start_at);

ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "class_sessions_owner_select"
  ON public.class_sessions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin());

CREATE POLICY "class_sessions_owner_insert"
  ON public.class_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM public.student_tutor_enrollments
      WHERE id = enrollment_id
        AND user_id = (select auth.uid())
        AND status = 'active'
        AND remaining_classes > 0
    )
  );

CREATE POLICY "class_sessions_owner_update"
  ON public.class_sessions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id OR private.is_admin())
  WITH CHECK ((select auth.uid()) = user_id OR private.is_admin());

-- ----------------------------------------------------------------------------
-- 8. CLASS LEDGER ENTRIES (Immutable Audit Log)
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

-- Normal clients CANNOT insert or update the ledger directly
CREATE POLICY "class_ledger_admin_manage"
  ON public.class_ledger_entries
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ----------------------------------------------------------------------------
-- 9. TRANSACTIONAL SECURITY DEFINER RPCs
-- ----------------------------------------------------------------------------

-- A. Simulate Development Purchase Activation
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
  v_enrollment_id uuid;
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

  -- Fetch package specs
  SELECT * INTO v_pkg
  FROM public.tuition_packages
  WHERE id = v_purchase.package_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tuition package % not found', v_purchase.package_id;
  END IF;

  -- Create active enrollment
  INSERT INTO public.student_tutor_enrollments (
    user_id,
    student_profile_id,
    package_purchase_id,
    tutor_slug,
    tutor_name,
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
    v_purchase.tutor_slug,
    v_purchase.tutor_name,
    v_purchase.tuition_mode,
    v_pkg.total_classes,
    v_pkg.total_classes,
    'active',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()) + (v_pkg.validity_days || ' days')::interval
  ) RETURNING id INTO v_enrollment_id;

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

-- B. Mark Session Completed & Decrement Class Ledger
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

  -- Lock session
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
-- 10. CANONICAL SEED DATA (Packages & Public Tutor Catalog)
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

-- Public Tutor Catalog Seeds
INSERT INTO public.public_tutor_catalog (
  slug, name, profile_image, headline, bio, subjects, classes, boards,
  languages, experience_years, rating, review_count, offers_online,
  offers_home, locality, city, travel_radius_km, starting_monthly_fee,
  verification, available_days, available_times, is_approved
) VALUES
(
  'ananya-sharma',
  'Ananya Sharma',
  '',
  'Mathematics & Science Specialist',
  'Patient, concept-first educator who builds intuitive understanding rather than rote memorisation. 8+ years guiding CBSE & ICSE students to academic excellence across Classes 6 to 12.',
  ARRAY['Mathematics', 'Science'],
  ARRAY['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  ARRAY['CBSE', 'ICSE'],
  ARRAY['English', 'Hindi', 'Telugu'],
  8,
  4.9,
  124,
  true,
  true,
  'B.N. Reddy Nagar',
  'Hyderabad',
  5,
  3200,
  ARRAY['Identity verified', 'Qualification verified', 'Teaching profile reviewed'],
  ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday'],
  ARRAY['4:00 PM', '5:00 PM', '6:00 PM'],
  true
),
(
  'rahul-verma',
  'Rahul Verma',
  '',
  'English & Social Studies Mentor',
  'Engaging educator specialising in English fluency, grammar, literature analysis, and Social Studies for middle and secondary school learners.',
  ARRAY['English', 'Social Studies'],
  ARRAY['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
  ARRAY['CBSE', 'ICSE', 'State Board'],
  ARRAY['English', 'Hindi'],
  5,
  4.7,
  86,
  true,
  false,
  'Dilsukhnagar',
  'Hyderabad',
  0,
  2800,
  ARRAY['Identity verified', 'Qualification verified'],
  ARRAY['Tuesday', 'Thursday', 'Saturday'],
  ARRAY['5:00 PM', '6:00 PM', '7:00 PM'],
  true
),
(
  'meera-reddy',
  'Meera Reddy',
  '',
  'Physics & Chemistry Instructor',
  'Structured, concept-oriented mentor helping students master numerical problem-solving, equation balancing, and competitive board preparation.',
  ARRAY['Physics', 'Chemistry'],
  ARRAY['Class 9', 'Class 10', 'Class 11', 'Class 12'],
  ARRAY['CBSE', 'State Board'],
  ARRAY['English', 'Telugu'],
  7,
  4.8,
  103,
  true,
  true,
  'Vanasthalipuram',
  'Hyderabad',
  6,
  4000,
  ARRAY['Identity verified', 'Qualification verified', 'Teaching profile reviewed'],
  ARRAY['Monday', 'Tuesday', 'Thursday', 'Saturday'],
  ARRAY['4:30 PM', '5:30 PM', '7:00 PM'],
  true
),
(
  'arjun-nair',
  'Arjun Nair',
  '',
  'Computer Science & Coding Coach',
  'Practical technology educator teaching computational thinking, Python fundamentals, algorithms, and web development through live coding.',
  ARRAY['Computer Science', 'Python'],
  ARRAY['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  ARRAY['CBSE', 'ICSE'],
  ARRAY['English', 'Hindi'],
  4,
  4.6,
  58,
  true,
  false,
  'Madhapur',
  'Hyderabad',
  0,
  3500,
  ARRAY['Identity verified', 'Qualification verified'],
  ARRAY['Wednesday', 'Friday', 'Saturday', 'Sunday'],
  ARRAY['5:00 PM', '6:30 PM', '8:00 PM'],
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
  offers_online = EXCLUDED.offers_online,
  offers_home = EXCLUDED.offers_home,
  locality = EXCLUDED.locality,
  city = EXCLUDED.city,
  travel_radius_km = EXCLUDED.travel_radius_km,
  starting_monthly_fee = EXCLUDED.starting_monthly_fee,
  verification = EXCLUDED.verification,
  available_days = EXCLUDED.available_days,
  available_times = EXCLUDED.available_times,
  is_approved = EXCLUDED.is_approved;
