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

export default function CryptoPortfolioCard({
  totalValue,
  changeToday,
  changePct,
  totalProfit,
  bestPerformerSymbol,
  bestPerformerChangePct,
  history,
}: {
  totalValue: number;
  changeToday: number;
  changePct: number;
  totalProfit: number;
  bestPerformerSymbol: string;
  bestPerformerChangePct: number;
  history: NetWorthPoint[];
}) {
  const [range, setRange] = useState<Range>("1W");
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();
  const positive = changePct >= 0;
  const profitPositive = totalProfit >= 0;

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card glass-edge-hero relative flex h-full flex-col overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_4px_4px_14px_rgba(255,255,255,0.2),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8"
    >
      <EdgeGlow />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_0%_0%,var(--accent-soft),transparent_65%)]"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Your Crypto Portfolio
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
              {formatGBP(totalValue)}
            </h2>
            <span
              className={`mb-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                positive ? "bg-accent-soft text-accent" : "bg-red-500/10 text-red-400"
              }`}
            >
              {positive ? "+" : ""}
              {formatGBP(changeToday)} today
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">24h Change</p>
              <p className={`mt-0.5 text-sm font-semibold ${positive ? "text-accent" : "text-red-400"}`}>
                {positive ? "+" : ""}
                {changePct}%
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Total Profit</p>
              <p className={`mt-0.5 text-sm font-semibold ${profitPositive ? "text-accent" : "text-red-400"}`}>
                {profitPositive ? "+" : ""}
                {formatGBP(totalProfit)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Best Performer</p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-50">
                {bestPerformerSymbol}{" "}
                <span className="text-accent">
                  +{bestPerformerChangePct}%
                </span>
              </p>
            </div>
          </div>
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

      <div className="relative mt-2 flex-1">
        <PortfolioGraph range={range} history={history} />
      </div>
    </section>
  );
}
