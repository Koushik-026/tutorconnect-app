import Link from "next/link";
import type { Tutor } from "@/lib/types";

interface TutorCardProps {
  tutor: Tutor;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TutorCard({ tutor }: TutorCardProps) {
  const offersOnline = tutor.modes.includes("online");
  const offersHome = tutor.modes.includes("home");

  return (
    <article className="tc-card tc-card-hover flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Tutor identity */}
        <div className="mb-5 flex items-start gap-4">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 text-lg font-extrabold text-white shadow-md shadow-blue-500/20"
          >
            {getInitials(tutor.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900">
                {tutor.name}
              </h3>

              {tutor.verification.length > 0 && (
                <span className="badge badge-green">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>

                  Verified
                </span>
              )}
            </div>

            <p className="mt-1 text-sm font-semibold text-slate-600">
              {tutor.headline}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-current"
                >
                  <path d="m12 2.5 2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.32l-5.8 3.05 1.11-6.47-4.7-4.58 6.49-.94L12 2.5Z" />
                </svg>

                {tutor.rating}
              </span>

              <span className="text-slate-500">
                {tutor.reviewCount} reviews
              </span>

              <span className="text-slate-500">
                {tutor.experienceYears} years experience
              </span>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tutor.subjects.map((subject) => (
            <span key={subject} className="badge badge-blue">
              {subject}
            </span>
          ))}
        </div>

        {/* Tutor information */}
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5V6.75A2.75 2.75 0 0 1 6.75 4H20v13H6.75A2.75 2.75 0 0 0 4 19.75" />
              <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5H6.5A2.5 2.5 0 0 0 4 19.5Z" />
            </svg>

            <span>
              {tutor.classes[0]}–{tutor.classes[tutor.classes.length - 1]}
              {" • "}
              {tutor.boards.join(", ")}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-teal-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>

            <span>
              {tutor.locality}, {tutor.city}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-violet-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16v14H4z" />
              <path d="m8 9 4 3 4-3" />
            </svg>

            <span>{tutor.languages.join(", ")}</span>
          </div>
        </div>

        {/* Teaching modes */}
        <div className="mt-5 flex flex-wrap gap-2">
          {offersOnline && (
            <span className="badge badge-teal">Online available</span>
          )}

          {offersHome && (
            <span className="badge badge-violet">
              Home tuition within {tutor.travelRadiusKm} km
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Plans starting from
          </p>

          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {formatCurrency(tutor.startingMonthlyFee)}
            <span className="text-sm font-semibold text-slate-500">
              /month
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-3 border-t border-slate-200 bg-slate-50/70 p-5 sm:grid-cols-2 sm:p-6">
        <Link
          href={`/tutors/${tutor.id}`}
          className="btn btn-secondary w-full"
        >
          View Profile
        </Link>

        <Link
          href={`/demo/book?tutor=${tutor.id}`}
          className="btn btn-primary w-full"
        >
          Book Free Demo
        </Link>
      </div>
    </article>
  );
}