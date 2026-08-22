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
      className="group glass-edge-card relative rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-50">
        Today&apos;s Snapshot
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-zinc-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/snapshot-net-worth-v2.svg"
              alt=""
              className="h-9 w-9 shrink-0"
            />
            Net Worth
          </span>
          <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-accent">
            {netWorthChange}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-zinc-300">
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
          <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-zinc-300">
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

        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5 whitespace-nowrap text-sm text-zinc-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/snapshot-goal-progress.svg"
                alt=""
                className="h-9 w-9 shrink-0"
              />
              Goal Progress
            </span>
            <span className="text-sm font-semibold text-zinc-50">
              {goalProgress}%
            </span>
          </div>
          <div className="mt-2 ml-[46px] h-1.5 w-[calc(100%-46px)] overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-sky-400 transition-all duration-500 ease-out"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
