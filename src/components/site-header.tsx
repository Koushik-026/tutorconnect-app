"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { IconArrowRight, IconX } from "./ui/icons";

interface NavLink {
  label: string;
  href: string;
}

const navigationLinks: NavLink[] = [
  { label: "Find Tutors", href: "/tutors" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Subjects", href: "/#subjects" },
  { label: "Sign In", href: "/auth" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        role="banner"
        className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8 pointer-events-none"
      >
        <div
          className={`pointer-events-auto w-full max-w-[1240px] mx-auto rounded-full px-4 sm:px-6 py-2 transition-all flex items-center justify-between md:grid md:grid-cols-[auto_1fr_auto] md:items-center gap-4 ${
            scrolled
              ? "border border-[var(--tc-border)] bg-[var(--tc-surface)]/95 shadow-md backdrop-blur-md"
              : "border border-[var(--tc-border)] bg-[var(--tc-surface)]/88 shadow-xs backdrop-blur-sm"
          }`}
        >
          {/* Left Column: Logo */}
          <div className="flex items-center justify-self-start">
            <Logo compact={false} />
          </div>

          {/* Center Column: Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center justify-self-center gap-1.5 md:flex"
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
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-160 ${
                    isActive
                      ? "bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] font-bold"
                      : "text-[var(--tc-text-secondary)] hover:bg-[var(--tc-surface-muted)] hover:text-[var(--tc-text-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Column: Theme Toggle + CTA Actions (desktop) */}
          <div className="hidden items-center justify-self-end gap-3 md:flex">
            <ThemeToggle />
            <Link
              href="/tutors"
              className="btn btn-primary min-h-[38px] px-4 py-2 text-xs font-bold rounded-full gap-1.5"
            >
              <span>Explore Tutors</span>
              <IconArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-drawer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--tc-border)] bg-[var(--tc-surface)] text-[var(--tc-text-primary)] shadow-xs hover:bg-[var(--tc-surface-muted)] transition cursor-pointer"
            >
              <span className="sr-only">Toggle navigation menu</span>
              {isMenuOpen ? (
                <IconX size={17} />
              ) : (
                <svg
                  className="h-4.5 w-4.5"
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
        </div>
      </header>

      {/* Spacer */}
      <div className="h-20 sm:h-24 w-full shrink-0" aria-hidden="true" />

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div
          id="mobile-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 flex flex-col bg-[var(--tc-bg)] pt-24 px-6 pb-8 md:hidden overflow-y-auto"
        >
          <nav className="flex flex-col gap-2">
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-3.5 text-sm font-semibold text-[var(--tc-text-primary)] hover:border-[var(--tc-primary)]/40 hover:bg-[var(--tc-soft-primary)] transition"
              >
                <span>{item.label}</span>
                <IconArrowRight size={15} className="text-[var(--tc-text-secondary)]" />
              </Link>
            ))}

            <div className="pt-5 mt-3 border-t border-[var(--tc-border)] flex flex-col gap-2.5">
              <Link
                href="/tutors"
                onClick={closeMenu}
                className="btn btn-primary w-full min-h-[44px] text-xs font-bold rounded-xl justify-center"
              >
                <span>Explore Tutors</span>
                <IconArrowRight size={14} />
              </Link>
              <Link
                href="/demo/book"
                onClick={closeMenu}
                className="btn btn-outline w-full min-h-[44px] text-xs font-bold rounded-xl justify-center"
              >
                Book a Free Demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
