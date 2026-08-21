"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES, useTheme, type Theme } from "../context/theme-context";

const SWATCH_CLASS: Record<Theme, string> = {
  emerald: "bg-emerald-400",
  purple: "bg-purple-400",
  ocean: "bg-sky-400",
  gold: "bg-amber-500",
};

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Appearance"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-from to-accent-to text-sm font-semibold text-zinc-950 transition-colors duration-500 ease-out"
      >
        C
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-md"
        >
          <p className="px-3 pb-1.5 pt-1 text-xs font-medium text-zinc-500">
            Appearance
          </p>
          {THEMES.map((option) => {
            const active = option.id === theme;
            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(option.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
                  active
                    ? "bg-accent-soft text-zinc-50"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${SWATCH_CLASS[option.id]}`}
                />
                <span className="flex-1 text-left">{option.label}</span>
                {active && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 text-accent"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
