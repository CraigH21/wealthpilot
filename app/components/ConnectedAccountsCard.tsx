"use client";

import { useRef, useState } from "react";
import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";
import type { ConnectedAccount, Transaction } from "../lib/mock/portfolioContext";
import AddAccountPanel from "./add-account/AddAccountPanel";
import AccountDetailsModal from "./account-details/AccountDetailsModal";

export default function ConnectedAccountsCard({
  accounts,
  transactions,
}: {
  accounts: ConnectedAccount[];
  transactions: Transaction[];
}) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();
  const trackRef = useRef<HTMLDivElement>(null);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ConnectedAccount | null>(null);

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative h-full overflow-hidden rounded-3xl p-5 pb-6 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[3px] hover:scale-[1.01] sm:p-6 sm:pb-7"
    >
      <EdgeGlow />

      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-zinc-500"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 17H7a5 5 0 010-10h2M15 7h2a5 5 0 010 10h-2M8 12h8" />
          </svg>
          <p className="text-sm font-medium text-zinc-900">Connected Accounts</p>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
            {accounts.length} Connected
          </span>
        </div>

        <button
          type="button"
          onClick={() => setAddAccountOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border"
        >
          Add Account
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="relative mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll connected accounts left"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5 text-zinc-500 transition-colors duration-300 ease-out hover:text-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <div
          ref={trackRef}
          className="flex flex-1 items-center gap-3 overflow-x-auto py-1.5 [scrollbar-width:none]"
        >
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              title={account.name}
              onClick={() => setSelectedAccount(account)}
              className="shrink-0"
            >
              {account.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={account.logo}
                  alt={account.name}
                  className="h-12 w-12 rounded-full bg-black/10 object-cover transition-transform duration-300 ease-out hover:scale-110"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent transition-transform duration-300 ease-out hover:scale-110">
                  {account.name[0]}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll connected accounts right"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5 text-zinc-500 transition-colors duration-300 ease-out hover:text-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <AddAccountPanel open={addAccountOpen} onClose={() => setAddAccountOpen(false)} />

      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          transactions={transactions}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  );
}
