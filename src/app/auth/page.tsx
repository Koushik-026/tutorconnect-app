"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FormEvent,
  Suspense,
  useState,
} from "react";
import { Logo } from "@/components/logo";

type Role = "student" | "tutor";
type AuthMode = "signin" | "create";

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
    >
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

function StudentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.7-4.1 3.3-6.2 7.5-6.2s6.8 2.1 7.5 6.2" />
      <path d="M8.2 8.5c1.6-.2 2.8-1.1 3.6-2.7 1 1.5 2.3 2.3 4 2.4" />
    </svg>
  );
}

function TutorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5.5c2.5-.9 5-.4 8 1.5v12c-3-1.9-5.5-2.4-8-1.5v-12Z" />
      <path d="M20 5.5c-2.5-.9-5-.4-8 1.5v12c3-1.9 5.5-2.4 8-1.5v-12Z" />
    </svg>
  );
}

function AuthPageContent() {
  const searchParams = useSearchParams();

  const roleFromUrl =
    searchParams.get("role") === "tutor"
      ? "tutor"
      : searchParams.get("role") === "student"
        ? "student"
        : null;

  const [role, setRole] = useState<Role | null>(
    roleFromUrl,
  );

  const [mode, setMode] =
    useState<AuthMode>("signin");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [notice, setNotice] =
    useState<string | null>(null);

  function chooseRole(selectedRole: Role) {
    setRole(selectedRole);
    setMode("create");
    setNotice(null);
  }

  function openSignIn() {
    setRole("student");
    setMode("signin");
    setNotice(null);
  }

  function changeRole(selectedRole: Role) {
    setRole(selectedRole);
    setNotice(null);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setNotice(
      "Authentication is not connected yet. No account data was submitted or stored.",
    );
  }

  function handleGoogle() {
    setNotice(
      "Google authentication will be connected during the Firebase authentication phase.",
    );
  }

  /* =========================================================
     ROLE SELECTION
     ========================================================= */

  if (!role) {
    return (
      <main
        id="main-content"
        className="relative min-h-screen overflow-hidden bg-[#faf9ff]"
      >
        <div
          aria-hidden="true"
          className="absolute -left-32 bottom-[-80px] h-96 w-96 rounded-full bg-violet-200/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-blue-200/25 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="dot-grid absolute inset-0 opacity-20"
        />

        <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 py-6 sm:px-8 lg:px-10">
          <div className="shrink-0">
            <Logo />
          </div>

          <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
            <div className="w-full max-w-4xl">
              <div className="text-center">
                <span className="badge badge-blue">
                  Welcome to TutorConnect
                </span>

                <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-5xl">
                  Choose Your Role
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  Select how you want to use
                  TutorConnect so we can personalize your
                  experience.
                </p>
              </div>

              <div className="mt-9 grid gap-5 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    chooseRole("student")
                  }
                  className="group tc-card tc-card-hover flex min-h-[230px] w-full flex-col items-center justify-center p-7 text-center sm:p-9"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition group-hover:scale-105">
                    <StudentIcon />
                  </span>

                  <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
                    Student or Parent
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
                    Find tutors, attend demos, manage
                    classes and follow the student&apos;s
                    learning journey.
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700">
                    Continue
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    chooseRole("tutor")
                  }
                  className="group tc-card tc-card-hover flex min-h-[230px] w-full flex-col items-center justify-center p-7 text-center sm:p-9"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-700 transition group-hover:scale-105">
                    <TutorIcon />
                  </span>

                  <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
                    Tutor or Educator
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
                    Build your tutor profile, manage
                    students, schedules and your tutoring
                    activity.
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-violet-700">
                    Continue
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-slate-600 sm:text-base">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={openSignIn}
                  className="font-extrabold text-blue-700 transition hover:text-blue-800"
                >
                  Sign In
                </button>
              </p>

              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                >
                  ← Back to TutorConnect
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     SIGN IN / CREATE ACCOUNT
     ========================================================= */

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[#faf9ff] px-4 py-5 sm:px-6 sm:py-8 lg:flex lg:items-center lg:justify-center lg:px-8 lg:py-10"
    >
      <div
        aria-hidden="true"
        className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-200/25 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-[-80px] h-96 w-96 rounded-full bg-teal-200/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="dot-grid absolute inset-0 opacity-20"
      />

      <div className="relative mx-auto grid w-full max-w-[1120px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(37,99,235,0.13)] lg:grid-cols-[0.82fr_1.18fr]">
        {/* =====================================================
            DESKTOP BRAND PANEL
        ====================================================== */}
        <aside className="relative hidden min-h-[720px] overflow-hidden border-r border-slate-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 p-10 lg:flex lg:flex-col">
          <div
            aria-hidden="true"
            className="absolute -right-20 top-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -left-20 bottom-12 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl"
          />

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-blue-700"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="relative z-10 my-auto">
            <Logo />

            <div className="mt-12 max-w-sm">
              <span className="badge badge-blue">
                Human learning, supported by technology
              </span>

              <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-slate-950">
                Learn and teach with confidence.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                TutorConnect brings tutor discovery,
                online demos, classes, learning materials
                and progress into one connected platform.
              </p>
            </div>

            <div className="mt-10 grid gap-3">
              <div className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur">
                <p className="text-sm font-extrabold text-slate-900">
                  ✓ Verified tutor profiles
                </p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur">
                <p className="text-sm font-extrabold text-slate-900">
                  ✓ Free online demos
                </p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur">
                <p className="text-sm font-extrabold text-slate-900">
                  ✓ Online and home tuition
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs leading-5 text-slate-500">
            Secure authentication and account
            verification will be handled through the
            TutorConnect authentication system.
          </p>
        </aside>

        {/* =====================================================
            AUTH FORM
        ====================================================== */}
        <section className="relative bg-white px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          {/* Mobile heading */}
          <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
            <Logo />

            <Link
              href="/"
              className="text-sm font-bold text-slate-500 transition hover:text-slate-900"
            >
              Home
            </Link>
          </div>

          {/* ROLE SWITCHER */}
          <div className="rounded-2xl bg-slate-100 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() =>
                  changeRole("student")
                }
                className={`rounded-xl px-3 py-3 text-sm font-extrabold transition ${
                  role === "student"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Student / Parent
              </button>

              <button
                type="button"
                onClick={() =>
                  changeRole("tutor")
                }
                className={`rounded-xl px-3 py-3 text-sm font-extrabold transition ${
                  role === "tutor"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Tutor
              </button>
            </div>
          </div>

          {/* SIGN IN / CREATE TABS */}
          <div className="mt-6 flex gap-7 border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setNotice(null);
              }}
              className={`relative pb-3 text-sm font-extrabold transition ${
                mode === "signin"
                  ? "text-blue-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In

              {mode === "signin" && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("create");
                setNotice(null);
              }}
              className={`relative pb-3 text-sm font-extrabold transition ${
                mode === "create"
                  ? "text-blue-700"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account

              {mode === "create" && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>
          </div>

          <div className="mt-8">
            <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              {mode === "signin"
                ? "Welcome back"
                : role === "tutor"
                  ? "Create your tutor account"
                  : "Create your account"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {mode === "signin"
                ? `Sign in to continue as ${
                    role === "tutor"
                      ? "a tutor"
                      : "a student or parent"
                  }.`
                : role === "tutor"
                  ? "Create your account first. Tutor verification and professional profile setup come next."
                  : "Create your account to find tutors, book demos and manage learning."}
            </p>
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogle}
            className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50/50"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* DIVIDER */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium text-slate-400">
              or continue with email
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {mode === "create" && (
              <div>
                <label
                  htmlFor="full-name"
                  className="form-label"
                >
                  Full name
                </label>

                <input
                  id="full-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="form-label"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-slate-700"
                >
                  Password
                </label>

                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        "Password reset will be enabled when Firebase Authentication is connected.",
                      )
                    }
                    className="text-xs font-bold text-blue-700 transition hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete={
                    mode === "signin"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                  minLength={8}
                  placeholder="Enter your password"
                  className="form-input pr-14"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-extrabold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {mode === "create" && (
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Use at least 8 characters. Stronger
                  password rules will be enforced by the
                  authentication backend.
                </p>
              )}
            </div>

            {mode === "create" && (
              <div>
                <label
                  htmlFor="confirm-password"
                  className="form-label"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Enter your password again"
                    className="form-input pr-14"
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-extrabold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>
            )}

            {mode === "signin" && (
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                />

                Keep me signed in on this device
              </label>
            )}

            {mode === "create" && (
              <label className="flex items-start gap-3 text-xs leading-5 text-slate-500">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
                />

                <span>
                  I agree to the TutorConnect Terms and
                  Privacy Policy. Final legal documents
                  will be linked before production.
                </span>
              </label>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              {mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* HONEST FRONTEND STATUS */}
          {notice && (
            <div
              role="status"
              className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
            >
              {notice}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            {mode === "signin"
              ? "New to TutorConnect?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(
                  mode === "signin"
                    ? "create"
                    : "signin",
                );
                setNotice(null);
              }}
              className="font-extrabold text-blue-700 transition hover:text-blue-800"
            >
              {mode === "signin"
                ? "Create account"
                : "Sign in"}
            </button>
          </p>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setRole(null);
                setNotice(null);
              }}
              className="text-sm font-bold text-slate-500 transition hover:text-slate-900"
            >
              ← Change account type
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
          <div className="text-center">
            <Logo />

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Loading TutorConnect…
            </p>
          </div>
        </main>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}