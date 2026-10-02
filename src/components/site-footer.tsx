import Link from "next/link";
import { Logo } from "./logo";
import { IconShieldCheck, IconVideo, IconHomeTuition } from "./ui/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E4DED4] bg-[#FFFEFB] text-[#676B64]">
      <div className="container-shell py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#676B64]">
              Thoughtfully curated 1-on-1 online and in-home tuition for school students in Hyderabad. Connect with vetted educators, attend a free 30-minute demo, and establish a steady learning rhythm.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#66518A]/20 bg-[#EFEAF8] px-3 py-1 text-xs font-bold text-[#4E3C70]">
                <IconShieldCheck size={13} className="text-[#66518A]" />
                <span>Verified Profiles</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4F7867]/20 bg-[#E6F0EA] px-3 py-1 text-xs font-bold text-[#3E6153]">
                <IconVideo size={13} className="text-[#4F7867]" />
                <span>Free 30-min Online Demos</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E99873]/25 bg-[#FBE9DF] px-3 py-1 text-xs font-bold text-[#A64E28]">
                <IconHomeTuition size={13} className="text-[#E99873]" />
                <span>Home Tuition Radius</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#232520]">
              Discover
            </span>
            <ul className="mt-4 space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/tutors" className="transition hover:text-[#66518A]">
                  All Tutors
                </Link>
              </li>
              <li>
                <Link href="/tutors?mode=online" className="transition hover:text-[#66518A]">
                  Online Tutors
                </Link>
              </li>
              <li>
                <Link href="/tutors?mode=home" className="transition hover:text-[#66518A]">
                  Home Tutors (Hyderabad)
                </Link>
              </li>
              <li>
                <Link href="/tutors?subject=Mathematics" className="transition hover:text-[#66518A]">
                  Mathematics Tuition
                </Link>
              </li>
              <li>
                <Link href="/tutors?subject=Science" className="transition hover:text-[#66518A]">
                  Science Tuition
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Programs */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#232520]">
              Learning Journey
            </span>
            <ul className="mt-4 space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/demo/book" className="transition hover:text-[#66518A]">
                  Book a Free Demo
                </Link>
              </li>
              <li>
                <Link href="/packages/select" className="transition hover:text-[#66518A]">
                  Class Packages
                </Link>
              </li>
              <li>
                <Link href="/dashboard/student" className="transition hover:text-[#66518A]">
                  Student Workspace
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition hover:text-[#66518A]">
                  How Matching Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Governance & Safety */}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#232520]">
              Trust &amp; Safety
            </span>
            <ul className="mt-4 space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/auth?role=tutor" className="transition hover:text-[#66518A]">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <span className="text-[#989C94] cursor-default">Identity Verification</span>
              </li>
              <li>
                <span className="text-[#989C94] cursor-default">Qualification Review</span>
              </li>
              <li>
                <span className="text-[#989C94] cursor-default">Tuition Support Assistance</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E4DED4] pt-8 text-xs text-[#989C94] sm:flex-row">
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
