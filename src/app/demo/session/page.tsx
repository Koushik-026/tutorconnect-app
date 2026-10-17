import { redirect } from "next/navigation";
import { getVerifiedAuth } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DemoBookingRow } from "@/lib/types/database";
import { evaluateDemoJoinWindow } from "@/lib/utils/timing";
import { DemoSessionClient } from "@/components/demo/demo-session-client";

interface DemoSessionPageProps {
  searchParams: Promise<{
    booking_id?: string;
  }>;
}

export default async function DemoSessionPage({
  searchParams,
}: DemoSessionPageProps) {
  // Fail closed: Never allow session access if Supabase is unconfigured
  if (!isSupabaseConfigured()) {
    redirect("/auth?error=unconfigured");
  }

  // 1. Read booking_id from searchParams
  const params = await searchParams;
  const bookingId = params.booking_id;
  if (!bookingId) {
    redirect("/tutors");
  }

  // 2. Resolve authenticated user using existing Supabase server auth helpers
  const auth = await getVerifiedAuth();
  if (!auth.isAuthenticated || !auth.userId) {
    redirect(
      `/auth?intent=student&next=${encodeURIComponent(`/demo/session?booking_id=${bookingId}`)}`
    );
  }

  // 3. Query the booking server-side
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("demo_bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("user_id", auth.userId)
    .single();

  // 4. Require booking ownership: booking.user_id === authenticated user
  if (error || !data) {
    redirect("/tutors");
  }

  const booking = data as DemoBookingRow;
  if (booking.user_id !== auth.userId) {
    redirect("/tutors");
  }

  // 5. Reject: cancelled, no_show
  if (booking.status === "cancelled" || booking.status === "no_show") {
    redirect(`/demo/confirmation?booking_id=${bookingId}`);
  }

  // 6. Completed: redirect to /demo/feedback
  if (booking.status === "completed") {
    redirect(`/demo/feedback?booking_id=${bookingId}`);
  }

  // 7. Evaluate the canonical join window SERVER-SIDE using evaluateDemoJoinWindow()
  const timing = evaluateDemoJoinWindow(
    booking.scheduled_start_at,
    booking.scheduled_end_at
  );

  // 8. too_early: redirect to /demo/waiting-room?booking_id=...
  if (timing.reason === "too_early") {
    redirect(`/demo/waiting-room?booking_id=${bookingId}`);
  }

  // 9. expired or invalid_timing: redirect safely to /demo/confirmation?booking_id=...
  if (timing.reason === "expired" || timing.reason === "invalid_timing" || !timing.canJoin) {
    redirect(`/demo/confirmation?booking_id=${bookingId}`);
  }

  // Resolve student profile display name server-side if exists
  let studentName = "Student";
  if (booking.student_profile_id) {
    const { data: sp } = await supabase
      .from("student_profiles")
      .select("display_name")
      .eq("id", booking.student_profile_id)
      .single();
    if (sp?.display_name) {
      studentName = sp.display_name;
    }
  }

  // 10. Only after every check passes: render the interactive demo-room client component
  return (
    <DemoSessionClient
      bookingId={booking.id}
      tutorName={booking.tutor_name || "Educator"}
      studentName={studentName}
      subjectName={booking.subject || "Focus Subject"}
      scheduledEndAt={booking.scheduled_end_at}
    />
  );
}
