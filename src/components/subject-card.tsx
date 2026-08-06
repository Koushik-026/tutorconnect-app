import Link from "next/link";
import type { Subject } from "@/lib/types";

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Link
      href={`/tutors?subject=${encodeURIComponent(subject.name)}`}
      aria-label={`Find ${subject.name} tutors`}
      className="tc-card tc-card-hover group block h-full p-5 sm:p-6"
    >
      <div className="flex h-full flex-col">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 text-xl font-extrabold text-blue-700 transition group-hover:scale-105">
            {subject.icon}
          </span>

          <span className="badge badge-blue">
            {subject.tutorCount} tutors
          </span>
        </div>

        <h3 className="mb-2 text-lg font-extrabold text-slate-900">
          {subject.name}
        </h3>

        <p className="mb-5 flex-1 text-sm leading-6 text-slate-600">
          {subject.description}
        </p>

        <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
          Explore tutors

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}