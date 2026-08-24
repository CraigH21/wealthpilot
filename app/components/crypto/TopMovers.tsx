"use client";

import { useState } from "react";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import { coinLogoUrl, type MarketCoin } from "../../lib/crypto/market";

type Tab = "gainers" | "losers" | "trending";

/** "Trending" = highest 24h-volume-to-market-cap turnover among coins with a
 * meaningful market cap — a real, computable proxy for "getting a lot of
 * trading attention right now" rather than a fabricated ranking. */
function turnoverRatio(coin: MarketCoin): number {
  return coin.marketCapGBP > 0 ? coin.volume24hGBP / coin.marketCapGBP : 0;
}

export default function TopMovers({ coins }: { coins: MarketCoin[] }) {
  const [tab, setTab] = useState<Tab>("gainers");
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  const sorted = [...coins].sort((a, b) => {
    if (tab === "gainers") return b.percentChange24h - a.percentChange24h;
    if (tab === "losers") return a.percentChange24h - b.percentChange24h;
    return turnoverRatio(b) - turnoverRatio(a);
  });
  const top = sorted.slice(0, 5);

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-50">Top Movers (24h)</h3>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {(["gainers", "losers", "trending"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                tab === option ? "bg-accent-soft text-accent" : "text-zinc-500"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {top.map((coin) => {
          const positive = coin.percentChange24h >= 0;
          return (
            <div key={coin.id} className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coinLogoUrl(coin.id)}
                alt=""
                className="h-6 w-6 shrink-0 rounded-full bg-white/10 object-cover"
              />
              <span className="flex-1 truncate text-sm font-medium text-zinc-50">{coin.symbol}</span>
              {tab === "trending" ? (
                <span className="text-sm font-semibold text-accent">
                  {(turnoverRatio(coin) * 100).toFixed(0)}% turnover
                </span>
              ) : (
                <span className={`text-sm font-semibold ${positive ? "text-accent" : "text-red-400"}`}>
                  {positive ? "+" : ""}
                  {coin.percentChange24h.toFixed(1)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
