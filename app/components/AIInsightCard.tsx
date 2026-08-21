"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

export default function AIInsightCard() {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8"
    >
      <EdgeGlow />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_0%_0%,var(--accent-soft),transparent_65%)]"
      />

      <div className="relative flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent shadow-[0_0_16px_var(--accent-glow)] transition-colors duration-500 ease-out">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5.5 w-5.5"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="6.5" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="6.5" cy="11" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="17.5" cy="11" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="9" cy="17" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="15" cy="17" r="1.6" fill="currentColor" stroke="none" />
            <path d="M12 6.5L6.5 11M12 6.5L17.5 11M6.5 11L9 17M17.5 11L15 17M9 17L15 17M6.5 11L17.5 11" />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-accent transition-colors duration-500 ease-out">
            AI Weekly Insight
          </p>
          <p className="mt-1.5 text-lg font-semibold leading-snug text-zinc-50 sm:text-xl">
            Your portfolio gained £418 this week (+3.2%).
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-medium text-zinc-500">Top Winner</p>
              <p className="mt-1 text-sm font-semibold text-zinc-50">
                Nvidia{" "}
                <span className="text-accent transition-colors duration-500 ease-out">
                  +6.1%
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-medium text-zinc-500">Risk Alert</p>
              <p className="mt-1 text-sm font-semibold text-zinc-50">
                Crypto now represents 31% of your portfolio.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border"
          >
            Ask AI
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
      </div>
    </section>
  );
}
