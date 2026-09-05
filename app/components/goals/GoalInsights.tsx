import Link from "next/link";
import type { ReactNode } from "react";
import EdgeGlow from "../EdgeGlow";
import { calculateGoalProjection } from "../../lib/ai/calculators";
import { planGoal, GOALS_TODAY } from "../../lib/goals/planning";
import type { Goal } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

type InsightIconKey = "bulb" | "boost" | "star";
type Insight = { icon: InsightIconKey; title: string; body: ReactNode; tone: "accent" | "sky" | "amber" };

const ICONS: Record<InsightIconKey, ReactNode> = {
  bulb: <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.5.4.8 1 .8 1.7v.6h6.4v-.6c0-.7.3-1.3.8-1.7A7 7 0 0012 2z" />,
  boost: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
  star: <path d="M12 2l3 6.6 7 .9-5.2 4.9L18.2 21 12 17.3 5.8 21 7.2 14.4 2 9.5l7-.9L12 2z" />,
};

const TONE: Record<Insight["tone"], string> = {
  accent: "bg-accent-soft text-accent",
  sky: "bg-sky-500/10 text-sky-400",
  amber: "bg-amber-500/10 text-amber-400",
};

/** Builds three insight cards straight from each goal's real plan (see
 * planGoal) instead of static copy — a behind goal always yields a concrete
 * "save £X more" figure, a healthy goal gets a top-up projection, and the
 * praise always names whichever goal is genuinely furthest ahead. */
function buildInsights(goals: Goal[]): Insight[] {
  const plans = goals.map((goal) => ({ goal, plan: planGoal(goal) }));

  const behind = [...plans]
    .filter((p) => p.plan.status === "Slightly behind")
    .sort((a, b) => a.plan.remaining / a.plan.monthsUntilDeadline - b.plan.remaining / b.plan.monthsUntilDeadline)[0];

  const boostCandidate = [...plans]
    .filter((p) => p.plan.status !== "Slightly behind")
    .sort((a, b) => b.plan.remaining - a.plan.remaining)[0];

  const monthsAheadOf = (p: (typeof plans)[number]) => p.plan.monthsUntilDeadline - p.plan.monthsAtCurrentPace;
  const ahead = [...plans]
    .filter((p) => p.plan.status === "Ahead of plan")
    .sort((a, b) => monthsAheadOf(b) - monthsAheadOf(a))[0];

  const insights: Insight[] = [];

  if (behind) {
    const requiredMonthly = behind.plan.remaining / behind.plan.monthsUntilDeadline;
    const extra = Math.max(1, Math.ceil(requiredMonthly - behind.goal.monthlyContribution));
    insights.push({
      icon: "bulb",
      title: `Save ${formatGBP(extra)} more`,
      tone: "accent",
      body: (
        <>
          per month<br />
          <span className="text-zinc-500">
            You could finish your {behind.goal.name} on time by adding {formatGBP(extra)}/month.
          </span>
        </>
      ),
    });
  }

  if (boostCandidate) {
    const topUp = 150;
    const projection = calculateGoalProjection({
      targetAmount: boostCandidate.goal.targetAmount,
      currentAmount: boostCandidate.goal.currentAmount,
      currentContribution: boostCandidate.goal.monthlyContribution,
      newContribution: boostCandidate.goal.monthlyContribution + topUp,
      now: GOALS_TODAY,
    });
    insights.push({
      icon: "boost",
      title: `Boost your ${boostCandidate.goal.name}`,
      tone: "sky",
      body: (
        <>
          progress<br />
          <span className="text-zinc-500">
            An extra {formatGBP(topUp)}/month could get you there {projection.monthsSaved} months sooner.
          </span>
        </>
      ),
    });
  }

  if (ahead) {
    const monthsAhead = ahead.plan.monthsUntilDeadline - ahead.plan.monthsAtCurrentPace;
    insights.push({
      icon: "star",
      title: "You're doing great!",
      tone: "amber",
      body: (
        <>
          <span className="text-zinc-500">
            You&rsquo;re {monthsAhead} {monthsAhead === 1 ? "month" : "months"} ahead of plan on your {ahead.goal.name}. Keep up the momentum!
          </span>
        </>
      ),
    });
  }

  return insights;
}

export default function GoalInsights({ goals }: { goals: Goal[] }) {
  const insights = buildInsights(goals);

  return (
    <div className="glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <EdgeGlow />
      <h2 className="relative text-base font-semibold text-zinc-900">AI Goal Insights</h2>
      <p className="relative mt-1 text-sm text-zinc-600">Actionable insights to help you reach your goals faster</p>

      <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {insights.map((insight) => (
          <div key={insight.title} className="flex flex-col rounded-2xl border border-black/10 bg-black/5 p-4">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${TONE[insight.tone]}`}>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                {ICONS[insight.icon]}
              </svg>
            </span>
            <p className="mt-2.5 text-sm font-semibold text-zinc-900">{insight.title}</p>
            <p className="mt-1 flex-1 text-xs leading-relaxed">{insight.body}</p>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/ai-coach"
        className="relative mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent transition-transform duration-300 ease-out hover:-translate-y-[1px]"
      >
        Ask AI Coach About Your Goals
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
