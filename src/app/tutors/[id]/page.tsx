import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

type TutorProfile = {
  id: string;
  initials: string;
  name: string;
  headline: string;
  bio: string;
  subjects: string[];
  classes: string[];
  boards: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  modes: ("online" | "home")[];
  locality: string;
  city: string;
  travelRadiusKm: number;
  qualifications: string[];
  teachingStyle: string[];
  availability: {
    day: string;
    times: string[];
  }[];
  packages: {
    classes: number;
    price: number;
    description: string;
  }[];
  profileImage?: string;
};

const tutors: TutorProfile[] = [
  {
    id: "ananya-sharma",
    initials: "AS",
    name: "Ananya Sharma",
    headline: "Mathematics & Science Tutor",
    bio:
      "I help students understand Mathematics and Science through clear explanations, guided practice and regular feedback. My focus is on building strong fundamentals first and then improving confidence with progressively challenging questions.",
    subjects: ["Mathematics", "Science"],
    classes: [
      "Class 6",
      "Class 7",
      "Class 8",
      "Class 9",
      "Class 10",
      "Class 11",
      "Class 12",
    ],
    boards: ["CBSE", "ICSE"],
    languages: ["English", "Hindi", "Telugu"],
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 124,
    modes: ["online", "home"],
    locality: "B.N. Reddy Nagar",
    city: "Hyderabad",
    travelRadiusKm: 5,
    qualifications: [
      "Postgraduate-level subject knowledge",
      "8 years of tutoring experience",
      "CBSE and ICSE teaching experience",
    ],
    teachingStyle: [
      "Concept-first explanations",
      "Step-by-step problem solving",
      "Regular practice and feedback",
      "Progress-based revision",
    ],
    availability: [
      {
        day: "Monday",
        times: ["5:00 PM", "6:30 PM"],
      },
      {
        day: "Wednesday",
        times: ["5:00 PM", "6:30 PM"],
      },
      {
        day: "Friday",
        times: ["5:00 PM", "6:30 PM"],
      },
      {
        day: "Saturday",
        times: ["10:00 AM", "4:00 PM"],
      },
    ],
    packages: [
      {
        classes: 8,
        price: 3200,
        description: "Suitable for focused monthly support.",
      },
      {
        classes: 12,
        price: 4500,
        description: "Balanced plan for regular weekly learning.",
      },
      {
        classes: 15,
        price: 5400,
        description: "Best for consistent multi-subject tuition.",
      },
    ],
    profileImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA",
  },
  {
    id: "rahul-verma",
    initials: "RV",
    name: "Rahul Verma",
    headline: "English & Social Studies Tutor",
    bio:
      "I focus on helping students communicate clearly, improve writing and understand Social Studies through simple explanations and structured revision.",
    subjects: ["English", "Social Studies"],
    classes: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
    boards: ["CBSE", "ICSE", "State Board"],
    languages: ["English", "Hindi"],
    experienceYears: 5,
    rating: 4.7,
    reviewCount: 88,
    modes: ["online"],
    locality: "Dilsukhnagar",
    city: "Hyderabad",
    travelRadiusKm: 0,
    qualifications: [
      "English and humanities tutoring experience",
      "5 years of teaching experience",
    ],
    teachingStyle: [
      "Structured explanations",
      "Writing practice",
      "Revision-based learning",
    ],
    availability: [
      {
        day: "Tuesday",
        times: ["5:00 PM", "7:00 PM"],
      },
      {
        day: "Thursday",
        times: ["5:00 PM", "7:00 PM"],
      },
      {
        day: "Saturday",
        times: ["11:00 AM"],
      },
    ],
    packages: [
      {
        classes: 8,
        price: 2800,
        description: "Monthly online learning support.",
      },
      {
        classes: 12,
        price: 4000,
        description: "Regular weekly learning plan.",
      },
      {
        classes: 15,
        price: 4800,
        description: "Extended monthly learning support.",
      },
    ],
  },
  {
    id: "meera-reddy",
    initials: "MR",
    name: "Meera Reddy",
    headline: "Physics & Chemistry Tutor",
    bio:
      "I help students develop strong conceptual understanding in Physics and Chemistry with a focus on numericals, equations and exam preparation.",
    subjects: ["Physics", "Chemistry"],
    classes: ["Class 9", "Class 10", "Class 11", "Class 12"],
    boards: ["CBSE", "State Board"],
    languages: ["English", "Telugu"],
    experienceYears: 7,
    rating: 4.8,
    reviewCount: 103,
    modes: ["online", "home"],
    locality: "Vanasthalipuram",
    city: "Hyderabad",
    travelRadiusKm: 6,
    qualifications: [
      "Science-focused tutoring experience",
      "7 years of teaching experience",
    ],
    teachingStyle: [
      "Concept visualization",
      "Numerical problem solving",
      "Exam-oriented revision",
    ],
    availability: [
      {
        day: "Monday",
        times: ["6:00 PM"],
      },
      {
        day: "Wednesday",
        times: ["6:00 PM"],
      },
      {
        day: "Saturday",
        times: ["9:30 AM", "3:30 PM"],
      },
    ],
    packages: [
      {
        classes: 8,
        price: 4000,
        description: "Focused Physics or Chemistry support.",
      },
      {
        classes: 12,
        price: 5500,
        description: "Regular science tuition plan.",
      },
      {
        classes: 15,
        price: 6500,
        description: "Comprehensive monthly science support.",
      },
    ],
  },
  {
    id: "arjun-nair",
    initials: "AN",
    name: "Arjun Nair",
    headline: "Computer Science & Mathematics Tutor",
    bio:
      "I teach programming fundamentals, logical thinking and Mathematics through practical examples and guided problem solving.",
    subjects: ["Computer Science", "Mathematics"],
    classes: ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
    boards: ["CBSE", "ICSE"],
    languages: ["English", "Hindi"],
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 76,
    modes: ["online", "home"],
    locality: "Himayat Nagar",
    city: "Hyderabad",
    travelRadiusKm: 5,
    qualifications: [
      "Computer Science tutoring experience",
      "6 years of teaching experience",
    ],
    teachingStyle: [
      "Practical examples",
      "Logic-first programming",
      "Step-by-step Mathematics practice",
    ],
    availability: [
      {
        day: "Tuesday",
        times: ["5:30 PM", "7:00 PM"],
      },
      {
        day: "Thursday",
        times: ["5:30 PM", "7:00 PM"],
      },
      {
        day: "Sunday",
        times: ["10:00 AM"],
      },
    ],
    packages: [
      {
        classes: 8,
        price: 3600,
        description: "Monthly academic support.",
      },
      {
        classes: 12,
        price: 5000,
        description: "Regular weekly tuition plan.",
      },
      {
        classes: 15,
        price: 6000,
        description: "Extended learning package.",
      },
    ],
  },
];

function getTutor(id: string) {
  return tutors.find((tutor) => tutor.id === id);
}

function formatPrice(price: number) {
  return price.toLocaleString("en-IN");
}

export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tutor = getTutor(id);

  if (!tutor) {
    notFound();
  }

  const supportsHome = tutor.modes.includes("home");

  return (
    <>
      <SiteHeader />

      <main
        id="main-content"
        className="min-h-screen bg-slate-50/60"
      >
        {/* =====================================================
            BREADCRUMB
        ====================================================== */}
        <div className="border-b border-slate-200 bg-white">
          <div className="container-shell py-4">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-slate-500"
            >
              <Link
                href="/"
                className="transition hover:text-blue-700"
              >
                Home
              </Link>

              <span>›</span>

              <Link
                href="/tutors"
                className="transition hover:text-blue-700"
              >
                Find Tutors
              </Link>

              <span>›</span>

              <span className="font-semibold text-slate-800">
                {tutor.name}
              </span>
            </nav>
          </div>
        </div>

        {/* =====================================================
            PROFILE HERO
        ====================================================== */}
        <section className="border-b border-slate-200 bg-white">
          <div className="container-shell py-8 sm:py-10 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
              {/* MAIN PROFILE */}
              <div className="min-w-0">
                <div className="flex flex-col gap-6 sm:flex-row">
                  {/* PROFILE PHOTO */}
                  <div className="shrink-0">
                    {tutor.profileImage ? (
                      <div
                        role="img"
                        aria-label={`${tutor.name} profile`}
                        className="h-40 w-40 rounded-[28px] border border-slate-200 bg-cover bg-center shadow-sm sm:h-44 sm:w-44 lg:h-48 lg:w-48"
                        style={{
                          backgroundImage: `url('${tutor.profileImage}')`,
                        }}
                      />
                    ) : (
                      <div className="flex h-40 w-40 items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-600 to-teal-500 text-4xl font-extrabold text-white shadow-lg sm:h-44 sm:w-44 lg:h-48 lg:w-48">
                        {tutor.initials}
                      </div>
                    )}
                  </div>

                  {/* PROFILE INFO */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                        {tutor.name}
                      </h1>

                      <span className="badge badge-green">
                        ✓ Verified
                      </span>
                    </div>

                    <p className="mt-2 text-base font-semibold text-slate-600 sm:text-lg">
                      {tutor.headline}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                      <span className="font-extrabold text-amber-600">
                        ★ {tutor.rating}
                      </span>

                      <span>
                        {tutor.reviewCount} reviews
                      </span>

                      <span>•</span>

                      <span>
                        {tutor.experienceYears} years experience
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {tutor.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="badge badge-blue"
                        >
                          {subject}
                        </span>
                      ))}

                      {tutor.modes.includes("online") && (
                        <span className="badge badge-teal">
                          Online tuition
                        </span>
                      )}

                      {supportsHome && (
                        <span className="badge badge-violet">
                          Home tuition within{" "}
                          {tutor.travelRadiusKm} km
                        </span>
                      )}
                    </div>

                    <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                      <p className="flex gap-2">
                        <span className="text-blue-600">
                          ◉
                        </span>

                        <span>
                          {tutor.locality}, {tutor.city}
                        </span>
                      </p>

                      <p className="flex gap-2">
                        <span className="text-violet-600">
                          ◫
                        </span>

                        <span>
                          {tutor.languages.join(", ")}
                        </span>
                      </p>

                      <p className="flex gap-2">
                        <span className="text-teal-600">
                          ▣
                        </span>

                        <span>
                          {tutor.classes[0]}–
                          {tutor.classes.at(-1)}
                        </span>
                      </p>

                      <p className="flex gap-2">
                        <span className="text-blue-600">
                          ◇
                        </span>

                        <span>
                          {tutor.boards.join(", ")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DESKTOP ACTION CARD */}
              <aside className="hidden lg:block">
                <div className="tc-card sticky top-24 p-6">
                  <span className="badge badge-teal">
                    Free online demo
                  </span>

                  <h2 className="mt-4 text-2xl font-extrabold text-slate-950">
                    Meet {tutor.name.split(" ")[0]} before
                    choosing a package
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Attend a 30-minute online demo and
                    understand the tutor&apos;s teaching
                    style before paying.
                  </p>

                  <Link
                    href={`/demo/book?tutor=${tutor.id}`}
                    className="btn btn-primary mt-6 w-full"
                  >
                    Book Free Online Demo
                  </Link>

                  <Link
                    href={`/auth?next=/tutors/${tutor.id}`}
                    className="btn btn-secondary mt-3 w-full"
                  >
                    Message on TutorConnect
                  </Link>

                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <p className="text-sm font-extrabold text-slate-950">
                      Trust & Safety
                    </p>

                    <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                      <p>✓ Verified tutor profile</p>
                      <p>✓ Payments stay on TutorConnect</p>
                      <p>✓ Free demos are conducted online</p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {/* MOBILE / TABLET ACTIONS */}
            <div className="mt-8 grid gap-3 lg:hidden sm:grid-cols-2">
              <Link
                href={`/demo/book?tutor=${tutor.id}`}
                className="btn btn-primary w-full"
              >
                Book Free Online Demo
              </Link>

              <Link
                href={`/auth?next=/tutors/${tutor.id}`}
                className="btn btn-secondary w-full"
              >
                Message on TutorConnect
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <section className="container-shell py-8 sm:py-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="min-w-0 space-y-6">
              {/* ABOUT */}
              <article className="tc-card p-6 sm:p-7">
                <span className="badge badge-blue">
                  About the tutor
                </span>

                <h2 className="mt-4 text-2xl font-extrabold text-slate-950">
                  About me & teaching style
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                  {tutor.bio}
                </p>

                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <h3 className="font-extrabold text-slate-950">
                      Qualifications & experience
                    </h3>

                    <div className="mt-4 space-y-3">
                      {tutor.qualifications.map((item) => (
                        <p
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-slate-600"
                        >
                          <span className="mt-0.5 text-blue-600">
                            ✓
                          </span>

                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <h3 className="font-extrabold text-slate-950">
                      Teaching approach
                    </h3>

                    <div className="mt-4 space-y-3">
                      {tutor.teachingStyle.map((item) => (
                        <p
                          key={item}
                          className="flex gap-3 text-sm leading-6 text-slate-600"
                        >
                          <span className="mt-0.5 text-teal-600">
                            ✓
                          </span>

                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

              {/* TEACHING DETAILS */}
              <article className="tc-card p-6 sm:p-7">
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Teaching details
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Subjects
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {tutor.subjects.map((subject) => (
                        <span
                          key={subject}
                          className="badge badge-blue"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Boards
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {tutor.boards.map((board) => (
                        <span
                          key={board}
                          className="badge badge-violet"
                        >
                          {board}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Classes
                    </p>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      {tutor.classes[0]} to{" "}
                      {tutor.classes.at(-1)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                      Languages
                    </p>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      {tutor.languages.join(", ")}
                    </p>
                  </div>
                </div>
              </article>

              {/* LOCATION */}
              <article className="tc-card p-6 sm:p-7">
                <h2 className="text-2xl font-extrabold text-slate-950">
                  Location & tuition mode
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
                    <span className="badge badge-teal">
                      Online
                    </span>

                    <h3 className="mt-4 font-extrabold text-slate-950">
                      Online tuition available
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Attend regular classes online from
                      anywhere.
                    </p>
                  </div>

                  {supportsHome && (
                    <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
                      <span className="badge badge-violet">
                        Home tuition
                      </span>

                      <h3 className="mt-4 font-extrabold text-slate-950">
                        Available within{" "}
                        {tutor.travelRadiusKm} km
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Based around {tutor.locality},{" "}
                        {tutor.city}. Final availability
                        depends on the student&apos;s actual
                        location.
                      </p>
                    </div>
                  )}
                </div>
              </article>

              {/* INTRO VIDEO */}
              <article className="tc-card overflow-hidden">
                <div className="p-6 sm:p-7">
                  <h2 className="text-2xl font-extrabold text-slate-950">
                    Tutor introduction
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    A short introduction video can be added
                    here after the tutor completes profile
                    verification.
                  </p>
                </div>

                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
                  <div className="text-center text-white">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl backdrop-blur">
                      ▶
                    </div>

                    <p className="mt-4 text-sm font-bold">
                      Introduction video
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      Video preview placeholder
                    </p>
                  </div>
                </div>
              </article>

              {/* REVIEWS */}
              <article className="tc-card p-6 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="badge badge-amber">
                      Student feedback
                    </span>

                    <h2 className="mt-4 text-2xl font-extrabold text-slate-950">
                      Reviews
                    </h2>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-3xl font-extrabold text-slate-950">
                      {tutor.rating}
                    </p>

                    <p className="text-sm text-slate-500">
                      {tutor.reviewCount} reviews
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <p className="text-sm leading-7 text-slate-600">
                    Student review content will appear here
                    after completed TutorConnect classes and
                    verified feedback submissions.
                  </p>
                </div>
              </article>
            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================== */}
            <aside className="space-y-6">
              {/* PACKAGES */}
              <article className="tc-card p-6">
                <span className="badge badge-violet">
                  Monthly packages
                </span>

                <h2 className="mt-4 text-2xl font-extrabold text-slate-950">
                  Choose after your free demo
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  You don&apos;t need to select a package
                  before attending the demo.
                </p>

                <div className="mt-6 space-y-3">
                  {tutor.packages.map((item, index) => (
                    <div
                      key={item.classes}
                      className={`rounded-2xl border p-5 ${
                        index === tutor.packages.length - 1
                          ? "border-blue-300 bg-blue-50/60"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-extrabold text-slate-950">
                            {item.classes} classes
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {item.description}
                          </p>
                        </div>

                        {index ===
                          tutor.packages.length - 1 && (
                          <span className="badge badge-blue">
                            Popular
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-2xl font-extrabold text-slate-950">
                        ₹{formatPrice(item.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/demo/book?tutor=${tutor.id}`}
                  className="btn btn-primary mt-5 w-full"
                >
                  Book Demo First
                </Link>
              </article>

              {/* AVAILABILITY */}
              <article className="tc-card p-6">
                <h2 className="text-xl font-extrabold text-slate-950">
                  Weekly availability
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Example available slots for regular
                  sessions.
                </p>

                <div className="mt-5 space-y-4">
                  {tutor.availability.map((slot) => (
                    <div
                      key={slot.day}
                      className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    >
                      <p className="text-sm font-extrabold text-slate-900">
                        {slot.day}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {slot.times.map((time) => (
                          <span
                            key={time}
                            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* SAFETY TABLET/MOBILE */}
              <article className="tc-card p-6 lg:hidden">
                <h2 className="font-extrabold text-slate-950">
                  TutorConnect safety
                </h2>

                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <p>✓ Verified tutor profile</p>
                  <p>✓ Free demo conducted online</p>
                  <p>✓ Payments stay on TutorConnect</p>
                  <p>✓ Learning records stay in your dashboard</p>
                </div>
              </article>
            </aside>
          </div>
        </section>

        {/* =====================================================
            MOBILE STICKY ACTION
        ====================================================== */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:hidden">
          <div className="mx-auto flex max-w-md gap-2">
            <Link
              href={`/tutors`}
              className="btn btn-secondary px-4"
            >
              Back
            </Link>

            <Link
              href={`/demo/book?tutor=${tutor.id}`}
              className="btn btn-primary flex-1"
            >
              Book Free Demo
            </Link>
          </div>
        </div>

        {/* MOBILE BOTTOM SPACER */}
        <div className="h-20 sm:hidden" />
      </main>
    </>
  );
}