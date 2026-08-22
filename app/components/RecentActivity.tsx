"use client";

import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

export type ActivityItem = {
  time: string;
  merchant: string;
  description: string;
  amount: string;
  positive: boolean;
  initials: string;
  badgeClass: string;
  logo?: string;
};

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    time: "10:24",
    merchant: "Barclays",
    description: "Salary received",
    amount: "+£2,350.00",
    positive: true,
    initials: "B",
    badgeClass: "bg-sky-500/15 text-sky-400",
    logo: "/icons/platforms/barclays.png",
  },
  {
    time: "09:12",
    merchant: "Coinbase",
    description: "Bought Bitcoin",
    amount: "-£250.00",
    positive: false,
    initials: "C",
    badgeClass: "bg-sky-500/15 text-sky-400",
    logo: "/icons/platforms/coinbase.png",
  },
  {
    time: "08:41",
    merchant: "Trading 212",
    description: "Nvidia dividend received",
    amount: "+£18.40",
    positive: true,
    initials: "T2",
    badgeClass: "bg-zinc-500/15 text-zinc-300",
    logo: "/icons/platforms/trading212.png",
  },
  {
    time: "Yesterday",
    merchant: "Starbucks",
    description: "Coffee & Snacks",
    amount: "-£4.70",
    positive: false,
    initials: "S",
    badgeClass: "bg-emerald-500/15 text-emerald-400",
  },
];

type RecentActivityProps = {
  activities?: ActivityItem[];
  period?: string;
};

export default function RecentActivity({
  activities = MOCK_ACTIVITY,
  period = "Today",
}: RecentActivityProps) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8"
    >
      <EdgeGlow />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-50">
            Recent Activity
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Your latest transactions across all accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="text-sm font-medium text-accent transition-colors duration-300 ease-out hover:text-zinc-50"
          >
            View all →
          </a>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300">
            {period}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-3 w-3"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>

      <div className="relative mt-5 flex flex-col divide-y divide-white/5">
        {activities.map((item, index) => (
          <div
            key={`${item.merchant}-${index}`}
            className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
          >
            <span className="w-14 shrink-0 text-xs text-zinc-500">
              {item.time}
            </span>

            {item.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.logo}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full bg-white/10 object-cover"
              />
            ) : (
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${item.badgeClass}`}
              >
                {item.initials}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-50">
                {item.merchant}
              </p>
              <p className="text-xs text-zinc-500">{item.description}</p>
            </div>

            <span
              className={`shrink-0 text-sm font-semibold whitespace-nowrap ${
                item.positive ? "text-accent" : "text-zinc-50"
              }`}
            >
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
