import type { ReactNode } from "react";
import EdgeGlow from "../EdgeGlow";
import type { SpendingCategoryTotal } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

const CATEGORY_STYLE: Record<string, { color: string; bg: string; icon: ReactNode }> = {
  Housing: {
    color: "#fbbf24",
    bg: "bg-amber-500/10",
    icon: <path d="M4 10l8-5 8 5v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z" />,
  },
  "Bills & Utilities": {
    color: "#38bdf8",
    bg: "bg-sky-500/10",
    icon: <path d="M13 2L4 14h6l-1 8 9-12h-6z" />,
  },
  Subscriptions: {
    color: "#c084fc",
    bg: "bg-purple-500/10",
    icon: <path d="M17 2l4 4-4 4M7 22l-4-4 4-4M3 6h13a4 4 0 014 4M21 18H8a4 4 0 01-4-4" />,
  },
  "Health & Fitness": {
    color: "#fb7185",
    bg: "bg-rose-500/10",
    icon: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z" />,
  },
  Groceries: {
    color: "#78ba00",
    bg: "bg-accent-soft",
    icon: <path d="M6 2l1.5 5h9L18 2M4 8h16l-1.5 11a2 2 0 01-2 2H7.5a2 2 0 01-2-2L4 8zM9 12v4M15 12v4" />,
  },
  Shopping: {
    color: "#fb923c",
    bg: "bg-orange-500/10",
    icon: <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4M3 6h18M16 10a4 4 0 01-8 0" />,
  },
  Transport: {
    color: "#38bdf8",
    bg: "bg-sky-500/10",
    icon: <path d="M5 17h14M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zM5 17V9l2-5h10l2 5v8" />,
  },
  "Dining & Takeaway": {
    color: "#facc15",
    bg: "bg-yellow-500/10",
    icon: <path d="M6 2v7a2 2 0 002 2v11M6 2a2 2 0 00-2 2M18 2v20M18 2a3 3 0 013 3v4a3 3 0 01-3 3" />,
  },
};

const DEFAULT_STYLE = { color: "#a1a1aa", bg: "bg-black/5", icon: <circle cx="12" cy="12" r="9" /> };

export default function SpendingCategoriesCard({ categories }: { categories: SpendingCategoryTotal[] }) {
  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const maxAmount = Math.max(...categories.map((c) => c.amount), 1);

  return (
    <div className="glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <EdgeGlow />
      <h2 className="relative text-base font-semibold text-zinc-900">Spending Categories</h2>
      <p className="relative mt-1 text-sm text-zinc-600">This month&rsquo;s spending by category</p>

      <div className="relative mt-5 flex flex-col gap-4">
        {categories.map((category) => {
          const style = CATEGORY_STYLE[category.category] ?? DEFAULT_STYLE;
          const widthPct = Math.max(4, Math.round((category.amount / maxAmount) * 100));
          return (
            <div key={category.category} className="flex items-center gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.bg}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke={style.color}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {style.icon}
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-zinc-700">{category.category}</span>
                  <span className="shrink-0 text-zinc-500">{formatGBP(category.amount)}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${widthPct}%`, backgroundColor: style.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-black/10 pt-4 text-sm">
        <span className="font-medium text-zinc-500">Total Spending</span>
        <span className="font-semibold text-zinc-900">{formatGBP(total)}</span>
      </div>
    </div>
  );
}
