import { redirect } from "next/navigation";
import { getVerifiedAuth } from "@/lib/supabase/auth";
import { getTutorBySlug, getLearnerProfiles } from "@/lib/services/workflow";
import { tutors as mockTutors } from "@/lib/data";
import { DemoBookForm } from "./book-form";

interface DemoBookPageProps {
  searchParams: Promise<{
    tutor?: string;
  }>;
}

export default async function DemoBookPage({
  searchParams,
}: DemoBookPageProps) {
  const params = await searchParams;
  const tutorSlug = params.tutor || "ananya-sharma";

  const auth = await getVerifiedAuth();

  // If Supabase is configured and user is not authenticated, redirect to /auth with safe next route
  if (auth.isConfigured && !auth.isAuthenticated) {
    redirect(`/auth?next=${encodeURIComponent(`/demo/book?tutor=${tutorSlug}`)}`);
  }

  // Fetch tutor details
  const tutor =
    (await getTutorBySlug(tutorSlug)) ||
    mockTutors.find((t) => t.id === tutorSlug) ||
    mockTutors[0];

  // Fetch learner profiles for authenticated user
  const profiles = auth.userId ? await getLearnerProfiles(auth.userId) : [];

  return (
    <DemoBookForm
      tutor={tutor}
      initialProfiles={profiles}
      isAuthenticated={auth.isAuthenticated}
    />
  );
}
