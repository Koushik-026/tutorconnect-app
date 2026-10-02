"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./logo";
import { IconArrowRight, IconX } from "./ui/icons";

const navigationLinks = [
  { href: "/tutors", label: "Find Tutors" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#modes", label: "Online & Home" },
  { href: "/packages/select", label: "Packages" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isCurrent = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Floating Pill Navigation Surface */}
      <header className="fixed top-3 sm:top-5 inset-x-0 mx-auto w-[calc(100%-1.5rem)] max-w-5xl z-50">
        <div className="flex h-14 sm:h-16 items-center justify-between rounded-full border border-[rgba(54,48,60,0.12)] bg-[#FFFFFF]/90 px-4 sm:px-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-semibold text-[#6D706A]">
            {navigationLinks.map((item) => {
              const active = isCurrent(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-3.5 py-1.5 transition-colors ${
                    active
                      ? "text-[#7257A5] bg-[#EEE7FF]/80 font-bold"
                      : "hover:text-[#20221F] hover:bg-[#F4F0FF]/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Group */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="text-xs font-bold text-[#6D706A] hover:text-[#20221F] px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/tutors"
              className="btn btn-primary min-h-[40px] px-4 text-xs font-bold shadow-[0_4px_16px_rgba(114,87,165,0.22)] rounded-full"
            >
              <span>Find Tutors</span>
              <IconArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-drawer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(54,48,60,0.12)] bg-white text-[#20221F] shadow-xs hover:bg-[#F4F0FF] transition md:hidden"
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
          className="fixed inset-0 z-40 flex flex-col bg-[#FCFBF8] pt-24 px-6 pb-8 md:hidden overflow-y-auto"
        >
          <nav className="flex flex-col gap-2.5">
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl border border-[rgba(54,48,60,0.10)] bg-white p-4 text-base font-bold text-[#20221F] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#7257A5]/40 hover:bg-[#EEE7FF]/40 transition"
              >
                <span>{item.label}</span>
                <IconArrowRight size={16} className="text-[#6D706A]" />
              </Link>
            ))}

            <div className="pt-6 mt-4 border-t border-[rgba(54,48,60,0.10)] flex flex-col gap-3">
              <Link
                href="/tutors"
                onClick={closeMenu}
                className="btn btn-primary w-full min-h-[48px] text-sm font-bold shadow-[0_4px_16px_rgba(114,87,165,0.22)] rounded-full justify-center"
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
