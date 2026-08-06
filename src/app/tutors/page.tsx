import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { TutorCard } from "@/components/tutor-card";
import { subjects, tutors } from "@/lib/data";

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

    /*
      This is temporary mock location filtering.

      Later, Supabase PostGIS will calculate the actual distance between
      student and tutor locations.
    */
    const locationMatches =
      !selectedLocation ||
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

  const availableLanguages = Array.from(
    new Set(tutors.flatMap((tutor) => tutor.languages)),
  ).sort();

  const filtersAreActive =
    selectedSubject ||
    selectedClass ||
    selectedLocation ||
    selectedMode ||
    selectedLanguage;

  return (
    <main className="min-h-screen">
      <SiteHeader />

      {/* Page heading */}
      <section className="border-b border-slate-200 bg-white/60 py-10 sm:py-14">
        <div className="container-shell">
          <span className="badge badge-blue mb-4">Tutor discovery</span>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Find a tutor who matches your needs
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Filter tutors by subject, class, teaching mode, language and
                locality. Every free demo is conducted online.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              <span className="font-bold">Location:</span>{" "}
              {selectedLocation || "Hyderabad"}
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-shell">
          <div className="grid gap-7 lg:grid-cols-[290px_1fr]">
            {/* =================================================
                Filters
            ================================================== */}
            <aside>
              <form
                action="/tutors"
                className="tc-card sticky top-24 space-y-5 p-5 sm:p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Filters
                    </h2>

                    {filtersAreActive && (
                      <Link
                        href="/tutors"
                        className="text-sm font-bold text-blue-600 hover:text-blue-700"
                      >
                        Clear
                      </Link>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Refine the tutor results.
                  </p>
                </div>

                <div>
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    defaultValue={selectedSubject}
                    className="form-input"
                  >
                    <option value="">All subjects</option>

                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="class" className="form-label">
                    Student class
                  </label>

                  <select
                    id="class"
                    name="class"
                    defaultValue={selectedClass}
                    className="form-input"
                  >
                    <option value="">All classes</option>

                    {Array.from({ length: 7 }, (_, index) => index + 6).map(
                      (classNumber) => (
                        <option
                          key={classNumber}
                          value={`Class ${classNumber}`}
                        >
                          Class {classNumber}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="mode" className="form-label">
                    Tuition mode
                  </label>

                  <select
                    id="mode"
                    name="mode"
                    defaultValue={selectedMode}
                    className="form-input"
                  >
                    <option value="">Online or home</option>
                    <option value="online">Online tuition</option>
                    <option value="home">Home tuition</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="language" className="form-label">
                    Teaching language
                  </label>

                  <select
                    id="language"
                    name="language"
                    defaultValue={selectedLanguage}
                    className="form-input"
                  >
                    <option value="">All languages</option>

                    {availableLanguages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="form-label">
                    Locality
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    defaultValue={selectedLocation}
                    placeholder="For example: B.N. Reddy Nagar"
                    className="form-input"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Exact distance matching will be connected when we add the
                    location database.
                  </p>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Apply Filters
                </button>
              </form>
            </aside>

            {/* =================================================
                Results
            ================================================== */}
            <div>
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Available tutors
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {filteredTutors.length}{" "}
                    {filteredTutors.length === 1 ? "tutor" : "tutors"} found
                  </p>
                </div>

                <select
                  aria-label="Sort tutor results"
                  defaultValue="recommended"
                  className="form-input max-w-55"
                >
                  <option value="recommended">Recommended first</option>
                  <option value="rating">Highest rated</option>
                  <option value="experience">Most experienced</option>
                  <option value="price-low">Lowest price</option>
                </select>
              </div>

              {filteredTutors.length > 0 ? (
                <div className="grid gap-6 xl:grid-cols-2">
                  {filteredTutors.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>
              ) : (
                <div className="tc-card px-6 py-16 text-center sm:px-10">
                  <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-3xl bg-blue-100 text-3xl">
                    🔎
                  </div>

                  <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
                    No matching tutors found
                  </h2>

                  <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
                    Try changing the subject, tuition mode, language or
                    locality to see more tutor profiles.
                  </p>

                  <Link href="/tutors" className="btn btn-primary mt-7">
                    Clear All Filters
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container-shell py-7 text-sm text-slate-500">
          © 2026 TutorConnect. All rights reserved.
        </div>
      </footer>
    </main>
  );
}