"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconVideo, IconHomeTuition } from "./ui/icons";

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
  const [selectedMode, setSelectedMode] = useState<"all" | "online" | "home">("online");
  const [locality, setLocality] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSubject) params.set("subject", selectedSubject);
    if (selectedClass) params.set("class", selectedClass);
    if (selectedMode !== "all") params.set("mode", selectedMode);
    if (selectedMode === "home" && locality.trim()) params.set("locality", locality.trim());
    router.push(`/tutors?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto w-full max-w-3xl"
      aria-label="Find a tutor"
    >
      <div className="search-dock p-2 sm:p-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

          {/* Subject */}
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-subject" className="sr-only">Subject</label>
            <div className="relative">
              <select
                id="hero-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full appearance-none rounded-xl border-0 bg-transparent px-4 py-3 text-sm font-semibold text-[#18211E] focus:outline-none focus:ring-2 focus:ring-[#236B5B]/20 focus:bg-[#F4F8FB] transition-colors cursor-pointer hover:bg-[#F4F8FB]"
              >
                <option value="" disabled>Subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9BAAA5]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-px self-stretch bg-[rgba(24,33,30,0.09)]" />

          {/* Class */}
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-class" className="sr-only">Class / Grade</label>
            <div className="relative">
              <select
                id="hero-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full appearance-none rounded-xl border-0 bg-transparent px-4 py-3 text-sm font-semibold text-[#18211E] focus:outline-none focus:ring-2 focus:ring-[#236B5B]/20 focus:bg-[#F4F8FB] transition-colors cursor-pointer hover:bg-[#F4F8FB]"
              >
                <option value="" disabled>Grade</option>
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9BAAA5]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-px self-stretch bg-[rgba(24,33,30,0.09)]" />

          {/* Mode */}
          <div className="flex items-center gap-1 px-2">
            <button
              type="button"
              onClick={() => setSelectedMode("online")}
              aria-pressed={selectedMode === "online"}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                selectedMode === "online"
                  ? "bg-[#236B5B] text-white shadow-sm"
                  : "text-[#66716D] hover:bg-[#F4F8FB] hover:text-[#18211E]"
              }`}
            >
              <IconVideo size={12} />
              <span>Online</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode("home")}
              aria-pressed={selectedMode === "home"}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                selectedMode === "home"
                  ? "bg-[#236B5B] text-white shadow-sm"
                  : "text-[#66716D] hover:bg-[#F4F8FB] hover:text-[#18211E]"
              }`}
            >
              <IconHomeTuition size={12} />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode("all")}
              aria-pressed={selectedMode === "all"}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                selectedMode === "all"
                  ? "bg-[#236B5B] text-white shadow-sm"
                  : "text-[#66716D] hover:bg-[#F4F8FB] hover:text-[#18211E]"
              }`}
            >
              Both
            </button>
          </div>

          {/* Locality (shown when home mode) */}
          {selectedMode === "home" && (
            <>
              <div className="hidden sm:block w-px self-stretch bg-[rgba(24,33,30,0.09)]" />
              <div className="flex-1 min-w-0">
                <label htmlFor="hero-locality" className="sr-only">Hyderabad locality</label>
                <input
                  id="hero-locality"
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Madhapur"
                  className="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm font-semibold text-[#18211E] placeholder:text-[#9BAAA5] focus:outline-none focus:ring-2 focus:ring-[#236B5B]/20 focus:bg-[#F4F8FB] transition-colors"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary min-h-[48px] px-6 text-sm font-bold rounded-2xl gap-2 shrink-0 justify-center sm:self-auto"
          >
            <span>Find Tutors</span>
            <IconArrowRight size={15} />
          </button>
        </div>
      </div>
    </form>
  );
}