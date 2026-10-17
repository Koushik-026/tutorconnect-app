"use client";

import { useState, useEffect } from "react";
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
  { label: "Sign In", href: "/auth" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        role="banner"
        className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8 pointer-events-none"
      >
        <div
          className={`pointer-events-auto w-full max-w-[1280px] mx-auto rounded-full px-5 sm:px-6 py-2.5 transition-all flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:items-center ${
            scrolled
              ? "border border-[rgba(24,33,30,0.09)] bg-white/94 shadow-[0_6px_24px_rgba(24,33,30,0.07)] backdrop-blur-md"
              : "border border-[rgba(24,33,30,0.07)] bg-white/88 shadow-[0_4px_16px_rgba(24,33,30,0.04)] backdrop-blur-sm"
          }`}
        >
          {/* Left Column: Logo */}
          <div className="flex items-center justify-self-start">
            <Logo compact={false} />
          </div>

          {/* Center Column: Desktop Navigation Links (mathematically page-centered) */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center justify-self-center gap-1 md:flex"
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
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#E2F5EC] text-[#1A5247]"
                      : "text-[#66716D] hover:bg-[#F4F8FB] hover:text-[#18211E]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Column: CTA Actions (desktop) */}
          <div className="hidden items-center justify-self-end md:flex">
            <Link
              href="/tutors"
              className="btn btn-primary min-h-[38px] px-5 py-2 text-xs font-bold rounded-full gap-1.5"
              style={{ minHeight: "38px" }}
            >
              <span>Explore Tutors</span>
              <IconArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-drawer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(24,33,30,0.09)] bg-white text-[#18211E] shadow-sm hover:bg-[#F4F8FB] transition md:hidden"
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

      {/* Spacer */}
      <div className="h-20 sm:h-24 w-full shrink-0" aria-hidden="true" />

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div
          id="mobile-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 flex flex-col bg-[#FCFDFE] pt-24 px-6 pb-8 md:hidden overflow-y-auto"
        >
          <nav className="flex flex-col gap-2">
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl border border-[rgba(24,33,30,0.09)] bg-white p-4 text-base font-semibold text-[#18211E] hover:border-[#236B5B]/30 hover:bg-[#E2F5EC]/40 transition"
              >
                <span>{item.label}</span>
                <IconArrowRight size={16} className="text-[#66716D]" />
              </Link>
            ))}

            <div className="pt-6 mt-4 border-t border-[rgba(24,33,30,0.09)] flex flex-col gap-3">
              <Link
                href="/tutors"
                onClick={closeMenu}
                className="btn btn-primary w-full min-h-[48px] text-sm font-bold rounded-full justify-center"
              >
                <span>Explore Tutors</span>
                <IconArrowRight size={15} />
              </Link>
              <Link
                href="/demo/book"
                onClick={closeMenu}
                className="btn btn-outline w-full min-h-[48px] text-sm font-bold rounded-full justify-center"
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