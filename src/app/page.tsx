import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const howItWorksSteps = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Choose the student's class, board, subjects, learning goals and preferred tuition mode.",
  },
  {
    number: "02",
    title: "Discover suitable tutors",
    description:
      "Compare tutor experience, subjects, ratings, languages, prices and location availability.",
  },
  {
    number: "03",
    title: "Attend a free online demo",
    description:
      "Meet the tutor through a 30-minute online demo before choosing a monthly plan.",
  },
  {
    number: "04",
    title: "Start your monthly tuition",
    description:
      "Choose a package, confirm the schedule, pay securely and track progress from one dashboard.",
  },
];

const subjects = [
  {
    name: "Mathematics",
    icon: "∑",
    description:
      "Build strong foundations and improve problem-solving skills.",
  },
  {
    name: "Science",
    icon: "⚗",
    description:
      "Understand scientific concepts through clear explanations.",
  },
  {
    name: "English",
    icon: "A",
    description:
      "Improve grammar, vocabulary, writing and communication.",
  },
  {
    name: "Physics",
    icon: "⚛",
    description:
      "Learn concepts, formulas and numerical problem solving.",
  },
  {
    name: "Chemistry",
    icon: "●",
    description:
      "Master reactions, equations and important concepts.",
  },
  {
    name: "Computer Science",
    icon: "</>",
    description:
      "Learn programming, logic and modern computing skills.",
  },
];

const featuredTutors = [
  {
    id: "ananya-sharma",
    initials: "AS",
    name: "Ananya Sharma",
    role: "Mathematics and Science Tutor",
    rating: "4.9",
    reviews: "124 reviews",
    experience: "8 years experience",
    subjects: ["Mathematics", "Science"],
    classes: "Classes 6–12 · CBSE, ICSE",
    location: "B.N. Reddy Nagar, Hyderabad",
    languages: "English, Hindi, Telugu",
    availability: [
      "Online available",
      "Home tuition within 5 km",
    ],
    price: "₹3,200",
  },
  {
    id: "rahul-verma",
    initials: "RV",
    name: "Rahul Verma",
    role: "English and Social Studies Tutor",
    rating: "4.7",
    reviews: "88 reviews",
    experience: "5 years experience",
    subjects: ["English", "Social Studies"],
    classes: "Classes 6–10 · CBSE, ICSE, State Board",
    location: "Dilsukhnagar, Hyderabad",
    languages: "English, Hindi",
    availability: ["Online available"],
    price: "₹2,800",
  },
  {
    id: "meera-reddy",
    initials: "MR",
    name: "Meera Reddy",
    role: "Physics and Chemistry Tutor",
    rating: "4.8",
    reviews: "103 reviews",
    experience: "7 years experience",
    subjects: ["Physics", "Chemistry"],
    classes: "Classes 9–12 · CBSE, State Board",
    location: "Vanasthalipuram, Hyderabad",
    languages: "English, Telugu",
    availability: [
      "Online available",
      "Home tuition within 6 km",
    ],
    price: "₹4,000",
  },
];

const platformBenefits = [
  {
    title: "Verified tutor profiles",
    description:
      "Review tutor identity, qualifications, subjects and experience before booking.",
  },
  {
    title: "Free online demo",
    description:
      "Understand the tutor's teaching style through a 30-minute online demo.",
  },
  {
    title: "Online and home tuition",
    description:
      "Choose online classes or nearby home tuition depending on availability.",
  },
  {
    title: "Progress in one place",
    description:
      "Track classes, homework, notes, quizzes and tutor feedback from one dashboard.",
  },
];

const parentBenefits = [
  "View completed and remaining classes",
  "Track homework, quizzes and tutor feedback",
  "Manage schedules, payments and renewals",
  "Request rescheduling or tutor replacement",
];

const tutorBenefits = [
  "Receive relevant student enquiries",
  "Choose online tuition, home tuition or both",
  "Manage demos, schedules and students",
  "Upload notes, assignments and quizzes",
  "Track earnings and payout status",
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content">
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-[#fbfaff] via-white to-blue-50/70">
          <div
            aria-hidden="true"
            className="absolute -left-36 top-36 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -right-28 top-0 h-96 w-96 rounded-full bg-teal-200/25 blur-3xl"
          />

          <div className="container-shell relative py-12 sm:py-16 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-2 text-xs font-bold text-blue-700 shadow-sm sm:text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3 4.5 6.5v5c0 4.5 3 7.5 7.5 9.5 4.5-2 7.5-5 7.5-9.5v-5L12 3Z" />
                      <path d="m9.5 12 1.6 1.6 3.6-3.6" />
                    </svg>
                  </span>

                  Verified tutor profiles · Free online demos
                </div>

                <h1 className="max-w-[720px] font-[family-name:var(--font-manrope)] text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-[4rem]">
                  Find the right tutor.

                  <span className="mt-1 block bg-gradient-to-r from-blue-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Learn with confidence.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Connect with experienced educators for personalized
                  online or home tuition. Find the right support for
                  CBSE, ICSE and competitive exam preparation.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/tutors"
                    className="btn btn-primary group w-full sm:w-auto"
                  >
                    Find a Tutor

                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </Link>

                  <div className="sm:hidden">
                    <Link
                      href="#how-it-works"
                      className="btn btn-secondary w-full"
                    >
                      How It Works
                    </Link>
                  </div>

                  <div className="hidden sm:block">
                    <Link
                      href="/auth?role=tutor"
                      className="btn btn-secondary"
                    >
                      Become a Tutor
                    </Link>
                  </div>
                </div>

                <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 border-t border-slate-200/80 pt-6 sm:flex sm:gap-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                      ✓
                    </span>

                    Verified Profiles
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                      ◉
                    </span>

                    Online + Home
                  </div>
                </div>
              </div>

              {/* HERO IMAGE */}
              <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
                <div
                  aria-hidden="true"
                  className="absolute -inset-5 rounded-[40px] bg-gradient-to-br from-blue-200/30 via-transparent to-teal-200/40 blur-2xl"
                />

                <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_28px_80px_rgba(37,99,235,0.16)] sm:rounded-[32px]">
                  {/* Mobile image */}
                  <div
                    role="img"
                    aria-label="Student learning online with a tutor"
                    className="aspect-[4/3] w-full bg-cover bg-center sm:hidden"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtGg6OZOCZvIcuw4wNUMALT5_jyLmy9jPcns3qV7v4GtYqYXtU1J-eO6-BgYNMaXmOyqXbp5564b0m6O3jfnhE5bWR5gY3vUli5ILiOnEzOrAjhlgFjJLYz6H0kt1n17Y01a1vFtJ9yYkabE-JlNYc4zhGGp3j2QZa8QUSH5hBuNbfWoEzToZRvAZp7Gh9UOOBd0WKignY--Cm9djY-J73ghAkwHNzHfXbyt2HbTXlWFBUhxYrMcxeYw')",
                    }}
                  />

                  {/* Tablet / desktop image */}
                  <div
                    role="img"
                    aria-label="Tutor teaching through an online learning session"
                    className="hidden min-h-[430px] w-full bg-cover bg-center sm:block lg:min-h-[500px]"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA')",
                    }}
                  />

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/80 bg-white/92 p-3 shadow-xl backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:min-w-[300px] sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="16"
                            rx="2"
                          />
                          <path d="M16 3v4" />
                          <path d="M8 3v4" />
                          <path d="M3 10h18" />
                          <path d="m9 16 2 2 4-4" />
                        </svg>
                      </div>

                      <div>
                        <p className="text-sm font-extrabold text-slate-900">
                          Free online demo
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                          30-minute session before choosing a plan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP TRUST STRIP */}
          <div className="hidden border-t border-slate-100 bg-white/90 md:block">
            <div className="container-shell grid grid-cols-3 divide-x divide-slate-100 py-8">
              <div className="px-7 text-center first:pl-0">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  ✓
                </div>

                <h2 className="mt-4 text-base font-extrabold">
                  Verified Profiles
                </h2>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Review tutor experience, qualifications and teaching
                  details before booking.
                </p>
              </div>

              <div className="px-7 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  ◉
                </div>

                <h2 className="mt-4 text-base font-extrabold">
                  Free Online Demos
                </h2>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Meet the tutor through a 30-minute online demo before
                  choosing a package.
                </p>
              </div>

              <div className="px-7 text-center last:pr-0">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-violet-50 text-violet-700">
                  ₹
                </div>

                <h2 className="mt-4 text-base font-extrabold">
                  Secure Platform Payments
                </h2>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Tuition payments stay inside TutorConnect with a clear
                  digital payment record.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH PANEL
        ====================================================== */}
        <section className="pb-12 pt-6 sm:pt-8">
          <div className="container-shell">
            <form
              action="/tutors"
              className="tc-card grid gap-4 p-5 md:grid-cols-2 md:p-7 lg:grid-cols-[1fr_1fr_1.1fr_auto] lg:items-end"
            >
              <div>
                <label
                  htmlFor="subject"
                  className="form-label"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  name="subject"
                  defaultValue=""
                  className="form-input"
                >
                  <option value="" disabled>
                    Select a subject
                  </option>

                  {subjects.map((subject) => (
                    <option
                      key={subject.name}
                      value={subject.name}
                    >
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="class"
                  className="form-label"
                >
                  Student class
                </label>

                <select
                  id="class"
                  name="class"
                  defaultValue=""
                  className="form-input"
                >
                  <option value="" disabled>
                    Select class
                  </option>

                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="form-label"
                >
                  Locality
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue="B.N. Reddy Nagar, Hyderabad"
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full lg:w-auto"
              >
                Search Tutors
              </button>
            </form>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}
        <section
          id="how-it-works"
          className="section-spacing scroll-mt-24"
        >
          <div className="container-shell">
            <div className="max-w-3xl">
              <span className="badge badge-teal">
                Simple process
              </span>

              <h2 className="section-heading mt-4">
                From tutor search to learning in four steps
              </h2>

              <p className="section-description mt-4">
                TutorConnect keeps tutor discovery, demos, monthly
                packages and learning management inside one connected
                platform.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {howItWorksSteps.map((step) => (
                <article
                  key={step.number}
                  className="tc-card tc-card-hover p-6"
                >
                  <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl bg-blue-50 px-3 text-sm font-extrabold text-blue-700">
                    {step.number}
                  </span>

                  <h3 className="mt-5 text-lg font-extrabold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SUBJECTS
        ====================================================== */}
        <section
          id="subjects"
          className="section-spacing scroll-mt-24 bg-white/70"
        >
          <div className="container-shell">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <span className="badge badge-violet">
                  Popular subjects
                </span>

                <h2 className="section-heading mt-4">
                  Find support for every important subject
                </h2>

                <p className="section-description mt-4">
                  Browse tutors by subject and choose someone who
                  understands the student&apos;s class, board and learning
                  goals.
                </p>
              </div>

              <Link
                href="/tutors"
                className="btn btn-secondary shrink-0"
              >
                View all tutors
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={`/tutors?subject=${encodeURIComponent(
                    subject.name,
                  )}`}
                  className="tc-card tc-card-hover group p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 text-lg font-black text-blue-700">
                      {subject.icon}
                    </div>

                    <span className="text-sm font-bold text-blue-600 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-slate-950">
                    {subject.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {subject.description}
                  </p>

                  <p className="mt-4 text-sm font-bold text-blue-600">
                    Explore tutors →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURED TUTORS
        ====================================================== */}
        <section className="section-spacing">
          <div className="container-shell">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <span className="badge badge-blue">
                  Featured tutors
                </span>

                <h2 className="section-heading mt-4">
                  Meet tutors ready to help students improve
                </h2>

                <p className="section-description mt-4">
                  Compare verified information, subjects,
                  experience, availability and monthly plan prices
                  before booking a demo.
                </p>
              </div>

              <Link
                href="/tutors"
                className="btn btn-secondary shrink-0"
              >
                Explore all tutors
              </Link>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {featuredTutors.map((tutor) => (
                <article
                  key={tutor.id}
                  className="tc-card flex h-full flex-col overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 font-extrabold text-white shadow-md">
                        {tutor.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-extrabold text-slate-950">
                            {tutor.name}
                          </h3>

                          <span className="badge badge-green">
                            ✓ Verified
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          {tutor.role}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          <span className="font-bold text-amber-600">
                            ★ {tutor.rating}
                          </span>

                          {` · ${tutor.reviews} · ${tutor.experience}`}
                        </p>
                      </div>
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
                    </div>

                    <div className="mt-5 space-y-3 text-sm text-slate-600">
                      <p>▣ {tutor.classes}</p>
                      <p>◉ {tutor.location}</p>
                      <p>▤ {tutor.languages}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {tutor.availability.map((item, index) => (
                        <span
                          key={item}
                          className={
                            index === 0
                              ? "badge badge-teal"
                              : "badge badge-violet"
                          }
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-5">
                      <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
                        Plans starting from
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-slate-950">
                        {tutor.price}

                        <span className="text-sm font-semibold text-slate-500">
                          /month
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50/70 p-5">
                    <Link
                      href={`/tutors/${tutor.id}`}
                      className="btn btn-secondary w-full px-3"
                    >
                      View Profile
                    </Link>

                    <Link
                      href={`/demo/book?tutor=${tutor.id}`}
                      className="btn btn-primary w-full px-3"
                    >
                      Book Free Demo
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PLATFORM BENEFITS
        ====================================================== */}
        <section className="section-spacing bg-[#020817] text-white">
          <div className="container-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100">
                One connected platform
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">
                More than just finding a tutor
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-300">
                TutorConnect helps families manage the complete
                tuition relationship—from the first demo to classes,
                learning materials and progress.
              </p>

              <Link
                href="/tutors"
                className="btn mt-7 bg-white text-slate-950 hover:bg-slate-100"
              >
                Find your tutor
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {platformBenefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 font-black text-white">
                    ✓
                  </div>

                  <h3 className="mt-4 text-base font-extrabold text-white">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PARENT + TUTOR BENEFITS
        ====================================================== */}
        <section className="section-spacing">
          <div className="container-shell grid gap-5 lg:grid-cols-2">
            <article className="overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-blue-50 to-violet-50 p-6 sm:p-8">
                <span className="badge badge-blue">
                  For parents
                </span>

                <h2 className="mt-3 text-2xl font-extrabold text-slate-950">
                  Stay informed about every class
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Manage tutor selection, packages, payments and
                  learning progress without depending on scattered
                  messages.
                </p>
              </div>

              <div className="space-y-4 p-6 sm:p-8">
                {parentBenefits.map((benefit) => (
                  <p
                    key={benefit}
                    className="flex gap-3 text-sm text-slate-700"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                      ✓
                    </span>

                    {benefit}
                  </p>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-[24px] border border-teal-100 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 sm:p-8">
                <span className="badge badge-teal">
                  For tutors
                </span>

                <h2 className="mt-3 text-2xl font-extrabold text-slate-950">
                  Grow your tutoring career
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Receive relevant requests, organize classes and
                  build a trusted professional profile.
                </p>
              </div>

              <div className="space-y-4 p-6 sm:p-8">
                {tutorBenefits.map((benefit) => (
                  <p
                    key={benefit}
                    className="flex gap-3 text-sm text-slate-700"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-black text-teal-700">
                      ✓
                    </span>

                    {benefit}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="pb-16 sm:pb-20 lg:pb-24">
          <div className="container-shell">
            <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-600 via-blue-600 to-teal-500 px-6 py-12 text-center text-white shadow-[0_24px_60px_rgba(37,99,235,0.22)] sm:px-10 sm:py-16">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
                Your next tutor is one demo away
              </span>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
                Find a tutor who matches the student&apos;s needs
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                Explore tutor profiles, attend a free online demo and
                continue only when you are satisfied with the teaching
                experience.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/tutors"
                  className="btn bg-white text-blue-700 hover:bg-blue-50"
                >
                  Find a Tutor
                </Link>

                <Link
                  href="/auth?role=tutor"
                  className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  Become a Tutor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="container-shell flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TutorConnect. All rights reserved.</p>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            <Link
              href="#"
              className="hover:text-slate-900"
            >
              Privacy
            </Link>

            <Link
              href="#"
              className="hover:text-slate-900"
            >
              Terms
            </Link>

            <Link
              href="#"
              className="hover:text-slate-900"
            >
              Refund Policy
            </Link>

            <Link
              href="#"
              className="hover:text-slate-900"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}