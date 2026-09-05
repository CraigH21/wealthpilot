"use client";

import { useMemo, useState } from "react";
import type { ConnectedAccount, Transaction } from "../../lib/mock/portfolioContext";

const COLLAPSED_ROWS = 8;

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);

const formatDate = (date: string) => {
  const today = "2026-08-24";
  const yesterday = "2026-08-23";
  if (date === today) return "Today";
  if (date === yesterday) return "Yesterday";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export default function RecentTransactionsTable({
  transactions,
  accounts,
}: {
  transactions: Transaction[];
  accounts: ConnectedAccount[];
}) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  const accountName = useMemo(() => {
    const map = new Map(accounts.map((account) => [account.id, account.name]));
    return (accountId: string) => map.get(accountId) ?? accountId;
  }, [accounts]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transactions;
    return transactions.filter(
      (transaction) =>
        transaction.merchant.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        accountName(transaction.accountId).toLowerCase().includes(query)
    );
  }, [transactions, search, accountName]);

  const rows = expanded ? filtered : filtered.slice(0, COLLAPSED_ROWS);

  return (
    <div className="glass-edge-card relative rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Recent Transactions</h2>
          <p className="mt-1 text-sm text-zinc-600">Your latest bank transactions across all accounts</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-full border border-black/10 bg-black/5 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent"
          >
            {expanded ? "Show less" : "View all"}
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-zinc-600">
              <th className="pb-3 pr-2 font-medium">Date</th>
              <th className="pb-3 pr-2 font-medium">Merchant</th>
              <th className="pb-3 pr-2 font-medium">Category</th>
              <th className="pb-3 pr-2 font-medium">Account</th>
              <th className="pb-3 pl-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((transaction) => {
              const positive = transaction.amount > 0;
              return (
                <tr key={transaction.id} className="transition-colors duration-300 ease-out hover:bg-black/5">
                  <td className="py-3 pr-2 text-zinc-500">{formatDate(transaction.date)}</td>
                  <td className="py-3 pr-2 font-medium text-zinc-900">{transaction.merchant}</td>
                  <td className="py-3 pr-2 text-zinc-500">{transaction.category}</td>
                  <td className="py-3 pr-2 text-zinc-500">{accountName(transaction.accountId)}</td>
                  <td className={`py-3 pl-2 text-right font-medium ${positive ? "text-accent" : "text-zinc-900"}`}>
                    {positive ? "+" : "-"}
                    {formatGBP(Math.abs(transaction.amount))}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-zinc-600">
                  No transactions match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
