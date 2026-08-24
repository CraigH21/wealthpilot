import { getHealthStatus, type Goal, type PortfolioContext } from "../../mock/portfolioContext";
import {
  calculateAffordability,
  calculateGoalProjection,
  calculateInvestmentSplit,
  calculatePortfolioAllocation,
  calculateSpendingSummary,
} from "../calculators";
import {
  computeRiskAlert,
  formatGBP,
  getCrypto,
  getEmergencyFund,
  getGoalProgressPct,
  RECOMMEND_ISA_TOP_UP,
  TARGET_ALLOCATION_BY_RISK_PROFILE,
} from "../contextHelpers";
import type { AIEngine, CoachHistoryTurn, CoachReport, CoachTopic, EngineInput } from "../types";

const FOLLOW_UP_PHRASES = [
  "what if",
  "and if",
  "instead",
  "how about",
  "what about",
  "increase it to",
  "reduce it to",
  "increase to",
  "reduce to",
  "lower it to",
  "raise it to",
];

function matches(message: string, keywords: string[]) {
  const lower = message.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

function isFollowUpMessage(message: string) {
  return matches(message, FOLLOW_UP_PHRASES);
}

/** Pulls an amount out of free text — prefers a £-marked figure ("£1,500",
 * "£150") over a bare number, since a bare digit in a sentence is more often
 * incidental (a date, a count) than an amount the user actually means. */
function extractAmount(message: string): number | null {
  const cleaned = message.replace(/,/g, "");
  const currencyMatch = cleaned.match(/£\s?(\d+(?:\.\d+)?)/);
  if (currencyMatch) return Number(currencyMatch[1]);
  const bareMatch = cleaned.match(/\b(\d+(?:\.\d+)?)\b/);
  return bareMatch ? Number(bareMatch[1]) : null;
}

/**
 * Resolves "the number the user means" for whichever topic parameter is in
 * play — a holiday cost, an investment amount, a monthly contribution —
 * regardless of whether this is the first message on the topic or a
 * follow-up. Any amount found in the text is used; only silence falls back
 * to the topic's illustrative default. "add £150"/"increase by 150" reads
 * as a delta on top of the current value; "increase it to £150" or a bare
 * "£150" reads as the new absolute value.
 */
function resolveParameterAmount(message: string, currentValue: number, defaultValue: number): number {
  const amount = extractAmount(message);
  if (amount === null) return defaultValue;
  const lower = message.toLowerCase();
  const isDelta = /\b(add|increase by|more|extra)\b/.test(lower) && !/\bto\b/.test(lower);
  return isDelta ? currentValue + amount : amount;
}

// ---------------------------------------------------------------------------
// Topic report builders — each owns one financial "conversation topic" and
// can be called either fresh (from a keyword match) or as a follow-up
// continuation (with a raw message to pull an updated number out of).
// ---------------------------------------------------------------------------

function buildPortfolioReviewReport(context: PortfolioContext): CoachReport {
  const crypto = getCrypto(context);
  const riskAlert = computeRiskAlert(context);

  return {
    directAnswer: `Your portfolio is in great shape — health score is ${context.healthScore}/100 (${getHealthStatus(context.healthScore)}).`,
    why: `Net worth is up ${context.netWorthChangePct}% this month and ${formatGBP(context.weeklyChangeAbs)} this week, though ${crypto?.name ?? "crypto"} concentration is above target for your ${context.riskProfile.toLowerCase()} risk profile.`,
    breakdown: [
      { label: "Net worth", value: formatGBP(context.netWorth) },
      { label: "This week", value: `+${formatGBP(context.weeklyChangeAbs)}` },
      { label: "This month", value: `+${context.netWorthChangePct}%` },
      { label: `${crypto?.name ?? "Crypto"} allocation`, value: `${crypto?.allocationPct ?? 0}%` },
    ],
    recommendation: RECOMMEND_ISA_TOP_UP,
    riskOrOpportunity: riskAlert
      ? { type: "risk", text: riskAlert }
      : { type: "opportunity", text: "No major concentration risk right now — a good time to keep contributing steadily." },
  };
}

function buildHolidayReport(context: PortfolioContext, message: string): CoachReport {
  const defaultCost = 1500;
  const holidayCost = resolveParameterAmount(message, defaultCost, defaultCost);

  const result = calculateAffordability({
    cashBalance: context.cash,
    monthlyIncome: context.monthlyIncome,
    monthlyExpenses: context.monthlySpending,
    purchaseAmount: holidayCost,
  });

  return {
    directAnswer: result.canAfford
      ? `Yes — you can comfortably afford a ${formatGBP(holidayCost)} holiday.`
      : `Not quite comfortably — a ${formatGBP(holidayCost)} holiday would eat into your essential-expenses buffer.`,
    why: result.canAfford
      ? `You're holding ${formatGBP(context.cash)} in cash. After booking you'd still have ${formatGBP(result.remainingCash)} left — about ${result.monthsOfBufferAfter} months of essential expenses in reserve.`
      : `You're holding ${formatGBP(context.cash)} in cash, but spending ${formatGBP(holidayCost)} would leave only ${formatGBP(result.remainingCash)} — under one month's essential expenses.`,
    breakdown: [
      { label: "Cash available", value: formatGBP(context.cash) },
      { label: "Holiday cost", value: formatGBP(holidayCost) },
      { label: "Remaining after", value: formatGBP(result.remainingCash) },
      { label: "Buffer after (months)", value: `${result.monthsOfBufferAfter}` },
    ],
    recommendation: result.canAfford
      ? "Book it from your cash buffer, not your ISA — keep your invested money compounding."
      : `Consider trimming the budget by ${formatGBP(holidayCost - (context.cash - context.monthlySpending))} to keep a full month's buffer intact.`,
    riskOrOpportunity: {
      type: "risk",
      text: "Keep at least one month of essential expenses in cash after booking.",
    },
  };
}

function buildInvestReport(context: PortfolioContext, message: string): CoachReport {
  const defaultAmount = 500;
  const totalToInvest = resolveParameterAmount(message, defaultAmount, defaultAmount);

  const emergencyFund = getEmergencyFund(context);
  const split = calculateInvestmentSplit({
    totalAmount: totalToInvest,
    goalCurrentAmount: emergencyFund?.currentAmount ?? 0,
    goalTargetAmount: emergencyFund?.targetAmount ?? 0,
  });

  return {
    directAnswer: `Split the ${formatGBP(totalToInvest)} three ways to close your allocation gap and boost your Emergency Fund.`,
    why: "Your portfolio is tilted toward crypto right now, so new contributions are the easiest way to rebalance without selling anything.",
    breakdown: [
      { label: "S&P 500 ETF", value: formatGBP(split.isaAmount) },
      { label: "Emergency Fund", value: formatGBP(split.goalAmount) },
      { label: "Cash buffer", value: formatGBP(split.cashAmount) },
      { label: "New Emergency Fund %", value: `${split.newGoalProgressPct}%` },
    ],
    recommendation: RECOMMEND_ISA_TOP_UP,
    riskOrOpportunity: {
      type: "opportunity",
      text: `Contributions like this every month would fully fund your Emergency Fund in a few months.`,
    },
  };
}

function buildSpendingReport(context: PortfolioContext): CoachReport {
  const emergencyFund = getEmergencyFund(context);
  const goalRemaining = emergencyFund
    ? Math.max(emergencyFund.targetAmount - emergencyFund.currentAmount, 0)
    : undefined;

  const summary = calculateSpendingSummary({
    monthlyIncome: context.monthlyIncome,
    monthlyExpenses: context.monthlySpending,
    goalRemaining,
  });

  return {
    directAnswer: `Your spending is on track — you're saving ${formatGBP(summary.surplus)} a month.`,
    why: "Housing and everyday living costs make up most of your outgoings, with no unusual spikes or subscription creep this month.",
    breakdown: [
      { label: "Income", value: formatGBP(context.monthlyIncome) },
      { label: "Spending", value: formatGBP(context.monthlySpending) },
      { label: "Saved", value: formatGBP(summary.surplus) },
      { label: "Savings rate", value: `${summary.savingsRatePct}%` },
    ],
    recommendation: "Redirect this month's surplus toward your Emergency Fund.",
    riskOrOpportunity: {
      type: "opportunity",
      text:
        summary.monthsToCloseGoal != null
          ? `Redirecting this surplus would fully fund your Emergency Fund in about ${summary.monthsToCloseGoal} months.`
          : "Redirecting any spare cash would help fund your goals faster.",
    },
  };
}

function formatGoalDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/** Matches a goal by name or its configured keywords — "house", "deposit",
 * "the car fund", etc. — against a chunk of free text. */
function resolveNamedGoal(context: PortfolioContext, text: string): Goal | null {
  const lower = text.toLowerCase();
  return (
    context.goals.find(
      (goal) => lower.includes(goal.name.toLowerCase()) || goal.keywords.some((keyword) => lower.includes(keyword))
    ) ?? null
  );
}

/**
 * Which goal is this message about? An explicit name/keyword in the message
 * always wins. Failing that, only a recognised follow-up phrase ("what if
 * I add £150 a month?") falls back to whatever goal the previous assistant
 * turn was actually discussing — a bare "what's my goals" with no history
 * of its own correctly falls through to the all-goals overview instead.
 */
function resolveGoalForMessage(context: PortfolioContext, message: string, history: CoachHistoryTurn[]): Goal | null {
  const named = resolveNamedGoal(context, message);
  if (named) return named;
  if (!isFollowUpMessage(message)) return null;

  for (let i = history.length - 1; i >= 0; i--) {
    const turn = history[i];
    if (turn.role === "assistant") {
      return resolveNamedGoal(context, turn.text);
    }
  }
  return null;
}

function buildGoalsOverviewReport(context: PortfolioContext): CoachReport {
  const totalRemaining = context.goals.reduce((sum, g) => sum + Math.max(g.targetAmount - g.currentAmount, 0), 0);
  const totalMonthly = context.goals.reduce((sum, g) => sum + g.monthlyContribution, 0);

  return {
    directAnswer: `You're actively working toward ${context.goals.length} goals, putting ${formatGBP(totalMonthly)}/month toward them combined.`,
    why: `Together you have ${formatGBP(totalRemaining)} left to save across all of them. Here's where each one stands.`,
    breakdown: context.goals.map((goal) => ({
      label: goal.name,
      value: `${formatGBP(goal.currentAmount)} / ${formatGBP(goal.targetAmount)} (${getGoalProgressPct(goal)}%) — by ${formatGoalDate(goal.targetDate)}`,
    })),
    recommendation: RECOMMEND_ISA_TOP_UP,
    riskOrOpportunity: {
      type: "opportunity",
      text: "Ask about any one goal by name for a detailed projection and what a higher contribution would do to the timeline.",
    },
  };
}

function buildGoalReport(context: PortfolioContext, message: string, history: CoachHistoryTurn[]): CoachReport {
  const goal = resolveGoalForMessage(context, message, history) ?? getEmergencyFund(context) ?? null;

  // A genuinely general "what's my goals" ask — not a follow-up, no goal
  // named — gets the overview rather than an arbitrarily-chosen single goal.
  if (!goal || (!resolveNamedGoal(context, message) && !isFollowUpMessage(message))) {
    return buildGoalsOverviewReport(context);
  }

  const currentContribution = goal.monthlyContribution;
  const defaultNewContribution = currentContribution + 50;
  const newContribution = resolveParameterAmount(message, currentContribution, defaultNewContribution);

  const projection = calculateGoalProjection({
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    currentContribution,
    newContribution,
  });

  return {
    directAnswer: `Good news — increasing your ${goal.name} contribution to ${formatGBP(newContribution)}/month would get you there ${projection.monthsSaved ?? 0} months sooner.`,
    why: `You have ${formatGBP(projection.remaining)} left to reach your ${formatGBP(goal.targetAmount)} target (aiming for ${formatGoalDate(goal.targetDate)}). At your current pace that's about ${projection.monthsAtCurrentPace} months — bumping the contribution closes the gap faster without touching your investments.`,
    breakdown: [
      { label: "Current contribution", value: `${formatGBP(currentContribution)}/month` },
      { label: "New contribution", value: `${formatGBP(newContribution)}/month` },
      { label: "Remaining to save", value: formatGBP(projection.remaining) },
      { label: "Estimated completion", value: projection.newCompletionDate ?? projection.currentCompletionDate },
      { label: "Time saved", value: `${projection.monthsSaved ?? 0} months sooner` },
    ],
    recommendation:
      "This increase looks affordable based on your cash balance and monthly spending — prioritise it before increasing higher-risk investments.",
    riskOrOpportunity: {
      type: "risk",
      text: "Make sure you still keep at least one month's essential expenses available in cash.",
    },
  };
}

function buildRiskReport(context: PortfolioContext): CoachReport {
  const targets = TARGET_ALLOCATION_BY_RISK_PROFILE[context.riskProfile];
  const allocation = calculatePortfolioAllocation({
    assets: context.holdings.map((h) => ({ name: h.name, value: h.value })),
    targets,
  });
  const crypto = getCrypto(context);

  return {
    directAnswer: `Your biggest risk is concentration — ${crypto?.name ?? "crypto"} makes up ${crypto?.allocationPct ?? 0}% of your portfolio, above what I'd recommend for a ${context.riskProfile.toLowerCase()} risk profile.`,
    why: `Your diversification score is ${allocation.diversificationScore}/100. ${allocation.concentrationWarnings[0] ?? "Nothing else stands out as overweight right now."}`,
    breakdown: allocation.breakdown.map((row) => ({
      label: row.name,
      value: `${row.actualPct}% (target ${row.targetPct}%)`,
    })),
    recommendation: "Rebalance new contributions into your ISA and ETFs until crypto is back under target.",
    riskOrOpportunity: {
      type: "risk",
      text: allocation.concentrationWarnings[0] ?? `${crypto?.name ?? "Crypto"} exposure is elevated.`,
    },
  };
}

const KNOWN_PROVIDERS: { keyword: string; provider: string; label: string }[] = [
  { keyword: "barclays", provider: "barclays", label: "Barclays" },
  { keyword: "monzo", provider: "monzo", label: "Monzo" },
  { keyword: "trading 212", provider: "trading212", label: "Trading 212" },
  { keyword: "trading212", provider: "trading212", label: "Trading 212" },
  { keyword: "coinbase", provider: "coinbase", label: "Coinbase" },
  { keyword: "kraken", provider: "kraken", label: "Kraken" },
  { keyword: "ledger", provider: "ledger", label: "Ledger" },
  { keyword: "paypal", provider: "paypal", label: "PayPal" },
  { keyword: "aviva", provider: "aviva", label: "Aviva" },
  { keyword: "pension", provider: "aviva", label: "Aviva" },
];

function resolveProviderFromMessage(message: string): { provider: string; label: string } | null {
  const lower = message.toLowerCase();
  const found = KNOWN_PROVIDERS.find((p) => lower.includes(p.keyword));
  return found ? { provider: found.provider, label: found.label } : null;
}

function buildAccountsReport(context: PortfolioContext, message: string): CoachReport {
  const named = resolveProviderFromMessage(message);

  if (named) {
    const matches = context.connectedAccounts.filter((a) => a.provider === named.provider);

    if (matches.length === 0) {
      return {
        directAnswer: `No — you don't have ${named.label} connected right now.`,
        why: `Your connected accounts are: ${context.connectedAccounts.map((a) => a.name).join(", ")}.`,
        breakdown: context.connectedAccounts.map((a) => ({ label: a.name, value: formatGBP(a.balance) })),
        recommendation: "You can connect a new account from the dashboard whenever you're ready.",
        riskOrOpportunity: {
          type: "opportunity",
          text: "Adding more accounts gives me a fuller picture of your finances to work from.",
        },
      };
    }

    const total = matches.reduce((sum, a) => sum + a.balance, 0);
    return {
      directAnswer: `Yes — ${matches.length > 1 ? `you have ${matches.length} ${named.label} accounts connected` : `${named.label} is connected`}, worth ${formatGBP(total)} combined.`,
      why: matches.map((a) => `${a.name} holds ${formatGBP(a.balance)}`).join("; ") + ".",
      breakdown: matches.map((a) => ({ label: a.name, value: formatGBP(a.balance) })),
      recommendation: "Ask about any other provider, or ask for your full list of connected accounts.",
      riskOrOpportunity: {
        type: "opportunity",
        text: `${named.label} makes up ${Math.round((total / context.netWorth) * 100)}% of your net worth.`,
      },
    };
  }

  const total = context.connectedAccounts.reduce((sum, a) => sum + a.balance, 0);
  return {
    directAnswer: `You've got ${context.connectedAccounts.length} accounts connected, worth ${formatGBP(total)} combined.`,
    why: "That's everything across your banks, broker, crypto exchanges, pension, and PayPal — here's each one.",
    breakdown: context.connectedAccounts.map((a) => ({ label: a.name, value: formatGBP(a.balance) })),
    recommendation: "Ask about a specific provider by name for its exact balance.",
    riskOrOpportunity: {
      type: "opportunity",
      text: "Everything here is in one place, so any of my other answers already account for all of it.",
    },
  };
}

function buildGeneralReport(context: PortfolioContext): CoachReport {
  const fundProgressPct = getGoalProgressPct(getEmergencyFund(context));

  return {
    directAnswer: "Good question — let me pull together what's most relevant.",
    why: "I don't have a tailored answer for that specific phrasing yet, but here's where things stand so you can dig in from here.",
    breakdown: [
      { label: "Net worth", value: formatGBP(context.netWorth) },
      { label: "Portfolio health", value: `${context.healthScore}/100` },
      { label: "Emergency Fund", value: `${fundProgressPct}% funded` },
    ],
    recommendation: "Try asking about your spending, a specific goal, or where to invest next — I'll go deeper on any of those.",
    riskOrOpportunity: {
      type: "opportunity",
      text: "Ask me something specific and I can give you an exact number, not just an overview.",
    },
  };
}

function buildReportForTopic(
  topic: CoachTopic,
  context: PortfolioContext,
  message: string,
  history: CoachHistoryTurn[]
): CoachReport {
  switch (topic) {
    case "portfolioReview":
      return buildPortfolioReviewReport(context);
    case "holiday":
      return buildHolidayReport(context, message);
    case "invest":
      return buildInvestReport(context, message);
    case "spending":
      return buildSpendingReport(context);
    case "goal":
      return buildGoalReport(context, message, history);
    case "risk":
      return buildRiskReport(context);
    case "accounts":
      return buildAccountsReport(context, message);
    case "general":
      return buildGeneralReport(context);
  }
}

/** Keyword-based intent detection. Returns null (no verdict) rather than a
 * default, so callers can distinguish "no topic keyword found" from "general
 * topic found" and decide separately whether to fall back to a prior topic
 * or to the true general-purpose response. */
function classifyTopicByKeyword(message: string): CoachTopic | null {
  if (matches(message, ["review my portfolio", "portfolio health", "how is my portfolio"])) {
    return "portfolioReview";
  }
  if (matches(message, ["holiday", "afford"])) return "holiday";
  if (matches(message, ["invest", "where should i"])) return "invest";
  if (matches(message, ["spending", "spend"])) return "spending";
  if (
    matches(message, [
      "emergency fund",
      "emergency",
      "house deposit",
      "deposit",
      "wedding",
      "new car",
      "buy a car",
      "car fund",
      "vehicle",
      "my goal",
      "my goals",
      "save for",
      "saving for",
    ])
  ) {
    return "goal";
  }
  if (matches(message, ["risk"])) return "risk";
  if (
    matches(message, [
      "do i have",
      "which account",
      "which accounts",
      "my accounts",
      "my account",
      "connected account",
      "connected accounts",
      "what accounts",
      "what account",
      "barclays",
      "monzo",
      "trading 212",
      "trading212",
      "coinbase",
      "kraken",
      "ledger",
      "paypal",
      "aviva",
      "pension",
    ])
  ) {
    return "accounts";
  }
  return null;
}

/**
 * Full intent resolution: an explicit topic keyword always wins ("what about
 * investing £500 instead?" is unambiguously about investing, even though
 * it's also phrased as a follow-up). Only when no topic keyword is present
 * do we check whether this reads as a follow-up to the previous topic.
 * Anything left over is a genuinely general/unrecognised ask.
 */
function resolveTopic(message: string, previousTopic: CoachTopic | null): CoachTopic {
  const keywordTopic = classifyTopicByKeyword(message);
  if (keywordTopic) return keywordTopic;
  if (previousTopic && isFollowUpMessage(message)) return previousTopic;
  return "general";
}

function findPreviousTopic(history: CoachHistoryTurn[]): CoachTopic | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const turn = history[i];
    if (turn.role === "assistant" && turn.topic) return turn.topic;
  }
  return null;
}

/**
 * Local rule-based engine — no network calls, no API key, no per-message
 * cost. Implements the same `AIEngine` contract a real model-backed engine
 * would, so swapping this out later (see `engine/index.ts`) doesn't touch
 * the API route, the UI, or the calculators.
 */
export const mockEngine: AIEngine = {
  async generate({ message, context, history }: EngineInput) {
    const topic = message ? resolveTopic(message, findPreviousTopic(history)) : "portfolioReview";
    const report = buildReportForTopic(topic, context, message ?? "", history);

    return {
      topic,
      report,
      healthScore: context.healthScore,
      healthStatus: getHealthStatus(context.healthScore),
      mainInsight: report.directAnswer,
      recommendation: report.recommendation,
      riskAlert: report.riskOrOpportunity.type === "risk" ? report.riskOrOpportunity.text : null,
    };
  },
};
