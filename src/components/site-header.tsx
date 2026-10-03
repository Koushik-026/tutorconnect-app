"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { IconArrowRight, IconX } from "./ui/icons";

interface NavLink {
  label: string;
  href: string;
}

const navigationLinks: NavLink[] = [
  { label: "Find Tutors", href: "/tutors" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Subjects", href: "/#subjects" },
  { label: "Free Demo", href: "/demo/book" },
  { label: "Student Space", href: "/dashboard/student" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        role="banner"
        className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 rounded-full border border-[rgba(55,48,40,0.12)] bg-white/92 px-4 sm:px-6 py-2.5 shadow-[0_8px_32px_rgba(55,48,40,0.06)] backdrop-blur-md transition-all w-full max-w-5xl">
          {/* Logo */}
          <Logo compact={false} />

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-1.5 md:flex"
          >
            {navigationLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href) && !item.href.includes("#");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#E4EEE9] text-[#244A40]"
                      : "text-[#6F6A62] hover:bg-[#FFF7ED] hover:text-[#25231F]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <Link
              href="/auth"
              className="text-xs font-bold text-[#6F6A62] hover:text-[#25231F] px-3 py-1.5 transition"
            >
              Sign In
            </Link>

            <Link
              href="/tutors"
              className="btn btn-primary min-h-[44px] px-5 text-xs font-bold shadow-[0_4px_16px_rgba(49,95,82,0.20)] rounded-full gap-1.5"
            >
              <span>Explore Tutors</span>
              <IconArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-drawer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(55,48,40,0.12)] bg-white text-[#25231F] shadow-xs hover:bg-[#FFF7ED] transition md:hidden"
          >
            <span className="sr-only">Toggle navigation menu</span>
            {isMenuOpen ? (
              <IconX size={18} />
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Spacer for Floating Nav so content doesn't tuck awkwardly */}
      <div className="h-20 sm:h-24 w-full shrink-0" aria-hidden="true" />

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div
          id="mobile-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 flex flex-col bg-[#FFFBF5] pt-24 px-6 pb-8 md:hidden overflow-y-auto"
        >
          <nav className="flex flex-col gap-2.5">
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl border border-[rgba(55,48,40,0.10)] bg-white p-4 text-base font-bold text-[#25231F] shadow-[0_2px_8px_rgba(55,48,40,0.02)] hover:border-[#315F52]/40 hover:bg-[#E4EEE9]/40 transition"
              >
                <span>{item.label}</span>
                <IconArrowRight size={16} className="text-[#6F6A62]" />
              </Link>
            ))}

            <div className="pt-6 mt-4 border-t border-[rgba(55,48,40,0.10)] flex flex-col gap-3">
              <Link
                href="/tutors"
                onClick={closeMenu}
                className="btn btn-primary w-full min-h-[48px] text-sm font-bold shadow-[0_4px_16px_rgba(49,95,82,0.22)] rounded-full justify-center"
              >
                <span>Find Your Tutor</span>
                <IconArrowRight size={15} />
              </Link>

              <Link
                href="/auth"
                onClick={closeMenu}
                className="btn btn-outline w-full min-h-[48px] text-sm font-bold rounded-full justify-center"
              >
                Student / Parent Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
