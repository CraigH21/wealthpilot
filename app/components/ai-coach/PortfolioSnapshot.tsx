"use client";

import type { ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";
import { getHealthStatus, type PortfolioContext } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

function SnapshotCard({ children }: { children: ReactNode }) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />
      {children}
    </div>
  );
}

export default function PortfolioSnapshot({
  context,
}: {
  context: PortfolioContext;
}) {
  const goal = context.goals[0];
  const goalPct = goal
    ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
    : 0;

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col gap-4 overflow-y-auto">
      <SnapshotCard>
        <p className="text-xs font-medium text-zinc-500">Net Worth</p>
        <p className="mt-1.5 text-2xl font-semibold text-zinc-50">
          {formatGBP(context.netWorth)}
        </p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent">
          +{context.netWorthChangePct}% this month
        </span>
      </SnapshotCard>

      <SnapshotCard>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">Portfolio Health</p>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
            {getHealthStatus(context.healthScore)}
          </span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-zinc-50">
            {context.healthScore}
          </span>
          <span className="text-xs text-zinc-500">/ 100</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${context.healthScore}%` }}
          />
        </div>
      </SnapshotCard>

      <SnapshotCard>
        <p className="text-xs font-medium text-zinc-500">Asset Allocation</p>
        <div className="mt-2 flex items-center gap-4">
          <div className="h-24 w-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={context.holdings}
                  dataKey="allocationPct"
                  nameKey="name"
                  innerRadius={28}
                  outerRadius={44}
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive
                  animationDuration={700}
                >
                  {context.holdings.map((holding) => (
                    <Cell key={holding.id} fill={holding.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            {context.holdings.map((holding) => (
              <div
                key={holding.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: holding.color }}
                  />
                  {holding.name}
                </span>
                <span className="font-medium text-zinc-300">
                  {holding.allocationPct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </SnapshotCard>

      {goal && (
        <SnapshotCard>
          <p className="text-xs font-medium text-zinc-500">Active Goal</p>
          <p className="mt-1 text-sm font-semibold text-zinc-50">{goal.name}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              {formatGBP(goal.currentAmount)} / {formatGBP(goal.targetAmount)}
            </span>
            <span className="font-medium text-accent">{goalPct}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-sky-400 transition-all duration-500 ease-out"
              style={{ width: `${goalPct}%` }}
            />
          </div>
        </SnapshotCard>
      )}

      <SnapshotCard>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500">Connected Accounts</p>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
            {context.connectedAccounts.length} Connected
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {context.connectedAccounts.map((account) => (
            <div key={account.id} className="flex items-center gap-2.5">
              {account.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={account.logo}
                  alt=""
                  className="h-6 w-6 shrink-0 rounded-full bg-white/10 object-cover"
                />
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-500/10 text-[10px] font-semibold text-zinc-300">
                  {account.name[0]}
                </span>
              )}
              <span className="flex-1 truncate text-sm text-zinc-300">
                {account.name}
              </span>
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  account.status === "connected" ? "bg-accent" : "bg-amber-400"
                }`}
              />
            </div>
          ))}
        </div>
      </SnapshotCard>
    </aside>
  );
}
