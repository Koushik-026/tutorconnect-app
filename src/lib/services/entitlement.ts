import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  DemoBookingRow,
  DemoBookingStatus,
  PackagePurchaseRow,
  StudentTutorEnrollmentRow,
} from "@/lib/types/database";

export type StudentJourneyStage =
  | "needs_onboarding"
  | "exploring"
  | "demo_booked"
  | "demo_completed"
  | "payment_pending"
  | "active_enrollment"
  | "completed";

export interface StudentJourneySummary {
  stage: StudentJourneyStage;
  activeBookingId?: string;
  pendingPurchaseId?: string;
  activeEnrollmentId?: string;
  tutorSlug?: string;
  studentProfileId?: string;
}

/**
 * 1. Account / Default Journey Summary Resolver
 * Resolves the user's primary journey stage using deterministic precedence:
 * 1. Active enrollment (remaining_classes > 0)
 * 2. Pending purchase (awaiting payment)
 * 3. Confirmed / requested demo booking
 * 4. Completed demo booking (status = 'completed')
 * Note: Package selection and routine setup are transient UI flows passing query params until purchase creation.
 * 5. Historical completed / expired enrollment (read-only historical access)
 * 6. Exploring (has student/parent role, but no bookings or purchases)
 * 7. Needs onboarding (has no account roles yet)
 */
export async function getStudentJourneySummary(
  userId: string
): Promise<StudentJourneySummary> {
  if (!isSupabaseConfigured() || !userId) {
    return { stage: "exploring" };
  }

  try {
    const supabase = await createClient();

    // Check account_roles
    const { data: roles, error: rolesErr } = await supabase
      .from("account_roles")
      .select("role")
      .eq("user_id", userId);

    if (rolesErr || !roles || roles.length === 0) {
      return { stage: "needs_onboarding" };
    }

    const roleNames = roles.map((r: { role: string }) => r.role);
    const hasLearnerRole =
      roleNames.includes("student") ||
      roleNames.includes("parent") ||
      roleNames.includes("admin");

    if (!hasLearnerRole) {
      // User is tutor-only
      return { stage: "needs_onboarding" };
    }

    // 1. Check Active Enrollment
    const { data: activeEnrollments } = await supabase
      .from("student_tutor_enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .gt("remaining_classes", 0)
      .order("created_at", { ascending: false })
      .limit(1);

    if (activeEnrollments && activeEnrollments.length > 0) {
      const e = activeEnrollments[0] as StudentTutorEnrollmentRow;
      return {
        stage: "active_enrollment",
        activeEnrollmentId: e.id,
        tutorSlug: e.tutor_slug,
        studentProfileId: e.student_profile_id,
      };
    }

    // 2. Check Pending Purchase
    const { data: pendingPurchases } = await supabase
      .from("package_purchases")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1);

    if (pendingPurchases && pendingPurchases.length > 0) {
      const p = pendingPurchases[0] as PackagePurchaseRow;
      return {
        stage: "payment_pending",
        pendingPurchaseId: p.id,
        tutorSlug: p.tutor_slug,
        studentProfileId: p.student_profile_id,
      };
    }

    // 3 & 4. Check Demo Bookings
    const { data: demoBookings } = await supabase
      .from("demo_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (demoBookings && demoBookings.length > 0) {
      // Look for confirmed or requested demo
      const activeDemo = demoBookings.find(
        (b) => b.status === "confirmed" || b.status === "requested"
      );
      if (activeDemo) {
        return {
          stage: "demo_booked",
          activeBookingId: activeDemo.id,
          tutorSlug: activeDemo.tutor_slug,
          studentProfileId: activeDemo.student_profile_id,
        };
      }

      // Look for completed demo
      // Rule: status = 'completed'
      const completedDemo = demoBookings.find(
        (b) => b.status === "completed"
      );
      if (completedDemo) {
        return {
          stage: "demo_completed",
          activeBookingId: completedDemo.id,
          tutorSlug: completedDemo.tutor_slug,
          studentProfileId: completedDemo.student_profile_id,
        };
      }
    }

    // 5. Check Historical Completed/Expired Enrollments
    const { data: pastEnrollments } = await supabase
      .from("student_tutor_enrollments")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["completed", "expired"])
      .order("created_at", { ascending: false })
      .limit(1);

    if (pastEnrollments && pastEnrollments.length > 0) {
      const e = pastEnrollments[0] as StudentTutorEnrollmentRow;
      return {
        stage: "completed",
        activeEnrollmentId: e.id,
        tutorSlug: e.tutor_slug,
        studentProfileId: e.student_profile_id,
      };
    }

    // 6. Exploring (Authenticated learner with 0 bookings/enrollments)
    return { stage: "exploring" };
  } catch (err) {
    console.error("getStudentJourneySummary error:", err);
    return { stage: "exploring" };
  }
}

/**
 * 2. Route-Specific Entitlement Helpers
 */

export async function requireLearnerRole(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !userId) return false;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("account_roles")
      .select("role")
      .eq("user_id", userId);
    if (!data) return false;
    const roles = data.map((r: { role: string }) => r.role);
    return roles.includes("student") || roles.includes("parent") || roles.includes("admin");
  } catch {
    return false;
  }
}

export async function requireOwnedDemo(
  userId: string,
  bookingId: string,
  allowedStatuses?: DemoBookingStatus[]
): Promise<DemoBookingRow | null> {
  if (!isSupabaseConfigured() || !userId || !bookingId) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("demo_bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;
    const booking = data as DemoBookingRow;
    if (allowedStatuses && allowedStatuses.length > 0) {
      if (!allowedStatuses.includes(booking.status)) return null;
    }
    return booking;
  } catch {
    return null;
  }
}

export async function requireOwnedPendingPurchase(
  userId: string,
  purchaseId: string
): Promise<PackagePurchaseRow | null> {
  if (!isSupabaseConfigured() || !userId || !purchaseId) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("package_purchases")
      .select("*")
      .eq("id", purchaseId)
      .eq("user_id", userId)
      .eq("status", "pending")
      .single();

    if (error || !data) return null;
    return data as PackagePurchaseRow;
  } catch {
    return null;
  }
}

export async function requireActiveEnrollment(
  userId: string,
  enrollmentId?: string
): Promise<StudentTutorEnrollmentRow | null> {
  if (!isSupabaseConfigured() || !userId) return null;
  try {
    const supabase = await createClient();
    let query = supabase
      .from("student_tutor_enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .gt("remaining_classes", 0);

    if (enrollmentId) {
      query = query.eq("id", enrollmentId);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) return null;
    return data[0] as StudentTutorEnrollmentRow;
  } catch {
    return null;
  }
}

export async function requireHistoricalOrActiveEnrollment(
  userId: string
): Promise<StudentTutorEnrollmentRow[]> {
  if (!isSupabaseConfigured() || !userId) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("student_tutor_enrollments")
      .select("*")
      .eq("user_id", userId)
      .in("status", ["active", "completed", "expired"])
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as StudentTutorEnrollmentRow[];
  } catch {
    return [];
  }
}

/**
 * 3. Default Journey Destination Resolver
 */
export function getDefaultJourneyRedirect(summary: StudentJourneySummary): string {
  switch (summary.stage) {
    case "needs_onboarding":
      return "/auth/onboarding";
    case "exploring":
      return "/tutors";
    case "demo_booked":
      return summary.activeBookingId
        ? `/demo/confirmation?booking_id=${summary.activeBookingId}`
        : "/tutors";
    case "demo_completed":
      return summary.tutorSlug
        ? `/packages/select?tutor=${encodeURIComponent(summary.tutorSlug)}`
        : "/tutors";
    case "payment_pending":
      return summary.pendingPurchaseId
        ? `/payment/checkout?purchase_id=${summary.pendingPurchaseId}`
        : "/packages/select";
    case "active_enrollment":
    case "completed":
      return "/dashboard/student";
    default:
      return "/tutors";
  }
}

/**
 * 4. Checks whether an explicit requested redirect route is permitted for the user's entitlement stage.
 * Used to ensure user-supplied next parameters cannot bypass entitlement boundaries.
 */
export function isRouteAllowedForStage(
  stage: StudentJourneyStage,
  pathname: string
): boolean {
  if (!pathname.startsWith("/")) return false;
  const path = pathname.split("?")[0];

  // Public routes always permitted
  if (
    path === "/" ||
    path === "/tutors" ||
    path.startsWith("/tutors/") ||
    path.startsWith("/auth")
  ) {
    return true;
  }

  // Demo routes
  if (path === "/demo/book") {
    return stage !== "needs_onboarding";
  }
  if (
    path === "/demo/confirmation" ||
    path === "/demo/waiting-room" ||
    path === "/demo/session"
  ) {
    return (
      stage === "demo_booked" ||
      stage === "demo_completed" ||
      stage === "active_enrollment"
    );
  }
  if (path === "/demo/feedback") {
    return stage === "demo_booked" || stage === "demo_completed";
  }

  // Package & Payment routes
  if (
    path === "/packages/select" ||
    path === "/schedule/confirm" ||
    path === "/payment/checkout" ||
    path === "/payment/result"
  ) {
    return (
      stage === "demo_completed" ||
      stage === "payment_pending" ||
      stage === "active_enrollment" ||
      stage === "completed"
    );
  }

  // Student Dashboard & Sessions
  if (path.startsWith("/dashboard/student")) {
    return stage === "active_enrollment" || stage === "completed";
  }

  // Tutor Workspace: Learner journey stages NEVER authorize tutor workspace routes.
  // Tutor route authorization is role- and resource-specific.
  if (path.startsWith("/dashboard/tutor")) {
    return false;
  }

  return false;
}

export {
  evaluateDemoJoinWindow,
  type DemoJoinWindowEvaluation,
} from "@/lib/utils/timing";
