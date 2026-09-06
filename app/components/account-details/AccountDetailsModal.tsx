"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { removeAccountAction } from "../../lib/actions/removeAccount";
import type { ConnectedAccount, Transaction } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const STATUS_LABEL: Record<ConnectedAccount["status"], string> = {
  connected: "Connected",
  syncing: "Syncing",
};

export default function AccountDetailsModal({
  account,
  transactions,
  onClose,
}: {
  account: ConnectedAccount;
  transactions: Transaction[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleRemove = async () => {
    setRemoving(true);
    await removeAccountAction(account.id);
    router.refresh();
    onClose();
  };

  const accountTransactions = transactions.filter((t) => t.accountId === account.id).slice(0, 8);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="wp-dark-scope fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-black/10 bg-[var(--background)] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {account.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={account.logo} alt="" className="h-11 w-11 rounded-full bg-black/5 object-cover" />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {account.name[0]}
              </span>
            )}
            <div>
              <p className="text-sm font-semibold text-zinc-900">{account.name}</p>
              <p className="text-xs text-zinc-500">{account.accountType ?? account.provider}</p>
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

        <div className="mt-5 rounded-2xl border-2 border-accent-border bg-black/5 p-4 shadow-[0_0_16px_var(--accent-glow)]">
          <p className="text-xs font-medium text-zinc-500">Balance</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{formatGBP(account.balance)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                account.status === "connected" ? "bg-accent-soft text-accent" : "bg-amber-500/10 text-amber-500"
              }`}
            >
              {STATUS_LABEL[account.status]}
            </span>
            {account.interestRateAER !== undefined && (
              <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                {account.interestRateAER}% AER
              </span>
            )}
            {account.networks?.map((network) => (
              <span key={network} className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                {network}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Recent Transactions</p>
          <div className="mt-2 flex max-h-56 flex-col gap-1 overflow-y-auto">
            {accountTransactions.length === 0 && (
              <p className="py-3 text-sm text-zinc-500">No transactions on this account yet.</p>
            )}
            {accountTransactions.map((t) => {
              const positive = t.amount > 0;
              return (
                <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm hover:bg-black/5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">{t.merchant}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(t.date)} &middot; {t.category}
                    </p>
                  </div>
                  <span className={`shrink-0 font-semibold ${positive ? "text-accent" : "text-red-400"}`}>
                    {positive ? "+" : "-"}£{Math.abs(t.amount).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {confirmingRemove ? (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-zinc-900">Remove {account.name}?</p>
            <p className="mt-1 text-xs text-zinc-500">
              This can&rsquo;t be undone — its transaction history will be removed too.
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingRemove(false)}
                disabled={removing}
                className="inline-flex shrink-0 items-center rounded-full bg-black/5 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all duration-300 ease-out hover:bg-black/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={removing}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 shadow-[0_0_16px_rgba(239,68,68,0.35)] transition-all duration-300 ease-out hover:bg-red-500/20 disabled:opacity-50"
              >
                {removing ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setConfirmingRemove(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 shadow-[0_0_16px_rgba(239,68,68,0.35)] transition-all duration-300 ease-out hover:bg-red-500/20"
            >
              Remove Account
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
