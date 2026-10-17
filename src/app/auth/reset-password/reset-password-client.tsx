"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { IconArrowRight, IconCheck, IconShieldCheck } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function ResetPasswordInner() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);

  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    async function checkSession() {
      if (!isConfigured) {
        setHasValidSession(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          setHasValidSession(false);
        } else {
          setHasValidSession(true);
        }
      } catch {
        setHasValidSession(false);
      }
    }
    checkSession();
  }, [isConfigured]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setErrorMessage("Supabase authentication is not configured.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");

      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message || "Failed to update password. Please try again.");
        return;
      }

      setStatus("success");

      // Redirect through the server-authoritative resolver
      setTimeout(() => {
        router.push("/auth/resolve");
      }, 1500);
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred while updating your password.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] text-[var(--tc-text-primary)] transition-colors">
      <header className="border-b border-[var(--tc-border)] bg-[var(--tc-surface)]/88 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/auth"
            className="text-xs font-bold text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] transition"
          >
            &larr; Back to Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-md mx-auto">
          <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-7 sm:p-9 shadow-xs">
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tc-primary)]/20 bg-[#E2F5EC] px-3 py-1 text-xs font-bold text-[#1A5247] mb-3">
                <IconShieldCheck size={14} className="text-[var(--tc-primary)]" />
                <span>Password Recovery</span>
              </span>
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[var(--tc-text-primary)]">
                Set New Password
              </h1>
              <p className="mt-1 text-xs text-[var(--tc-text-secondary)]">
                Enter your new password below to regain access to your account.
              </p>
            </div>

            {hasValidSession === false && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-[var(--tc-danger)]/20 bg-[var(--tc-danger)]/10 p-4 text-xs font-medium text-[var(--tc-danger)]"
              >
                Your password recovery session is invalid or has expired. Please{" "}
                <Link href="/auth" className="underline font-bold">
                  request a new reset link
                </Link>
                .
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-[var(--tc-danger)]/20 bg-[var(--tc-danger)]/10 p-4 text-xs font-medium text-[var(--tc-danger)]"
              >
                {errorMessage}
              </div>
            )}

            {status === "success" ? (
              <div className="rounded-2xl border border-[var(--tc-primary)]/20 bg-[#E2F5EC]/50 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tc-primary)] text-white">
                  <IconCheck size={20} />
                </div>
                <h3 className="font-[family-name:var(--font-manrope)] text-base font-bold text-[var(--tc-text-primary)]">
                  Password Updated Successfully
                </h3>
                <p className="text-xs text-[var(--tc-text-secondary)]">
                  Redirecting you to your account...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="new-password"
                    className="text-xs font-bold text-[var(--tc-text-secondary)] block mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    disabled={status === "loading" || hasValidSession === false}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="At least 8 characters"
                    className="w-full rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--tc-text-primary)] placeholder:text-[var(--tc-text-secondary)] focus:border-[var(--tc-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--tc-primary)]/15 transition min-h-[48px]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="text-xs font-bold text-[var(--tc-text-secondary)] block mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    disabled={status === "loading" || hasValidSession === false}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Re-enter password"
                    className="w-full rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--tc-text-primary)] placeholder:text-[var(--tc-text-secondary)] focus:border-[var(--tc-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--tc-primary)]/15 transition min-h-[48px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || hasValidSession === false}
                  className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(35,107,91,0.22)] justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <span>{status === "loading" ? "Updating..." : "Update Password"}</span>
                  <IconArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFDFE]" />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
