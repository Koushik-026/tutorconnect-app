import Link from "next/link";
import { Logo } from "./logo";
import { IconShieldCheck, IconVideo, IconHomeTuition } from "./ui/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600">
      <div className="container-shell py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Personalised online and home tuition for school and secondary students. Connect with verified educators, attend a free 30-minute demo, and track learning progress effortlessly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1 text-xs font-bold text-blue-700">
                <IconShieldCheck size={14} />
                Verified Profiles
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50/70 px-3 py-1 text-xs font-bold text-teal-700">
                <IconVideo size={14} />
                Free Online Demos
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50/70 px-3 py-1 text-xs font-bold text-purple-700">
                <IconHomeTuition size={14} />
                Online & Home Mode
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-[family-name:var(--font-manrope)] text-sm font-bold uppercase tracking-wider text-slate-900">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/tutors" className="transition hover:text-blue-600">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition hover:text-blue-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#subjects" className="transition hover:text-blue-600">
                  Popular Subjects
                </Link>
              </li>
              <li>
                <Link href="/packages/select" className="transition hover:text-blue-600">
                  Tuition Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-[family-name:var(--font-manrope)] text-sm font-bold uppercase tracking-wider text-slate-900">
              Get Started
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/auth?role=student" className="transition hover:text-blue-600">
                  Student / Parent Login
                </Link>
              </li>
              <li>
                <Link href="/auth?role=tutor" className="transition hover:text-blue-600">
                  Apply as a Tutor
                </Link>
              </li>
              <li>
                <Link href="/demo/book" className="transition hover:text-blue-600">
                  Book a Free Demo
                </Link>
              </li>
              <li>
                <Link href="/dashboard/student" className="transition hover:text-blue-600">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Support */}
          <div>
            <h4 className="font-[family-name:var(--font-manrope)] text-sm font-bold uppercase tracking-wider text-slate-900">
              Coverage
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Hyderabad: B.N. Reddy Nagar, Dilsukhnagar, Vanasthalipuram, Madhapur, Gachibowli, Kukatpally, and online across India.
            </p>
            <p className="mt-4 text-xs font-semibold text-slate-400">
              CBSE &bull; ICSE &bull; State Board
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} TutorConnect. Built for focused, calm learning.</p>
          <div className="flex gap-6">
            <Link href="/" className="transition hover:text-slate-600">
              Privacy Policy
            </Link>
            <Link href="/" className="transition hover:text-slate-600">
              Terms of Service
            </Link>
            <Link href="/" className="transition hover:text-slate-600">
              Trust &amp; Safety
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
