import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TutorCard } from "@/components/tutor-card";
import { ModeSegmentedControl } from "@/components/mode-segmented-control";
import { subjects } from "@/lib/data";
import { getCatalogueTutors } from "@/lib/services/workflow";
import {
  IconSearch,
  IconX,
  IconGraduationCap,
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
      selectedMode === "both" ||
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
    selectedMode && selectedMode !== "all" && selectedMode !== "both" ? selectedMode : "",
    selectedBoard,
  ].filter(Boolean).length;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--tc-bg)] text-[var(--tc-text-primary)] transition-colors">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-20 md:pb-28">
        {/* Top Editorial Header */}
        <section className="border-b border-[var(--tc-border)] bg-[var(--tc-surface-muted)] py-12 md:py-16 transition-colors">
          <div className="container-shell">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tc-primary)]/20 bg-[var(--tc-surface)] px-3.5 py-1 text-xs font-bold text-[var(--tc-primary)] shadow-xs">
                <IconGraduationCap size={14} className="text-[var(--tc-primary)]" />
                <span>Hyderabad Educators &bull; Free 30-Min Demo</span>
              </div>

              <h1 className="mt-4 font-[family-name:var(--font-manrope)] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[var(--tc-text-primary)]">
                Find the ideal mentor for your child.
              </h1>

              <p className="mt-3 text-sm sm:text-base text-[var(--tc-text-secondary)] leading-relaxed max-w-2xl mx-auto">
                Connect with 1-on-1 educators in Hyderabad across CBSE, ICSE, and State curricula. Experience teaching rapport first in a free 30-minute online demo.
              </p>
            </div>
          </div>
        </section>

        {/* Discovery Filter & Results Layout */}
        <div className="container-shell mt-8 md:mt-12">
          {/* Floating/Sticky Compact Filter Bar */}
          <div className="sticky top-20 z-30 mb-8 rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)]/95 p-4 sm:p-5 shadow-sm backdrop-blur-md transition-colors">
            <form method="GET" action="/tutors" className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--tc-border)] pb-3">
                {/* Segmented Mode Selector */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-[var(--tc-text-secondary)]">Mode:</span>
                  <ModeSegmentedControl initialMode={selectedMode} />
                </div>

                {/* Filter Status & Reset */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[var(--tc-text-secondary)]">
                    Showing <strong className="text-[var(--tc-text-primary)]">{filteredTutors.length}</strong> educators
                  </span>
                  {activeFiltersCount > 0 && (
                    <Link
                      href="/tutors"
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--tc-surface-muted)] border border-[var(--tc-border)] px-2.5 py-1 text-xs font-bold text-[var(--tc-danger)] hover:bg-[var(--tc-danger)]/10 transition"
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
                    className="w-full rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--tc-text-primary)] focus:border-[var(--tc-primary)] focus:outline-none transition-colors cursor-pointer"
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
                    className="w-full rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--tc-text-primary)] focus:border-[var(--tc-primary)] focus:outline-none transition-colors cursor-pointer"
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
                    className="w-full rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--tc-text-primary)] focus:border-[var(--tc-primary)] focus:outline-none transition-colors cursor-pointer"
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
                    className="w-full rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--tc-text-primary)] placeholder:text-[var(--tc-text-secondary)] focus:border-[var(--tc-primary)] focus:outline-none transition-colors"
                  />
                </div>

                {/* Apply Button */}
                <div className="col-span-2 sm:col-span-4 lg:col-span-1">
                  <input type="hidden" name="mode" value={selectedMode} />
                  <button
                    type="submit"
                    className="btn btn-primary w-full min-h-[42px] rounded-xl text-xs font-bold justify-center"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Results Grid: 2-column spacious editorial cards */}
          {filteredTutors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 transition-opacity duration-200">
              {filteredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-12 text-center transition-colors">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tc-soft-primary)] text-[var(--tc-primary)]">
                <IconSearch size={24} />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-xl font-bold text-[var(--tc-text-primary)]">
                No educators matched your current criteria
              </h3>
              <p className="mt-2 text-sm text-[var(--tc-text-secondary)]">
                Try adjusting your filters or search by a broader subject or class.
              </p>
              <div className="mt-6">
                <Link href="/tutors" className="btn btn-primary rounded-xl px-6 py-2.5 text-xs font-bold">
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
