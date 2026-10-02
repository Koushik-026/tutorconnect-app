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
    <div className="flex min-h-screen flex-col bg-[#F7F4EE]">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-16">
        {/* Header / Intro Strip */}
        <section className="border-b border-[#E4DED4] bg-[#FFFEFB] py-10 lg:py-14">
          <div className="container-shell">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#4F7867]/20 bg-[#E6F0EA] px-3 py-1 text-xs font-bold text-[#3E6153] mb-3">
                <IconShieldCheck size={13} />
                <span>Verified Tutors &bull; Free 30-min Demo</span>
              </div>
              <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-extrabold tracking-tight text-[#232520] sm:text-4xl">
                Find Your Ideal Educator
              </h1>
              <p className="mt-2 text-sm text-[#676B64] leading-relaxed">
                Compare verified educator credentials, teaching modes, subjects, and experience across Hyderabad and online.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Toolbar & Results */}
        <section className="py-8">
          <div className="container-shell">
            {/* Filter Form Card */}
            <form
              method="GET"
              action="/tutors"
              className="rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-5 shadow-xs mb-8"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {/* Subject */}
                <div>
                  <label htmlFor="filter-subject" className="block text-[11px] font-bold uppercase tracking-wider text-[#989C94] mb-1">
                    Subject
                  </label>
                  <select
                    id="filter-subject"
                    name="subject"
                    defaultValue={selectedSubject}
                    className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3 py-2 text-xs font-semibold text-[#232520] focus:outline-hidden focus:border-[#66518A]"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label htmlFor="filter-class" className="block text-[11px] font-bold uppercase tracking-wider text-[#989C94] mb-1">
                    Class Level
                  </label>
                  <select
                    id="filter-class"
                    name="class"
                    defaultValue={selectedClass}
                    className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3 py-2 text-xs font-semibold text-[#232520] focus:outline-hidden focus:border-[#66518A]"
                  >
                    <option value="">All Classes</option>
                    {availableClasses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode */}
                <div>
                  <label htmlFor="filter-mode" className="block text-[11px] font-bold uppercase tracking-wider text-[#989C94] mb-1">
                    Teaching Mode
                  </label>
                  <select
                    id="filter-mode"
                    name="mode"
                    defaultValue={selectedMode}
                    className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3 py-2 text-xs font-semibold text-[#232520] focus:outline-hidden focus:border-[#66518A]"
                  >
                    <option value="">Online &amp; Home</option>
                    <option value="online">Online Tuition</option>
                    <option value="home">Home Tuition</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label htmlFor="filter-language" className="block text-[11px] font-bold uppercase tracking-wider text-[#989C94] mb-1">
                    Language
                  </label>
                  <select
                    id="filter-language"
                    name="language"
                    defaultValue={selectedLanguage}
                    className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3 py-2 text-xs font-semibold text-[#232520] focus:outline-hidden focus:border-[#66518A]"
                  >
                    <option value="">All Languages</option>
                    {availableLanguages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location / Locality */}
                <div>
                  <label htmlFor="filter-location" className="block text-[11px] font-bold uppercase tracking-wider text-[#989C94] mb-1">
                    Locality
                  </label>
                  <input
                    id="filter-location"
                    type="text"
                    name="location"
                    defaultValue={selectedLocation}
                    placeholder="e.g. B.N. Reddy, Madhapur"
                    className="w-full rounded-xl border border-[#E4DED4] bg-[#FFFEFB] px-3 py-2 text-xs font-semibold text-[#232520] placeholder:text-[#989C94] focus:outline-hidden focus:border-[#66518A]"
                  >
                  </input>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ECE6DC] pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {filtersAreActive && (
                    <>
                      <span className="text-[11px] font-bold text-[#989C94]">Active:</span>
                      {selectedSubject && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#EFEAF8] px-2 py-0.5 text-[11px] font-bold text-[#4E3C70]">
                          {selectedSubject}
                        </span>
                      )}
                      {selectedClass && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#ECE6DC] px-2 py-0.5 text-[11px] font-bold text-[#4D504A]">
                          {selectedClass}
                        </span>
                      )}
                      {selectedMode && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#E6F0EA] px-2 py-0.5 text-[11px] font-bold text-[#3E6153]">
                          {selectedMode === "online" ? "Online" : "Home"}
                        </span>
                      )}
                      {selectedLocation && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FDF4E5] px-2 py-0.5 text-[11px] font-bold text-[#965C12]">
                          {selectedLocation}
                        </span>
                      )}
                      <Link
                        href="/tutors"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C84B31] hover:underline ml-1"
                      >
                        <IconX size={12} />
                        <span>Clear All</span>
                      </Link>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary min-h-[38px] px-4 text-xs font-bold shadow-xs ml-auto"
                >
                  <IconFilter size={13} />
                  <span>Apply Filters</span>
                </button>
              </div>

              <p className="mt-2.5 text-[11px] text-[#989C94]">
                Note: Locality and distance matching represent prototype estimations. Exact home tuition travel coverage is confirmed directly with educators.
              </p>
            </form>

            {/* Results Grid */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#676B64]">
                Showing {filteredTutors.length} {filteredTutors.length === 1 ? "educator" : "educators"}
              </span>
            </div>

            {filteredTutors.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-md rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-8 text-center shadow-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFEAF8] text-[#66518A]">
                  <IconSearch size={22} />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-manrope)] text-lg font-bold text-[#232520]">
                  No tutors matched your filter
                </h3>
                <p className="mt-2 text-sm text-[#676B64] leading-relaxed">
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
