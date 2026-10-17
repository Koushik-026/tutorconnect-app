import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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
    "Find online and home tutors, attend a free online demo, and manage classes, study notes, and learning progress in one place.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var theme = localStorage.getItem('tc-theme') || 'system';
                var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
