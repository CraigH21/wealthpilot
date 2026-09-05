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

export type Mode = "light" | "dark";
export const MODES: { id: Mode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const STORAGE_KEY = "wealthpilot-theme";
const MODE_STORAGE_KEY = "wealthpilot-mode";
const DEFAULT_THEME: Theme = "emerald";
const DEFAULT_MODE: Mode = "light";

function isTheme(value: string | null): value is Theme {
  return THEMES.some((theme) => theme.id === value);
}

function isMode(value: string | null): value is Mode {
  return MODES.some((mode) => mode.id === value);
}

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [mode, setModeState] = useState<Mode>(DEFAULT_MODE);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(storedTheme)) {
      setThemeState(storedTheme);
    }
    const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (isMode(storedMode)) {
      setModeState(storedMode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
  }, [mode]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const setMode = (next: Mode) => {
    setModeState(next);
    window.localStorage.setItem(MODE_STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode }}>
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

/** Inline, pre-hydration script: reads the stored theme/mode and applies
 * them to `<html>` immediately, so there's no flash of the default
 * theme/mode on load. */
export const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    var valid = ${JSON.stringify(THEMES.map((t) => t.id))};
    if (stored && valid.indexOf(stored) !== -1) {
      document.documentElement.setAttribute('data-theme', stored);
    }
    var storedMode = window.localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)});
    var validModes = ${JSON.stringify(MODES.map((m) => m.id))};
    if (storedMode && validModes.indexOf(storedMode) !== -1) {
      document.documentElement.setAttribute('data-mode', storedMode);
    }
  } catch (e) {}
})();
`;
