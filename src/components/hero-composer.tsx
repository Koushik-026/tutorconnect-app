"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconMapPin,
  IconVideo,
  IconHomeTuition,
  IconArrowRight,
} from "./ui/icons";

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
      className="mx-auto w-full max-w-4xl rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white/95 p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_rgba(55,48,40,0.06)] backdrop-blur-md transition-all"
    >
      <div className="flex flex-col gap-5">
        {/* Mode Selector Tabs (Pill Switch) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(55,48,40,0.08)] pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6F6A62]">
              Tuition Mode:
            </span>
            <div className="inline-flex rounded-full bg-[#FFFBF5] p-1 border border-[rgba(55,48,40,0.10)]">
              <button
                type="button"
                onClick={() => setSelectedMode("online")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                  selectedMode === "online"
                    ? "bg-[#315F52] text-white shadow-xs"
                    : "text-[#6F6A62] hover:text-[#25231F]"
                }`}
              >
                <IconVideo size={13} />
                <span>Online (1-on-1)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("home")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                  selectedMode === "home"
                    ? "bg-[#315F52] text-white shadow-xs"
                    : "text-[#6F6A62] hover:text-[#25231F]"
                }`}
              >
                <IconHomeTuition size={13} />
                <span>Home Tuition</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode("all")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                  selectedMode === "all"
                    ? "bg-[#315F52] text-white shadow-xs"
                    : "text-[#6F6A62] hover:text-[#25231F]"
                }`}
              >
                <span>Both</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#315F52]">
            <span className="h-2 w-2 rounded-full bg-[#315F52]" />
            <span>Free 30-min demo included</span>
          </div>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
          {/* Subject Field */}
          <div className="lg:col-span-4 flex flex-col gap-1.5">
            <label htmlFor="hero-subject" className="text-xs font-bold text-[#6F6A62]">
              Subject
            </label>
            <div className="relative">
              <select
                id="hero-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-3 text-sm font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden focus:ring-2 focus:ring-[#315F52]/15 transition"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9B958C]">
                ▼
              </div>
            </div>
          </div>

          {/* Class Field */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <label htmlFor="hero-class" className="text-xs font-bold text-[#6F6A62]">
              Class / Grade
            </label>
            <div className="relative">
              <select
                id="hero-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-4 py-3 text-sm font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden focus:ring-2 focus:ring-[#315F52]/15 transition"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9B958C]">
                ▼
              </div>
            </div>
          </div>

          {/* Locality Field (or Board / Context if online) */}
          <div className="lg:col-span-5 flex flex-col gap-1.5">
            <label htmlFor="hero-locality" className="text-xs font-bold text-[#6F6A62]">
              {selectedMode === "home" ? "Hyderabad Locality (for Home visits)" : "Curriculum / Locality"}
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 text-[#9B958C]">
                {selectedMode === "home" ? <IconMapPin size={16} /> : <IconSearch size={16} />}
              </div>
              <input
                id="hero-locality"
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder={selectedMode === "home" ? "e.g. Madhapur, Jubilee Hills" : "e.g. CBSE, ICSE, or Area"}
                className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] pl-10 pr-4 py-3 text-sm font-semibold text-[#25231F] placeholder:text-[#9B958C] focus:border-[#315F52] focus:outline-hidden focus:ring-2 focus:ring-[#315F52]/15 transition"
              />
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6F6A62]">
            <span className="font-bold text-[#25231F]">Popular:</span>
            {["Class 10 Maths", "Class 9 Science", "CBSE Physics"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item.includes("Maths")) setSelectedSubject("Mathematics");
                  if (item.includes("Science")) setSelectedSubject("Science");
                  if (item.includes("Physics")) setSelectedSubject("Physics");
                  if (item.includes("10")) setSelectedClass("Class 10");
                  if (item.includes("9")) setSelectedClass("Class 9");
                }}
                className="rounded-full bg-[#E4EEE9] px-2.5 py-0.5 font-medium text-[#244A40] hover:bg-[#D5E3DC] transition"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto min-h-[48px] px-8 rounded-full text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] gap-2 shrink-0 justify-center"
          >
            <span>Find Tutors</span>
            <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}
