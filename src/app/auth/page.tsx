"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconArrowRight,
  IconCheck,
} from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sanitizeInternalRedirect } from "@/lib/utils/redirect";

type RoleIntent = "student" | "tutor";

// Feature flag: Google is primary authentication for demo. Email/magic-link UI is hidden from normal flow.
const SHOW_EMAIL_AUTH = false;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.38Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.4l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.94A5.99 5.99 0 0 1 6.07 12c0-.68.12-1.34.33-1.94H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.53l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.78.5 3.82 1.5l2.87-2.87C16.96 2.97 14.7 2 12 2A10 10 0 0 0 3.05 7.47l3.35 2.59c.8-2.36 3-4.1 5.6-4.1Z"
      />
    </svg>
  );
}

function AuthInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "tutor" || searchParams.get("intent") === "tutor"
      ? "tutor"
      : "student";
  const defaultNextForRole =
    initialRole === "tutor" ? "/dashboard/tutor/pending" : "/tutors";
  const nextParam = searchParams.get("next") || defaultNextForRole;
  const intentParam = searchParams.get("intent") || searchParams.get("role");
  const errorParam = searchParams.get("error");

  const [role, setRole] = useState<RoleIntent>(initialRole);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "email_sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState(
    errorParam ? "Authentication attempt could not be completed. Please try again." : ""
  );

  // OTP Fallback State (preserved for email flows)
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState("");

  const isConfigured = isSupabaseConfigured();

  // Manual resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      setStatus("error");
      setErrorMessage(
        "Supabase credentials are not configured. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
      );
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");
      const supabase = createClient();
      const defaultNext = role === "tutor" ? "/dashboard/tutor/pending" : "/tutors";
      const safeNext = sanitizeInternalRedirect(nextParam, defaultNext);
      const origin = window.location.origin;
      const redirectTo = origin + "/auth/callback?next=" + encodeURIComponent(safeNext) + "&intent=" + role;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message || "Google sign-in could not be initiated. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred during Google sign-in. Please try again.");
    }
  };

  const handleMagicLinkSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isConfigured) {
      setStatus("error");
      setErrorMessage(
        "Supabase authentication runtime is not configured."
      );
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");
      setOtp("");
      setOtpError("");
      setResendNotice("");

      const supabase = createClient();
      const safeNext = sanitizeInternalRedirect(nextParam, "/dashboard/student");
      const origin = window.location.origin;
      const emailRedirectTo = origin + "/auth/confirm?next=" + encodeURIComponent(safeNext) + "&intent=" + role;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        setStatus("error");
        if (error.status === 429 || error.message.toLowerCase().includes("rate limit")) {
          setErrorMessage("Email rate limit exceeded. Please wait a few minutes before trying again.");
        } else {
          setErrorMessage(error.message || "Unable to send magic link. Please check your email and try again.");
        }
      } else {
        setStatus("email_sent");
        setResendCooldown(60);
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again in a few moments.");
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setResendNotice("");
    setOtpError("");

    try {
      const supabase = createClient();
      const safeNext = sanitizeInternalRedirect(nextParam, "/dashboard/student");
      const origin = window.location.origin;
      const emailRedirectTo = origin + "/auth/confirm?next=" + encodeURIComponent(safeNext) + "&intent=" + role;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        if (error.status === 429 || error.message.toLowerCase().includes("rate limit")) {
          setOtpError("Email rate limit reached. Please wait a few minutes before requesting another code.");
        } else {
          setOtpError(error.message || "Failed to resend verification email. Please try again.");
        }
      } else {
        setResendNotice("A new verification link and 6-digit code has been sent to your email.");
        setResendCooldown(60);
      }
    } catch {
      setOtpError("An unexpected error occurred while resending. Please try again in a moment.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();

    const cleanOtp = otp.trim().replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (!isConfigured) {
      setOtpError("Supabase authentication runtime is not configured.");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setOtpError("");
      setResendNotice("");

      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: cleanOtp,
        type: "email",
      });

      if (error) {
        if (error.status === 429 || error.message.toLowerCase().includes("rate limit")) {
          setOtpError("Verification attempts rate limited. Please wait a moment and try again.");
        } else {
          setOtpError(error.message || "Invalid or expired verification code. Please check your email or request a new code.");
        }
        setIsVerifyingOtp(false);
        return;
      }

      // Preserve next, intent, tutor intent, and onboarding flow
      const safeNext = sanitizeInternalRedirect(nextParam, "/dashboard/student");
      const userId = data.user?.id;
      let targetUrl = safeNext;

      if (userId) {
        const { data: roles } = await supabase
          .from("account_roles")
          .select("role")
          .eq("user_id", userId);

        if (!roles || roles.length === 0) {
          const onboardingParams = new URLSearchParams();
          const targetIntent =
            intentParam === "tutor" || intentParam === "student" || intentParam === "parent"
              ? intentParam
              : role === "tutor"
              ? "tutor"
              : "student";

          onboardingParams.set("intent", targetIntent);
          onboardingParams.set("next", safeNext);
          targetUrl = "/auth/onboarding?" + onboardingParams.toString();
        }
      }

      router.push(targetUrl);
      router.refresh();
    } catch {
      setOtpError("An unexpected error occurred while verifying the code. Please try again.");
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFDFE] text-[#18211E]">
      <header className="border-b border-[rgba(24,33,30,0.08)] bg-white/88 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-xs font-bold text-[#66716D] hover:text-[#18211E] transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Context & Simple Factual Messaging */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#236B5B]">
                {role === "student" ? "Student & Parent" : "Tutor Portal"}
              </p>

              <h1 className="font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18211E] leading-[1.15]">
                {role === "student"
                  ? "Manage your tutoring journey in one place."
                  : "Join TutorConnect as a tutor."}
              </h1>

              <p className="text-sm leading-relaxed text-[#66716D]">
                {role === "student"
                  ? "Sign in to explore tutors, book demos, and manage your learning schedule."
                  : "Sign in to continue your tutor profile and application."}
              </p>

              <div className="space-y-3 pt-2 text-xs font-medium text-[#66716D]">
                <div className="flex items-center gap-2">
                  <IconCheck size={14} className="text-[#236B5B]" />
                  <span>Quick, secure sign-in with your Google account</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck size={14} className="text-[#236B5B]" />
                  <span>
                    {role === "student"
                      ? "Book 30-minute demos and manage your lesson calendar"
                      : "Manage your teaching profile, demo availability, and hourly rates"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Focused Auth Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[rgba(24,33,30,0.08)] bg-white p-7 sm:p-9 shadow-[0_8px_32px_rgba(24,33,30,0.04)]">
                {/* Role Intent Switcher */}
                <div className="flex rounded-full bg-[#F4F8FB] p-1 border border-[rgba(24,33,30,0.08)] mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("student");
                      setStatus("idle");
                      setErrorMessage("");
                      setOtpError("");
                    }}
                    className={
                      "flex-1 rounded-full py-2.5 text-xs font-bold transition-all text-center " +
                      (role === "student"
                        ? "bg-[#236B5B] text-white shadow-xs"
                        : "text-[#66716D] hover:text-[#18211E]")
                    }
                  >
                    Student / Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole("tutor");
                      setStatus("idle");
                      setErrorMessage("");
                      setOtpError("");
                    }}
                    className={
                      "flex-1 rounded-full py-2.5 text-xs font-bold transition-all text-center " +
                      (role === "tutor"
                        ? "bg-[#236B5B] text-white shadow-xs"
                        : "text-[#66716D] hover:text-[#18211E]")
                    }
                  >
                    Educator / Tutor
                  </button>
                </div>

                <div className="mb-6">
                  <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#18211E]">
                    {role === "student" ? "Sign in as Student or Parent" : "Sign in as Tutor"}
                  </h2>
                  <p className="mt-1 text-xs text-[#66716D]">
                    {role === "student"
                      ? "Explore tutors, book demo sessions, and manage your tuition schedule."
                      : "Access your teaching profile, availability, and inquiries."}
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-5 rounded-2xl border border-[#C84B31]/25 bg-[#FCEEEA] p-4 text-xs font-medium text-[#C84B31]"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* State: Email Sent with OTP Fallback (retained internally for email flows) */}
                {status === "email_sent" ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-[#236B5B]/20 bg-[#E2F5EC]/50 p-6 text-center space-y-3">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#236B5B] text-white">
                        <IconCheck size={20} />
                      </div>
                      <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#18211E]">
                        Check your email
                      </h3>
                      <p className="text-xs text-[#66716D] leading-relaxed max-w-sm mx-auto">
                        We sent a secure magic link and 6-digit verification code to <strong className="text-[#18211E]">{email}</strong>. Click the link in your email to sign in immediately.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[rgba(24,33,30,0.08)] bg-white p-5 sm:p-6 space-y-4">
                      <div className="text-center space-y-1">
                        <p className="text-xs font-semibold text-[#18211E]">
                          Link not working? Enter the 6-digit code from the email.
                        </p>
                      </div>

                      {/* OTP Form */}
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                          <label
                            htmlFor="auth-otp"
                            className="text-xs font-bold text-[#66716D] block mb-2 text-center"
                          >
                            6-Digit Verification Code
                          </label>
                          <input
                            id="auth-otp"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            autoComplete="one-time-code"
                            aria-label="6-digit verification code"
                            disabled={isVerifyingOtp}
                            value={otp}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                              setOtp(val);
                              setOtpError("");
                            }}
                            placeholder="------"
                            className="w-full max-w-xs mx-auto block rounded-2xl border border-[rgba(24,33,30,0.12)] bg-[#F4F8FB] px-4 py-3 text-center text-xl sm:text-2xl font-mono font-bold tracking-[0.35em] text-[#18211E] placeholder:text-[#9BAAA5] focus:border-[#236B5B] focus:outline-hidden focus:ring-2 focus:ring-[#236B5B]/15 transition min-h-[48px]"
                          />
                        </div>

                        {otpError && (
                          <div
                            role="alert"
                            className="rounded-xl border border-[#C84B31]/25 bg-[#FCEEEA] p-3 text-xs font-medium text-[#C84B31] text-center"
                          >
                            {otpError}
                          </div>
                        )}

                        {resendNotice && (
                          <div
                            role="status"
                            className="rounded-xl border border-[#236B5B]/20 bg-[#E2F5EC] p-3 text-xs font-medium text-[#1A5247] text-center"
                          >
                            {resendNotice}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isVerifyingOtp || otp.length !== 6}
                          className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(35,107,91,0.22)] justify-center gap-2 disabled:opacity-50 transition"
                        >
                          <span>{isVerifyingOtp ? "Verifying code..." : "Verify code"}</span>
                          <IconArrowRight size={15} />
                        </button>
                      </form>

                      {/* Manual Resend & Different Email options */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-[rgba(24,33,30,0.06)] pt-4">
                        <button
                          type="button"
                          disabled={isResending || resendCooldown > 0}
                          onClick={handleResendOtp}
                          className="font-bold text-[#236B5B] hover:underline disabled:opacity-50 disabled:no-underline min-h-[44px] inline-flex items-center"
                        >
                          {resendCooldown > 0
                            ? ("Resend code in " + resendCooldown + "s")
                            : isResending
                            ? "Sending..."
                            : "Resend code / link"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setStatus("idle");
                            setOtp("");
                            setOtpError("");
                            setResendNotice("");
                            setErrorMessage("");
                          }}
                          className="font-semibold text-[#66716D] hover:text-[#18211E] min-h-[44px] inline-flex items-center"
                        >
                          Use a different email
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Primary: Google OAuth Button */}
                    <button
                      type="button"
                      disabled={status === "loading"}
                      onClick={handleGoogleSignIn}
                      className="btn btn-outline w-full min-h-[50px] rounded-full text-sm font-bold gap-3 justify-center border border-[rgba(24,33,30,0.12)] bg-white text-[#18211E] hover:border-[#236B5B]/40 hover:bg-[#F4F8FB] transition disabled:opacity-50 shadow-xs"
                    >
                      <GoogleIcon />
                      <span>{status === "loading" ? "Connecting to Google..." : "Continue with Google"}</span>
                    </button>

                    <p className="mt-4 text-center text-xs text-[#9BAAA5]">
                      Secure, fast sign-in using your Google account.
                    </p>

                    {/* Email / Magic Link UI (hidden for demo, underlying implementation preserved) */}
                    {SHOW_EMAIL_AUTH && (
                      <div className="mt-6 pt-6 border-t border-[rgba(24,33,30,0.08)]">
                        <div className="relative mb-5 text-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[rgba(24,33,30,0.08)]" />
                          </div>
                          <span className="relative bg-white px-3 text-[11px] font-semibold text-[#9BAAA5]">
                            or with email magic link
                          </span>
                        </div>

                        <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="auth-email" className="text-xs font-bold text-[#66716D] block mb-1">
                              Email Address
                            </label>
                            <input
                              id="auth-email"
                              type="email"
                              required
                              disabled={status === "loading"}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full rounded-2xl border border-[rgba(24,33,30,0.12)] bg-[#F4F8FB] px-4 py-3 text-sm font-semibold text-[#18211E] placeholder:text-[#9BAAA5] focus:border-[#236B5B] focus:outline-hidden focus:ring-2 focus:ring-[#236B5B]/15 transition"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={status === "loading"}
                            className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(35,107,91,0.22)] justify-center gap-2 mt-2 disabled:opacity-50"
                          >
                            <span>{status === "loading" ? "Sending Link..." : "Send Magic Link"}</span>
                            <IconArrowRight size={15} />
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFDFE]" />}>
      <AuthInner />
    </Suspense>
  );
}
