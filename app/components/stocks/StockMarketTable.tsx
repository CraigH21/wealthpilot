"use client";

import { useMemo, useState } from "react";
import StockTickerLogo from "./StockTickerLogo";
import type { StockMarketSnapshot, StockMover } from "../../lib/stocks/market";

type Tab = "gainers" | "losers" | "mostActive";

const TABS: { value: Tab; label: string }[] = [
  { value: "gainers", label: "Gainers" },
  { value: "losers", label: "Losers" },
  { value: "mostActive", label: "Most Active" },
];

const ROWS_PER_PAGE = 10;

const formatVolume = (value: number) =>
  new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export default function StockMarketTable({ snapshot }: { snapshot: StockMarketSnapshot }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("mostActive");
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const source: StockMover[] = tab === "gainers" ? snapshot.gainers : tab === "losers" ? snapshot.losers : snapshot.mostActive;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return source;
    return source.filter((mover) => mover.symbol.toLowerCase().includes(query));
  }, [source, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const updateTab = (next: Tab) => {
    setTab(next);
    setPage(1);
  };

  const toggleFavourite = (symbol: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  return (
    <div className="glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Live Stock Market</h2>
          <p className="mt-1 text-sm text-zinc-600">
            All prices in USD • Live data from Alpha Vantage • Updated {snapshot.lastUpdated}
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600"
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
            placeholder="Search by ticker..."
            className="w-full rounded-full border border-black/10 bg-black/5 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((option) => {
          const active = option.value === tab;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updateTab(option.value)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-300 ease-out ${
                active
                  ? "border-accent-border bg-accent-soft text-accent"
                  : "border-black/10 bg-black/5 text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-zinc-600">
              <th className="pb-3 pr-2 font-medium">#</th>
              <th className="pb-3 pr-2 font-medium">Symbol</th>
              <th className="pb-3 pr-2 text-right font-medium">Price</th>
              <th className="pb-3 pr-2 text-right font-medium">Change</th>
              <th className="pb-3 pr-2 text-right font-medium">Change %</th>
              <th className="pb-3 pr-2 text-right font-medium">Volume</th>
              <th className="pb-3 pl-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {pageRows.map((mover, index) => {
              const positive = mover.changePercent >= 0;
              return (
                <tr key={mover.symbol} className="transition-colors duration-300 ease-out hover:bg-black/5">
                  <td className="py-3 pr-2 text-zinc-600">{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      <StockTickerLogo symbol={mover.symbol} size={24} />
                      <span className="font-medium text-zinc-900">{mover.symbol}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2 text-right font-medium text-zinc-900">
                    ${mover.price.toFixed(2)}
                  </td>
                  <td className={`py-3 pr-2 text-right font-medium ${positive ? "text-accent" : "text-red-400"}`}>
                    {positive ? "+" : ""}
                    {mover.changeAmount.toFixed(2)}
                  </td>
                  <td className={`py-3 pr-2 text-right font-medium ${positive ? "text-accent" : "text-red-400"}`}>
                    {positive ? "+" : ""}
                    {mover.changePercent.toFixed(2)}%
                  </td>
                  <td className="py-3 pr-2 text-right text-zinc-600">{formatVolume(mover.volume)}</td>
                  <td className="py-3 pl-2 text-right">
                    <button
                      type="button"
                      onClick={() => toggleFavourite(mover.symbol)}
                      aria-label={favourites.has(mover.symbol) ? "Remove from favourites" : "Add to favourites"}
                      className={favourites.has(mover.symbol) ? "text-accent" : "text-zinc-600 hover:text-zinc-500"}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={favourites.has(mover.symbol) ? "currentColor" : "none"}
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
                <td colSpan={7} className="py-8 text-center text-sm text-zinc-600">
                  No tickers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
        <p>
          Showing {pageRows.length ? (currentPage - 1) * ROWS_PER_PAGE + 1 : 0}–
          {(currentPage - 1) * ROWS_PER_PAGE + pageRows.length} of {filtered.length} loaded
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-black/10 bg-black/5 p-1.5 text-zinc-500 disabled:opacity-30"
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
            className="rounded-full border border-black/10 bg-black/5 p-1.5 text-zinc-500 disabled:opacity-30"
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
