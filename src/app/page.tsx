import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SubjectCard } from "@/components/subject-card";
import { TutorCard } from "@/components/tutor-card";
import {
  platformBenefits,
  student,
  subjects,
  tutors,
} from "@/lib/data";

const howItWorksSteps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Choose the student’s class, board, subjects, learning goals and preferred tuition mode.",
  },
  {
    number: "02",
    title: "Discover suitable tutors",
    description:
      "Compare tutor experience, subjects, ratings, languages, prices and location availability.",
  },
  {
    number: "03",
    title: "Attend a free online demo",
    description:
      "Meet the tutor through a 30-minute online demo before choosing a monthly plan.",
  },
  {
    number: "04",
    title: "Start your monthly tuition",
    description:
      "Choose a package, confirm the schedule, pay securely and track progress from one dashboard.",
  },
];

const parentBenefits = [
  "View completed and remaining classes",
  "Track homework, quizzes and tutor feedback",
  "Manage schedules, payments and renewals",
  "Request rescheduling or tutor replacement",
];

const tutorBenefits = [
  "Receive relevant student enquiries",
  "Choose online tuition, home tuition or both",
  "Manage demos, schedules and students",
  "Upload notes, assignments and quizzes",
  "Track earnings and payout status",
];

export default function HomePage() {
  const featuredTutors = tutors.slice(0, 3);

  return (
    <main>
      <SiteHeader />

      {/* =====================================================
          Hero section
      ====================================================== */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl"
        />

        <div className="container-shell relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Hero content */}
            <div className="animate-fade-up">
              <span className="badge badge-blue mb-5">
                Verified tutors • Free online demos
              </span>

              <h1 className="page-heading max-w-4xl">
                Find the right tutor.
                <span className="gradient-text block">
                  Learn with confidence.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Connect with verified tutors for online and home tuition,
                attend a free online demo and manage classes, notes,
                assignments and progress in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/tutors"
                  className="btn btn-primary w-full sm:w-auto"
                >
                  Find a Tutor

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </Link>

                <Link
                  href="/auth?role=tutor"
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Become a Tutor
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                    ✓
                  </span>
                  Verified profiles
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                    ✓
                  </span>
                  Free online demo
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                    ✓
                  </span>
                  Secure payments
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hero-gradient glass-card relative min-h-105 overflow-hidden p-5 sm:min-h-120 sm:p-8">
              <div className="absolute inset-x-6 top-6 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-lg backdrop-blur sm:inset-x-10 sm:top-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 font-extrabold text-white">
                    AS
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-slate-900">
                      Ananya Sharma
                    </p>
                    <p className="text-sm text-slate-600">
                      Mathematics and Science Tutor
                    </p>
                  </div>

                  <span className="badge badge-green hidden sm:inline-flex">
                    Verified
                  </span>
                </div>
              </div>

              <div className="absolute left-5 top-31 w-[65%] rounded-3xl bg-slate-900 p-5 text-white shadow-2xl sm:left-10 sm:top-35 sm:w-[62%] sm:p-7">
                <div className="mb-6 flex items-center justify-between">
                  <span className="badge bg-white/10 text-white">
                    Free online demo
                  </span>

                  <span className="text-xs text-slate-300">30 min</span>
                </div>

                <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-teal-500/30 sm:h-40">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-xl font-extrabold">
                      AS
                    </div>
                    <p className="font-bold">Concept explanation</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Mathematics • Class 9
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    🎤
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    📹
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                    ✕
                  </span>
                </div>
              </div>

              <div className="animate-float absolute bottom-10 right-5 w-46 rounded-2xl border border-white/90 bg-white/90 p-4 shadow-xl backdrop-blur sm:right-8 sm:w-52">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Student progress
                  </span>

                  <span className="badge badge-teal">On track</span>
                </div>

                <p className="mt-4 text-2xl font-extrabold text-slate-900">
                  4 of 15
                </p>

                <p className="text-sm text-slate-500">Classes completed</p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[27%] rounded-full bg-gradient-to-r from-blue-600 to-teal-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          Tutor search panel
      ====================================================== */}
      <section className="pb-12">
        <div className="container-shell">
          <form
            action="/tutors"
            className="tc-card grid gap-4 p-5 md:grid-cols-2 md:p-7 lg:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <div>
              <label htmlFor="subject" className="form-label">
                Subject
              </label>

              <select
                id="subject"
                name="subject"
                defaultValue=""
                className="form-input"
              >
                <option value="" disabled>
                  Select a subject
                </option>

                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="class" className="form-label">
                Student class
              </label>

              <select
                id="class"
                name="class"
                defaultValue=""
                className="form-input"
              >
                <option value="" disabled>
                  Select class
                </option>

                {Array.from({ length: 7 }, (_, index) => index + 6).map(
                  (classNumber) => (
                    <option
                      key={classNumber}
                      value={`Class ${classNumber}`}
                    >
                      Class {classNumber}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="form-label">
                Locality
              </label>

              <input
                id="location"
                name="location"
                type="text"
                defaultValue={`${student.locality}, ${student.city}`}
                className="form-input"
              />
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                Search Tutors
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* =====================================================
          How it works
      ====================================================== */}
      <section id="how-it-works" className="section-spacing">
        <div className="container-shell">
          <div className="mb-10">
            <span className="badge badge-teal mb-4">Simple process</span>

            <h2 className="section-heading">
              From tutor search to learning in four steps
            </h2>

            <p className="section-description mt-4">
              TutorConnect keeps tutor discovery, demos, monthly packages and
              learning management inside one connected platform.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {howItWorksSteps.map((step) => (
              <article
                key={step.number}
                className="tc-card tc-card-hover p-6"
              >
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 font-extrabold text-blue-700">
                  {step.number}
                </span>

                <h3 className="text-lg font-extrabold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          Subjects
      ====================================================== */}
      <section id="subjects" className="section-spacing bg-white/55">
        <div className="container-shell">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="badge badge-violet mb-4">
                Popular subjects
              </span>

              <h2 className="section-heading">
                Find support for every important subject
              </h2>

              <p className="section-description mt-4">
                Browse tutors by subject and choose someone who understands
                the student’s class, board and learning goals.
              </p>
            </div>

            <Link href="/tutors" className="btn btn-secondary">
              View all tutors
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          Featured tutors
      ====================================================== */}
      <section className="section-spacing">
        <div className="container-shell">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="badge badge-blue mb-4">
                Featured tutors
              </span>

              <h2 className="section-heading">
                Meet tutors ready to help students improve
              </h2>

              <p className="section-description mt-4">
                Compare verified information, subjects, experience,
                availability and monthly plan prices before booking a demo.
              </p>
            </div>

            <Link href="/tutors" className="btn btn-secondary">
              Explore all tutors
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          Platform benefits
      ====================================================== */}
      <section className="section-spacing bg-slate-950 text-white">
        <div className="container-shell">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="badge bg-white/10 text-white">
                One connected platform
              </span>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                More than just finding a tutor
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-300">
                TutorConnect helps families manage the complete tuition
                relationship—from the first demo to classes, learning
                materials and progress.
              </p>

              <Link
                href="/tutors"
                className="btn mt-7 bg-white text-slate-950 hover:bg-slate-100"
              >
                Find your tutor
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {platformBenefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 font-bold text-white">
                    ✓
                  </span>

                  <h3 className="font-extrabold text-white">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          Parents and tutors
      ====================================================== */}
      <section className="section-spacing">
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="tc-card overflow-hidden">
              <div className="border-b border-slate-200 bg-gradient-to-br from-blue-50 to-violet-50 p-7">
                <span className="badge badge-blue">For parents</span>

                <h2 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Stay informed about every class
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Manage tutor selection, packages, payments and learning
                  progress without depending on scattered messages.
                </p>
              </div>

              <ul className="space-y-4 p-7">
                {parentBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      ✓
                    </span>

                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="tc-card overflow-hidden">
              <div className="border-b border-slate-200 bg-gradient-to-br from-teal-50 to-blue-50 p-7">
                <span className="badge badge-teal">For tutors</span>

                <h2 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Grow your tutoring career
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Receive relevant requests, organise classes and build a
                  trusted professional profile.
                </p>
              </div>

              <ul className="space-y-4 p-7">
                {tutorBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-slate-700"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                      ✓
                    </span>

                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          Final CTA
      ====================================================== */}
      <section className="pb-20 pt-6">
        <div className="container-shell">
          <div className="overflow-hidden rounded-4xl bg-gradient-to-br from-blue-600 via-blue-600 to-teal-500 p-7 text-center text-white shadow-2xl shadow-blue-500/20 sm:p-12">
            <span className="badge bg-white/15 text-white">
              Your next tutor is one demo away
            </span>

            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Find a tutor who matches the student’s needs
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-blue-50">
              Explore tutor profiles, attend a free online demo and continue
              only when you are satisfied with the teaching experience.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/tutors"
                className="btn bg-white text-blue-700 hover:bg-blue-50"
              >
                Find a Tutor
              </Link>

              <Link
                href="/auth?role=tutor"
                className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Become a Tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          Footer
      ====================================================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container-shell py-8">
          <div className="flex flex-col justify-between gap-5 text-sm text-slate-500 md:flex-row md:items-center">
            <p>© 2026 TutorConnect. All rights reserved.</p>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="#" className="hover:text-blue-600">
                Privacy
              </Link>

              <Link href="#" className="hover:text-blue-600">
                Terms
              </Link>

              <Link href="#" className="hover:text-blue-600">
                Refund Policy
              </Link>

              <Link href="#" className="hover:text-blue-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}