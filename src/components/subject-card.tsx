import Link from "next/link";
import type { Subject } from "@/lib/types";
import { SubjectIcon, IconArrowRight } from "./ui/icons";

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Link
      href={`/tutors?subject=${encodeURIComponent(subject.name)}`}
      aria-label={`Explore ${subject.name} tutors`}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 sm:p-6"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50/80 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <SubjectIcon name={subject.name} size={24} />
          </span>

          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
            {subject.tutorCount} tutors
          </span>
        </div>

        <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {subject.name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {subject.description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600">
        <span>Explore tutors</span>
        <IconArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
