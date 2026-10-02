"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconGraduationCap,
  IconHomeTuition,
  IconArrowRight,
  IconShieldCheck,
} from "@/components/ui/icons";

type Role = "student" | "tutor";
type AuthMode = "signin" | "create";

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
        d="M6.4 13.94A6 6 0 0 1 6.08 12c0-.67.12-1.32.32-1.94V7.47H3.05A10 10 0 0 0 2 12c0 1.62.39 3.15 1.05 4.53l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.8.51 3.84 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.95 5.47l3.35 2.59c.8-2.36 3-4.12 5.6-4.12Z"
      />
    </svg>
  );
}

function AuthPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roleFromUrl =
    searchParams.get("role") === "tutor"
      ? "tutor"
      : "student";

  const [role, setRole] = useState<Role>(roleFromUrl);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (role === "student") {
      router.push("/dashboard/student");
    } else {
      setNotice(
        "Tutor application submitted! Educator onboarding and background verification will be enabled during the provider backend phase.",
      );
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Role Selector Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/70">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                role === "student"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <IconGraduationCap size={16} />
              <span>Student / Parent</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                role === "tutor"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <IconHomeTuition size={16} />
              <span>Educator / Tutor</span>
            </button>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-extrabold text-slate-950">
                {mode === "signin"
                  ? role === "student"
                    ? "Welcome back"
                    : "Tutor sign in"
                  : role === "student"
                    ? "Create your student account"
                    : "Apply as an educator"}
              </h1>
              <p className="mt-1.5 text-xs text-slate-500">
                {mode === "signin"
                  ? "Enter your credentials to access your dashboard"
                  : role === "student"
                    ? "Join thousands of learners in Hyderabad & online"
                    : "Teach online or home tuition with verified status"}
              </p>
            </div>

            {/* Social Login Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  if (role === "student") {
                    router.push("/dashboard/student");
                  } else {
                    setNotice("Google authentication for tutors will be connected with Supabase.");
                  }
                }}
                className="btn btn-secondary w-full gap-2.5 text-xs font-bold"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Or with email
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "create" && (
                <>
                  <div>
                    <label className="form-label" htmlFor="auth-name">
                      Full Name
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Reddy"
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="form-label" htmlFor="auth-phone">
                      Mobile Number
                    </label>
                    <input
                      id="auth-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="form-input text-xs"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="form-label" htmlFor="auth-email">
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label mb-0" htmlFor="auth-password">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setNotice("Password reset email workflow will be connected.")}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    className="form-input text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {notice && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 flex items-start gap-2">
                  <IconShieldCheck size={16} className="shrink-0 mt-0.5" />
                  <span>{notice}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full min-h-[46px] text-xs font-bold shadow-xs mt-2"
              >
                <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                <IconArrowRight size={14} />
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-5 text-center text-xs text-slate-500">
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("create")}
                    className="font-bold text-blue-600 hover:text-blue-700"
                  >
                    Sign up now
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-bold text-blue-600 hover:text-blue-700"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Prototype disclaimer */}
          <p className="mt-4 text-center text-[11px] text-slate-400">
            Frontend demonstration preview &bull; Simulated authentication session
          </p>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbfbfc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading authentication...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
