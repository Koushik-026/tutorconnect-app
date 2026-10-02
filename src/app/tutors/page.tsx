import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TutorCard } from "@/components/tutor-card";
import { subjects, tutors } from "@/lib/data";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconShieldCheck,
} from "@/components/ui/icons";

interface TutorDiscoveryPageProps {
  searchParams: Promise<{
    subject?: string;
    class?: string;
    location?: string;
    mode?: string;
    language?: string;
  }>;
}

function normalise(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export default async function TutorDiscoveryPage({
  searchParams,
}: TutorDiscoveryPageProps) {
  const params = await searchParams;

  const selectedSubject = params.subject ?? "";
  const selectedClass = params.class ?? "";
  const selectedLocation = params.location ?? "";
  const selectedMode = params.mode ?? "";
  const selectedLanguage = params.language ?? "";

  const filteredTutors = tutors.filter((tutor) => {
    const subjectMatches =
      !selectedSubject ||
      tutor.subjects.some(
        (subject) => normalise(subject) === normalise(selectedSubject),
      );

    const classMatches =
      !selectedClass ||
      tutor.classes.some(
        (className) => normalise(className) === normalise(selectedClass),
      );

    const languageMatches =
      !selectedLanguage ||
      tutor.languages.some(
        (language) => normalise(language) === normalise(selectedLanguage),
      );

    const modeMatches =
      !selectedMode ||
      tutor.modes.includes(selectedMode as "online" | "home");

    const locationMatches =
      !selectedLocation ||
      (selectedMode !== "home" && !tutor.modes.includes("home")) ||
      normalise(tutor.locality).includes(normalise(selectedLocation)) ||
      normalise(tutor.city).includes(normalise(selectedLocation)) ||
      normalise(selectedLocation).includes(normalise(tutor.locality)) ||
      normalise(selectedLocation).includes(normalise(tutor.city));

    return (
      subjectMatches &&
      classMatches &&
      languageMatches &&
      modeMatches &&
      locationMatches
    );
  });

  const availableClasses = Array.from(
    new Set(tutors.flatMap((tutor) => tutor.classes)),
  ).sort();

  const availableLanguages = Array.from(
    new Set(tutors.flatMap((tutor) => tutor.languages)),
  ).sort();

  const filtersAreActive = Boolean(
    selectedSubject ||
      selectedClass ||
      selectedLocation ||
      selectedMode ||
      selectedLanguage,
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfc]">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        {/* Page Hero Header */}
        <section className="border-b border-slate-200/80 bg-white py-8 sm:py-12">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  <IconShieldCheck size={14} />
                  <span>Verified Tutors &bull; Free 30-min Demo</span>
                </div>
                <h1 className="mt-3 font-[family-name:var(--font-manrope)] text-2xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  Find the right tutor for your child
                </h1>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Compare educator credentials, teaching modes, subjects, and experience across Hyderabad and online.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Showing <strong className="text-slate-900">{filteredTutors.length}</strong> available educators
              </div>
            </div>

            {/* Filter Bar */}
            <form
              method="GET"
              action="/tutors"
              className="mt-6 rounded-2xl border border-slate-200 bg-[#f8fafc] p-3 shadow-xs"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {/* Subject */}
                <div>
                  <label htmlFor="filter-subject" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Subject
                  </label>
                  <select
                    id="filter-subject"
                    name="subject"
                    defaultValue={selectedSubject}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grade / Class */}
                <div>
                  <label htmlFor="filter-class" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Class
                  </label>
                  <select
                    id="filter-class"
                    name="class"
                    defaultValue={selectedClass}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="">All Classes</option>
                    {availableClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teaching Mode */}
                <div>
                  <label htmlFor="filter-mode" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Mode
                  </label>
                  <select
                    id="filter-mode"
                    name="mode"
                    defaultValue={selectedMode}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="">Any Mode</option>
                    <option value="online">Online Tuition</option>
                    <option value="home">Home Tuition</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label htmlFor="filter-language" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Language
                  </label>
                  <select
                    id="filter-language"
                    name="language"
                    defaultValue={selectedLanguage}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="">Any Language</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location / Locality */}
                <div>
                  <label htmlFor="filter-location" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Locality
                  </label>
                  <input
                    id="filter-location"
                    type="text"
                    name="location"
                    defaultValue={selectedLocation}
                    placeholder="e.g. B.N. Reddy, Madhapur"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200/70 pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {filtersAreActive && (
                    <>
                      <span className="text-[11px] font-bold text-slate-400">Filters:</span>
                      {selectedSubject && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                          {selectedSubject}
                        </span>
                      )}
                      {selectedClass && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                          {selectedClass}
                        </span>
                      )}
                      {selectedMode && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                          {selectedMode === "online" ? "Online" : "Home"}
                        </span>
                      )}
                      {selectedLocation && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                          {selectedLocation}
                        </span>
                      )}
                      {selectedLanguage && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                          {selectedLanguage}
                        </span>
                      )}
                      <Link
                        href="/tutors"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 ml-1"
                      >
                        <IconX size={12} />
                        Clear All
                      </Link>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary min-h-[38px] px-4 text-xs font-bold shrink-0 ml-auto"
                >
                  <IconFilter size={13} />
                  <span>Apply Filters</span>
                </button>
              </div>
              <p className="mt-2.5 text-[11px] text-slate-400">
                Note: Locality and distance matching represent prototype estimations. Exact home tuition travel coverage is confirmed directly with educators.
              </p>
            </form>
          </div>
        </section>

        {/* Tutor Results Grid */}
        <section className="py-10 sm:py-14">
          <div className="container-shell">
            {filteredTutors.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <IconSearch size={22} />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-lg font-bold text-slate-900">
                  No tutors matched your filter
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Try adjusting your subject, location, or class criteria to see more available educators.
                </p>
                <div className="mt-6">
                  <Link href="/tutors" className="btn btn-secondary">
                    <span>Reset All Filters</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
