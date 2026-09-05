"use client";

import { useTheme, type Mode } from "../context/theme-context";
import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

const OPTIONS: { id: Mode; label: string; icon: React.ReactNode }[] = [
  {
    id: "light",
    label: "Light",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    ),
  },
  {
    id: "dark",
    label: "Dark",
    icon: <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />,
  },
];

export default function AppearancePill() {
  const { mode, setMode } = useTheme();
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative mr-[50px] flex items-center gap-1 rounded-full p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      {OPTIONS.map((option) => {
        const active = option.id === mode;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setMode(option.id)}
            aria-pressed={active}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out ${
              active
                ? "bg-accent-soft text-accent shadow-[0_0_14px_var(--accent-glow)]"
                : "text-zinc-500 hover:text-foreground"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-3.5 w-3.5"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {option.icon}
            </svg>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
