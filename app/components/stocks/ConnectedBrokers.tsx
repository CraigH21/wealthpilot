"use client";

import { useEffect, useState } from "react";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import { stockLogoUrl } from "../../lib/stocks/market";
import type { ConnectedAccount, Security } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

// Sync recency is a display freshness cue, not financial data — a fixed
// lookup rather than something that needs to reconcile with anything.
const LAST_SYNCED: Record<string, string> = {
  "trading212-isa": "5m ago",
  "trading212-gia": "12m ago",
};

function BrokerCard({ account, onSelect }: { account: ConnectedAccount; onSelect: (id: string) => void }) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLButtonElement>();

  return (
    <button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      type="button"
      onClick={() => onSelect(account.id)}
      className="group glass-edge-card relative w-full overflow-hidden rounded-2xl p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[3px]"
    >
      <EdgeGlow />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          {account.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={account.logo}
              alt=""
              className="h-10 w-10 shrink-0 rounded-xl bg-black/10 object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-semibold text-accent">
              {account.name[0]}
            </span>
          )}
          <div>
            <p className="text-sm font-medium text-zinc-900">{account.name}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Connected
            </span>
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 text-zinc-600"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>

      <p className="relative mt-4 text-2xl font-semibold text-zinc-900">{formatGBP(account.balance)}</p>
      <p className="relative mt-1 text-xs text-zinc-600">
        Last synced {LAST_SYNCED[account.id] ?? "recently"}
      </p>
    </button>
  );
}

function BrokerHoldingsModal({
  account,
  holdings,
  onClose,
}: {
  account: ConnectedAccount;
  holdings: Security[];
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="glass-edge-card glass-edge-hero relative w-full max-w-md overflow-hidden rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55),inset_4px_4px_10px_rgba(255,255,255,0.14),inset_-3px_-3px_8px_var(--accent-soft)] backdrop-blur-[32px]"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {account.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={account.logo} alt="" className="h-10 w-10 shrink-0 rounded-xl bg-black/10 object-cover" />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-semibold text-accent">
                {account.name[0]}
              </span>
            )}
            <div>
              <p className="text-sm font-semibold text-zinc-900">{account.name}</p>
              <p className="text-xs text-zinc-600">{formatGBP(account.balance)} total</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-zinc-500 hover:text-zinc-900"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-1">
          {holdings.length === 0 ? (
            <p className="py-4 text-center text-sm text-zinc-600">No holdings in this account.</p>
          ) : (
            holdings.map((holding) => (
              <div
                key={holding.symbol}
                className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/5 px-3 py-2.5"
              >
                {holding.logoSymbol ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stockLogoUrl(holding.logoSymbol)}
                      alt=""
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </span>
                ) : (
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: `${holding.color}1a`, color: holding.color }}
                  >
                    {holding.symbol.slice(0, 3)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900">{holding.name}</p>
                  <p className="text-xs text-zinc-600">{holding.category}</p>
                </div>
                <span className="text-sm font-semibold text-zinc-900">{formatGBP(holding.value)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConnectedBrokers({
  accounts,
  securities,
}: {
  accounts: ConnectedAccount[];
  securities: Security[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedAccount = accounts.find((a) => a.id === selectedId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">Your Connected Accounts</h2>
        <p className="text-sm text-zinc-600">{accounts.length} accounts connected</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {accounts.map((account) => (
          <BrokerCard key={account.id} account={account} onSelect={setSelectedId} />
        ))}
      </div>

      {selectedAccount && (
        <BrokerHoldingsModal
          account={selectedAccount}
          holdings={securities.filter((security) => security.accountId === selectedAccount.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
