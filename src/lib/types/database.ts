/**
 * TutorConnect Database Types & Application Model Aliases
 * Contains authoritative schema types and Phase 3 core workflow models.
 */

import type { Database } from "./database.generated";

export type { Database, Json } from "./database.generated";

export type AccountRole = Database["public"]["Enums"]["account_role"];
export type TutorApprovalStatus = Database["public"]["Enums"]["tutor_approval_status"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AccountRoleRow = Database["public"]["Tables"]["account_roles"]["Row"];
export type StudentProfile = Database["public"]["Tables"]["student_profiles"]["Row"];
export type TutorProfile = Database["public"]["Tables"]["tutor_profiles"]["Row"];
export type TutorApplicationState = Database["public"]["Tables"]["tutor_application_states"]["Row"];
export type Subject = Database["public"]["Tables"]["subjects"]["Row"];
export type TutorSubject = Database["public"]["Tables"]["tutor_subjects"]["Row"];

// ============================================================================
// PHASE 3 DRAFT APPLICATION INTERFACES (Pre-live migration definitions)
// Note: These interfaces define the pending Phase 3 migration schema and will
// be superseded by auto-generated Database['public']['Tables'] types once
// the migration is applied live to Supabase.
// ============================================================================

export interface PublicTutorCatalog {
  id: string;
  slug: string;
  name: string;
  profile_image: string;
  headline: string;
  bio: string;
  subjects: string[];
  classes: string[];
  boards: string[];
  languages: string[];
  experience_years: number;
  rating: number | null;
  review_count: number;
  is_demo_profile: boolean;
  offers_online: boolean;
  offers_home: boolean;
  locality: string;
  city: string;
  travel_radius_km: number;
  starting_package_price_inr: number;
  verification: string[];
  available_days: string[];
  available_times: string[];
  is_approved: boolean;
  tutor_profile_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type DemoBookingStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface DemoBookingRow {
  id: string;
  user_id: string;
  student_profile_id: string;
  tutor_slug: string;
  tutor_name: string;
  subject: string;
  session_mode: "online";
  duration_minutes: number;
  price_inr: number;
  scheduled_start_at: string;
  scheduled_end_at: string;
  status: DemoBookingStatus;
  meeting_reference?: string | null;
  learning_goal?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DemoFeedbackRow {
  id: string;
  demo_booking_id: string;
  user_id: string;
  rating: number | null;
  tags: string[];
  feedback_text: string | null;
  interested_in_tuition: boolean | null;
  created_at: string;
}

export interface TuitionPackageRow {
  id: string;
  title: string;
  rhythm_name: string;
  intensity: string;
  total_classes: number;
  price_inr: number;
  class_duration_minutes: number;
  validity_days: number;
  pace_description: string;
  best_for: string;
  is_recommended: boolean;
  features: string[];
  created_at: string;
}

export interface SchedulePreferenceRow {
  id: string;
  user_id: string;
  student_profile_id: string;
  tutor_slug: string;
  package_id: string;
  tuition_mode: "online" | "home";
  preferred_days: string[];
  preferred_time: string;
  timezone: string;
  initial_subject?: string | null;
  created_at: string;
  updated_at: string;
}

export type PackagePurchaseStatus =
  | "pending"
  | "activated"
  | "failed"
  | "cancelled"
  | "refunded";

export interface PackagePurchaseRow {
  id: string;
  user_id: string;
  student_profile_id: string;
  package_id: string;
  schedule_preference_id?: string | null;
  tutor_slug: string;
  tutor_name: string;
  tuition_mode: "online" | "home";
  amount_inr: number;
  status: PackagePurchaseStatus;
  payment_method: string;
  transaction_reference: string;
  is_demo_simulation: boolean;
  activated_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type EnrollmentStatus = "active" | "completed" | "expired" | "cancelled";

export interface StudentTutorEnrollmentRow {
  id: string;
  user_id: string;
  student_profile_id: string;
  package_purchase_id?: string | null;
  schedule_preference_id?: string | null;
  tutor_slug: string;
  tutor_name: string;
  initial_subject?: string | null;
  tuition_mode: "online" | "home";
  total_classes: number;
  remaining_classes: number;
  status: EnrollmentStatus;
  started_at: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export type ClassSessionStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "student_no_show"
  | "tutor_no_show";

export interface ClassSessionRow {
  id: string;
  enrollment_id: string;
  student_profile_id: string;
  user_id: string;
  tutor_slug: string;
  tutor_name: string;
  subject: string;
  session_mode: "online" | "home";
  scheduled_start_at: string;
  duration_minutes: number;
  status: ClassSessionStatus;
  meeting_provider?: string | null;
  meeting_reference?: string | null;
  locality?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export type LedgerEntryType =
  | "class_completed"
  | "class_credit"
  | "class_adjustment";

export interface ClassLedgerEntryRow {
  id: string;
  enrollment_id: string;
  class_session_id?: string | null;
  user_id: string;
  entry_type: LedgerEntryType;
  classes_delta: number;
  balance_after: number;
  notes?: string | null;
  created_at: string;
}
