import Link from "next/link";
import type { Subject } from "@/lib/types";
import { SubjectIcon, IconArrowRight } from "./ui/icons";

interface SubjectCardProps {
  subject: Subject;
}

// Subject-specific Paper Bloom palette mappings
const subjectThemes: Record<
  string,
  {
    bgIcon: string;
    textIcon: string;
    borderHover: string;
    accentText: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  Mathematics: {
    bgIcon: "bg-[#F4F0FB]",
    textIcon: "text-[#554477]",
    borderHover: "hover:border-[#B7A5DE]",
    accentText: "text-[#554477]",
    badgeBg: "bg-[#F4F0FB]",
    badgeText: "text-[#554477]",
  },
  Science: {
    bgIcon: "bg-[#E6F0EA]",
    textIcon: "text-[#3E6153]",
    borderHover: "hover:border-[#4F7867]",
    accentText: "text-[#3E6153]",
    badgeBg: "bg-[#E6F0EA]",
    badgeText: "text-[#3E6153]",
  },
  Physics: {
    bgIcon: "bg-[#EFEAF8]",
    textIcon: "text-[#4E3C70]",
    borderHover: "hover:border-[#66518A]",
    accentText: "text-[#4E3C70]",
    badgeBg: "bg-[#EFEAF8]",
    badgeText: "text-[#4E3C70]",
  },
  Chemistry: {
    bgIcon: "bg-[#FBE9DF]",
    textIcon: "text-[#A64E28]",
    borderHover: "hover:border-[#E99873]",
    accentText: "text-[#A64E28]",
    badgeBg: "bg-[#FBE9DF]",
    badgeText: "text-[#A64E28]",
  },
  English: {
    bgIcon: "bg-[#F8EFCF]",
    textIcon: "text-[#826514]",
    borderHover: "hover:border-[#D9B85F]",
    accentText: "text-[#826514]",
    badgeBg: "bg-[#F8EFCF]",
    badgeText: "text-[#826514]",
  },
  "Computer Science": {
    bgIcon: "bg-[#E8F0EE]",
    textIcon: "text-[#324C49]",
    borderHover: "hover:border-[#486B67]",
    accentText: "text-[#324C49]",
    badgeBg: "bg-[#E8F0EE]",
    badgeText: "text-[#324C49]",
  },
};

export function SubjectCard({ subject }: SubjectCardProps) {
  const theme =
    subjectThemes[subject.name] || {
      bgIcon: "bg-[#EFEAF8]",
      textIcon: "text-[#66518A]",
      borderHover: "hover:border-[#66518A]",
      accentText: "text-[#66518A]",
      badgeBg: "bg-[#ECE6DC]",
      badgeText: "text-[#4D504A]",
    };

  return (
    <Link
      href={`/tutors?subject=${encodeURIComponent(subject.name)}`}
      aria-label={`Explore ${subject.name} tutors`}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 ${theme.borderHover} hover:shadow-md hover:shadow-[#66518A]/5 sm:p-6`}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.bgIcon} ${theme.textIcon} transition-colors`}
          >
            <SubjectIcon name={subject.name} size={22} />
          </span>

          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${theme.badgeBg} ${theme.badgeText}`}
          >
            {subject.tutorCount} tutors
          </span>
        </div>

        <h3 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520] group-hover:text-[#66518A] transition-colors">
          {subject.name}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#676B64]">
          {subject.description}
        </p>
      </div>

      <div className={`mt-5 flex items-center gap-1.5 text-xs font-bold ${theme.accentText}`}>
        <span>Explore tutors</span>
        <IconArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
