"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconArrowRight,
  IconShieldCheck,
  IconVideo,
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

function AuthInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const roleParam = searchParams.get("role");
  const initialRole: Role = roleParam === "tutor" ? "tutor" : "student";
  const [role, setRole] = useState<Role>(initialRole);
  const [mode, setMode] = useState<AuthMode>("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (role === "student") {
      router.push("/dashboard/student");
    } else {
      router.push("/tutors");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      {/* Minimal Top Header */}
      <header className="border-b border-[rgba(55,48,40,0.08)] bg-white/80 py-4 backdrop-blur-md">
        <div className="container-shell flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/tutors"
            className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] transition"
          >
            &larr; Back to Tutors
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 flex items-center">
        <div className="container-shell w-full">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center max-w-5xl mx-auto">
            {/* Left Column: Quiet Educational Visual Context (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#315F52]">
                  TutorConnect Access
                </span>
                <h1 className="mt-2 font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[#25231F] leading-tight">
                  A personalized workspace for student progress.
                </h1>
                <p className="mt-3 text-sm text-[#6F6A62] leading-relaxed">
                  Log in to track your upcoming classes, review digital lesson notes shared by your educator, and monitor weekly subject rhythm.
                </p>
              </div>

              {/* Original Miniature Workspace Mockup Preview */}
              <div className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(55,48,40,0.06)] pb-3">
                  <span className="text-xs font-bold text-[#25231F]">Next Session</span>
                  <span className="rounded-full bg-[#E3EADD] px-2.5 py-0.5 text-[11px] font-bold text-[#244A40]">
                    Confirmed
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4EEE9] text-xs font-extrabold text-[#244A40]">
                    AS
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#25231F]">Ananya Sharma</p>
                    <p className="text-[11px] text-[#6F6A62]">Mathematics &bull; Class 9 CBSE</p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#FFFBF5] p-3 text-[11px] text-[#6F6A62] flex items-center justify-between">
                  <span>Mon, 04:30 PM &bull; 1-on-1 Online</span>
                  <span className="font-bold text-[#315F52]">Class 4 of 12</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#6F6A62]">
                <div className="flex items-center gap-2">
                  <IconShieldCheck size={14} className="text-[#315F52]" />
                  <span>Secure prototype credentials simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconVideo size={14} className="text-[#315F52]" />
                  <span>Direct link to live 1-on-1 demo rooms</span>
                </div>
              </div>
            </div>

            {/* Right Column: Focused Auth Object */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white p-7 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
                {/* Role Switcher */}
                <div className="flex rounded-full bg-[#FFFBF5] p-1 border border-[rgba(55,48,40,0.10)] mb-6">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
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
                    onClick={() => setRole("tutor")}
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
                    {mode === "signin"
                      ? role === "student"
                        ? "Sign in to Student Workspace"
                        : "Educator Portal Access"
                      : role === "student"
                      ? "Create Student Account"
                      : "Apply as an Educator"}
                  </h2>
                  <p className="mt-1 text-xs text-[#6F6A62]">
                    {role === "student"
                      ? "Track your tuition routine, upcoming classes, and digital lesson notes."
                      : "Manage your student inquiries, demo slots, and teaching schedule in Hyderabad."}
                  </p>
                </div>

                {/* Simulated Google SSO Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-outline w-full min-h-[46px] rounded-full text-xs font-bold gap-2.5 justify-center mb-5"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

                <div className="relative mb-5 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[rgba(55,48,40,0.10)]" />
                  </div>
                  <span className="relative bg-white px-3 text-[11px] font-semibold text-[#9B958C]">
                    or with email
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "create" && (
                    <div>
                      <label className="text-xs font-bold text-[#6F6A62] block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === "student" ? "e.g. Aarav Mehta" : "e.g. Ananya Sharma"}
                        className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-2.5 text-sm font-semibold text-[#25231F] placeholder:text-[#9B958C] focus:border-[#315F52] focus:outline-hidden"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-[#6F6A62] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-2.5 text-sm font-semibold text-[#25231F] placeholder:text-[#9B958C] focus:border-[#315F52] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#6F6A62] block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-2.5 text-sm font-semibold text-[#25231F] placeholder:text-[#9B958C] focus:border-[#315F52] focus:outline-hidden"
                    />
                  </div>

                  {mode === "create" && (
                    <div>
                      <label className="text-xs font-bold text-[#6F6A62] block mb-1">
                        Contact Number (Hyderabad)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-2.5 text-sm font-semibold text-[#25231F] placeholder:text-[#9B958C] focus:border-[#315F52] focus:outline-hidden"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-full min-h-[48px] rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] justify-center gap-2 mt-2"
                  >
                    <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                    <IconArrowRight size={15} />
                  </button>
                </form>

                <div className="mt-5 text-center text-xs text-[#6F6A62]">
                  {mode === "signin" ? (
                    <p>
                      Don&apos;t have an account yet?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("create")}
                        className="font-bold text-[#315F52] hover:underline"
                      >
                        Create one now
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("signin")}
                        className="font-bold text-[#315F52] hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
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
