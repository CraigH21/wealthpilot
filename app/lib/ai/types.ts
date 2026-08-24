import type { PortfolioContext } from "../mock/portfolioContext";

export type CoachTopic =
  | "portfolioReview"
  | "holiday"
  | "invest"
  | "spending"
  | "goal"
  | "risk"
  | "accounts"
  | "general";

export type BreakdownRow = { label: string; value: string };
export type RiskOrOpportunity = { type: "risk" | "opportunity"; text: string };

export type CoachReport = {
  directAnswer: string;
  why: string;
  breakdown: BreakdownRow[];
  recommendation: string;
  riskOrOpportunity: RiskOrOpportunity;
};

export type CoachInsight = {
  topic: CoachTopic;
  report: CoachReport;
  healthScore: number;
  healthStatus: string;
  mainInsight: string;
  recommendation: string;
  riskAlert: string | null;
};

export type WealthBriefing = {
  netWorthChangeAbs: number;
  netWorthChangePct: number;
  biggestWinner: { name: string; changePct: number };
  biggestRisk: string;
  goal: { name: string; currentAmount: number; targetAmount: number; progressPct: number } | null;
  recommendation: string;
};

/** One turn of prior conversation, as much as the AI engine needs to see —
 * deliberately decoupled from the UI's ChatMessage shape (which also carries
 * React keys etc.) so the engine boundary stays stable independent of UI
 * shape or which engine (mock, OpenAI, anything else) is behind it. */
export type CoachHistoryTurn = {
  role: "user" | "assistant";
  text: string;
  topic?: CoachTopic;
};

export type EngineInput = {
  message?: string;
  context: PortfolioContext;
  history: CoachHistoryTurn[];
};

/**
 * The one contract every AI engine implementation must satisfy — today
 * that's `mockEngine` (local rules, no network calls); later it could be an
 * `openaiEngine` that calls a real model with these same tools/context.
 * Nothing outside `app/lib/ai/engine/` and `app/api/ai-coach/` should ever
 * need to know which one is active.
 */
export interface AIEngine {
  generate(input: EngineInput): Promise<CoachInsight>;
}
