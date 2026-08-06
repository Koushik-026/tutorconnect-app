export type TeachingMode = "online" | "home";

export type VerificationType =
  | "Identity verified"
  | "Qualification verified"
  | "Teaching profile reviewed";

export interface Tutor {
  id: string;
  name: string;
  profileImage: string;
  headline: string;
  bio: string;

  subjects: string[];
  classes: string[];
  boards: string[];
  languages: string[];

  experienceYears: number;
  rating: number;
  reviewCount: number;

  modes: TeachingMode[];

  locality: string;
  city: string;
  travelRadiusKm: number;

  startingMonthlyFee: number;

  verification: VerificationType[];

  availableDays: string[];
  availableTimes: string[];
}

export interface Student {
  id: string;
  name: string;
  className: string;
  board: string;
  subjects: string[];
  locality: string;
  city: string;
  preferredLanguages: string[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  tutorCount: number;
  description: string;
}

export interface TuitionPackage {
  id: string;
  title: string;
  numberOfClasses: number;
  price: number;
  validityDays: number;
  classDurationMinutes: number;
  description: string;
}

export interface DemoBooking {
  id: string;
  studentId: string;
  tutorId: string;
  subjects: string[];

  date: string;
  startTime: string;
  endTime: string;
  timezone: string;

  durationMinutes: number;
  mode: "online";

  status:
    | "requested"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "no-show";
}