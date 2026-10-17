import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TutorCard } from "@/components/tutor-card";
import { subjects } from "@/lib/data";
import { getCatalogueTutors } from "@/lib/services/workflow";
import {
  IconSearch,
  IconX,
  IconShieldCheck,
  IconVideo,
  IconHomeTuition,
} from "@/components/ui/icons";

interface TutorDiscoveryPageProps {
  searchParams: Promise<{
    subject?: string;
    class?: string;
    locality?: string;
    location?: string;
    mode?: string;
    language?: string;
    board?: string;
  }>;
}

function normalise(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export default async function TutorDiscoveryPage({
  searchParams,
}: TutorDiscoveryPageProps) {
  const params = await searchParams;

  const tutors = await getCatalogueTutors();
  const selectedSubject = params.subject ?? "";
  const selectedClass = params.class ?? "";
  const selectedLocation = params.locality ?? params.location ?? "";
  const selectedMode = params.mode ?? "";
  const selectedLanguage = params.language ?? "";
  const selectedBoard = params.board ?? "";

  const filteredTutors = tutors.filter((tutor) => {
    const subjectMatches =
      !selectedSubject ||
      tutor.subjects.some((s) => normalise(s) === normalise(selectedSubject));

    const classMatches =
      !selectedClass ||
      tutor.classes.some((c) => normalise(c) === normalise(selectedClass));

    const locationMatches =
      !selectedLocation ||
      normalise(tutor.locality).includes(normalise(selectedLocation)) ||
      normalise(tutor.city).includes(normalise(selectedLocation));

    const modeMatches =
      !selectedMode ||
      selectedMode === "all" ||
      tutor.modes.includes(selectedMode as "online" | "home");

    const languageMatches =
      !selectedLanguage ||
      tutor.languages.some((l) => normalise(l) === normalise(selectedLanguage));

    const boardMatches =
      !selectedBoard ||
      tutor.boards.some((b) => normalise(b) === normalise(selectedBoard));

    return (
      subjectMatches &&
      classMatches &&
      locationMatches &&
      modeMatches &&
      languageMatches &&
      boardMatches
    );
  });

  const availableClasses = Array.from(
    new Set(tutors.flatMap((tutor) => tutor.classes)),
  ).sort();

  const availableBoards = Array.from(
    new Set(tutors.flatMap((tutor) => tutor.boards)),
  ).sort();

  const activeFiltersCount = [
    selectedSubject,
    selectedClass,
    selectedLocation,
    selectedMode && selectedMode !== "all" ? selectedMode : "",
    selectedBoard,
  ].filter(Boolean).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-20 md:pb-28">
        {/* Top Editorial Header */}
        <section className="border-b border-[rgba(55,48,40,0.08)] bg-gradient-to-b from-[#E4EEE9]/30 to-[#FFFBF5] py-12 md:py-16">
          <div className="container-shell">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#315F52]/20 bg-white px-3.5 py-1 text-xs font-bold text-[#244A40]">
                <IconShieldCheck size={14} className="text-[#315F52]" />
                <span>Verified Hyderabad Mentors &bull; Free 30-Min Demo</span>
              </div>

              <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#25231F]">
                Find the ideal mentor for your child.
              </h1>

              <p className="mt-3 text-base text-[#6F6A62] leading-relaxed">
                Connect with verified 1-on-1 educators in Hyderabad across CBSE, ICSE, and State curricula. Experience teaching rapport first in a free 30-minute online demo.
              </p>
            </div>
          </div>
        </section>

        {/* Discovery Filter & Results Layout */}
        <div className="container-shell mt-8 md:mt-12">
          {/* Floating/Sticky Compact Filter Bar */}
          <div className="sticky top-20 z-30 mb-8 rounded-3xl border border-[rgba(55,48,40,0.12)] bg-white/95 p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-md">
            <form method="GET" action="/tutors" className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(55,48,40,0.06)] pb-3">
                {/* Mode Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6F6A62]">Mode:</span>
                  <div className="inline-flex rounded-full bg-[#FFFBF5] p-1 border border-[rgba(55,48,40,0.10)]">
                    <Link
                      href={`/tutors?mode=online${selectedSubject ? `&subject=${encodeURIComponent(selectedSubject)}` : ""}${selectedClass ? `&class=${encodeURIComponent(selectedClass)}` : ""}`}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                        selectedMode === "online"
                          ? "bg-[#315F52] text-white shadow-xs"
                          : "text-[#6F6A62] hover:text-[#25231F]"
                      }`}
                    >
                      <IconVideo size={12} />
                      <span>Online</span>
                    </Link>

                    <Link
                      href={`/tutors?mode=home${selectedSubject ? `&subject=${encodeURIComponent(selectedSubject)}` : ""}${selectedClass ? `&class=${encodeURIComponent(selectedClass)}` : ""}`}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                        selectedMode === "home"
                          ? "bg-[#315F52] text-white shadow-xs"
                          : "text-[#6F6A62] hover:text-[#25231F]"
                      }`}
                    >
                      <IconHomeTuition size={12} />
                      <span>Home</span>
                    </Link>

                    <Link
                      href={`/tutors${selectedSubject ? `?subject=${encodeURIComponent(selectedSubject)}` : ""}`}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                        !selectedMode || selectedMode === "all"
                          ? "bg-[#315F52] text-white shadow-xs"
                          : "text-[#6F6A62] hover:text-[#25231F]"
                      }`}
                    >
                      <span>All</span>
                    </Link>
                  </div>
                </div>

                {/* Filter Status & Reset */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#6F6A62]">
                    Showing <strong className="text-[#25231F]">{filteredTutors.length}</strong> educators
                  </span>
                  {activeFiltersCount > 0 && (
                    <Link
                      href="/tutors"
                      className="inline-flex items-center gap-1 rounded-full bg-[#FFFBF5] border border-[rgba(55,48,40,0.12)] px-2.5 py-1 text-xs font-bold text-[#C84B31] hover:bg-[#FCEEEA] transition"
                    >
                      <IconX size={12} />
                      <span>Reset</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {/* Subject */}
                <div>
                  <label htmlFor="filter-subject" className="sr-only">Subject</label>
                  <select
                    id="filter-subject"
                    name="subject"
                    defaultValue={selectedSubject}
                    className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-3 py-2 text-xs font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((s) => (<option key={s.id} value={s.name}>{s.name}</option>))}
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label htmlFor="filter-class" className="sr-only">Class</label>
                  <select
                    id="filter-class"
                    name="class"
                    defaultValue={selectedClass}
                    className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-3 py-2 text-xs font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                  >
                    <option value="">All Classes</option>
                    {availableClasses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Board */}
                <div>
                  <label htmlFor="filter-board" className="sr-only">Board</label>
                  <select
                    id="filter-board"
                    name="board"
                    defaultValue={selectedBoard}
                    className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-3 py-2 text-xs font-semibold text-[#25231F] focus:border-[#315F52] focus:outline-hidden"
                  >
                    <option value="">All Boards</option>
                    {availableBoards.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Locality Input */}
                <div>
                  <label htmlFor="filter-locality" className="sr-only">Locality</label>
                  <input
                    id="filter-locality"
                    name="locality"
                    type="text"
                    defaultValue={selectedLocation}
                    placeholder="Locality (e.g. Madhapur)"
                    className="w-full rounded-2xl border border-[rgba(55,48,40,0.12)] bg-[#FFF7ED] px-3 py-2 text-xs font-semibold text-[#25231F] placeholder:text-[#9B958C] focus:border-[#315F52] focus:outline-hidden"
                  />
                </div>

                {/* Apply Button */}
                <div className="col-span-2 sm:col-span-4 lg:col-span-1">
                  <input type="hidden" name="mode" value={selectedMode} />
                  <button
                    type="submit"
                    className="btn btn-primary w-full min-h-[44px] rounded-2xl text-xs font-bold justify-center"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Results Grid: 2-column spacious editorial cards */}
          {filteredTutors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E4EEE9] text-[#244A40]">
                <IconSearch size={24} />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-xl font-bold text-[#25231F]">
                No mentors matched your current criteria
              </h3>
              <p className="mt-2 text-sm text-[#6F6A62]">
                Try adjusting your filters or search by a broader subject or class.
              </p>
              <div className="mt-6">
                <Link href="/tutors" className="btn btn-primary rounded-full px-6 py-2.5 text-xs font-bold">
                  View All Educators
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
