import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TutorConnect",
    template: "%s | TutorConnect",
  },
  description:
    "Find verified online and home tutors, attend a free online demo, and manage classes, notes, quizzes and progress in one place.",
  applicationName: "TutorConnect",
  keywords: [
    "TutorConnect",
    "online tutors",
    "home tuition",
    "Hyderabad tutors",
    "student learning",
    "private tuition",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}