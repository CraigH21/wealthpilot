"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

const NAV_ITEMS = [
  {
    label: "Overview",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    label: "Crypto",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    label: "Stocks",
    icon: (
      <>
        <rect x="4" y="14" width="3" height="6" />
        <rect x="10.5" y="9" width="3" height="11" />
        <rect x="17" y="4" width="3" height="16" />
      </>
    ),
  },
  {
    label: "Banks",
    icon: (
      <>
        <path d="M4 10l8-5 8 5" />
        <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
        <path d="M4 20h16" />
      </>
    ),
  },
  {
    label: "Goals",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "AI Coach",
    icon: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />,
  },
];

export default function Sidebar() {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();

  return (
    <aside className="flex w-full flex-col justify-between gap-8 lg:w-52 lg:shrink-0">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item, index) => {
          const active = index === 0;
          return (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 ease-out ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-zinc-400 hover:text-accent"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4.5 w-4.5"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
              {item.label}
            </a>
          );
        })}
      </nav>

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="group glass-edge-card relative rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
      >
        <EdgeGlow />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-accent"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9l-5.6 3.2 1.4-6.3-4.8-4.3 6.4-.6L12 3z" />
        </svg>
        <p className="mt-3 text-sm font-medium text-zinc-50">
          Unlock more with Pro
        </p>
        <p className="mt-1 text-xs text-zinc-500">£9/month</p>
        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border"
        >
          Upgrade
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
