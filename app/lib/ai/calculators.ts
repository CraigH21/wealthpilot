/**
 * Pure financial calculators used by coachService.ts. No copywriting or
 * portfolio-context reading here — these take plain numbers in and return
 * plain numbers/booleans out, so they're trivially testable and reusable
 * regardless of what generates the numbers (mock rules today, an LLM tool
 * call later).
 */

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export type GoalProjection = {
  remaining: number;
  monthsAtCurrentPace: number;
  currentCompletionDate: string;
  monthsAtNewPace: number | null;
  newCompletionDate: string | null;
  monthsSaved: number | null;
};

/** Projects any savings goal forward — not specific to the Emergency Fund,
 * works for any {target, current, monthly contribution} triple. */
export function calculateGoalProjection({
  targetAmount,
  currentAmount,
  currentContribution,
  newContribution,
  now = new Date(),
}: {
  targetAmount: number;
  currentAmount: number;
  currentContribution: number;
  newContribution?: number | null;
  now?: Date;
}): GoalProjection {
  const remaining = Math.max(targetAmount - currentAmount, 0);
  const monthsAtCurrentPace =
    currentContribution > 0 ? Math.ceil(remaining / currentContribution) : Infinity;
  const currentCompletionDate = formatMonthYear(addMonths(now, monthsAtCurrentPace));

  if (!newContribution || newContribution <= 0) {
    return {
      remaining,
      monthsAtCurrentPace,
      currentCompletionDate,
      monthsAtNewPace: null,
      newCompletionDate: null,
      monthsSaved: null,
    };
  }

  const monthsAtNewPace = Math.ceil(remaining / newContribution);
  const newCompletionDate = formatMonthYear(addMonths(now, monthsAtNewPace));
  const monthsSaved = Math.max(monthsAtCurrentPace - monthsAtNewPace, 0);

  return {
    remaining,
    monthsAtCurrentPace,
    currentCompletionDate,
    monthsAtNewPace,
    newCompletionDate,
    monthsSaved,
  };
}

export type AffordabilityResult = {
  canAfford: boolean;
  remainingCash: number;
  monthsOfBufferAfter: number;
  monthsToRebuildSurplus: number;
};

export function calculateAffordability({
  cashBalance,
  monthlyIncome,
  monthlyExpenses,
  purchaseAmount,
}: {
  cashBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  purchaseAmount: number;
}): AffordabilityResult {
  const remainingCash = cashBalance - purchaseAmount;
  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const monthsOfBufferAfter =
    monthlyExpenses > 0 ? Math.round((remainingCash / monthlyExpenses) * 10) / 10 : 0;
  // "Afford" means the purchase doesn't eat into the one-month essential-expenses buffer.
  const canAfford = remainingCash >= monthlyExpenses;
  const monthsToRebuildSurplus =
    monthlySurplus > 0 ? Math.ceil(purchaseAmount / monthlySurplus) : Infinity;

  return { canAfford, remainingCash, monthsOfBufferAfter, monthsToRebuildSurplus };
}

/**
 * Turns a handful of portfolio signals into a single 0-100 health score,
 * so the number shown everywhere (dashboard card, AI Coach, snapshot) is
 * genuinely computed from the underlying data rather than a fixed constant.
 * Weights are deliberately simple and inspectable: diversification and
 * savings rate matter most, emergency-fund progress and net-worth trend
 * matter somewhat less.
 */
export function calculatePortfolioHealthScore({
  diversificationScore,
  savingsRatePct,
  emergencyFundProgressPct,
  netWorthTrendPct,
}: {
  diversificationScore: number;
  savingsRatePct: number;
  emergencyFundProgressPct: number;
  netWorthTrendPct: number;
}): number {
  const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

  const savingsScore = clamp(savingsRatePct * 2.5); // a 40% savings rate maxes this out
  const trendScore = clamp(50 + netWorthTrendPct * 5); // flat month = 50, +10% month = 100

  const score =
    diversificationScore * 0.3 +
    savingsScore * 0.3 +
    clamp(emergencyFundProgressPct) * 0.2 +
    trendScore * 0.2;

  return Math.round(clamp(score));
}

export type InvestmentSplitResult = {
  isaAmount: number;
  goalAmount: number;
  cashAmount: number;
  newGoalProgressPct: number;
};

export function calculateInvestmentSplit({
  totalAmount,
  goalCurrentAmount,
  goalTargetAmount,
  isaShare = 0.6,
  goalShare = 0.3,
}: {
  totalAmount: number;
  goalCurrentAmount: number;
  goalTargetAmount: number;
  isaShare?: number;
  goalShare?: number;
}): InvestmentSplitResult {
  const isaAmount = Math.round(totalAmount * isaShare);
  const goalAmount = Math.round(totalAmount * goalShare);
  const cashAmount = totalAmount - isaAmount - goalAmount;
  const newGoalProgressPct =
    goalTargetAmount > 0
      ? Math.round(((goalCurrentAmount + goalAmount) / goalTargetAmount) * 100)
      : 0;

  return { isaAmount, goalAmount, cashAmount, newGoalProgressPct };
}

export type SpendingSummary = {
  surplus: number;
  savingsRatePct: number;
  monthsToCloseGoal: number | null;
};

export function calculateSpendingSummary({
  monthlyIncome,
  monthlyExpenses,
  goalRemaining,
}: {
  monthlyIncome: number;
  monthlyExpenses: number;
  goalRemaining?: number;
}): SpendingSummary {
  const surplus = monthlyIncome - monthlyExpenses;
  const savingsRatePct = monthlyIncome > 0 ? Math.round((surplus / monthlyIncome) * 100) : 0;
  const monthsToCloseGoal =
    goalRemaining != null && surplus > 0 ? Math.ceil(goalRemaining / surplus) : null;

  return { surplus, savingsRatePct, monthsToCloseGoal };
}

export type AllocationBreakdownRow = {
  name: string;
  value: number;
  actualPct: number;
  targetPct: number;
  overTarget: boolean;
};

export type PortfolioAllocationResult = {
  breakdown: AllocationBreakdownRow[];
  concentrationWarnings: string[];
  diversificationScore: number;
};

export function calculatePortfolioAllocation({
  assets,
  targets,
}: {
  assets: { name: string; value: number }[];
  targets: Record<string, number>;
}): PortfolioAllocationResult {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const breakdown: AllocationBreakdownRow[] = assets.map((asset) => {
    const actualPct = totalValue > 0 ? Math.round((asset.value / totalValue) * 1000) / 10 : 0;
    const targetPct = targets[asset.name] ?? 0;
    return { name: asset.name, value: asset.value, actualPct, targetPct, overTarget: actualPct > targetPct };
  });

  const concentrationWarnings = breakdown
    .filter((row) => row.overTarget)
    .map((row) => `${row.name} is ${row.actualPct}% of your portfolio, above your ${row.targetPct}% target.`);

  // Simple, explainable score: start at 100 and penalise however far the
  // largest holding sits above an even split across all asset classes.
  const evenSplitPct = breakdown.length > 0 ? 100 / breakdown.length : 100;
  const maxPct = breakdown.length > 0 ? Math.max(...breakdown.map((row) => row.actualPct)) : 0;
  const diversificationScore = Math.max(0, Math.round(100 - (maxPct - evenSplitPct)));

  return { breakdown, concentrationWarnings, diversificationScore };
}
