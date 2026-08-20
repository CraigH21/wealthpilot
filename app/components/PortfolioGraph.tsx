"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type ActiveDotProps,
  type TooltipContentProps,
} from "recharts";

type Range = "1D" | "1W" | "1M" | "1Y";

const RANGES: Range[] = ["1D", "1W", "1M", "1Y"];

type Point = { label: string; value: number };

const DATA: Record<Range, Point[]> = {
  "1D": [
    { label: "00:00", value: 181200 },
    { label: "02:00", value: 181800 },
    { label: "04:00", value: 180950 },
    { label: "06:00", value: 182400 },
    { label: "08:00", value: 183100 },
    { label: "10:00", value: 182700 },
    { label: "12:00", value: 183600 },
    { label: "14:00", value: 184100 },
    { label: "16:00", value: 183800 },
    { label: "18:00", value: 184500 },
    { label: "20:00", value: 183950 },
    { label: "22:00", value: 184320 },
  ],
  "1W": [
    { label: "Mon", value: 174200 },
    { label: "Tue", value: 176800 },
    { label: "Wed", value: 175400 },
    { label: "Thu", value: 178900 },
    { label: "Fri", value: 180200 },
    { label: "Sat", value: 179650 },
    { label: "Sun", value: 184320 },
  ],
  "1M": [
    { label: "Wk 1", value: 168500 },
    { label: "Wk 2", value: 171200 },
    { label: "Wk 3", value: 174800 },
    { label: "Wk 4", value: 176300 },
    { label: "Wk 5", value: 179900 },
    { label: "Today", value: 184320 },
  ],
  "1Y": [
    { label: "Sep", value: 142000 },
    { label: "Oct", value: 148500 },
    { label: "Nov", value: 151200 },
    { label: "Dec", value: 155800 },
    { label: "Jan", value: 159400 },
    { label: "Feb", value: 162100 },
    { label: "Mar", value: 165700 },
    { label: "Apr", value: 169800 },
    { label: "May", value: 172300 },
    { label: "Jun", value: 176900 },
    { label: "Jul", value: 180100 },
    { label: "Aug", value: 184320 },
  ],
};

const formatValue = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

// A single soft glow on the line path itself, scoped to just
// `.recharts-area-curve` — applying `filter` any higher up would blur the
// filled area too and produce a ghost duplicate of the line. Stick to one
// drop-shadow layer: chaining a second one produced a visible ghost on the
// steeper segments of the 1Y curve.
const LINE_GLOW =
  "[&_.recharts-area-curve]:[filter:drop-shadow(0_0_10px_var(--accent-glow))]";

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-accent-border bg-white/10 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_var(--accent-glow)] backdrop-blur-xl">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-300/80">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-white">
        {formatValue(Number(payload[0].value))}
      </p>
    </div>
  );
}

// A small glowing marker rendered only on hover — nothing shown at rest.
function GlowDot({ cx, cy }: ActiveDotProps) {
  if (cx == null || cy == null) return null;

  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="var(--accent)" fillOpacity={0.25} />
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill="var(--accent)"
        stroke="#09090b"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default function PortfolioGraph() {
  const [range, setRange] = useState<Range>("1M");
  const data = DATA[range];

  return (
    <div className="mt-8">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500">
          Portfolio Performance
        </span>

        <div className="flex -translate-y-3 items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          {RANGES.map((option) => {
            const active = option === range;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ease-out ${
                  active
                    ? "bg-accent-soft text-accent shadow-[0_0_14px_var(--accent-glow)]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative h-[315px] w-full overflow-hidden rounded-2xl bg-transparent">
        <div className={`h-full w-full ${LINE_GLOW}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              key={range}
              data={data}
              margin={{ top: 16, right: 8, left: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.55} />
                  <stop offset="55%" stopColor="var(--accent)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" hide />
              <YAxis hide domain={["dataMin - 4000", "dataMax + 4000"]} />
              <Tooltip content={CustomTooltip} cursor={false} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--accent)"
                strokeWidth={2.5}
                fill="url(#portfolioFill)"
                fillOpacity={1}
                dot={false}
                activeDot={GlowDot}
                isAnimationActive
                animationDuration={700}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
