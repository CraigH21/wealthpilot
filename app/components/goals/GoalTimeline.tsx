"use client";

import { useRef } from "react";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import { getGoalMeta, TONE_STYLE } from "../../lib/goals/meta";

export type TimelineGoal = { id: string; name: string; estimatedCompletion: string };

function ChevronButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll earlier" : "Scroll later"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5 text-zinc-500 transition-colors duration-300 ease-out hover:text-accent"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {direction === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

export default function GoalTimeline({ goals }: { goals: TimelineGoal[] }) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    trackRef.current?.scrollBy({ left: direction === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8"
    >
      <EdgeGlow />

      <div className="relative flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Goal Timeline</h2>
          <p className="mt-1 text-sm text-zinc-600">Your path to achieving financial freedom</p>
        </div>
        <div className="flex items-center gap-2">
          <ChevronButton direction="left" onClick={() => scroll("left")} />
          <ChevronButton direction="right" onClick={() => scroll("right")} />
        </div>
      </div>

      <div ref={trackRef} className="relative mt-8 overflow-x-auto pb-2 [scrollbar-width:none]">
        <div className="relative flex min-w-max items-start gap-2 px-2">
          <div className="pointer-events-none absolute left-8 right-8 top-6 h-px bg-black/10" />
          {goals.map((goal) => {
            const meta = getGoalMeta(goal.id);
            const tone = TONE_STYLE[meta.tone];
            return (
              <div key={goal.id} className="flex w-36 flex-col items-center text-center">
                <span
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 ${tone.bg}`}
                >
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
                <p className="mt-3 text-sm font-semibold text-zinc-900">{goal.estimatedCompletion}</p>
                <p className="mt-0.5 text-xs text-zinc-600">{goal.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
