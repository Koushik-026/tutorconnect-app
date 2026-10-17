"use client";

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage event listener for cross-tab and local theme changes
const subscribeTheme = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("tc-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("tc-theme-change", callback);
  };
};

const getThemeSnapshot = (): Theme => {
  try {
    const val = localStorage.getItem("tc-theme");
    if (val === "light" || val === "dark" || val === "system") {
      return val;
    }
  } catch {
    // Ignore storage errors
  }
  return "system";
};

const getThemeServerSnapshot = (): Theme => "system";

// Media query listener for system dark mode
const subscribeMedia = (callback: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getMediaSnapshot = (): boolean => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const getMediaServerSnapshot = (): boolean => false;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const systemIsDark = useSyncExternalStore(subscribeMedia, getMediaSnapshot, getMediaServerSnapshot);

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (systemIsDark ? "dark" : "light") : theme;

  // Synchronize DOM attributes and class with active resolved theme
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.setAttribute("data-theme", theme);
  }, [resolvedTheme, theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem("tc-theme", newTheme);
      window.dispatchEvent(new Event("tc-theme-change"));
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
