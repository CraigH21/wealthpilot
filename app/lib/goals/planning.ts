import { calculateGoalProjection } from "../ai/calculators";
import type { Goal } from "../mock/portfolioContext";

export type GoalStatus = "Ahead of plan" | "On track" | "Slightly behind";

export type GoalPlan = {
  progressPct: number;
  remaining: number;
  monthsAtCurrentPace: number;
  /** Projected completion date at the current monthly contribution — not
   * the goal's own deadline, which is only used to derive `status` below. */
  estimatedCompletion: string;
  monthsUntilDeadline: number;
  status: GoalStatus;
};

/** "Today" is fixed to the same date the rest of the mock portfolio data
 * treats as current (transactions stop partway through August 2026), so
 * every goal projection here stays reproducible rather than drifting with
 * the real clock. */
export const GOALS_TODAY = new Date(2026, 7, 24);

function monthsBetween(from: Date, to: Date): number {
  const months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  return Math.max(1, to.getDate() < from.getDate() ? months - 1 : months);
}

/** Compares how long a goal will actually take at its current contribution
 * against how long it has left until its own deadline — the same
 * {target, current, monthly} triple `calculateGoalProjection` already
 * knows how to project, just read against a second, deadline-shaped clock. */
export function planGoal(goal: Goal, now: Date = GOALS_TODAY): GoalPlan {
  const progressPct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const projection = calculateGoalProjection({
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    currentContribution: goal.monthlyContribution,
    now,
  });
  const monthsUntilDeadline = monthsBetween(now, new Date(goal.targetDate));

  let status: GoalStatus;
  if (!Number.isFinite(projection.monthsAtCurrentPace)) {
    status = "Slightly behind";
  } else if (projection.monthsAtCurrentPace <= monthsUntilDeadline * 0.9) {
    status = "Ahead of plan";
  } else if (projection.monthsAtCurrentPace <= monthsUntilDeadline * 1.1) {
    status = "On track";
  } else {
    status = "Slightly behind";
  }

  return {
    progressPct,
    remaining: projection.remaining,
    monthsAtCurrentPace: projection.monthsAtCurrentPace,
    estimatedCompletion: projection.currentCompletionDate,
    monthsUntilDeadline,
    status,
  };
}
