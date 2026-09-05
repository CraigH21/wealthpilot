"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

export type SnapshotData = {
  netWorthChange: string;
  bestPerformerLabel: string;
  bestPerformerChange: string;
  riskLevel: string;
  goalProgress: number;
};

const MOCK_SNAPSHOT: SnapshotData = {
  netWorthChange: "+£418",
  bestPerformerLabel: "NVDA",
  bestPerformerChange: "+6.1%",
  riskLevel: "Moderate",
  goalProgress: 78,
};

type TodaysSnapshotProps = Partial<SnapshotData>;

export default function TodaysSnapshot({
  netWorthChange = MOCK_SNAPSHOT.netWorthChange,
  bestPerformerLabel = MOCK_SNAPSHOT.bestPerformerLabel,
  bestPerformerChange = MOCK_SNAPSHOT.bestPerformerChange,
  riskLevel = MOCK_SNAPSHOT.riskLevel,
  goalProgress = MOCK_SNAPSHOT.goalProgress,
}: TodaysSnapshotProps) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[3px] hover:scale-[1.01]"
    >
      <EdgeGlow />

      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-900">
        Today&apos;s Snapshot
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-zinc-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/snapshot-net-worth-v2.svg"
              alt=""
              className="h-9 w-9 shrink-0"
            />
            <span className="leading-tight">
              <span className="block">Net Worth</span>
              <span className="block text-[10px] text-zinc-500">This week</span>
            </span>
          </span>
          <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-accent">
            {netWorthChange}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-zinc-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/snapshot-best-performer.svg"
              alt=""
              className="h-9 w-9 shrink-0"
            />
            <span className="leading-tight">
              Best
              <br />
              Performer
            </span>
          </span>
          <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-lime-400">
            {bestPerformerLabel} {bestPerformerChange}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-zinc-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/snapshot-risk-level.svg"
              alt=""
              className="h-9 w-9 shrink-0"
            />
            Risk Level
          </span>
          <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-purple-400">
            {riskLevel}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-zinc-600">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/snapshot-goal-progress.svg"
              alt=""
              className="h-9 w-9 shrink-0"
            />
            Goal Progress
          </span>
          <span className="text-sm font-semibold text-zinc-900">
            {goalProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}
