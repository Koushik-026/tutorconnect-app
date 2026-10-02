"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconArrowRight,
  IconShieldCheck,
  IconVideo,
  IconCheck,
} from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sanitizeInternalRedirect } from "@/lib/utils/redirect";

type RoleIntent = "student" | "tutor";

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
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "tutor" ? "tutor" : "student";
  const nextParam = searchParams.get("next") || "/dashboard/student";
  const errorParam = searchParams.get("error");

  const [role, setRole] = useState<RoleIntent>(initialRole);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "email_sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState(
    errorParam ? "Authentication attempt could not be completed. Please try again." : ""
  );

  const isConfigured = isSupabaseConfigured();

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      setStatus("error");
      setErrorMessage(
        "Supabase credentials are not yet configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local to activate live Google authentication."
      );
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");
      const supabase = createClient();
      const safeNext = sanitizeInternalRedirect(nextParam, "/dashboard/student");
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}&intent=${role}`;

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
        "Supabase authentication runtime is not yet configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local to activate live magic link sign-in."
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
      const supabase = createClient();
      const safeNext = sanitizeInternalRedirect(nextParam, "/dashboard/student");
      const origin = window.location.origin;
      const emailRedirectTo = `${origin}/auth/confirm?next=${encodeURIComponent(safeNext)}&intent=${role}`;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message || "Unable to send magic link. Please check your email and try again.");
      } else {
        setStatus("email_sent");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again in a few moments.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5] text-[#25231F]">
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Context & Trust */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#315F52]/20 bg-[#E4EEE9] px-3.5 py-1 text-xs font-bold text-[#244A40]">
                <IconShieldCheck size={14} className="text-[#315F52]" />
                <span>Verified Educational Access</span>
              </span>

              <h1 className="font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#25231F]">
                {role === "student"
                  ? "Welcome to your student learning space."
                  : "Educator portal & application hub."}
              </h1>

              <p className="text-sm leading-relaxed text-[#6F6A62]">
                {role === "student"
                  ? "Sign in to manage your tuition routine, access lesson notes shared by your tutor, and attend 1-on-1 classes."
                  : "Sign in to manage your teaching calendar, demo inquiries, and student routines in Hyderabad."}
              </p>

              <div className="space-y-3 pt-2 text-xs font-medium text-[#6F6A62]">
                <div className="flex items-center gap-2">
                  <IconCheck size={14} className="text-[#315F52]" />
                  <span>Passwordless, secure authentication via Google or Magic Link</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconShieldCheck size={14} className="text-[#315F52]" />
                  <span>Minor-safe authorization with parent-controlled student profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconVideo size={14} className="text-[#315F52]" />
                  <span>Direct connection to your scheduled learning sessions</span>
                </div>
              </div>
            </div>

            {/* Right Column: Focused Auth Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-9 shadow-[0_12px_40px_rgba(55,48,40,0.04)]">
                {/* Role Intent Switcher */}
                <div className="flex rounded-full bg-[#FFFBF5] p-1 border border-[rgba(55,48,40,0.10)] mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("student");
                      setStatus("idle");
                      setErrorMessage("");
                    }}
                    className={`flex-1 rounded-full py-2 text-xs font-bold transition-all text-center ${
                      role === "student"
                        ? "bg-[#315F52] text-white shadow-xs"
                        : "text-[#6F6A62] hover:text-[#25231F]"
                    }`}
                  >
                    Student / Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole("tutor");
                      setStatus("idle");
                      setErrorMessage("");
                    }}
                    className={`flex-1 rounded-full py-2 text-xs font-bold transition-all text-center ${
                      role === "tutor"
                        ? "bg-[#315F52] text-white shadow-xs"
                        : "text-[#6F6A62] hover:text-[#25231F]"
                    }`}
                  >
                    Educator / Tutor
                  </button>
                </div>

                <div className="mb-6">
                  <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold text-[#25231F]">
                    {role === "student" ? "Sign in to Student Space" : "Educator Portal Access"}
                  </h2>
                  <p className="mt-1 text-xs text-[#6F6A62]">
                    {role === "student"
                      ? "Track your tuition routine, upcoming classes, and digital lesson notes."
                      : "Manage your student inquiries, demo slots, and teaching schedule."}
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-5 rounded-2xl border border-[#C84B31]/25 bg-[#FCEEEA] p-4 text-xs font-medium text-[#A6361E]"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* State: Email Sent */}
                {status === "email_sent" ? (
                  <div className="rounded-2xl border border-[#315F52]/20 bg-[#E4EEE9]/50 p-6 text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#315F52] text-white">
                      <IconCheck size={20} />
                    </div>
                    <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#25231F]">
                      Check your email
                    </h3>
                    <p className="text-xs text-[#6F6A62] leading-relaxed max-w-sm mx-auto">
                      We sent a secure magic link to <strong className="text-[#25231F]">{email}</strong>. Click the link in your email to sign in immediately.
                    </p>
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setStatus("idle");
                          setEmail("");
                        }}
                        className="text-xs font-bold text-[#315F52] hover:underline"
                      >
                        Use a different email address
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      disabled={status === "loading"}
                      onClick={handleGoogleSignIn}
                      className="btn btn-outline w-full min-h-[48px] rounded-full text-xs font-bold gap-2.5 justify-center mb-5 hover:border-[#315F52]/40 transition disabled:opacity-50"
                    >
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </button>

                    <div className="relative mb-5 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[rgba(55,48,40,0.10)]" />
                      </div>
                      <span className="relative bg-white px-3 text-[11px] font-semibold text-[#9B958C]">
                        or with email magic link
                      </span>
                    </div>

                    {/* Email Magic Link Form */}
                    <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="auth-email" className="text-xs font-bold text-[#6F6A62] block mb-1">
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
                          className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-3 text-sm font-semibold text-[#25231F] placeholder:text-[#9B958C] focus:border-[#315F52] focus:outline-hidden focus:ring-2 focus:ring-[#315F52]/15 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2 mt-2 disabled:opacity-50"
                      >
                        <span>{status === "loading" ? "Sending Link..." : "Send Magic Link"}</span>
                        <IconArrowRight size={15} />
                      </button>
                    </form>

                    {!isSupabaseConfigured && (
                      <p className="mt-4 text-center text-[11px] text-[#9B958C]">
                        Supabase credentials can be configured via <code className="bg-[#FFF7ED] px-1 py-0.5 rounded">.env.local</code>.
                      </p>
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
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF5]" />}>
      <AuthInner />
    </Suspense>
  );
}
