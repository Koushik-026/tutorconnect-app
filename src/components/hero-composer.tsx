"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModeSegmentedControl, type TuitionMode } from "./mode-segmented-control";
import { IconArrowRight } from "./ui/icons";

interface HeroComposerProps {
  initialSubject?: string;
  initialClass?: string;
}

const subjects = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Social Studies",
  "Computer Science",
];

const classes = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

export function HeroComposer({
  initialSubject = "Mathematics",
  initialClass = "Class 10",
}: HeroComposerProps) {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedMode, setSelectedMode] = useState<TuitionMode>("online");
  const [locality, setLocality] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSubject) params.set("subject", selectedSubject);
    if (selectedClass) params.set("class", selectedClass);
    if (selectedMode !== "both") params.set("mode", selectedMode);
    if (selectedMode === "home" && locality.trim()) params.set("locality", locality.trim());
    router.push(`/tutors?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto w-full max-w-3xl"
      aria-label="Find an educator"
    >
      <div className="search-dock p-2 sm:p-2.5 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

          {/* Subject */}
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-subject" className="sr-only">Subject</label>
            <div className="relative">
              <select
                id="hero-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full appearance-none rounded-xl border-0 bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--tc-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--tc-primary)]/20 focus:bg-[var(--tc-surface-muted)] transition-colors cursor-pointer hover:bg-[var(--tc-surface-muted)]"
              >
                <option value="" disabled>Subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--tc-text-secondary)]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-px self-stretch bg-[var(--tc-border)]" />

          {/* Class */}
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-class" className="sr-only">Class / Grade</label>
            <div className="relative">
              <select
                id="hero-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full appearance-none rounded-xl border-0 bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--tc-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--tc-primary)]/20 focus:bg-[var(--tc-surface-muted)] transition-colors cursor-pointer hover:bg-[var(--tc-surface-muted)]"
              >
                <option value="" disabled>Grade</option>
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--tc-text-secondary)]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-px self-stretch bg-[var(--tc-border)]" />

          {/* Segmented Mode Selector */}
          <div className="flex items-center justify-center px-1">
            <ModeSegmentedControl
              initialMode={selectedMode}
              onChange={(mode) => setSelectedMode(mode)}
            />
          </div>

          {/* Locality (shown when home mode) */}
          {selectedMode === "home" && (
            <>
              <div className="hidden sm:block w-px self-stretch bg-[var(--tc-border)]" />
              <div className="flex-1 min-w-0">
                <label htmlFor="hero-locality" className="sr-only">Hyderabad locality</label>
                <input
                  id="hero-locality"
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Madhapur"
                  className="w-full rounded-xl border-0 bg-transparent px-4 py-2.5 text-sm font-semibold text-[var(--tc-text-primary)] placeholder:text-[var(--tc-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--tc-primary)]/20 focus:bg-[var(--tc-surface-muted)] transition-colors"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary min-h-[44px] px-5 text-xs font-bold rounded-xl gap-2 shrink-0 justify-center sm:self-auto"
          >
            <span>Find Tutors</span>
            <IconArrowRight size={14} />
          </button>
        </div>
      </div>
    </form>
  );
}
