"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconGraduationCap,
  IconHomeTuition,
  IconArrowRight,
  IconCheck,
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
        "Tutor application submitted! Educator onboarding and qualification review will be enabled during the provider backend phase.",
      );
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EE]">
      {/* Header */}
      <header className="border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-xs font-bold text-[#676B64] hover:text-[#232520] transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Main Container: Editorial Split Composition */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-4xl grid gap-8 lg:grid-cols-12 items-center">
          {/* Left Column: Brand & Educational Values (Hidden on small screens) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-6">
            <div>
              <span className="inline-block rounded-full bg-[#EFEAF8] border border-[#66518A]/20 px-3 py-1 text-xs font-bold text-[#4E3C70] mb-4">
                TutorConnect Workspace
              </span>
              <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold text-[#232520] tracking-tight leading-tight">
                Empowering focused 1-on-1 learning.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#676B64]">
                Sign in to manage your upcoming demo classes, coordinate lesson schedules, and review concept notes in your private student dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-5 space-y-3.5 text-xs text-[#232520]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E9F5EF] text-[#2E7D5B]">
                  <IconCheck size={12} />
                </span>
                <span>Verified tutor profiles and reviewed qualifications</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EFEAF8] text-[#66518A]">
                  <IconCheck size={12} />
                </span>
                <span>Personalized curriculum pacing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FBE9DF] text-[#A64E28]">
                  <IconCheck size={12} />
                </span>
                <span>Zero obligation free 30-min demo</span>
              </div>
            </div>

            <p className="text-[11px] text-[#989C94]">
              Your account and learning activity will be managed through TutorConnect.
            </p>
          </div>

          {/* Right Column: Focused Auth Card */}
          <div className="w-full lg:col-span-7 max-w-md mx-auto">
            {/* Role Selector Tabs */}
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-[#ECE6DC] p-1.5 border border-[#E4DED4]">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                  role === "student"
                    ? "bg-[#FFFEFB] text-[#232520] shadow-xs"
                    : "text-[#676B64] hover:text-[#232520]"
                }`}
              >
                <IconGraduationCap size={16} className={role === "student" ? "text-[#66518A]" : "text-[#989C94]"} />
                <span>Student / Parent</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("tutor")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                  role === "tutor"
                    ? "bg-[#FFFEFB] text-[#232520] shadow-xs"
                    : "text-[#676B64] hover:text-[#232520]"
                }`}
              >
                <IconHomeTuition size={16} className={role === "tutor" ? "text-[#4F7867]" : "text-[#989C94]"} />
                <span>Educator</span>
              </button>
            </div>

            {/* Auth Form Card */}
            <div className="rounded-3xl border border-[#E4DED4] bg-[#FFFEFB] p-6 sm:p-8 shadow-xs">
              {/* Card Header */}
              <div className="mb-6 text-center">
                <h2 className="font-[family-name:var(--font-manrope)] text-2xl font-bold tracking-tight text-[#232520]">
                  {mode === "signin"
                    ? role === "student"
                      ? "Welcome back"
                      : "Educator portal"
                    : role === "student"
                    ? "Create student profile"
                    : "Apply as an educator"}
                </h2>
                <p className="mt-1.5 text-xs text-[#676B64]">
                  {mode === "signin"
                    ? "Sign in to access your learning schedule."
                    : "Join TutorConnect to schedule tailored 1-on-1 classes."}
                </p>
              </div>

              {/* Notice Banner */}
              {notice && (
                <div className="mb-5 rounded-xl border border-[#B7A5DE]/30 bg-[#F4F0FB] p-3 text-xs text-[#554477] flex items-center justify-between">
                  <span>{notice}</span>
                  <button
                    type="button"
                    onClick={() => setNotice(null)}
                    className="font-bold underline ml-2 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Social Login Button */}
              <button
                type="button"
                onClick={() => {
                  if (role === "student") router.push("/dashboard/student");
                  else setNotice("Google Authentication simulated for prototype.");
                }}
                className="flex w-full min-h-[46px] items-center justify-center gap-3 rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-4 py-2.5 text-xs font-bold text-[#232520] shadow-2xs hover:bg-[#F7F4EE] hover:border-[#66518A]/30 transition"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#ECE6DC]" />
                <span className="text-[11px] font-bold uppercase text-[#989C94]">
                  Or with email
                </span>
                <div className="h-px flex-1 bg-[#ECE6DC]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "create" && (
                  <div>
                    <label className="form-label text-xs">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={role === "student" ? "e.g. Aarav Reddy" : "e.g. Ananya Sharma"}
                      className="form-input text-xs"
                    />
                  </div>
                )}

                {mode === "create" && (
                  <div>
                    <label className="form-label text-xs">Phone Number (Hyderabad)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="form-input text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="form-label text-xs">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="form-label text-xs mb-0">Password</label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setNotice("Password reset email simulated.")}
                        className="text-[11px] font-bold text-[#66518A] hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="form-input text-xs pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#989C94] hover:text-[#232520]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full min-h-[46px] text-xs font-bold shadow-xs mt-2"
                >
                  <span>
                    {mode === "signin"
                      ? "Sign In to Workspace"
                      : role === "student"
                      ? "Create Account"
                      : "Submit Application"}
                  </span>
                  <IconArrowRight size={14} />
                </button>
              </form>

              {/* Mode Toggle Switch */}
              <div className="mt-5 text-center text-xs text-[#676B64]">
                {mode === "signin" ? (
                  <span>
                    Don&apos;t have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("create")}
                      className="font-bold text-[#66518A] hover:underline cursor-pointer"
                    >
                      Create one
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="font-bold text-[#66518A] hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4DED4] bg-[#FFFEFB] py-4 text-center text-xs text-[#989C94]">
        <span>&copy; 2026 TutorConnect. 1-on-1 tutoring in Hyderabad.</span>
      </footer>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#676B64]">Loading authentication...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
