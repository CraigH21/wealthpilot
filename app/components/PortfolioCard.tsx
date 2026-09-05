"use client";

import { useState } from "react";
import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

type PortfolioCardProps = {
  name: string;
  symbol: string;
  logoSymbol: string | null;
  /** A fully-formed logo URL — takes priority over `logoSymbol`. Needed for
   * crypto, which resolves against CoinMarketCap's logo CDN rather than the
   * stock-logo one `logoSymbol` builds against. */
  logoUrl?: string | null;
  value: string;
  change: string;
  positive: boolean;
  accent: string;
  sparkline: string;
  sparklinePoints: string;
};

export default function PortfolioCard({
  name,
  symbol,
  logoSymbol,
  logoUrl: logoUrlProp,
  value,
  change,
  positive,
  accent,
  sparkline,
  sparklinePoints,
}: PortfolioCardProps) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();
  const [logoFailed, setLogoFailed] = useState(false);
  const logoUrl =
    logoUrlProp ?? (logoSymbol ? `https://financialmodelingprep.com/image-stock/${logoSymbol}.png` : null);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative overflow-hidden rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[3px] hover:scale-[1.01]"
    >
      <EdgeGlow />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_0%_0%,var(--accent-soft),transparent_65%)]"
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          {!logoUrl || logoFailed ? (
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-colors duration-500 ease-out ${accent}`}
            >
              {symbol}
            </span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 p-2 shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={`${name} logo`}
                className="h-full w-full object-contain"
                onError={() => setLogoFailed(true)}
              />
            </span>
          )}
          <div>
            <p className="text-sm font-medium text-zinc-900">{name}</p>
            <p className="text-xs text-zinc-600">{symbol}</p>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold text-zinc-900">{value}</p>
            <p
              className={`mt-1 text-sm font-medium transition-colors duration-500 ease-out ${
                positive ? "text-accent" : "text-red-400"
              }`}
            >
              {change}
            </p>
          </div>

          <svg viewBox="0 0 100 36" className="h-9 w-24 shrink-0">
            <defs>
              <linearGradient
                id={`sparkline-fill-${symbol}`}
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
              points={`0,36 ${sparklinePoints} 100,36`}
              fill={`url(#sparkline-fill-${symbol})`}
              stroke="none"
            />
            <polyline
              points={sparklinePoints}
              fill="none"
              stroke={sparkline}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
