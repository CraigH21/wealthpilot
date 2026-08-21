"use client";

import { useState } from "react";
import ConnectedAccounts from "./ConnectedAccounts";
import EdgeGlow from "./EdgeGlow";
import PortfolioGraph, { RANGES, type Range } from "./PortfolioGraph";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

export default function NetWorthCard() {
  const [range, setRange] = useState<Range>("1M");
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card glass-edge-hero relative overflow-hidden rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_4px_4px_14px_rgba(255,255,255,0.2),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-10"
    >
      <EdgeGlow />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_0%_0%,var(--accent-soft),transparent_65%)]"
      />

      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">Total Net Worth</p>

            <div className="mt-3 flex flex-wrap items-end gap-4">
              <h1 className="text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
                £184,320
              </h1>

              <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent transition-colors duration-500 ease-out">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
                +3.2% this month
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              Across all connected accounts
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            {RANGES.map((option) => {
              const active = option === range;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    active
                      ? "bg-accent-soft text-accent shadow-[0_0_14px_var(--accent-glow)]"
                      : "text-zinc-500"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <ConnectedAccounts />

        <PortfolioGraph range={range} />
      </div>
    </section>
  );
}
