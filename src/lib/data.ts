import type {
  DemoBooking,
  Student,
  Subject,
  TuitionPackage,
  Tutor,
} from "./types";

/*
  Canonical Mock Data for TutorConnect
  Provides consistent tutor names, pricing, subjects, and mock states.
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
    profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPQzlQm4NKP8RwwlMcU-iNR7MlCStPHTuPVcPnXON--lVzkkXxm1ybxWUlzS16db2LPkVNwpc8Yq6VEtVSFZio6QcV_HCmwmjn9I_3lrlxyxIGNSB2kbD9ddVK0tOvHW0lUKSzEGCdoY59_wDawLUr0UfLNPQt0j47gLzNAWb2qPr_uUIYdo2Zf2jyUfWwgm4IMCRYuUmOnKtOz8sxp9gE-_dTxCuiVPhfC4yikDR2ozPcCLCcIguDSA",
    headline: "Mathematics & Science Specialist",
    bio: "Patient, concept-first educator who builds intuitive understanding rather than rote memorisation. 8+ years guiding CBSE & ICSE students to academic excellence across Classes 6 to 12.",

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

    startingMonthlyFee: 3200,

    verification: [
      "Identity verified",
      "Qualification verified",
      "Teaching profile reviewed",
    ],

    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    availableTimes: ["4:00 PM", "5:00 PM", "6:00 PM"],
  },

  {
    id: "rahul-verma",
    name: "Rahul Verma",
    profileImage: "",
    headline: "English & Social Studies Mentor",
    bio: "Engaging educator specialising in English fluency, grammar, literature analysis, and Social Studies for middle and secondary school learners.",

    subjects: ["English", "Social Studies"],
    classes: [
      "Class 6",
      "Class 7",
      "Class 8",
      "Class 9",
      "Class 10",
    ],
    boards: ["CBSE", "ICSE", "State Board"],
    languages: ["English", "Hindi"],

    experienceYears: 5,
    rating: 4.7,
    reviewCount: 86,

    modes: ["online"],

    locality: "Dilsukhnagar",
    city: "Hyderabad",
    travelRadiusKm: 0,

    startingMonthlyFee: 2800,

    verification: ["Identity verified", "Qualification verified"],

    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableTimes: ["5:00 PM", "6:00 PM", "7:00 PM"],
  },

  {
    id: "meera-reddy",
    name: "Meera Reddy",
    profileImage: "",
    headline: "Physics & Chemistry Instructor",
    bio: "Structured, concept-oriented mentor helping students master numerical problem-solving, equation balancing, and competitive board preparation.",

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

    startingMonthlyFee: 4000,

    verification: [
      "Identity verified",
      "Qualification verified",
      "Teaching profile reviewed",
    ],

    availableDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
    availableTimes: ["4:30 PM", "5:30 PM", "7:00 PM"],
  },

  {
    id: "arjun-nair",
    name: "Arjun Nair",
    profileImage: "",
    headline: "Computer Science & Coding Coach",
    bio: "Practical technology educator teaching computational thinking, Python fundamentals, algorithms, and web development through live coding.",

    subjects: ["Computer Science", "Python"],
    classes: ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
    boards: ["CBSE", "ICSE"],
    languages: ["English", "Hindi"],

    experienceYears: 4,
    rating: 4.6,
    reviewCount: 58,

    modes: ["online"],

    locality: "Madhapur",
    city: "Hyderabad",
    travelRadiusKm: 0,

    startingMonthlyFee: 3500,

    verification: ["Identity verified", "Qualification verified"],

    availableDays: ["Wednesday", "Friday", "Saturday", "Sunday"],
    availableTimes: ["5:00 PM", "6:30 PM", "8:00 PM"],
  },
];

export const featuredTutor = tutors[0];

export const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "math",
    tutorCount: 42,
    description: "Build strong fundamentals, clear formulas, and master numerical problem solving.",
  },
  {
    id: "science",
    name: "Science",
    icon: "science",
    tutorCount: 36,
    description: "Explore core scientific phenomena with structured conceptual explanations.",
  },
  {
    id: "english",
    name: "English",
    icon: "english",
    tutorCount: 31,
    description: "Enhance language fluency, essay writing, comprehension, and grammar skills.",
  },
  {
    id: "physics",
    name: "Physics",
    icon: "physics",
    tutorCount: 24,
    description: "Understand physical principles, mechanics, optics, and numerical reasoning.",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "chemistry",
    tutorCount: 22,
    description: "Master organic & inorganic chemistry, balancing equations, and reaction mechanisms.",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    icon: "code",
    tutorCount: 18,
    description: "Learn logic building, Python programming, algorithms, and practical development.",
  },
];

export const tuitionPackages: TuitionPackage[] = [
  {
    id: "package-8",
    title: "Starter Plan",
    numberOfClasses: 8,
    price: 3200,
    validityDays: 30,
    classDurationMinutes: 60,
    description: "2 classes per week. Ideal for focused homework support and concept reinforcement.",
  },
  {
    id: "package-12",
    title: "Regular Plan",
    numberOfClasses: 12,
    price: 4500,
    validityDays: 40,
    classDurationMinutes: 60,
    description: "3 classes per week. Recommended for steady learning, revision, and regular testing.",
  },
  {
    id: "package-15",
    title: "Intensive Plan",
    numberOfClasses: 15,
    price: 5400,
    validityDays: 45,
    classDurationMinutes: 60,
    description: "3 to 4 classes per week. Comprehensive coverage for exam readiness and dual subjects.",
  },
];

export const demoBooking: DemoBooking = {
  id: "demo-aarav-ananya",
  studentId: student.id,
  tutorId: featuredTutor.id,
  subjects: ["Mathematics", "Science"],

  date: "4 August 2026",
  startTime: "4:00 PM",
  endTime: "4:30 PM",
  timezone: "India Standard Time",

  durationMinutes: 30,
  mode: "online",
  status: "confirmed",
};

export const demoTimeSlots = [
  "10:00 AM",
  "11:30 AM",
  "4:00 PM",
  "5:30 PM",
  "7:00 PM",
];

export const platformBenefits = [
  {
    title: "Verified tutor profiles",
    description:
      "Review tutor identity, qualifications, subjects, and verified credentials before booking.",
  },
  {
    title: "Free 30-min online demo",
    description:
      "Experience the tutor's teaching methodology firsthand before selecting any tuition plan.",
  },
  {
    title: "Online and home tuition",
    description:
      "Choose interactive digital classrooms or nearby in-person home tutoring based on your preference.",
  },
  {
    title: "Progress in one place",
    description:
      "Track attendance, homework submissions, tutor feedback, and assessment reports on one clean dashboard.",
  },
];
