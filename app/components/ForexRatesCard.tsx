"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";
import type { ForexPair } from "../lib/forex/rates";

const FLAGS: Record<string, string> = {
  GBP: "🇬🇧",
  USD: "🇺🇸",
  EUR: "🇪🇺",
  JPY: "🇯🇵",
};

export default function ForexRatesCard({ rates }: { rates: ForexPair[] }) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[3px] hover:scale-[1.01]"
    >
      <EdgeGlow />

      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4.5 w-4.5"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.4 2.5 3.5 5.9 3.5 9s-1.1 6.5-3.5 9c-2.4-2.5-3.5-5.9-3.5-9s1.1-6.5 3.5-9z" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-900">Forex Rates</p>
          <p className="text-xs text-zinc-500">Live exchange rates</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3.5">
        {rates.map((pair) => {
          const positive = pair.changePct >= 0;
          return (
            <div
              key={`${pair.base}${pair.quote}`}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-base">
                    {FLAGS[pair.base]}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-base">
                    {FLAGS[pair.quote]}
                  </span>
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-medium text-zinc-900">
                    {pair.base} / {pair.quote}
                  </span>
                  <span className="block text-xs text-zinc-500">{pair.rate.toFixed(2)}</span>
                </span>
              </span>
              <span
                className={`shrink-0 text-sm font-semibold ${
                  positive ? "text-accent" : "text-red-400"
                }`}
              >
                {positive ? "+" : ""}
                {pair.changePct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
