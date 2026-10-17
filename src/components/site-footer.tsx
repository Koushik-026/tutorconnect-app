import Link from "next/link";
import { Logo } from "./logo";
import { IconVideo, IconHomeTuition, IconCheck } from "./ui/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(24,33,30,0.09)] bg-[#F4F8FB] text-[#66716D]">
      <div className="container-shell py-16 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#66716D]">
              Thoughtful 1-on-1 online and in-home tuition for school students
              in Hyderabad. Attend a free 30-minute demo and find the right fit.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(35,107,91,0.20)] bg-[#E2F5EC] px-3 py-1 text-xs font-bold text-[#1A5247]">
                <IconCheck size={12} className="text-[#236B5B]" />
                <span>Free 30-min Demo</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(59,130,246,0.18)] bg-[#E3F2FF] px-3 py-1 text-xs font-bold text-[#1D4ED8]">
                <IconVideo size={12} />
                <span>Online Tuition</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(35,107,91,0.20)] bg-[#E2F5EC] px-3 py-1 text-xs font-bold text-[#1A5247]">
                <IconHomeTuition size={12} />
                <span>Home Tuition</span>
              </span>
            </div>
          </div>

          {/* Discover */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#18211E]">Discover</span>
            <ul className="mt-4 space-y-3 text-xs font-medium">
              <li><Link href="/tutors" className="transition hover:text-[#236B5B]">All Tutors</Link></li>
              <li><Link href="/tutors?mode=online" className="transition hover:text-[#236B5B]">Online Tutors</Link></li>
              <li><Link href="/tutors?mode=home" className="transition hover:text-[#236B5B]">Home Tutors (Hyderabad)</Link></li>
              <li><Link href="/tutors?subject=Mathematics" className="transition hover:text-[#236B5B]">Mathematics Tuition</Link></li>
              <li><Link href="/tutors?subject=Science" className="transition hover:text-[#236B5B]">Science Tuition</Link></li>
            </ul>
          </div>

          {/* Learning Journey */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#18211E]">Learning Journey</span>
            <ul className="mt-4 space-y-3 text-xs font-medium">
              <li><Link href="/demo/book" className="transition hover:text-[#236B5B]">Book a Free Demo</Link></li>
              <li><Link href="/packages/select" className="transition hover:text-[#236B5B]">Class Packages</Link></li>
              <li><Link href="/dashboard/student" className="transition hover:text-[#236B5B]">Student Workspace</Link></li>
              <li><Link href="/#how-it-works" className="transition hover:text-[#236B5B]">How It Works</Link></li>
            </ul>
          </div>

          {/* Tutors */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#18211E]">Tutors</span>
            <ul className="mt-4 space-y-3 text-xs font-medium">
              <li><Link href="/auth?role=tutor" className="transition hover:text-[#236B5B]">Become a Tutor</Link></li>
              <li><Link href="/auth" className="transition hover:text-[#236B5B]">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[rgba(24,33,30,0.09)] pt-8 text-xs text-[#9BAAA5] sm:flex-row">
          <p>&copy; 2026 TutorConnect. Crafted for student momentum.</p>
          <div className="flex gap-6">
            <span>CBSE &bull; ICSE &bull; State Board</span>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}