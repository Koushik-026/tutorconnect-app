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

      <header className="sticky top-0 z-40 border-b border-[#E4DED4] bg-[#FFFEFB]/90 backdrop-blur-md">
        <div className="container-shell flex h-18 items-center justify-between gap-4">
          <Logo />

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 lg:gap-2">
            {navigationLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#EFEAF8] text-[#66518A]"
                      : "text-[#676B64] hover:bg-[#F7F4EE] hover:text-[#232520]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/auth"
              className="rounded-xl px-4 py-2 text-xs font-bold text-[#676B64] hover:bg-[#F7F4EE] hover:text-[#232520] transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/tutors"
              className="btn btn-primary min-h-[42px] px-4 py-2 text-xs font-extrabold shadow-sm gap-1.5"
            >
              <span>Explore Tutors</span>
              <IconArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-drawer"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4DED4] bg-[#FFFEFB] text-[#232520] md:hidden shadow-xs hover:border-[#66518A]/40 transition"
          >
            <span className="sr-only">Open navigation menu</span>
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
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Paper Bloom Light Theme) */}
      {isMenuOpen && (
        <div
          id="mobile-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 flex flex-col bg-[#F7F4EE] md:hidden"
        >
          <div className="flex h-18 items-center justify-between border-b border-[#E4DED4] bg-[#FFFEFB] px-4">
            <Logo />
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4DED4] bg-[#FFFEFB] text-[#232520] hover:bg-[#F7F4EE] transition"
            >
              <span className="sr-only">Close navigation menu</span>
              <IconX size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-5 space-y-2">
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border border-[#E4DED4] bg-[#FFFEFB] p-4 text-sm font-bold text-[#232520] shadow-xs hover:border-[#66518A]/40 hover:bg-[#EFEAF8] transition"
              >
                <span>{item.label}</span>
                <IconArrowRight size={16} className="text-[#676B64]" />
              </Link>
            ))}

            <div className="pt-4 border-t border-[#E4DED4] space-y-3">
              <Link
                href="/tutors"
                onClick={closeMenu}
                className="btn btn-primary w-full min-h-[48px] text-sm font-bold shadow-sm"
              >
                <span>Find Your Tutor</span>
                <IconArrowRight size={15} />
              </Link>

              <Link
                href="/auth"
                onClick={closeMenu}
                className="btn btn-secondary w-full min-h-[48px] text-sm font-bold"
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
