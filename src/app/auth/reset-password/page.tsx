import { redirect } from "next/navigation";
import { isEmailPasswordAuthEnabled } from "@/lib/supabase/config";
import ResetPasswordClient from "./reset-password-client";

export default function ResetPasswordPage() {
  // Server-authoritative feature flag boundary:
  // Disallows accessing the password-reset experience or setting passwords
  // when email/password auth is disabled.
  if (!isEmailPasswordAuthEnabled()) {
    redirect("/auth");
  }

  return <ResetPasswordClient />;
}
