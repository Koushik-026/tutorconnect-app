export type TeachingMode = "online" | "home";

export type VerificationType =
  | "Qualification reviewed"
  | "Teaching profile reviewed"
  | "Identity verified"
  | "Qualification verified";

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
  rating?: number | null;
  reviewCount: number;
  isDemoProfile?: boolean;

  modes: TeachingMode[];

  locality: string;
  city: string;
  travelRadiusKm: number;

  startingPackagePrice: number;
  /** @deprecated Use startingPackagePrice */
  startingMonthlyFee?: number;

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
  description: string;
  classDurationMinutes: number;
}

export interface DemoBooking {
  id: string;
  studentId: string;
  tutorId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  mode: TeachingMode;
}
