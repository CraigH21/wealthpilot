"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

export default function ProUpsellCard() {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--pro-soft)] text-[color:var(--pro-accent)] shadow-[0_0_20px_var(--pro-glow),0_0_40px_var(--pro-glow)] transition-colors duration-500 ease-out">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8z" />
        </svg>
      </span>

      <p className="mt-3 text-sm font-semibold text-zinc-50">
        Unlock more with Pro
      </p>

      <ul className="mt-3 flex flex-col gap-1.5 text-xs text-zinc-400">
        <li>Advanced insights</li>
        <li>Higher limits</li>
        <li>Priority support</li>
      </ul>

      <button
        type="button"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--pro-soft)] px-4 py-2.5 text-sm font-medium text-[color:var(--pro-accent)] shadow-[0_0_16px_var(--pro-glow)] transition-all duration-300 ease-out hover:bg-[color:var(--pro-strong)]"
      >
        Upgrade to Pro
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
    </div>
  );
}
