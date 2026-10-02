/**
 * TutorConnect Phase 2.1: Database Schema Contract & Types
 * NOTE: These types are currently manually authored to match
 * supabase/migrations/20261002000000_phase2_backend_foundation.sql.
 * Once a live Supabase runtime project is linked, replace with
 * official generated types via: `supabase gen types typescript --project-id ...`
 */

export type AccountRole = "parent" | "student" | "tutor" | "admin";
export type TutorApprovalStatus = "pending" | "approved" | "rejected" | "suspended";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccountRoleRow {
  id: string;
  user_id: string;
  role: AccountRole;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  owner_user_id: string;
  display_name: string;
  class_level: string | null;
  board: string | null;
  created_at: string;
  updated_at: string;
}

export interface TutorProfile {
  id: string;
  user_id: string;
  slug: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  years_experience: number;
  boards: string[];
  offers_online: boolean;
  offers_home: boolean;
  locality: string | null;
  travel_radius_km: number | null;
  created_at: string;
  updated_at: string;
}

export interface TutorApplicationState {
  id: string;
  tutor_profile_id: string;
  status: TutorApprovalStatus;
  reviewed_at: string | null;
  reviewed_by: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface TutorSubject {
  id: string;
  tutor_profile_id: string;
  subject_id: string;
  created_at: string;
}

/**
 * Supabase Database interface for client typing
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      account_roles: {
        Row: AccountRoleRow;
        Insert: Omit<AccountRoleRow, "id" | "created_at"> & { id?: string };
        Update: Partial<AccountRoleRow>;
      };
      student_profiles: {
        Row: StudentProfile;
        Insert: Omit<StudentProfile, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<StudentProfile>;
      };
      tutor_profiles: {
        Row: TutorProfile;
        Insert: Omit<TutorProfile, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<TutorProfile>;
      };
      tutor_application_states: {
        Row: TutorApplicationState;
        Insert: Omit<TutorApplicationState, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<TutorApplicationState>;
      };
      subjects: {
        Row: Subject;
        Insert: Omit<Subject, "id" | "created_at"> & { id?: string };
        Update: Partial<Subject>;
      };
      tutor_subjects: {
        Row: TutorSubject;
        Insert: Omit<TutorSubject, "id" | "created_at"> & { id?: string };
        Update: Partial<TutorSubject>;
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_tutor_approved: {
        Args: { profile_id: string };
        Returns: boolean;
      };
      complete_onboarding: {
        Args: {
          chosen_role: AccountRole;
          p_display_name?: string | null;
        };
        Returns: {
          success: boolean;
          user_id: string;
          role: AccountRole;
        };
      };
    };
  };
}
