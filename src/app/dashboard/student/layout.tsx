import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getVerifiedAuth } from "@/lib/supabase/auth";

export default async function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getVerifiedAuth();

  // If Supabase runtime is configured and the user is not authenticated, redirect to /auth
  if (auth.isConfigured && !auth.isAuthenticated) {
    redirect("/auth?next=/dashboard/student");
  }

  return (
    <>
      {!auth.isConfigured && (
        <div
          role="status"
          className="bg-[#FFF7ED] border-b border-[rgba(55,48,40,0.10)] px-4 py-2 text-center text-xs text-[#6F6A62] font-semibold"
        >
          <span className="text-[#315F52] font-bold">Workspace Preview:</span> Connect Supabase in <code className="bg-white px-1.5 py-0.5 rounded border border-[rgba(55,48,40,0.10)]">.env.local</code> to activate live account authorization.
        </div>
      )}
      {children}
    </>
  );
}
