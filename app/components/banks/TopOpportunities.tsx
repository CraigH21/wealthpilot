"use client";

import { useState } from "react";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";

type Tab = "rates" | "fees" | "trending";

type Opportunity = { name: string; detail: string; highlight: string };

// Read by AIBankingInsights too, so the "rates available" callout there
// always names the same top rate shown here rather than a second number
// that could drift out of sync.
export const TOP_SAVINGS_AER = 5.0;

// Curated, presentational recommendations — not live rate data (there's no
// keyless savings-rate API), same spirit as the AI Coach's static
// recommendation copy elsewhere in the app.
const OPPORTUNITIES: Record<Tab, Opportunity[]> = {
  rates: [
    { name: "Chip Instant Access", detail: "Easy-access savings", highlight: `${TOP_SAVINGS_AER.toFixed(2)}% AER` },
    { name: "Marcus by Goldman Sachs", detail: "Easy-access savings", highlight: "4.90% AER" },
    { name: "Chase Saver", detail: "Easy-access savings", highlight: "4.85% AER" },
    { name: "Barclays Savings Account", detail: "Your account", highlight: "4.10% AER" },
  ],
  fees: [
    { name: "Monzo Current Account", detail: "No monthly fee, no FX fees abroad", highlight: "£0/mo" },
    { name: "Starling Current Account", detail: "No monthly fee, fee-free spending abroad", highlight: "£0/mo" },
    { name: "Chase Current Account", detail: "No monthly fee, 1% cashback on debit spend", highlight: "£0/mo" },
  ],
  trending: [
    { name: "Chip Instant Access", detail: "Most-opened easy-access account this month", highlight: "Trending" },
    { name: "Trading 212 Cash ISA", detail: "Tax-free interest on up to £20k", highlight: "Trending" },
    { name: "Chase Saver", detail: "Popular pairing with a Chase current account", highlight: "Trending" },
  ],
};

const TABS: { value: Tab; label: string }[] = [
  { value: "rates", label: "Higher Rates" },
  { value: "fees", label: "Lower Fees" },
  { value: "trending", label: "Trending" },
];

export default function TopOpportunities() {
  const [tab, setTab] = useState<Tab>("rates");
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900">Top Opportunities</h3>
        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-black/5 p-1">
          {TABS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTab(option.value)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                tab === option.value ? "bg-accent-soft text-accent" : "text-zinc-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {OPPORTUNITIES[tab].map((item) => (
          <div key={item.name} className="flex items-center gap-2.5 rounded-xl px-1 py-1.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-[10px] font-semibold text-zinc-600">
              {item.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
              <p className="truncate text-xs text-zinc-600">{item.detail}</p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-accent">{item.highlight}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
