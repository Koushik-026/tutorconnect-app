/**
 * TutorConnect Phase 2.3: Database Types & Application Model Aliases
 * Re-exports authoritative schema types from database.generated.ts
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
