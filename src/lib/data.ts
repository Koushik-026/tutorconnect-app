import type {
  DemoBooking,
  Student,
  Subject,
  TuitionPackage,
  Tutor,
} from "./types";

/*
  Canonical Sample/Demo Data for TutorConnect
  Provides consistent sample personas, packages, and subjects.
  Note: Seed tutors are illustrative demo profiles, not verified KYC professionals.
*/

export const student: Student = {
  id: "student-aarav-reddy",
  name: "Aarav Reddy",
  className: "Class 9",
  board: "CBSE",
  subjects: ["Mathematics", "Science"],
  locality: "B.N. Reddy Nagar",
  city: "Hyderabad",
  preferredLanguages: ["English", "Telugu"],
};

export const tutors: Tutor[] = [
  {
    id: "ananya-sharma",
    name: "Ananya Sharma",
    profileImage: "",
    headline: "Mathematics & Science Educator",
    bio: "Concept-first educator who builds intuitive understanding. Guiding CBSE & ICSE learners across Classes 6 to 12 in foundation and exam preparation.",

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
    rating: null,
    reviewCount: 0,
    isDemoProfile: true,

    modes: ["online", "home"],

    locality: "B.N. Reddy Nagar",
    city: "Hyderabad",
    travelRadiusKm: 5,

    startingPackagePrice: 3200,
    startingMonthlyFee: 3200,

    verification: [
      "Qualification reviewed",
      "Teaching profile reviewed",
    ],

    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    availableTimes: ["4:00 PM", "5:00 PM", "6:00 PM"],
  },

  {
    id: "rahul-verma",
    name: "Rahul Verma",
    profileImage: "",
    headline: "Physics & Mathematics Specialist",
    bio: "Engaging problem-solver who breaks down numerical difficulties into structured analytical steps. Specializes in secondary school Physics and Higher Mathematics.",

    subjects: ["Physics", "Mathematics"],
    classes: [
      "Class 8",
      "Class 9",
      "Class 10",
      "Class 11",
      "Class 12",
    ],
    boards: ["CBSE", "State Board"],
    languages: ["English", "Hindi"],

    experienceYears: 6,
    rating: null,
    reviewCount: 0,
    isDemoProfile: true,

    modes: ["online", "home"],

    locality: "Madhapur",
    city: "Hyderabad",
    travelRadiusKm: 7,

    startingPackagePrice: 3200,
    startingMonthlyFee: 3200,

    verification: [
      "Qualification reviewed",
      "Teaching profile reviewed",
    ],

    availableDays: ["Tuesday", "Thursday", "Saturday", "Sunday"],
    availableTimes: ["4:30 PM", "5:30 PM", "7:00 PM"],
  },

  {
    id: "priya-nair",
    name: "Priya Nair",
    profileImage: "",
    headline: "Chemistry & Biology Mentor",
    bio: "Dedicated science educator specializing in organic mechanisms, cell biology, and diagrammatic clarity for ICSE & CBSE boards.",

    subjects: ["Chemistry", "Biology", "Science"],
    classes: ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
    boards: ["ICSE", "CBSE"],
    languages: ["English", "Telugu"],

    experienceYears: 5,
    rating: null,
    reviewCount: 0,
    isDemoProfile: true,

    modes: ["online"],

    locality: "Gachibowli",
    city: "Hyderabad",
    travelRadiusKm: 0,

    startingPackagePrice: 3200,
    startingMonthlyFee: 3200,

    verification: [
      "Qualification reviewed",
      "Teaching profile reviewed",
    ],

    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    availableTimes: ["5:00 PM", "6:00 PM", "7:30 PM"],
  },

  {
    id: "vikram-reddy",
    name: "Vikram Reddy",
    profileImage: "",
    headline: "Computer Science & English Instructor",
    bio: "Focuses on systematic coding fundamentals in Python/Java and precise communicative English for middle and high school students.",

    subjects: ["Computer Science", "English"],
    classes: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
    boards: ["CBSE", "ICSE", "State Board"],
    languages: ["English", "Telugu"],

    experienceYears: 4,
    rating: null,
    reviewCount: 0,
    isDemoProfile: true,

    modes: ["online", "home"],

    locality: "Kukatpally",
    city: "Hyderabad",
    travelRadiusKm: 6,

    startingPackagePrice: 3200,
    startingMonthlyFee: 3200,

    verification: [
      "Qualification reviewed",
      "Teaching profile reviewed",
    ],

    availableDays: ["Monday", "Wednesday", "Friday", "Sunday"],
    availableTimes: ["3:30 PM", "5:00 PM", "6:30 PM"],
  },
];

export const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "pi",
    tutorCount: 42,
    description: "Arithmetic, Algebra, Geometry, Trigonometry, Calculus",
  },
  {
    id: "physics",
    name: "Physics",
    icon: "atom",
    tutorCount: 28,
    description: "Mechanics, Thermodynamics, Optics, Electricity, Magnetism",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "flask-conical",
    tutorCount: 24,
    description: "Physical, Inorganic, and Organic Chemistry with Lab Intuition",
  },
  {
    id: "biology",
    name: "Biology",
    icon: "dna",
    tutorCount: 19,
    description: "Botany, Zoology, Human Physiology, Genetics, Ecology",
  },
  {
    id: "english",
    name: "English",
    icon: "book-open",
    tutorCount: 31,
    description: "Grammar, Literature, Reading Comprehension, Writing Skills",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    icon: "code",
    tutorCount: 16,
    description: "Python, Java, Data Structures, Web Fundamentals, CBSE CS",
  },
];

export const tuitionPackages: TuitionPackage[] = [
  {
    id: "package-8",
    title: "Starter Plan (8 Classes)",
    numberOfClasses: 8,
    price: 3200,
    validityDays: 45,
    description: "Ideal for concept reinforcement, targeted doubt clearing, and bridging specific subject gaps.",
    classDurationMinutes: 60,
  },
  {
    id: "package-12",
    title: "Regular Plan (12 Classes)",
    numberOfClasses: 12,
    price: 4500,
    validityDays: 45,
    description: "Recommended for continuous syllabus coverage, exam preparation, and building problem-solving velocity.",
    classDurationMinutes: 60,
  },
  {
    id: "package-15",
    title: "Intensive Plan (15 Classes)",
    numberOfClasses: 15,
    price: 5400,
    validityDays: 45,
    description: "Comprehensive coverage for dual-subject learners and accelerated exam preparation.",
    classDurationMinutes: 60,
  },
];

export const sampleDemoBooking: DemoBooking = {
  id: "demo-aarav-ananya",
  studentId: "student-aarav-reddy",
  tutorId: "ananya-sharma",
  scheduledAt: "2026-10-05T16:30:00+05:30",
  status: "confirmed",
  mode: "online",
};
