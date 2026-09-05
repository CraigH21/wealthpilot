"use client";

import { useState } from "react";
import EdgeGlow from "../EdgeGlow";
import StockTickerLogo from "./StockTickerLogo";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import type { StockMarketSnapshot, StockMover } from "../../lib/stocks/market";

type Tab = "gainers" | "losers" | "mostActive";

const TAB_LABEL: Record<Tab, string> = {
  gainers: "Gainers",
  losers: "Losers",
  mostActive: "Most Active",
};

export default function StockTopMovers({ snapshot }: { snapshot: StockMarketSnapshot }) {
  const [tab, setTab] = useState<Tab>("gainers");
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  const list: StockMover[] = tab === "gainers" ? snapshot.gainers : tab === "losers" ? snapshot.losers : snapshot.mostActive;

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900">Top Movers</h3>
        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-black/5 p-1">
          {(["gainers", "losers", "mostActive"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                tab === option ? "bg-accent-soft text-accent" : "text-zinc-600"
              }`}
            >
              {TAB_LABEL[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {list.slice(0, 5).map((mover) => {
          const positive = mover.changePercent >= 0;
          return (
            <div key={mover.symbol} className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
              <StockTickerLogo symbol={mover.symbol} size={24} />
              <span className="flex-1 truncate text-sm font-medium text-zinc-900">{mover.symbol}</span>
              <span className={`text-sm font-semibold ${positive ? "text-accent" : "text-red-400"}`}>
                {positive ? "+" : ""}
                {mover.changePercent.toFixed(1)}%
              </span>
            </div>
          );
        })}
        {list.length === 0 && <p className="py-3 text-center text-sm text-zinc-600">No data right now.</p>}
      </div>
    </section>
  );
}
