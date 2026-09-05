"use client";

import { useEffect, useState } from "react";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import type { ConnectedAccount, Transaction } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

// Sync recency is a display freshness cue, not financial data — a fixed
// lookup rather than something that needs to reconcile with anything.
const LAST_SYNCED: Record<string, string> = {
  "barclays-current": "2m ago",
  "barclays-savings": "4m ago",
  "monzo-current": "3m ago",
  "monzo-savings": "6m ago",
};

function BankCard({ account, onSelect }: { account: ConnectedAccount; onSelect: (id: string) => void }) {
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
      <div className="relative mt-2 flex items-center gap-2 text-xs">
        {account.interestRateAER != null && (
          <span className="rounded-full bg-black/5 px-2 py-0.5 font-medium text-zinc-600">
            {account.interestRateAER}% AER
          </span>
        )}
        {account.accountType && <span className="text-zinc-600">{account.accountType}</span>}
      </div>
      <p className="relative mt-2 text-xs text-zinc-600">
        Last synced {LAST_SYNCED[account.id] ?? "recently"}
      </p>
    </button>
  );
}

function BankAccountModal({
  account,
  transactions,
  onClose,
}: {
  account: ConnectedAccount;
  transactions: Transaction[];
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
              <p className="text-xs text-zinc-600">{formatGBP(account.balance)} balance</p>
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

        <p className="relative mt-5 text-xs font-medium uppercase tracking-wide text-zinc-600">
          Recent transactions
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {transactions.length === 0 ? (
            <p className="py-4 text-center text-sm text-zinc-600">No transactions on this account.</p>
          ) : (
            transactions.slice(0, 6).map((transaction) => {
              const positive = transaction.amount > 0;
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/5 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{transaction.merchant}</p>
                    <p className="text-xs text-zinc-600">{transaction.category}</p>
                  </div>
                  <span className={`text-sm font-semibold ${positive ? "text-accent" : "text-zinc-600"}`}>
                    {positive ? "+" : "-"}
                    {formatGBP(Math.abs(transaction.amount))}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConnectedBanks({
  accounts,
  transactions,
}: {
  accounts: ConnectedAccount[];
  transactions: Transaction[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedAccount = accounts.find((a) => a.id === selectedId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">Your Connected Accounts</h2>
        <p className="text-sm text-zinc-600">{accounts.length} accounts connected</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {accounts.map((account) => (
          <BankCard key={account.id} account={account} onSelect={setSelectedId} />
        ))}
      </div>

      {selectedAccount && (
        <BankAccountModal
          account={selectedAccount}
          transactions={transactions.filter((transaction) => transaction.accountId === selectedAccount.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
