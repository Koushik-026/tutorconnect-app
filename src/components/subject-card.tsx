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
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[18px] border border-[var(--tc-border)] bg-[var(--tc-surface)] p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--tc-primary)]/40 hover:shadow-md sm:p-6"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] transition-colors group-hover:scale-105 duration-200">
            <SubjectIcon name={subject.name} size={20} />
          </span>

          <span className="rounded-full bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--tc-text-secondary)]">
            {subject.tutorCount} educators
          </span>
        </div>

        <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[var(--tc-text-primary)] group-hover:text-[var(--tc-primary)] transition-colors">
          {subject.name}
        </h3>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--tc-text-secondary)]">
          {subject.description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[var(--tc-primary)]">
        <span>Explore tutors</span>
        <IconArrowRight
          size={14}
          className="transition-transform duration-180 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
