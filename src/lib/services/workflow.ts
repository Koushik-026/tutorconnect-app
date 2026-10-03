/**
 * TutorConnect Core Workflow Service
 * Provides unified data access for:
 * - Public Tutor Catalog & Details
 * - Learner Profile Selection
 * - Demo Booking & Confirmation
 * - Demo Feedback
 * - Package Catalogue & Purchase Simulation
 * - Student Enrollments, Sessions & Class Ledger
 */

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { tutors as mockTutors, tuitionPackages as mockPackages } from "@/lib/data";
import type { Tutor, TeachingMode, VerificationType } from "@/lib/types";
import type {
  PublicTutorCatalog,
  DemoBookingRow,
  StudentProfile,
  PackagePurchaseRow,
  StudentTutorEnrollmentRow,
  ClassSessionRow,
  TuitionPackageRow,
} from "@/lib/types/database";

/**
 * Maps database public_tutor_catalog row to UI Tutor model
 */
function mapCatalogRowToTutor(row: PublicTutorCatalog): Tutor {
  const modes: TeachingMode[] = [];
  if (row.offers_online) modes.push("online");
  if (row.offers_home) modes.push("home");
  if (modes.length === 0) modes.push("online");

  return {
    id: row.slug,
    name: row.name,
    profileImage: row.profile_image || "",
    headline: row.headline,
    bio: row.bio,
    subjects: row.subjects || [],
    classes: row.classes || [],
    boards: row.boards || [],
    languages: row.languages || [],
    experienceYears: row.experience_years,
    rating: Number(row.rating) || 5.0,
    reviewCount: row.review_count || 0,
    modes,
    locality: row.locality || "",
    city: row.city || "Hyderabad",
    travelRadiusKm: row.travel_radius_km || 0,
    startingMonthlyFee: row.starting_monthly_fee || 3200,
    verification: (row.verification || [
      "Identity verified",
      "Qualification verified",
    ]) as VerificationType[],
    availableDays: row.available_days || ["Monday", "Wednesday", "Friday"],
    availableTimes: row.available_times || ["4:00 PM", "5:00 PM", "6:00 PM"],
  };
}

/**
 * 1. Fetch Approved Tutors
 */
export async function getCatalogueTutors(): Promise<Tutor[]> {
  if (!isSupabaseConfigured()) {
    return mockTutors;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("public_tutor_catalog")
      .select("*")
      .eq("is_approved", true)
      .order("rating", { ascending: false });

    if (error || !data || data.length === 0) {
      return mockTutors;
    }

    return (data as unknown as PublicTutorCatalog[]).map(mapCatalogRowToTutor);
  } catch {
    return mockTutors;
  }
}

/**
 * 2. Fetch Single Tutor by Slug
 */
export async function getTutorBySlug(slug: string): Promise<Tutor | null> {
  if (!slug) return null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("public_tutor_catalog")
        .select("*")
        .eq("slug", slug)
        .eq("is_approved", true)
        .single();

      if (!error && data) {
        return mapCatalogRowToTutor(data as unknown as PublicTutorCatalog);
      }
    } catch {
      // Fallback below
    }
  }

  const fallback = mockTutors.find((t) => t.id === slug);
  return fallback || null;
}

/**
 * 3. Fetch Tuition Packages
 */
export async function getTuitionPackages(): Promise<TuitionPackageRow[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("tuition_packages")
        .select("*")
        .order("total_classes", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as unknown as TuitionPackageRow[];
      }
    } catch {
      // Fallback below
    }
  }

  return mockPackages.map((p) => ({
    id: p.id,
    title: p.title,
    rhythm_name: p.id === "package-8" ? "Steady Start" : p.id === "package-12" ? "Consistent Momentum" : "Complete Mastery",
    intensity: p.id === "package-8" ? "Foundation Rhythm" : p.id === "package-12" ? "Balanced Rhythm" : "Accelerated Rhythm",
    total_classes: p.numberOfClasses,
    price_inr: p.price,
    class_duration_minutes: p.classDurationMinutes,
    validity_days: p.validityDays,
    pace_description: `${Math.round(p.numberOfClasses / 4)} classes / week`,
    best_for: p.description,
    is_recommended: p.id === "package-12",
    features: [
      `${p.numberOfClasses} 1-on-1 personalized sessions (60 min each)`,
      `${p.validityDays}-day validity from first session`,
      "Digital lesson notes when shared by tutor",
      "Online or eligible Home tuition",
      "Flexible weekly learning rhythm",
    ],
    created_at: new Date().toISOString(),
  }));
}

/**
 * 4. Learner Profiles (student_profiles)
 */
export async function getLearnerProfiles(userId: string): Promise<StudentProfile[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("owner_user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    return data as StudentProfile[];
  } catch {
    return [];
  }
}

export async function createLearnerProfile(params: {
  userId: string;
  displayName: string;
  classLevel: string;
  board: string;
}): Promise<StudentProfile | null> {
  if (!isSupabaseConfigured() || !params.userId) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("student_profiles")
      .insert({
        owner_user_id: params.userId,
        display_name: params.displayName.trim(),
        class_level: params.classLevel.trim(),
        board: params.board.trim(),
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to create learner profile:", error);
      return null;
    }
    return data as StudentProfile;
  } catch (e) {
    console.error("createLearnerProfile exception:", e);
    return null;
  }
}

/**
 * 5. Demo Bookings
 */
export async function createDemoBooking(params: {
  userId: string;
  studentProfileId: string;
  tutorSlug: string;
  tutorName: string;
  subject: string;
  scheduledStartAt: string;
  learningGoal?: string;
}): Promise<DemoBookingRow | null> {
  if (!isSupabaseConfigured() || !params.userId) return null;

  try {
    const supabase = await createClient();
    const startDate = new Date(params.scheduledStartAt);
    const endDate = new Date(startDate.getTime() + 30 * 60000);

    const { data, error } = await supabase
      .from("demo_bookings")
      .insert({
        user_id: params.userId,
        student_profile_id: params.studentProfileId,
        tutor_slug: params.tutorSlug,
        tutor_name: params.tutorName,
        subject: params.subject,
        session_mode: "online",
        duration_minutes: 30,
        price_inr: 0,
        scheduled_start_at: startDate.toISOString(),
        scheduled_end_at: endDate.toISOString(),
        status: "confirmed",
        learning_goal: params.learningGoal || null,
        meeting_reference: `demo-${params.tutorSlug}-${Date.now().toString().slice(-4)}`,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to create demo booking:", error);
      return null;
    }
    return data as DemoBookingRow;
  } catch (e) {
    console.error("createDemoBooking exception:", e);
    return null;
  }
}

export async function getDemoBookingById(bookingId: string): Promise<DemoBookingRow | null> {
  if (!isSupabaseConfigured() || !bookingId) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("demo_bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error || !data) return null;
    return data as DemoBookingRow;
  } catch {
    return null;
  }
}

export async function getUserDemoBookings(userId: string): Promise<DemoBookingRow[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("demo_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("scheduled_start_at", { ascending: false });

    if (error || !data) return [];
    return data as DemoBookingRow[];
  } catch {
    return [];
  }
}

/**
 * 6. Demo Feedback
 */
export async function submitDemoFeedback(params: {
  bookingId: string;
  userId: string;
  rating: number;
  tags: string[];
  feedbackText?: string;
  interestedInTuition?: boolean;
}): Promise<boolean> {
  if (!isSupabaseConfigured() || !params.userId) return true;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("demo_feedback").insert({
      demo_booking_id: params.bookingId,
      user_id: params.userId,
      rating: params.rating,
      tags: params.tags,
      feedback_text: params.feedbackText || null,
      interested_in_tuition: params.interestedInTuition ?? true,
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * 7. Package Purchase & Activation Simulation
 */
export async function createPackagePurchase(params: {
  userId: string;
  studentProfileId: string;
  packageId: string;
  tutorSlug: string;
  tutorName: string;
  tuitionMode: "online" | "home";
  amountInr: number;
  paymentMethod?: string;
}): Promise<PackagePurchaseRow | null> {
  if (!isSupabaseConfigured() || !params.userId) return null;

  try {
    const supabase = await createClient();
    const txRef = `TC-DEMO-${Date.now().toString().slice(-6)}`;

    const { data, error } = await supabase
      .from("package_purchases")
      .insert({
        user_id: params.userId,
        student_profile_id: params.studentProfileId,
        package_id: params.packageId,
        tutor_slug: params.tutorSlug,
        tutor_name: params.tutorName,
        tuition_mode: params.tuitionMode,
        amount_inr: params.amountInr,
        status: "pending",
        payment_method: params.paymentMethod || "UPI",
        transaction_reference: txRef,
        is_demo_simulation: true,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("createPackagePurchase error:", error);
      return null;
    }
    return data as PackagePurchaseRow;
  } catch (e) {
    console.error("createPackagePurchase exception:", e);
    return null;
  }
}

export async function activatePurchaseSimulation(
  purchaseId: string
): Promise<{ success: boolean; enrollmentId?: string; error?: string }> {
  if (!isSupabaseConfigured() || !purchaseId) {
    return { success: false, error: "Database not configured" };
  }

  const isDemoAllowed =
    process.env.TUTORCONNECT_DEMO_PAYMENT_MODE !== "false";

  if (!isDemoAllowed) {
    return {
      success: false,
      error: "Development payment simulation is disabled outside demo mode.",
    };
  }

  try {
    const supabase = await createClient();

    // 1. Attempt RPC first if migration is live
    const { data: rpcEnrollmentId, error: rpcError } = await supabase.rpc(
      "simulate_purchase_activation",
      { p_purchase_id: purchaseId }
    );

    if (!rpcError && rpcEnrollmentId) {
      // Seed upcoming class sessions for the activated enrollment
      await seedEnrollmentSessions(supabase, purchaseId, rpcEnrollmentId);
      return { success: true, enrollmentId: rpcEnrollmentId };
    }

    // 2. Resilient fallback if RPC is pending external migration
    const { data: purchase, error: pError } = await supabase
      .from("package_purchases")
      .select("*")
      .eq("id", purchaseId)
      .single();

    if (pError || !purchase) {
      return { success: false, error: "Purchase record not found" };
    }

    const totalClasses =
      purchase.package_id === "package-8"
        ? 8
        : purchase.package_id === "package-15"
        ? 15
        : 12;

    const validUntil = new Date(Date.now() + 45 * 86400000).toISOString();

    const { data: enrollment, error: eError } = await supabase
      .from("student_tutor_enrollments")
      .insert({
        user_id: purchase.user_id,
        student_profile_id: purchase.student_profile_id,
        package_purchase_id: purchase.id,
        tutor_slug: purchase.tutor_slug,
        tutor_name: purchase.tutor_name,
        tuition_mode: purchase.tuition_mode,
        total_classes: totalClasses,
        remaining_classes: totalClasses,
        status: "active",
        valid_until: validUntil,
      })
      .select()
      .single();

    if (eError || !enrollment) {
      console.error("Failed to create enrollment:", eError);
      return { success: false, error: "Enrollment creation failed" };
    }

    // Update purchase status
    await supabase
      .from("package_purchases")
      .update({
        status: "activated",
        activated_at: new Date().toISOString(),
      })
      .eq("id", purchaseId);

    // Seed upcoming sessions
    await seedEnrollmentSessions(supabase, purchaseId, enrollment.id);

    return { success: true, enrollmentId: enrollment.id };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Helper: Seeds initial upcoming sessions for a newly activated enrollment
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedEnrollmentSessions(supabase: any, purchaseId: string, enrollmentId: string) {
  try {
    const { data: enrollment } = await supabase
      .from("student_tutor_enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .single();

    if (!enrollment) return;

    // Check if sessions already exist
    const { data: existing } = await supabase
      .from("class_sessions")
      .select("id")
      .eq("enrollment_id", enrollmentId);

    if (existing && existing.length > 0) return;

    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 2); // Start 2 days in future
    baseDate.setHours(17, 0, 0, 0); // 5:00 PM

    const initialSessions = [
      {
        enrollment_id: enrollmentId,
        student_profile_id: enrollment.student_profile_id,
        user_id: enrollment.user_id,
        tutor_slug: enrollment.tutor_slug,
        tutor_name: enrollment.tutor_name,
        subject: "Mathematics",
        session_mode: enrollment.tuition_mode,
        scheduled_start_at: baseDate.toISOString(),
        duration_minutes: 60,
        status: "scheduled",
        locality: enrollment.tuition_mode === "home" ? "B.N. Reddy Nagar" : null,
        meeting_provider: enrollment.tuition_mode === "online" ? "demo_room" : null,
        meeting_reference: enrollment.tuition_mode === "online" ? `room-${enrollment.tutor_slug}-1` : null,
      },
      {
        enrollment_id: enrollmentId,
        student_profile_id: enrollment.student_profile_id,
        user_id: enrollment.user_id,
        tutor_slug: enrollment.tutor_slug,
        tutor_name: enrollment.tutor_name,
        subject: "Science",
        session_mode: enrollment.tuition_mode,
        scheduled_start_at: new Date(baseDate.getTime() + 2 * 86400000).toISOString(),
        duration_minutes: 60,
        status: "scheduled",
        locality: enrollment.tuition_mode === "home" ? "B.N. Reddy Nagar" : null,
        meeting_provider: enrollment.tuition_mode === "online" ? "demo_room" : null,
        meeting_reference: enrollment.tuition_mode === "online" ? `room-${enrollment.tutor_slug}-2` : null,
      },
      {
        enrollment_id: enrollmentId,
        student_profile_id: enrollment.student_profile_id,
        user_id: enrollment.user_id,
        tutor_slug: enrollment.tutor_slug,
        tutor_name: enrollment.tutor_name,
        subject: "Mathematics",
        session_mode: enrollment.tuition_mode,
        scheduled_start_at: new Date(baseDate.getTime() + 4 * 86400000).toISOString(),
        duration_minutes: 60,
        status: "scheduled",
        locality: enrollment.tuition_mode === "home" ? "B.N. Reddy Nagar" : null,
        meeting_provider: enrollment.tuition_mode === "online" ? "demo_room" : null,
        meeting_reference: enrollment.tuition_mode === "online" ? `room-${enrollment.tutor_slug}-3` : null,
      },
    ];

    await supabase.from("class_sessions").insert(initialSessions);
  } catch (e) {
    console.error("seedEnrollmentSessions error:", e);
  }
}

/**
 * 8. User Enrollments & Sessions
 */
export async function getUserEnrollments(userId: string): Promise<StudentTutorEnrollmentRow[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("student_tutor_enrollments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as StudentTutorEnrollmentRow[];
  } catch {
    return [];
  }
}

export async function getUserClassSessions(userId: string): Promise<ClassSessionRow[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("class_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("scheduled_start_at", { ascending: true });

    if (error || !data) return [];
    return data as ClassSessionRow[];
  } catch {
    return [];
  }
}

/**
 * 9. Mark Session Completed & Decrement Ledger
 */
export async function markClassSessionCompleted(
  sessionId: string,
  notes?: string
): Promise<{ success: boolean; remainingClasses?: number; error?: string }> {
  if (!isSupabaseConfigured() || !sessionId) {
    return { success: false, error: "Database not configured" };
  }

  try {
    const supabase = await createClient();

    // 1. Try RPC
    const { data: rpcRes, error: rpcErr } = await supabase.rpc(
      "mark_session_completed",
      {
        p_session_id: sessionId,
        p_notes: notes || "Session completed via student workspace",
      }
    );

    if (!rpcErr && rpcRes) {
      return {
        success: true,
        remainingClasses: (rpcRes as { remaining_classes: number }).remaining_classes,
      };
    }

    // 2. Resilient fallback
    const { data: session, error: sErr } = await supabase
      .from("class_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sErr || !session) {
      return { success: false, error: "Session not found" };
    }

    if (session.status === "completed") {
      return { success: true };
    }

    const { data: enrollment } = await supabase
      .from("student_tutor_enrollments")
      .select("*")
      .eq("id", session.enrollment_id)
      .single();

    if (!enrollment || enrollment.remaining_classes <= 0) {
      return { success: false, error: "No remaining classes" };
    }

    const newBalance = enrollment.remaining_classes - 1;

    // Record ledger entry
    await supabase.from("class_ledger_entries").insert({
      enrollment_id: enrollment.id,
      class_session_id: session.id,
      user_id: session.user_id,
      entry_type: "class_completed",
      classes_delta: -1,
      balance_after: newBalance,
      notes: notes || "Class completed via workspace",
    });

    // Decrement enrollment
    await supabase
      .from("student_tutor_enrollments")
      .update({
        remaining_classes: newBalance,
        status: newBalance === 0 ? "completed" : enrollment.status,
      })
      .eq("id", enrollment.id);

    // Update session
    await supabase
      .from("class_sessions")
      .update({ status: "completed" })
      .eq("id", sessionId);

    return { success: true, remainingClasses: newBalance };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}
