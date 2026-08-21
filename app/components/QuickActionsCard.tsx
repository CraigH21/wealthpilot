"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

const ACTIONS = [
  {
    label: "Add account",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M12 10v5M9.5 12.5h5" />
      </>
    ),
  },
  {
    label: "Set goal",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Ask AI",
    icon: (
      <>
        <path d="M4 5h16v11H8l-4 4V5z" />
      </>
    ),
  },
];

export default function QuickActionsCard() {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      <h3 className="text-sm font-semibold text-zinc-50">Quick Actions</h3>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs font-medium text-zinc-300 transition-all duration-300 ease-out hover:border-accent-border hover:bg-accent-soft hover:text-zinc-50 hover:shadow-[0_0_16px_var(--accent-glow)]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4.5 w-4.5 text-accent"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {action.icon}
            </svg>
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
