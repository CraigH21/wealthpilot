"use client";

import { useState } from "react";
import EdgeGlow from "../EdgeGlow";
import PortfolioGraph, { RANGES, type Range } from "../PortfolioGraph";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import type { NetWorthPoint } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export default function GoalsHero({
  completionPct,
  totalSaved,
  totalTarget,
  savedThisMonth,
  onTrackCount,
  goalCount,
  history,
}: {
  completionPct: number;
  totalSaved: number;
  totalTarget: number;
  savedThisMonth: number;
  onTrackCount: number;
  goalCount: number;
  history: NetWorthPoint[];
}) {
  const [range, setRange] = useState<Range>("1W");
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card glass-edge-hero relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_4px_4px_14px_rgba(255,255,255,0.2),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8"
    >
      <EdgeGlow />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_0%_0%,var(--accent-soft),transparent_65%)]"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
            Your Financial Goals
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              {completionPct}% <span className="text-2xl font-medium text-zinc-500 sm:text-3xl">Complete</span>
            </h2>
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
              +{formatGBP(savedThisMonth)} saved this month
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">Total Saved</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900">{formatGBP(totalSaved)}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">Total Target</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900">{formatGBP(totalTarget)}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">On Track</p>
              <p className="mt-0.5 text-sm font-semibold text-accent">
                {onTrackCount} of {goalCount} goals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-black/5 p-1 backdrop-blur-md">
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
                    : "text-zinc-600"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-2">
        <PortfolioGraph range={range} history={history} />
      </div>
    </section>
  );
}
