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
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Deliberately not random — the same fixed offsets every time, scaled to a
// small fraction of the underlying trend, so the 1D view doesn't look like a
// perfectly straight ramp between two anchor points but stays reproducible.
// This is the one range that stays synthetic even with real daily history:
// a single balance-per-day feed has no intraday shape to show, so until
// there's a real intraday data source this fakes one from today vs
// yesterday's real closes.
const WOBBLE = [0.1, -0.3, 0.5, -0.15, 0.35, -0.2, 0.25, -0.1, 0.4, -0.25, 0.15, 0];

const DAYS_BACK: Partial<Record<Range, number>> = { "1W": 7, "1M": 30 };

function formatLabel(dateStr: string, range: Range): string {
  const date = new Date(dateStr);
  if (range === "1W") return WEEKDAY_LABELS[date.getDay()];
  if (range === "1M") return `${date.getDate()} ${MONTH_LABELS[date.getMonth()]}`;
  return MONTH_LABELS[date.getMonth()];
}

/** Collapses real daily points down to one per calendar month (the last
 * real value seen in that month), so 1Y/ALL draw a clean line straight
 * between real month values instead of tracing every day's wobble — and
 * every label sits exactly on the point it names, instead of landing
 * wherever thinned tick spacing happens to fall. */
function aggregateByMonth(history: NetWorthPoint[]): Point[] {
  const lastInMonth = new Map<string, NetWorthPoint>();
  for (const point of history) {
    lastInMonth.set(point.date.slice(0, 7), point); // chronological input, so last write wins
  }
  return Array.from(lastInMonth.values()).map((point) => ({
    label: MONTH_LABELS[new Date(point.date).getMonth()],
    value: point.value,
  }));
}

/** Derives every range from real, dated history points — `history` is
 * expected to carry one entry per real calendar day (see
 * `expandToDaily` in `portfolioContext.ts`). 1W/1M slice the real trailing
 * window at full daily resolution; 1Y/ALL aggregate to one point per month
 * so long ranges stay readable. Only 1D is still fabricated, since
 * daily-granularity data has no intraday shape to slice — swap in a real
 * intraday feed later and that branch can go. */
function deriveRangeData(history: NetWorthPoint[], range: Range): Point[] {
  if (history.length === 0) return [];

  const today = history[history.length - 1];

  if (range === "1D") {
    const yesterday = history[history.length - 2] ?? today;
    const totalMove = today.value - yesterday.value;
    const points = 12;
    return Array.from({ length: points }, (_, i) => {
      const isLast = i === points - 1;
      const progress = (i + 1) / points;
      const trendValue = yesterday.value + totalMove * progress;
      const wobble = isLast ? 0 : WOBBLE[i % WOBBLE.length] * Math.abs(totalMove || today.value * 0.01) * 0.15;
      return {
        label: `${String(i * 2).padStart(2, "0")}:00`,
        value: Math.round(isLast ? today.value : trendValue + wobble),
      };
    });
  }

  if (range === "ALL") {
    return aggregateByMonth(history);
  }

  if (range === "1Y") {
    const cutoff = new Date(today.date);
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    return aggregateByMonth(history.filter((point) => new Date(point.date) >= cutoff));
  }

  const daysBack = DAYS_BACK[range]!;
  const cutoff = new Date(today.date);
  cutoff.setDate(cutoff.getDate() - daysBack);
  const sliced = history.filter((point) => new Date(point.date) >= cutoff);

  return sliced.map((point) => ({ label: formatLabel(point.date, range), value: point.value }));
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
    <div className="rounded-2xl border border-accent-border bg-white/90 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.15),0_0_20px_var(--accent-glow)] backdrop-blur-xl">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600/80">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-zinc-900">
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
  // Keep roughly 6-7 x-axis labels regardless of how many real days a range
  // slices in — 1D/1W stay fully labelled, 1M/1Y/ALL thin out instead of
  // overlapping as real daily history grows.
  const tickInterval = Math.max(0, Math.ceil(data.length / 6) - 1);
  // Scale Y-axis padding to the data's own spread instead of a flat amount —
  // a flat ±4000 padding produced colliding rounded labels (e.g. two "187K"
  // ticks) once 1D's real range got much tighter than the fabricated one.
  const values = data.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const yPadding = Math.max((maxValue - minValue) * 0.3, 1500);

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
              stroke="rgba(0,0,0,0.08)"
            />
            <XAxis
              dataKey="label"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval={tickInterval}
            />
            <YAxis
              domain={[minValue - yPadding, maxValue + yPadding]}
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
