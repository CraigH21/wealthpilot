import EdgeGlow from "../EdgeGlow";
import { getGoalMeta, TONE_STYLE } from "../../lib/goals/meta";

export type ContributionRow = { id: string; name: string; monthlyContribution: number };

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

export default function MonthlyContributions({ goals }: { goals: ContributionRow[] }) {
  const total = goals.reduce((sum, g) => sum + g.monthlyContribution, 0);
  const maxAmount = Math.max(...goals.map((g) => g.monthlyContribution), 1);

  return (
    <div className="glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <EdgeGlow />
      <div className="relative flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Monthly Contributions</h2>
          <p className="mt-1 text-sm text-zinc-600">Where your money goes each month</p>
        </div>
        <p className="shrink-0 text-sm text-zinc-600">
          Total per month <span className="font-semibold text-zinc-900">{formatGBP(total)}</span>
        </p>
      </div>

      <div className="relative mt-5 flex flex-col gap-4">
        {goals.map((goal) => {
          const meta = getGoalMeta(goal.id);
          const tone = TONE_STYLE[meta.tone];
          const widthPct = Math.max(4, Math.round((goal.monthlyContribution / maxAmount) * 100));
          return (
            <div key={goal.id} className="flex items-center gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.bg}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  stroke={tone.hex}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {meta.icon}
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-zinc-700">{goal.name}</span>
                  <span className="shrink-0 text-zinc-500">{formatGBP(goal.monthlyContribution)}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${widthPct}%`, backgroundColor: tone.hex }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
