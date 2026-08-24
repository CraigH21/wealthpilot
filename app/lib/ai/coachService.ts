import { type PortfolioContext } from "../mock/portfolioContext";
import { activeEngine } from "./engine";
import {
  computeRiskAlert,
  getBiggestWinner,
  getEmergencyFund,
  getGoalProgressPct,
  RECOMMEND_ISA_TOP_UP,
} from "./contextHelpers";
import type { CoachHistoryTurn, CoachInsight, WealthBriefing } from "./types";

export type {
  BreakdownRow,
  CoachHistoryTurn,
  CoachInsight,
  CoachReport,
  CoachTopic,
  RiskOrOpportunity,
  WealthBriefing,
} from "./types";

type CoachInput = {
  message?: string;
  context: PortfolioContext;
  history?: CoachHistoryTurn[];
};

/**
 * Public entry point for the AI Coach — this signature is the stable
 * contract every caller (the chat page's /api/ai-coach route, the dashboard
 * card) depends on. What actually generates the answer is delegated to
 * `activeEngine`, so swapping the mock engine for a real model later never
 * touches this function or anything that calls it.
 */
export async function generateCoachInsight({
  message,
  context,
  history = [],
}: CoachInput): Promise<CoachInsight> {
  return activeEngine.generate({ message, context, history });
}

/**
 * A standing daily summary shown before any conversation starts. Not part
 * of the conversational engine contract (no message/history involved), so
 * it reads context directly rather than going through `activeEngine` — but
 * shares the same helpers the engine's report builders use, so the two
 * never disagree.
 */
export async function generateWealthBriefing(context: PortfolioContext): Promise<WealthBriefing> {
  const emergencyFund = getEmergencyFund(context);
  const winner = getBiggestWinner(context);

  return {
    netWorthChangeAbs: context.weeklyChangeAbs,
    netWorthChangePct: context.netWorthChangePct,
    biggestWinner: { name: winner.name, changePct: winner.changePct },
    biggestRisk: computeRiskAlert(context) ?? "No major concentration risk right now.",
    goal: emergencyFund
      ? {
          name: emergencyFund.name,
          currentAmount: emergencyFund.currentAmount,
          targetAmount: emergencyFund.targetAmount,
          progressPct: getGoalProgressPct(emergencyFund),
        }
      : null,
    recommendation: RECOMMEND_ISA_TOP_UP,
  };
}
