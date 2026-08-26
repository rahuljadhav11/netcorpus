"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "indigo" | "original";

const STORAGE_KEY = "netcorpus-theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(t: Theme) {
  if (t === "original") {
    document.documentElement.setAttribute("data-theme", "original");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("indigo");
  const [mounted, setMounted] = useState(false);

  // Read saved preference once mounted (avoids SSR mismatch).
  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme) ?? "indigo";
    applyTheme(saved);
    setThemeState(saved);
    setMounted(true);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
