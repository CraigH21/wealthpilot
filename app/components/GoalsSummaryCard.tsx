"use client";

import { useState } from "react";
import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";
import SetGoalPanel from "./goals/SetGoalPanel";

type GoalsSummaryCardProps = {
  progressPct: number;
  onTargetPct: number;
  savingsCoveragePct: number;
};

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({
  pct,
  label,
  color,
}: {
  pct: number;
  label: string;
  color: string;
}) {
  const dash = (Math.min(pct, 100) / 100) * CIRCUMFERENCE;

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center px-1 text-center leading-tight">
        <span className="text-xl font-semibold text-zinc-900">{pct}%</span>
        <span className="text-[10px] text-zinc-500">{label}</span>
      </div>
    </div>
  );
}

export default function GoalsSummaryCard({
  progressPct,
  onTargetPct,
  savingsCoveragePct,
}: GoalsSummaryCardProps) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();
  const [setGoalOpen, setSetGoalOpen] = useState(false);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative flex flex-col rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[3px] hover:scale-[1.01]"
    >
      <EdgeGlow />

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-900">Goals</h3>
        <button
          type="button"
          onClick={() => setSetGoalOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border"
        >
          Set Goal
        </button>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        <ProgressRing pct={progressPct} label="Complete" color="var(--accent)" />
        <ProgressRing pct={onTargetPct} label="On Target" color="var(--pro-accent)" />
        <ProgressRing pct={savingsCoveragePct} label="Coverage" color="var(--tertiary-accent)" />
      </div>

      <SetGoalPanel open={setGoalOpen} onClose={() => setSetGoalOpen(false)} />
    </div>
  );
}
