"use client";

import React from "react";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Cycle sequence: System -> Light -> Dark -> System
  const handleCycle = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const currentLabel =
    theme === "system"
      ? `System (${resolvedTheme === "dark" ? "Dark" : "Light"})`
      : theme === "light"
      ? "Light"
      : "Dark";

  const nextLabel =
    theme === "system" ? "Light" : theme === "light" ? "Dark" : "System";

  const actionAria = `Theme preference: ${currentLabel}. Press to cycle to ${nextLabel} theme.`;

  return (
    <button
      type="button"
      aria-label={actionAria}
      title={actionAria}
      onClick={handleCycle}
      className={`relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border border-[var(--tc-border)] bg-[var(--tc-surface-muted)] p-[2px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tc-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tc-bg)] ${className}`}
    >
      <span className="sr-only">{actionAria}</span>

      {/* Background Track Icons (Subtle hints) */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[10px] text-[var(--tc-text-secondary)] opacity-60">
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </span>

      {/* Sliding Thumb: reflects active resolved theme */}
      <span
        className={`pointer-events-none relative flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--tc-surface)] text-[var(--tc-text-primary)] shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isDark ? "translate-x-[24px]" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <svg
            className="h-3.5 w-3.5 text-[var(--tc-primary)] transition-transform duration-200 rotate-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          <svg
            className="h-3.5 w-3.5 text-[var(--tc-warning)] transition-transform duration-200 rotate-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        )}

        {/* Small subtle indicator if System mode is active */}
        {theme === "system" && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[var(--tc-teal)] ring-1 ring-[var(--tc-surface)]"
            title="System theme active"
          />
        )}
      </span>
    </button>
  );
}
