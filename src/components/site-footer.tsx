import Link from "next/link";
import { Logo } from "./logo";
import { IconVideo, IconHomeTuition, IconCheck } from "./ui/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--tc-border)] bg-[var(--tc-surface-muted)] text-[var(--tc-text-secondary)] transition-colors">
      <div className="container-shell py-14 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-[var(--tc-text-secondary)]">
              Thoughtful 1-on-1 online and in-home tuition for school students
              in Hyderabad. Attend a free 30-minute demo and find the right fit.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tc-teal)]/25 bg-[var(--tc-teal)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--tc-teal)]">
                <IconCheck size={12} />
                <span>Free 30-min Demo</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tc-primary)]/20 bg-[var(--tc-soft-primary)] px-2.5 py-1 text-[11px] font-bold text-[var(--tc-primary)]">
                <IconVideo size={12} />
                <span>Online Tuition</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tc-border)] bg-[var(--tc-surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--tc-text-primary)]">
                <IconHomeTuition size={12} />
                <span>Home Tuition</span>
              </span>
            </div>
          </div>

          {/* Discover */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-primary)]">Discover</span>
            <ul className="mt-3.5 space-y-2.5 text-xs font-medium">
              <li><Link href="/tutors" className="transition-colors hover:text-[var(--tc-primary)]">All Tutors</Link></li>
              <li><Link href="/tutors?mode=online" className="transition-colors hover:text-[var(--tc-primary)]">Online Tutors</Link></li>
              <li><Link href="/tutors?mode=home" className="transition-colors hover:text-[var(--tc-primary)]">Home Tutors (Hyderabad)</Link></li>
              <li><Link href="/tutors?subject=Mathematics" className="transition-colors hover:text-[var(--tc-primary)]">Mathematics Tuition</Link></li>
              <li><Link href="/tutors?subject=Science" className="transition-colors hover:text-[var(--tc-primary)]">Science Tuition</Link></li>
            </ul>
          </div>

          {/* Learning Journey */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-primary)]">Learning Journey</span>
            <ul className="mt-3.5 space-y-2.5 text-xs font-medium">
              <li><Link href="/demo/book" className="transition-colors hover:text-[var(--tc-primary)]">Book a Free Demo</Link></li>
              <li><Link href="/packages/select" className="transition-colors hover:text-[var(--tc-primary)]">Class Packages</Link></li>
              <li><Link href="/dashboard/student" className="transition-colors hover:text-[var(--tc-primary)]">Student Workspace</Link></li>
              <li><Link href="/#how-it-works" className="transition-colors hover:text-[var(--tc-primary)]">How It Works</Link></li>
            </ul>
          </div>

          {/* Tutors */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--tc-text-primary)]">Tutors</span>
            <ul className="mt-3.5 space-y-2.5 text-xs font-medium">
              <li><Link href="/auth?role=tutor" className="transition-colors hover:text-[var(--tc-primary)]">Become a Tutor</Link></li>
              <li><Link href="/auth" className="transition-colors hover:text-[var(--tc-primary)]">Sign In</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--tc-border)] pt-6 text-xs text-[var(--tc-text-secondary)] sm:flex-row">
          <p>&copy; 2026 TutorConnect. Crafted for student momentum.</p>
          <div className="flex gap-5 text-[11px]">
            <span>CBSE &bull; ICSE &bull; State Board</span>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
