"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";

const navigationLinks = [
  {
    label: "Find Tutors",
    href: "/tutors",
  },
  {
    label: "How It Works",
    href: "/#how-it-works",
  },
  {
    label: "Subjects",
    href: "/#subjects",
  },
  {
    label: "Become a Tutor",
    href: "/auth?role=tutor",
  },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="container-shell">
        <div className="flex min-h-18 items-center justify-between gap-4">
          <Logo />

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/auth" className="btn btn-ghost">
              Sign In
            </Link>

            <Link href="/tutors" className="btn btn-primary">
              Find a Tutor
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 lg:hidden"
          >
            {isMenuOpen ? (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-slate-200 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
                <Link
                  href="/auth"
                  onClick={closeMenu}
                  className="btn btn-secondary"
                >
                  Sign In
                </Link>

                <Link
                  href="/tutors"
                  onClick={closeMenu}
                  className="btn btn-primary"
                >
                  Find a Tutor
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}