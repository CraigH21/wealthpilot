import type { Goal, PortfolioContext } from "../mock/portfolioContext";

/**
 * Shared portfolio-reading helpers — used by the mock engine's report
 * builders and by generateWealthBriefing, so the two never compute the same
 * fact (e.g. "is crypto over-concentrated?") two different ways.
 */

export const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export const RECOMMEND_ISA_TOP_UP =
  "Increase ISA contributions by £50/month to stay ahead of your Emergency Fund goal.";

export const TARGET_ALLOCATION_BY_RISK_PROFILE: Record<PortfolioContext["riskProfile"], Record<string, number>> = {
  Conservative: { Crypto: 10, Stocks: 15, ETFs: 25, Cash: 25, Pension: 25 },
  Moderate: { Crypto: 15, Stocks: 20, ETFs: 25, Cash: 15, Pension: 25 },
  Aggressive: { Crypto: 30, Stocks: 25, ETFs: 20, Cash: 5, Pension: 20 },
};

export function getCrypto(context: PortfolioContext) {
  return context.holdings.find((h) => h.category === "Crypto");
}

export function getEmergencyFund(context: PortfolioContext): Goal | undefined {
  return context.goals.find((g) => g.id === "emergency-fund");
}

export function getGoalProgressPct(goal: { currentAmount: number; targetAmount: number } | undefined) {
  return goal ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
}

export function computeRiskAlert(context: PortfolioContext): string | null {
  const crypto = getCrypto(context);
  const target = TARGET_ALLOCATION_BY_RISK_PROFILE[context.riskProfile]?.Crypto ?? 20;
  if (crypto && crypto.allocationPct > target) {
    return `Crypto exposure is ${crypto.allocationPct}%, above your ${target}% target for a ${context.riskProfile.toLowerCase()} risk profile.`;
  }
  return null;
}

export function getBiggestWinner(context: PortfolioContext) {
  return context.holdings.reduce((best, holding) => (holding.changePct > best.changePct ? holding : best));
}
