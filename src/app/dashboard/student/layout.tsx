import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getVerifiedAuth, getAccountRoles } from "@/lib/supabase/auth";
import Link from "next/link";
import { IconShieldCheck } from "@/components/ui/icons";

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

  // If authenticated, check roles
  if (auth.isConfigured && auth.isAuthenticated && auth.userId) {
    const roles = await getAccountRoles(auth.userId);

    // If account has no roles assigned yet, route to onboarding
    if (roles.length === 0) {
      redirect("/auth/onboarding?next=/dashboard/student");
    }

    // Must possess 'parent' or 'student' role
    const hasLearnerAccess = roles.some((r) => r === "parent" || r === "student");
    if (!hasLearnerAccess) {
      // User is authenticated as tutor only. Display polite role-denied UI with option to add learner role
      return (
        <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
          <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
            <div className="container-shell flex items-center justify-between">
              <span className="font-[family-name:var(--font-manrope)] text-lg font-extrabold text-[#25231F]">
                Tutor<span className="text-[#315F52]">Connect</span>
              </span>
              <form method="POST" action="/auth/signout">
                <button
                  type="submit"
                  className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-8 text-center shadow-[0_12px_40px_rgba(55,48,40,0.04)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#C84B31] mb-4">
                <IconShieldCheck size={24} />
              </div>
              <h2 className="font-[family-name:var(--font-manrope)] text-xl font-extrabold text-[#25231F]">
                Student Workspace Restricted
              </h2>
              <p className="mt-2 text-xs text-[#6F6A62] leading-relaxed">
                This workspace is reserved for Parent and Student accounts. Your account currently has the{" "}
                <span className="font-bold text-[#25231F]">Tutor</span> role.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/auth/onboarding?role=student&next=/dashboard/student"
                  className="btn btn-primary w-full min-h-[44px] rounded-full text-xs font-bold justify-center"
                >
                  Add Student Profile to Account
                </Link>
                <Link
                  href="/tutors"
                  className="btn btn-outline w-full min-h-[44px] rounded-full text-xs font-bold justify-center"
                >
                  Browse Tutor Marketplace
                </Link>
              </div>
            </div>
          </main>
        </div>
      );
    }
  }

  return (
    <>
      {!auth.isConfigured && (
        <div
          role="status"
          className="bg-[#FFF7ED] border-b border-[rgba(55,48,40,0.10)] px-4 py-2 text-center text-xs text-[#6F6A62] font-semibold"
        >
          <span className="text-[#315F52] font-bold">Workspace Preview:</span> Connect Supabase in{" "}
          <code className="bg-white px-1.5 py-0.5 rounded border border-[rgba(55,48,40,0.10)]">.env.local</code> to activate live account authorization.
        </div>
      )}
      {children}
    </>
  );
}
