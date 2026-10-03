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
  SchedulePreferenceRow,
} from "@/lib/types/database";

/**
 * Maps database public_tutor_catalog row to UI Tutor model
 */
function mapCatalogRowToTutor(row: PublicTutorCatalog): Tutor {
  const modes: TeachingMode[] = [];
  if (row.offers_online) modes.push("online");
  if (row.offers_home) modes.push("home");
  if (modes.length === 0) modes.push("online");

  const startingPrice = row.starting_package_price_inr || 3200;

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
    rating: row.rating ? Number(row.rating) : null,
    reviewCount: row.review_count || 0,
    isDemoProfile: row.is_demo_profile ?? true,
    modes,
    locality: row.locality || "",
    city: row.city || "Hyderabad",
    travelRadiusKm: row.travel_radius_km || 0,
    startingPackagePrice: startingPrice,
    startingMonthlyFee: startingPrice,
    verification: (row.verification || [
      "Qualification reviewed",
      "Teaching profile reviewed",
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
      .order("created_at", { ascending: true });

    if (error) {
      // If table is pending migration (PGRST205), allow pre-live preview fallback
      if (error.code === "PGRST205") return mockTutors;
      return [];
    }

    return (data as unknown as PublicTutorCatalog[]).map(mapCatalogRowToTutor);
  } catch {
    return [];
  }
}

/**
 * 2. Fetch Single Tutor by Slug
 * Note: When Supabase is configured, database is canonical. Unknown slug returns null (404).
 * Mock fallback is allowed only when Supabase is completely unconfigured.
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
      // If table does not exist yet in schema cache (pre-live migration), allow sample fallback
      if (error?.code === "PGRST205") {
        const preLiveFallback = mockTutors.find((t) => t.id === slug);
        return preLiveFallback || null;
      }
      // Database is canonical: unknown slug returns null (404)
      return null;
    } catch {
      return null;
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
    pace_description: String(Math.round(p.numberOfClasses / 4)) + " classes / week",
    best_for: p.description,
    is_recommended: p.id === "package-12",
    features: [
      String(p.numberOfClasses) + " 1-on-1 personalized sessions (60 min each)",
      String(p.validityDays) + "-day validity from first session",
      "Digital lesson notes when shared by tutor",
      "Online or eligible Home tuition",
      "Flexible weekly learning rhythm",
    ],
    created_at: new Date().toISOString(),
  }));
}

export async function getPackageById(packageId: string): Promise<TuitionPackageRow | null> {
  const all = await getTuitionPackages();
  return all.find((p) => p.id === packageId) || null;
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
  tutorName?: string;
  subject: string;
  scheduledStartAt: string;
  learningGoal?: string;
}): Promise<DemoBookingRow | null> {
  if (!isSupabaseConfigured() || !params.userId) return null;

  try {
    const supabase = await createClient();

    // 1. Verify tutor exists and is approved
    const { data: tutor, error: tErr } = await supabase
      .from("public_tutor_catalog")
      .select("*")
      .eq("slug", params.tutorSlug)
      .eq("is_approved", true)
      .single();

    if (tErr || !tutor) {
      console.error("Tutor not found or not approved:", params.tutorSlug);
      return null;
    }

    // 2. Validate subject belongs to tutor
    if (tutor.subjects && tutor.subjects.length > 0 && !tutor.subjects.includes(params.subject)) {
      console.error("Subject not offered by tutor:", params.subject);
      return null;
    }

    // 3. Validate scheduledStartAt is in future
    const startDate = new Date(params.scheduledStartAt);
    if (startDate.getTime() <= Date.now()) {
      console.error("Demo booking must be in the future");
      return null;
    }

    const endDate = new Date(startDate.getTime() + 30 * 60000);

    const { data, error } = await supabase
      .from("demo_bookings")
      .insert({
        user_id: params.userId,
        student_profile_id: params.studentProfileId,
        tutor_slug: tutor.slug,
        tutor_name: tutor.name,
        subject: params.subject,
        session_mode: "online",
        duration_minutes: 30,
        price_inr: 0,
        scheduled_start_at: startDate.toISOString(),
        scheduled_end_at: endDate.toISOString(),
        status: "confirmed",
        learning_goal: params.learningGoal || null,
        meeting_reference: "demo-" + tutor.slug + "-" + Date.now().toString().slice(-4),
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
      .order("scheduled_start_at", { ascending: true });

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
  tags?: string[];
  feedbackText?: string;
  interestedInTuition?: boolean;
}): Promise<boolean> {
  if (!isSupabaseConfigured() || !params.userId || !params.bookingId) return false;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("demo_feedback").insert({
      demo_booking_id: params.bookingId,
      user_id: params.userId,
      rating: params.rating,
      tags: params.tags || [],
      feedback_text: params.feedbackText || null,
      interested_in_tuition: params.interestedInTuition ?? true,
    });

    return !error;
  } catch {
    return false;
  }
}

/**
 * 7. Schedule Preferences
 */
export async function saveSchedulePreference(params: {
  userId: string;
  studentProfileId: string;
  tutorSlug: string;
  packageId: string;
  tuitionMode: "online" | "home";
  preferredDays: string[];
  preferredTime: string;
  initialSubject?: string;
}): Promise<SchedulePreferenceRow | null> {
  if (!isSupabaseConfigured() || !params.userId) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("schedule_preferences")
      .insert({
        user_id: params.userId,
        student_profile_id: params.studentProfileId,
        tutor_slug: params.tutorSlug,
        package_id: params.packageId,
        tuition_mode: params.tuitionMode,
        preferred_days: params.preferredDays,
        preferred_time: params.preferredTime,
        timezone: "Asia/Kolkata",
        initial_subject: params.initialSubject || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to save schedule preference:", error);
      return null;
    }
    return data as SchedulePreferenceRow;
  } catch (e) {
    console.error("saveSchedulePreference error:", e);
    return null;
  }
}

/**
 * 8. Package Purchases & Simulation
 */
export async function createPackagePurchase(params: {
  userId: string;
  studentProfileId: string;
  packageId: string;
  schedulePreferenceId?: string | null;
  tutorSlug: string;
  tuitionMode: "online" | "home";
  paymentMethod?: string;
}): Promise<PackagePurchaseRow | null> {
  if (!isSupabaseConfigured() || !params.userId) return null;

  // Fail closed: simulation must be strictly enabled
  if (process.env.TUTORCONNECT_DEMO_PAYMENT_MODE !== "true") {
    console.error("Demo payment mode is disabled.");
    return null;
  }

  try {
    const supabase = await createClient();

    // 1. Try secure RPC
    const { data: rpcRes, error: rpcErr } = await supabase.rpc("create_demo_purchase", {
      p_student_profile_id: params.studentProfileId,
      p_package_id: params.packageId,
      p_tutor_slug: params.tutorSlug,
      p_tuition_mode: params.tuitionMode,
      p_schedule_preference_id: params.schedulePreferenceId || null,
      p_payment_method: params.paymentMethod || "UPI",
    });

    if (!rpcErr && rpcRes) {
      const { data: purchase } = await supabase
        .from("package_purchases")
        .select("*")
        .eq("id", rpcRes.purchase_id)
        .single();

      if (purchase) return purchase as PackagePurchaseRow;
    }

    // 2. Direct server fallback if RPC not yet created
    const pkg = await getPackageById(params.packageId);
    if (!pkg) {
      console.error("Package not found:", params.packageId);
      return null;
    }

    const tutor = await getTutorBySlug(params.tutorSlug);
    if (!tutor) {
      console.error("Tutor not found:", params.tutorSlug);
      return null;
    }

    if (params.tuitionMode === "home" && !tutor.modes.includes("home")) {
      console.error("Home tuition not offered by tutor");
      return null;
    }

    const txRef = "TC-SIM-" + Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString(36).toUpperCase();

    const { data, error } = await supabase
      .from("package_purchases")
      .insert({
        user_id: params.userId,
        student_profile_id: params.studentProfileId,
        package_id: pkg.id,
        schedule_preference_id: params.schedulePreferenceId || null,
        tutor_slug: tutor.id,
        tutor_name: tutor.name,
        tuition_mode: params.tuitionMode,
        amount_inr: pkg.price_inr,
        status: "pending",
        payment_method: params.paymentMethod || "UPI",
        transaction_reference: txRef,
        is_demo_simulation: true,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Failed to create package purchase:", error);
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

  // Fail closed check
  if (process.env.TUTORCONNECT_DEMO_PAYMENT_MODE !== "true") {
    return { success: false, error: "Simulated activation is disabled in this environment." };
  }

  try {
    const supabase = await createClient();

    // Secure RPC execution
    const { data, error } = await supabase.rpc(
      "simulate_purchase_activation",
      { p_purchase_id: purchaseId }
    );

    if (!error && data) {
      return { success: true, enrollmentId: data as string };
    }

    return { success: false, error: error?.message || "Activation RPC failed." };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * 9. User Enrollments & Sessions
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
 * 10. Mark Session Completed & Decrement Ledger
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

    return {
      success: false,
      error: rpcErr?.message || "Session completion RPC failed.",
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}
