"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";
import { coinLogoUrl } from "../lib/crypto/market";
import type { MarketPulseSnapshot } from "../lib/market/pulse";

const SPARKLINE_UP = "0,28 10,24 20,26 30,18 40,20 50,14 60,17 70,10 80,12 90,6 100,4";
const SPARKLINE_DOWN = "0,6 10,10 20,8 30,14 40,12 50,18 60,15 70,20 80,18 90,24 100,22";

export default function MarketPulseCard({ snapshot }: { snapshot: MarketPulseSnapshot }) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();

  const items = [
    { ...snapshot.ftse, emoji: "🇬🇧" },
    { ...snapshot.sp500, emoji: "🇺🇸" },
    { ...snapshot.gold, emoji: "🪙" },
    { ...snapshot.bitcoin, logoUrl: coinLogoUrl(1) },
  ];

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
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M15 7h6v6" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-900">Market Pulse</p>
          <p className="text-xs text-zinc-500">Indices &amp; commodities</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3.5">
        {items.map((item) => {
          const positive = item.changePercent >= 0;
          const sparkline = positive ? "var(--accent)" : "#f87171";
          const gradientId = `market-pulse-fill-${item.label.replace(/[^a-zA-Z0-9]/g, "")}`;
          return (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                {"logoUrl" in item && item.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.logoUrl}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full bg-black/5 object-contain p-1"
                  />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-base">
                    {"emoji" in item ? item.emoji : null}
                  </span>
                )}
                <span className="leading-tight">
                  <span className="block text-sm font-medium text-zinc-900">{item.label}</span>
                  <span className="block text-xs text-zinc-500">{item.value}</span>
                </span>
              </span>

              <span className="flex shrink-0 items-center gap-2">
                <svg viewBox="0 0 100 36" className="h-7 w-16 shrink-0">
                  <defs>
                    <linearGradient
                      id={gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={sparkline} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={sparkline} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,36 ${positive ? SPARKLINE_UP : SPARKLINE_DOWN} 100,36`}
                    fill={`url(#${gradientId})`}
                    stroke="none"
                  />
                  <polyline
                    points={positive ? SPARKLINE_UP : SPARKLINE_DOWN}
                    fill="none"
                    stroke={sparkline}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className={`text-sm font-semibold ${positive ? "text-accent" : "text-red-400"}`}
                >
                  {positive ? "+" : ""}
                  {item.changePercent.toFixed(1)}%
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
