"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
    label: "For Tutors",
    href: "/auth?role=tutor",
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-slate-200/75 bg-white/88 backdrop-blur-2xl">
        <div className="container-shell">
          <div className="flex h-[72px] items-center justify-between gap-4">
            <Logo />

            {/* Desktop navigation */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-1 lg:flex"
            >
              {navigationLinks.map((link) => {
                const isActive =
                  link.href === "/tutors" && pathname.startsWith("/tutors");

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/auth" className="btn btn-ghost">
                Sign In
              </Link>

              <Link href="/tutors" className="btn btn-primary">
                Find a Tutor

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4.5 w-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </div>

            {/* Mobile and tablet actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/tutors"
                className="hidden min-h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:inline-flex"
              >
                Find a Tutor
              </Link>

              <button
                type="button"
                aria-label={
                  isMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
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
          </div>
        </div>

        {/* Mobile and tablet navigation */}
        {isMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="fixed inset-0 top-[73px] bg-slate-950/25 backdrop-blur-[2px] lg:hidden"
            />

            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white shadow-2xl shadow-slate-950/10 lg:hidden"
            >
              <div className="container-shell py-5">
                <div className="grid gap-2 sm:grid-cols-2">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={closeMenu}
                      className="group flex items-center justify-between rounded-2xl border border-transparent px-4 py-4 font-bold text-slate-700 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {link.label}

                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </Link>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
                  <Link
                    href="/auth"
                    onClick={closeMenu}
                    className="btn btn-secondary w-full"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/tutors"
                    onClick={closeMenu}
                    className="btn btn-primary w-full"
                  >
                    Find a Tutor
                  </Link>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Verified tutor profiles · Free online demos · Secure platform
                </p>
              </div>
            </nav>
          </>
        )}
      </header>
    </>
  );
}