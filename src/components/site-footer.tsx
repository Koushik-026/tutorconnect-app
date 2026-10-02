import Link from "next/link";
import { Logo } from "./logo";
import { IconShieldCheck, IconVideo, IconHomeTuition } from "./ui/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(54,48,60,0.10)] bg-[#FFFDF9] text-[#6D706A]">
      <div className="container-shell py-16 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#6D706A]">
              Thoughtfully curated 1-on-1 online and in-home tuition for school students in Hyderabad. Connect with vetted educators, attend a free 30-minute demo, and establish a steady learning rhythm.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7257A5]/20 bg-[#EEE7FF] px-3.5 py-1 text-xs font-bold text-[#594282]">
                <IconShieldCheck size={13} className="text-[#7257A5]" />
                <span>Verified Profiles</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5D806F]/20 bg-[#E5F0EA] px-3.5 py-1 text-xs font-bold text-[#3D5A4D]">
                <IconVideo size={13} className="text-[#5D806F]" />
                <span>Free 30-min Online Demos</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EFA17F]/25 bg-[#FCE7DE] px-3.5 py-1 text-xs font-bold text-[#A85834]">
                <IconHomeTuition size={13} className="text-[#EFA17F]" />
                <span>Home Tuition Radius</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#20221F]">
              Discover
            </span>
            <ul className="mt-4 space-y-3 text-xs font-medium">
              <li>
                <Link href="/tutors" className="transition hover:text-[#7257A5]">
                  All Tutors
                </Link>
              </li>
              <li>
                <Link href="/tutors?mode=online" className="transition hover:text-[#7257A5]">
                  Online Tutors
                </Link>
              </li>
              <li>
                <Link href="/tutors?mode=home" className="transition hover:text-[#7257A5]">
                  Home Tutors (Hyderabad)
                </Link>
              </li>
              <li>
                <Link href="/tutors?subject=Mathematics" className="transition hover:text-[#7257A5]">
                  Mathematics Tuition
                </Link>
              </li>
              <li>
                <Link href="/tutors?subject=Science" className="transition hover:text-[#7257A5]">
                  Science Tuition
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Programs */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#20221F]">
              Learning Journey
            </span>
            <ul className="mt-4 space-y-3 text-xs font-medium">
              <li>
                <Link href="/demo/book" className="transition hover:text-[#7257A5]">
                  Book a Free Demo
                </Link>
              </li>
              <li>
                <Link href="/packages/select" className="transition hover:text-[#7257A5]">
                  Class Packages
                </Link>
              </li>
              <li>
                <Link href="/dashboard/student" className="transition hover:text-[#7257A5]">
                  Student Workspace
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition hover:text-[#7257A5]">
                  How Matching Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Governance & Safety */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#20221F]">
              Trust &amp; Safety
            </span>
            <ul className="mt-4 space-y-3 text-xs font-medium">
              <li>
                <Link href="/auth?role=tutor" className="transition hover:text-[#7257A5]">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <span className="text-[#969991] cursor-default">Identity Verification</span>
              </li>
              <li>
                <span className="text-[#969991] cursor-default">Qualification Review</span>
              </li>
              <li>
                <span className="text-[#969991] cursor-default">Tuition Support Assistance</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[rgba(54,48,60,0.10)] pt-8 text-xs text-[#969991] sm:flex-row">
          <p>© 2026 TutorConnect. Crafted for student momentum. All rights reserved.</p>
          <div className="flex gap-6">
            <span>CBSE &bull; ICSE &bull; State Board</span>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
