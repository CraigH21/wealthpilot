"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

export type AICoachData = {
  healthScore: number;
  healthStatus: string;
  mainInsight: string;
  recommendation: string;
};

const MOCK_COACH_DATA: AICoachData = {
  healthScore: 82,
  healthStatus: "Good",
  mainInsight:
    "Your portfolio has grown 3.2% this month, outperforming the market average.",
  recommendation:
    "Consider diversifying further into AI stocks, which are showing strong momentum.",
};

type AICoachCardProps = Partial<AICoachData> & {
  onAskAI?: () => void;
};

export default function AICoachCard({
  healthScore = MOCK_COACH_DATA.healthScore,
  healthStatus = MOCK_COACH_DATA.healthStatus,
  mainInsight = MOCK_COACH_DATA.mainInsight,
  recommendation = MOCK_COACH_DATA.recommendation,
  onAskAI,
}: AICoachCardProps) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative flex flex-1 flex-col rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 text-accent"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        </svg>
        <h3 className="text-sm font-semibold text-zinc-50">AI Coach</h3>
      </div>

      <p className="mt-1 text-xs text-zinc-500">Your personal wealth coach</p>

      {/* Portfolio Health Score */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">
            Portfolio Health Score
          </p>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
            {healthStatus}
          </span>
        </div>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-zinc-50">
            {healthScore}
          </span>
          <span className="text-xs text-zinc-500">/ 100</span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Main Insight */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-medium text-zinc-500">Main Insight</p>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
          {mainInsight}
        </p>
      </div>

      {/* Recommendation */}
      <div className="mt-3 flex flex-1 flex-col justify-center rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-medium text-zinc-500">Recommendation</p>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
          {recommendation}
        </p>
      </div>

      <button
        type="button"
        onClick={onAskAI}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-soft px-4 py-2.5 text-sm font-medium text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border"
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
    </section>
  );
}
