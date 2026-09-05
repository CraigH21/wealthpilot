"use client";

import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import { getGoalMeta, TONE_STYLE } from "../../lib/goals/meta";
import type { GoalStatus } from "../../lib/goals/planning";
import type { Goal } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

const STATUS_TONE: Record<GoalStatus, { bg: string; text: string; bar: string }> = {
  "Ahead of plan": { bg: "bg-accent-soft", text: "text-accent", bar: "bg-accent" },
  "On track": { bg: "bg-sky-500/10", text: "text-sky-400", bar: "bg-sky-400" },
  "Slightly behind": { bg: "bg-amber-500/10", text: "text-amber-400", bar: "bg-amber-400" },
};

export type GoalCardData = Goal & {
  progressPct: number;
  status: GoalStatus;
  estimatedCompletion: string;
  monthsAtCurrentPace: number;
  monthsUntilDeadline: number;
};

function GoalCard({ goal }: { goal: GoalCardData }) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();
  const meta = getGoalMeta(goal.id);
  const tone = TONE_STYLE[meta.tone];
  const statusTone = STATUS_TONE[goal.status];
  const widthPct = Math.min(100, goal.progressPct);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative overflow-hidden rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[3px]"
    >
      <EdgeGlow />

      <div className="relative flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.bg}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-5 w-5 ${tone.text}`}
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {meta.icon}
          </svg>
        </span>
        <p className="text-sm font-medium text-zinc-900">{goal.name}</p>
      </div>

      <p className="relative mt-4 text-sm text-zinc-600">
        <span className="text-xl font-semibold text-zinc-900">{formatGBP(goal.currentAmount)}</span>
        {" "}/ {formatGBP(goal.targetAmount)}
      </p>

      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full rounded-full ${statusTone.bar} transition-all duration-500 ease-out`}
          style={{ width: `${widthPct}%` }}
        />
      </div>

      <div className="relative mt-3 flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone.bg} ${statusTone.text}`}>
          {goal.status}
        </span>
        <span className="shrink-0 text-[11px] text-zinc-600">Est. {goal.estimatedCompletion}</span>
      </div>
    </div>
  );
}

export default function GoalCards({ goals }: { goals: GoalCardData[] }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">Your Goals</h2>
        <p className="text-sm text-zinc-600">
          {goals.length} goals &bull; {formatGBP(goals.reduce((sum, g) => sum + g.currentAmount, 0))} saved
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
