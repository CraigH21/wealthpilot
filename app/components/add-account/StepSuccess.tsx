"use client";

import type { ConnectionResult } from "../../lib/mock/accountConnection";
import ProviderLogo from "./ProviderLogo";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);

export default function StepSuccess({
  result,
  onViewAccount,
  onDone,
}: {
  result: ConnectionResult;
  onViewAccount: () => void;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
          <ProviderLogo name={result.providerName} logo={result.providerLogo} size={40} />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_12px_var(--accent-glow)]">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
        </span>
        <p className="text-lg font-semibold text-zinc-900">{result.providerName} Connected</p>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">Connected</span>
          <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-zinc-600">Read-only</span>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Imported</p>
        <ul className="mt-2 flex flex-col gap-2">
          {result.accounts.map((account) => (
            <li key={account.name} className="flex items-center justify-between text-sm">
              <span className="text-zinc-700">{account.name}</span>
              <span className="font-semibold text-zinc-900">{formatGBP(account.balance)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-black/10 pt-3 text-sm text-zinc-600">
          {result.transactionCount} transactions imported.
        </div>
        <div className="mt-1 text-xs text-zinc-500">Last synced: Just now</div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onViewAccount}
          className="flex-1 rounded-full border border-black/10 bg-black/5 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors duration-300 ease-out hover:bg-black/10"
        >
          View Account
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex-1 rounded-full bg-accent-soft px-4 py-2.5 text-sm font-medium text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border"
        >
          Done
        </button>
      </div>
    </div>
  );
}
