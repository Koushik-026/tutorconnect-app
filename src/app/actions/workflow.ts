"use server";

import { revalidatePath } from "next/cache";
import { getVerifiedAuth } from "@/lib/supabase/auth";
import {
  createLearnerProfile,
  createDemoBooking,
  submitDemoFeedback,
  createPackagePurchase,
  activatePurchaseSimulation,
  markClassSessionCompleted,
} from "@/lib/services/workflow";

/**
 * Server Action: Create Learner Profile
 */
export async function createLearnerProfileAction(formData: FormData) {
  const auth = await getVerifiedAuth();
  if (!auth.isAuthenticated || !auth.userId) {
    return { success: false, error: "Authentication required" };
  }

  const displayName = formData.get("display_name") as string;
  const classLevel = formData.get("class_level") as string;
  const board = formData.get("board") as string;

  if (!displayName || !classLevel || !board) {
    return { success: false, error: "All profile fields are required." };
  }

  const profile = await createLearnerProfile({
    userId: auth.userId,
    displayName,
    classLevel,
    board,
  });

  if (!profile) {
    return { success: false, error: "Failed to create learner profile." };
  }

  revalidatePath("/dashboard/student");
  return { success: true, profile };
}

/**
 * Server Action: Submit Free Demo Booking
 */
export async function submitDemoBookingAction(params: {
  studentProfileId: string;
  tutorSlug: string;
  tutorName: string;
  subject: string;
  scheduledStartAt: string;
  learningGoal?: string;
}) {
  const auth = await getVerifiedAuth();
  if (!auth.isAuthenticated || !auth.userId) {
    return { success: false, error: "Authentication required" };
  }

  const booking = await createDemoBooking({
    userId: auth.userId,
    studentProfileId: params.studentProfileId,
    tutorSlug: params.tutorSlug,
    tutorName: params.tutorName,
    subject: params.subject,
    scheduledStartAt: params.scheduledStartAt,
    learningGoal: params.learningGoal,
  });

  if (!booking) {
    return { success: false, error: "Unable to complete demo booking." };
  }

  revalidatePath("/dashboard/student");
  return { success: true, bookingId: booking.id };
}

/**
 * Server Action: Submit Demo Feedback
 */
export async function submitDemoFeedbackAction(params: {
  bookingId: string;
  rating: number;
  tags: string[];
  feedbackText?: string;
  interestedInTuition?: boolean;
}) {
  const auth = await getVerifiedAuth();
  if (!auth.isAuthenticated || !auth.userId) {
    return { success: false, error: "Authentication required" };
  }

  const ok = await submitDemoFeedback({
    bookingId: params.bookingId,
    userId: auth.userId,
    rating: params.rating,
    tags: params.tags,
    feedbackText: params.feedbackText,
    interestedInTuition: params.interestedInTuition,
  });

  return { success: ok };
}

/**
 * Server Action: Create Package Purchase & Simulate Activation
 */
export async function createAndActivatePurchaseAction(params: {
  studentProfileId: string;
  packageId: string;
  tutorSlug: string;
  tutorName: string;
  tuitionMode: "online" | "home";
  amountInr: number;
  paymentMethod?: string;
  simulateFailure?: boolean;
}) {
  const auth = await getVerifiedAuth();
  if (!auth.isAuthenticated || !auth.userId) {
    return { success: false, error: "Authentication required" };
  }

  if (params.simulateFailure) {
    return { success: false, error: "Bank payment simulation failed as requested." };
  }

  // 1. Create Purchase row
  const purchase = await createPackagePurchase({
    userId: auth.userId,
    studentProfileId: params.studentProfileId,
    packageId: params.packageId,
    tutorSlug: params.tutorSlug,
    tutorName: params.tutorName,
    tuitionMode: params.tuitionMode,
    amountInr: params.amountInr,
    paymentMethod: params.paymentMethod,
  });

  if (!purchase) {
    return { success: false, error: "Unable to initiate package purchase." };
  }

  // 2. Activate purchase
  const activation = await activatePurchaseSimulation(purchase.id);
  if (!activation.success) {
    return { success: false, error: activation.error || "Activation failed." };
  }

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/sessions");
  return {
    success: true,
    purchaseId: purchase.id,
    enrollmentId: activation.enrollmentId,
    transactionReference: purchase.transaction_reference,
  };
}

/**
 * Server Action: Mark Class Session Completed
 */
export async function completeClassSessionAction(sessionId: string, notes?: string) {
  const auth = await getVerifiedAuth();
  if (!auth.isAuthenticated || !auth.userId) {
    return { success: false, error: "Authentication required" };
  }

  const result = await markClassSessionCompleted(sessionId, notes);
  if (!result.success) {
    return { success: false, error: result.error || "Failed to mark class completed." };
  }

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/sessions");
  return { success: true, remainingClasses: result.remainingClasses };
}
