"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type ActiveDotProps,
  type TooltipContentProps,
} from "recharts";
import type { NetWorthPoint } from "../lib/mock/portfolioContext";

export type Range = "1D" | "1W" | "1M" | "1Y" | "ALL";

export const RANGES: Range[] = ["1D", "1W", "1M", "1Y", "ALL"];

type Point = { label: string; value: number };

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Deliberately not random — the same fixed offsets every time, scaled to a
// small fraction of the underlying trend, so short ranges don't look like a
// perfectly straight ramp between two anchor points but stay reproducible.
const WOBBLE = [0.1, -0.3, 0.5, -0.15, 0.35, -0.2, 0.25, -0.1, 0.4, -0.25, 0.15, 0];

/** Derives every range from the real net-worth history (six real monthly
 * anchor points) instead of five disconnected hardcoded arrays. 1Y/ALL use
 * the anchors directly; 1M interpolates between the last two; 1D/1W extend
 * that same trend into a short run with a small fixed wobble, always ending
 * exactly on the current net worth. */
function deriveRangeData(history: NetWorthPoint[], range: Range): Point[] {
  if (history.length === 0) return [];

  if (range === "ALL" || range === "1Y") {
    return history.map((point) => ({
      label: MONTH_LABELS[new Date(point.date).getMonth()],
      value: point.value,
    }));
  }

  const last = history[history.length - 1].value;
  const prev = history[history.length - 2]?.value ?? last;
  const totalMove = last - prev;

  if (range === "1M") {
    const steps = 5;
    return Array.from({ length: steps + 1 }, (_, i) => ({
      label: i === steps ? "Today" : `Wk ${i + 1}`,
      value: Math.round(prev + (totalMove * i) / steps),
    }));
  }

  const isWeek = range === "1W";
  const points = isWeek ? 7 : 12;
  const labels = isWeek
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2, "0")}:00`);

  return Array.from({ length: points }, (_, i) => {
    const isLast = i === points - 1;
    const progress = (i + 1) / points;
    const trendValue = prev + totalMove * progress;
    const wobble = isLast ? 0 : WOBBLE[i % WOBBLE.length] * Math.abs(totalMove) * 0.15;
    return { label: labels[i], value: Math.round(isLast ? last : trendValue + wobble) };
  });
}

const formatValue = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

const formatAxisValue = (value: number) => `${Math.round(value / 1000)}K`;

const axisTick = { fill: "#71717a", fontSize: 11 };

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

export default function PortfolioGraph({ range, history }: { range: Range; history: NetWorthPoint[] }) {
  const data = deriveRangeData(history, range);

  return (
    <div className="relative mt-6 h-[280px] w-full overflow-hidden rounded-2xl bg-transparent">
      <div className={`h-full w-full ${LINE_GLOW}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            key={range}
            data={data}
            margin={{ top: 16, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.55} />
                <stop offset="55%" stopColor="var(--accent)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="rgba(255,255,255,0.08)"
            />
            <XAxis
              dataKey="label"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              domain={["dataMin - 4000", "dataMax + 4000"]}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatAxisValue}
              width={44}
            />
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
  );
}
