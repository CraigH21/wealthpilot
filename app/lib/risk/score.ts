import type { ConnectedAccount, Security } from "../mock/portfolioContext";

export type RiskCategory = "Low Risk" | "Moderate Risk" | "High Risk" | "Very High Risk";

export type PortfolioRiskResult = {
  score: number;
  category: RiskCategory;
  color: "green" | "amber" | "orange" | "red";
  description: string;
  insights: string[];
};

// --- Asset risk weights, 0-100 ---
// Bonds have no holdings or connection flow anywhere in this app yet (no
// bond account type exists to connect one) — kept here as the source of
// truth for whenever that changes, not wired into the calculation below.
const BOND_WEIGHTS = {
  governmentBond: 15, // UK Gilts / US Treasuries
  corporateBondInvestmentGrade: 25,
  corporateBondHighYield: 45,
  bondETF: 25,
} as const;

const CASH_WEIGHT = 5;
const ETF_WEIGHT = 35; // Global ETFs / Index Funds — this app doesn't distinguish the two

// Individual stocks aren't tagged Blue Chip vs Growth anywhere in the data
// model, so classify by symbol. Unrecognised stocks default to Blue Chip —
// the more conservative assumption for an unknown, presumably-established
// holding, rather than assuming growth-stock volatility.
const BLUE_CHIP_STOCK_WEIGHT = 50;
const GROWTH_STOCK_WEIGHT = 65;
const GROWTH_STOCK_SYMBOLS = new Set(["NVDA", "TSLA", "AMD", "PLTR"]);

function stockWeight(symbol: string): number {
  return GROWTH_STOCK_SYMBOLS.has(symbol) ? GROWTH_STOCK_WEIGHT : BLUE_CHIP_STOCK_WEIGHT;
}

// Same idea for crypto — BTC/ETH get their own (lower) weight, named
// memecoins are highest-risk, everything else falls to "Altcoin".
const CRYPTO_MAJOR_WEIGHT = 75; // BTC / ETH
const CRYPTO_ALTCOIN_WEIGHT = 90;
const CRYPTO_MEMECOIN_WEIGHT = 100;
const CRYPTO_MAJOR_SYMBOLS = new Set(["BTC", "ETH"]);
const CRYPTO_MEMECOIN_SYMBOLS = new Set(["DOGE", "SHIB", "PEPE", "FLOKI", "BONK"]);

function cryptoWeight(symbol: string): number {
  if (CRYPTO_MEMECOIN_SYMBOLS.has(symbol)) return CRYPTO_MEMECOIN_WEIGHT;
  if (CRYPTO_MAJOR_SYMBOLS.has(symbol)) return CRYPTO_MAJOR_WEIGHT;
  return CRYPTO_ALTCOIN_WEIGHT;
}

// Pension sub-type isn't captured by the Add Account flow's generic
// "Account type" dropdown for any other account type, so it reuses that
// same free-text field (`ConnectedAccount.accountType`) with its own set
// of options shown only when connecting a pension. Anything unset or
// unrecognised (e.g. the single hand-authored demo pension) falls back to
// "Balanced" — a reasonable default for an unspecified workplace pension,
// same rationale as the stock/crypto defaults above.
export const PENSION_TYPES = [
  "Cash Pension",
  "Balanced Pension Fund",
  "Global Equity Pension",
  "Target Retirement Fund",
  "High Growth Pension",
] as const;

const PENSION_WEIGHTS: Record<string, number> = {
  "Cash Pension": 20,
  "Balanced Pension Fund": 35,
  "Global Equity Pension": 45,
  "Target Retirement Fund": 40,
  "High Growth Pension": 55,
};
const DEFAULT_PENSION_WEIGHT = PENSION_WEIGHTS["Balanced Pension Fund"];

function pensionWeight(accountType: string | undefined): number {
  return accountType ? (PENSION_WEIGHTS[accountType] ?? DEFAULT_PENSION_WEIGHT) : DEFAULT_PENSION_WEIGHT;
}

function categoryFor(score: number): { category: RiskCategory; color: PortfolioRiskResult["color"]; description: string } {
  if (score <= 29) {
    return { category: "Low Risk", color: "green", description: "Your portfolio is conservatively invested." };
  }
  if (score <= 59) {
    return { category: "Moderate Risk", color: "amber", description: "Balanced portfolio with moderate investment risk." };
  }
  if (score <= 79) {
    return { category: "High Risk", color: "orange", description: "Growth-focused portfolio with elevated volatility." };
  }
  return { category: "Very High Risk", color: "red", description: "High exposure to volatile assets. Consider diversifying." };
}

export function calculatePortfolioRiskScore({
  securities,
  cash,
  pensionAccounts,
}: {
  securities: Security[];
  cash: number;
  pensionAccounts: Pick<ConnectedAccount, "balance" | "accountType">[];
}): PortfolioRiskResult {
  const items: { value: number; weight: number }[] = securities.map((security) => ({
    value: security.value,
    weight:
      security.category === "Stocks"
        ? stockWeight(security.symbol)
        : security.category === "Crypto"
          ? cryptoWeight(security.symbol)
          : ETF_WEIGHT,
  }));

  if (cash > 0) items.push({ value: cash, weight: CASH_WEIGHT });
  for (const pension of pensionAccounts) {
    items.push({ value: pension.balance, weight: pensionWeight(pension.accountType) });
  }

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  // Percentages are derived from each item's share of the actual total
  // (rather than assuming external inputs already sum to 100) so the score
  // can never be silently understated by an asset category the formula
  // forgot to include — every pound in the portfolio is always accounted
  // for, by construction.
  const score =
    totalValue > 0
      ? Math.round(items.reduce((sum, item) => sum + (item.value / totalValue) * 100 * item.weight, 0) / 100)
      : 0;

  const pctOfValue = (value: number) => (totalValue > 0 ? (value / totalValue) * 100 : 0);
  const sumBy = (predicate: (security: Security) => boolean) =>
    securities.filter(predicate).reduce((sum, security) => sum + security.value, 0);

  const cryptoPct = pctOfValue(sumBy((s) => s.category === "Crypto"));
  const cashPct = pctOfValue(cash);
  const etfPct = pctOfValue(sumBy((s) => s.category === "ETFs"));

  const insights: string[] = [];
  if (cryptoPct > 25) {
    insights.push("Crypto exposure is above the recommended allocation for a balanced portfolio.");
  }
  if (cashPct > 40) {
    insights.push("You may be holding more cash than necessary based on your goals.");
  }
  if (etfPct > 50) {
    insights.push("Your portfolio is well diversified through index investing.");
  }

  return { score, ...categoryFor(score), insights };
}
