"use client";

import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import type { WealthBriefing } from "../../lib/ai/coachService";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export default function WealthBriefingCard({ briefing }: { briefing: WealthBriefing }) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();
  const positive = briefing.netWorthChangeAbs >= 0;

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-50">Today&apos;s Wealth Briefing</h3>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
          Live
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-medium text-zinc-500">Net Worth Change</p>
          <p className={`mt-1 text-lg font-semibold ${positive ? "text-accent" : "text-red-400"}`}>
            {positive ? "+" : ""}
            {formatGBP(briefing.netWorthChangeAbs)} this week
          </p>
          <p className="text-xs text-zinc-500">
            {briefing.netWorthChangePct >= 0 ? "+" : ""}
            {briefing.netWorthChangePct}% this month
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-medium text-zinc-500">Biggest Winner</p>
          <p className="mt-1 text-lg font-semibold text-zinc-50">{briefing.biggestWinner.name}</p>
          <p className="text-xs font-medium text-accent">+{briefing.biggestWinner.changePct}%</p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs font-medium text-amber-400">Biggest Risk</p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{briefing.biggestRisk}</p>
        </div>

        {briefing.goal && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-medium text-zinc-500">{briefing.goal.name} Progress</p>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="text-zinc-400">
                {formatGBP(briefing.goal.currentAmount)} / {formatGBP(briefing.goal.targetAmount)}
              </span>
              <span className="font-medium text-accent">{briefing.goal.progressPct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-sky-400 transition-all duration-500 ease-out"
                style={{ width: `${briefing.goal.progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-medium text-zinc-500">Recommendation</p>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{briefing.recommendation}</p>
      </div>
    </section>
  );
}
