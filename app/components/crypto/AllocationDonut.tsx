"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export type AllocationSlice = { symbol: string; name: string; value: number; pct: number; color: string };

export default function AllocationDonut({ slices, total }: { slices: AllocationSlice[]; total: number }) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLElement>();

  return (
    <section
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group glass-edge-card relative rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px]"
    >
      <EdgeGlow />
      <h3 className="text-sm font-semibold text-zinc-50">Portfolio Allocation</h3>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={62}
                paddingAngle={2}
                stroke="none"
                isAnimationActive
                animationDuration={700}
              >
                {slices.map((slice) => (
                  <Cell key={slice.symbol} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-semibold text-zinc-50">{formatGBP(total)}</span>
            <span className="text-[11px] text-zinc-500">Total Value</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {slices.map((slice) => (
            <div key={slice.symbol} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                {slice.name}
              </span>
              <span className="font-medium text-zinc-300">{slice.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
