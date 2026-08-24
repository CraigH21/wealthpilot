"use client";

import { useMemo, useState } from "react";
import { coinLogoUrl, coinMatchesCategory, type MarketCategory, type MarketCoin } from "../../lib/crypto/market";

const FILTERS: { value: MarketCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "top100", label: "Top 100" },
  { value: "defi", label: "DeFi" },
  { value: "ai", label: "AI" },
  { value: "gaming", label: "Gaming" },
  { value: "memecoins", label: "Memecoins" },
  { value: "stablecoins", label: "Stablecoins" },
  { value: "layer1", label: "Layer 1" },
];

const ROWS_PER_PAGE = 10;
const SPARKLINE_UP = "0,28 10,24 20,26 30,18 40,20 50,14 60,17 70,10 80,12 90,6 100,4";
const SPARKLINE_DOWN = "0,6 10,10 20,8 30,14 40,12 50,18 60,15 70,20 80,18 90,24 100,22";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

function Sparkline({ positive }: { positive: boolean }) {
  const color = positive ? "var(--accent)" : "#f87171";
  const points = positive ? SPARKLINE_UP : SPARKLINE_DOWN;

  return (
    <svg viewBox="0 0 100 36" className="h-8 w-20">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MarketTable({ coins }: { coins: MarketCoin[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MarketCategory>("all");
  const [favourites, setFavourites] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return coins.filter((coin) => {
      if (!coinMatchesCategory(coin, category)) return false;
      if (!query) return true;
      return coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query);
    });
  }, [coins, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const updateFilter = (next: MarketCategory) => {
    setCategory(next);
    setPage(1);
  };

  const toggleFavourite = (id: number) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-50">Live Crypto Market</h2>
          <p className="mt-1 text-sm text-zinc-500">All prices in GBP • Live data from CoinMarketCap</p>
        </div>

        <div className="relative w-full max-w-xs">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search coins, symbols or categories..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.value === category;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => updateFilter(filter.value)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 ease-out ${
                active
                  ? "border-accent-border bg-accent-soft text-accent"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-zinc-500">
              <th className="pb-3 pr-2 font-medium">#</th>
              <th className="pb-3 pr-2 font-medium">Name</th>
              <th className="pb-3 pr-2 font-medium">Symbol</th>
              <th className="pb-3 pr-2 text-right font-medium">Price (GBP)</th>
              <th className="pb-3 pr-2 text-right font-medium">24h %</th>
              <th className="pb-3 pr-2 text-right font-medium">Market Cap</th>
              <th className="pb-3 pr-2 text-right font-medium">24h Volume</th>
              <th className="pb-3 pr-2 font-medium">7D Chart</th>
              <th className="pb-3 pl-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pageRows.map((coin) => {
              const positive = coin.percentChange24h >= 0;
              const positive7d = coin.percentChange7d >= 0;
              return (
                <tr key={coin.id} className="transition-colors duration-300 ease-out hover:bg-white/5">
                  <td className="py-3 pr-2 text-zinc-500">{coin.rank}</td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coinLogoUrl(coin.id)}
                        alt=""
                        className="h-6 w-6 shrink-0 rounded-full bg-white/10 object-cover"
                      />
                      <span className="font-medium text-zinc-50">{coin.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2 text-zinc-400">{coin.symbol}</td>
                  <td className="py-3 pr-2 text-right font-medium text-zinc-50">{formatGBP(coin.priceGBP)}</td>
                  <td className={`py-3 pr-2 text-right font-medium ${positive ? "text-accent" : "text-red-400"}`}>
                    {positive ? "+" : ""}
                    {coin.percentChange24h.toFixed(2)}%
                  </td>
                  <td className="py-3 pr-2 text-right text-zinc-300">{formatCompact(coin.marketCapGBP)}</td>
                  <td className="py-3 pr-2 text-right text-zinc-300">{formatCompact(coin.volume24hGBP)}</td>
                  <td className="py-3 pr-2">
                    <Sparkline positive={positive7d} />
                  </td>
                  <td className="py-3 pl-2 text-right">
                    <button
                      type="button"
                      onClick={() => toggleFavourite(coin.id)}
                      aria-label={favourites.has(coin.id) ? "Remove from favourites" : "Add to favourites"}
                      className={favourites.has(coin.id) ? "text-accent" : "text-zinc-600 hover:text-zinc-400"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={favourites.has(coin.id) ? "currentColor" : "none"}
                        className="h-4 w-4"
                        stroke="currentColor"
                        strokeWidth={1.75}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} className="py-8 text-center text-sm text-zinc-500">
                  No coins match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
        <p>
          Showing {pageRows.length ? (currentPage - 1) * ROWS_PER_PAGE + 1 : 0}–
          {(currentPage - 1) * ROWS_PER_PAGE + pageRows.length} of {filtered.length} loaded
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-white/10 bg-white/5 p-1.5 text-zinc-400 disabled:opacity-30"
            aria-label="Previous page"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <span className="rounded-full bg-accent-soft px-3 py-1 font-medium text-accent">{currentPage}</span>
          <span>of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-white/10 bg-white/5 p-1.5 text-zinc-400 disabled:opacity-30"
            aria-label="Next page"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
