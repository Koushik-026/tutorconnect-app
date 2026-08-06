import type {
  DemoBooking,
  Student,
  Subject,
  TuitionPackage,
  Tutor,
} from "./types";

/*
  This file temporarily stores mock data.

  Later, Supabase will provide this information.
  For now, every page imports data from this file so tutor names,
  prices, subjects and dates remain consistent.
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
    profileImage: "/images/tutors/ananya-sharma.jpg",
    headline: "Mathematics and Science Tutor",
    bio: "Patient and result-focused tutor who helps students understand concepts clearly instead of memorising answers. Experienced in teaching CBSE and ICSE students from Classes 6 to 12.",

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
    profileImage: "/images/tutors/rahul-verma.jpg",
    headline: "English and Social Studies Tutor",
    bio: "Friendly tutor specialising in English communication, grammar and Social Studies for middle-school and secondary-school students.",

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
    profileImage: "/images/tutors/meera-reddy.jpg",
    headline: "Physics and Chemistry Tutor",
    bio: "Concept-oriented tutor helping students build strong foundations in Physics and Chemistry through examples, problem solving and regular assessments.",

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
    profileImage: "/images/tutors/arjun-nair.jpg",
    headline: "Computer Science Tutor",
    bio: "Practical Computer Science tutor teaching programming fundamentals, Python, web development and logical problem solving.",

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
    icon: "∑",
    tutorCount: 42,
    description: "Build strong foundations and improve problem-solving skills.",
  },
  {
    id: "science",
    name: "Science",
    icon: "⚗",
    tutorCount: 36,
    description: "Understand scientific concepts through clear explanations.",
  },
  {
    id: "english",
    name: "English",
    icon: "A",
    tutorCount: 31,
    description: "Improve grammar, vocabulary, writing and communication.",
  },
  {
    id: "physics",
    name: "Physics",
    icon: "⚛",
    tutorCount: 24,
    description: "Learn concepts, formulas and numerical problem solving.",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "◉",
    tutorCount: 22,
    description: "Master reactions, equations and important concepts.",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    icon: "</>",
    tutorCount: 18,
    description: "Learn programming, logic and modern computing skills.",
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
    description: "Suitable for students who need weekly academic support.",
  },
  {
    id: "package-12",
    title: "Regular Plan",
    numberOfClasses: 12,
    price: 4500,
    validityDays: 40,
    classDurationMinutes: 60,
    description: "Regular learning support with three classes per week.",
  },
  {
    id: "package-15",
    title: "Intensive Plan",
    numberOfClasses: 15,
    price: 5400,
    validityDays: 45,
    classDurationMinutes: 60,
    description: "Intensive monthly learning for stronger improvement.",
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
      "Track classes, homework, notes, quizzes and tutor feedback.",
  },
];