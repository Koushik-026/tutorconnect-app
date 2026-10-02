"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { IconArrowRight, IconX } from "./ui/icons";

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

      <header className="sticky top-0 z-50 border-b border-slate-200/75 bg-white/85 backdrop-blur-md">
        <div className="container-shell">
          <div className="flex h-[70px] items-center justify-between gap-4">
            <Logo />

            {/* Desktop navigation */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-1 md:flex"
            >
              {navigationLinks.map((link) => {
                const isActive =
                  link.href === "/tutors" && pathname.startsWith("/tutors");

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2.5 md:flex">
              <Link
                href="/auth"
                className="btn btn-ghost text-slate-700 hover:text-slate-900"
              >
                Sign In
              </Link>

              <Link href="/tutors" className="btn btn-primary">
                Find a Tutor
                <IconArrowRight size={16} />
              </Link>
            </div>

            {/* Mobile actions & hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/tutors"
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-blue-600 px-3.5 text-xs font-bold text-white shadow-xs"
              >
                Find Tutor
              </Link>

              <button
                type="button"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 active:bg-slate-100"
              >
                {isMenuOpen ? (
                  <IconX size={22} />
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down navigation */}
        {isMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation menu overlay"
              onClick={closeMenu}
              className="fixed inset-0 top-[71px] bg-slate-900/30 backdrop-blur-xs md:hidden"
            />

            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white p-5 shadow-xl md:hidden"
            >
              <div className="space-y-1.5">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex min-h-[48px] items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-slate-800 transition hover:bg-blue-50/70 hover:text-blue-700"
                  >
                    <span>{link.label}</span>
                    <IconArrowRight size={16} className="text-slate-400" />
                  </Link>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
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

              <p className="mt-4 text-center text-xs font-semibold text-slate-400">
                Verified Profiles &bull; Free Online Demos &bull; Safe Learning
              </p>
            </nav>
          </>
        )}
      </header>
    </>
  );
}
