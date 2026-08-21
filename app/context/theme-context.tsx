"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "emerald" | "purple" | "ocean" | "gold";

export const THEMES: { id: Theme; label: string }[] = [
  { id: "emerald", label: "Emerald" },
  { id: "purple", label: "Purple AI" },
  { id: "ocean", label: "Ocean Blue" },
  { id: "gold", label: "BTC Gold" },
];

const STORAGE_KEY = "wealthpilot-theme";
const DEFAULT_THEME: Theme = "emerald";

function isTheme(value: string | null): value is Theme {
  return THEMES.some((theme) => theme.id === value);
}

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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

/** Inline, pre-hydration script: reads the stored theme and applies it to
 * `<html>` immediately, so there's no flash of the default theme on load. */
export const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    var valid = ${JSON.stringify(THEMES.map((t) => t.id))};
    if (stored && valid.indexOf(stored) !== -1) {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;
