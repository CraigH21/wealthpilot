import { calculatePortfolioAllocation, calculatePortfolioHealthScore } from "../ai/calculators";
import { TARGET_ALLOCATION_BY_RISK_PROFILE } from "../ai/contextHelpers";

export type Profile = {
  name: string;
  location: string;
};

export type AccountCategory = "bank" | "broker" | "crypto" | "pension" | "payments";

export type ConnectedAccount = {
  id: string;
  name: string;
  provider: string;
  category: AccountCategory;
  balance: number;
  status: "connected" | "syncing";
  logo?: string;
  /** Blockchains this account operates on — only meaningful for crypto wallets. */
  networks?: string[];
};

/** Category-level allocation bucket — what the Asset Allocation donut and
 * the AI's concentration-risk reasoning operate on. */
export type Holding = {
  id: string;
  name: string;
  symbol: string;
  category: "Crypto" | "Stocks" | "ETFs" | "Cash" | "Pension";
  allocationPct: number;
  value: number;
  changePct: number;
  color: string;
};

/** An individual named position within a Holding category — what the
 * dashboard's "Your Portfolio" cards and any security-specific AI question
 * ("should I sell bitcoin?") read from. */
export type Security = {
  id: string;
  name: string;
  symbol: string;
  logoSymbol: string | null;
  category: "Stocks" | "ETFs" | "Crypto";
  accountId: string;
  value: number;
  changePct: number;
  color: string;
  /** Cost basis per unit — only populated for crypto holdings so far. */
  avgBuyPriceGBP?: number;
  /** CoinMarketCap's numeric coin id — real logo artwork, not a lookup by
   * name/symbol against a different CDN. Crypto only. */
  cmcId?: number;
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  /** Free-text phrases that mean "the user is talking about this goal". */
  keywords: string[];
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  amount: number;
  accountId: string;
};

export type NetWorthPoint = { date: string; value: number };
export type SpendingCategoryTotal = { category: string; amount: number };

export type PortfolioContext = {
  profile: Profile;
  netWorth: number;
  netWorthChangePct: number;
  weeklyChangeAbs: number;
  cash: number;
  monthlyIncome: number;
  monthlySpending: number;
  healthScore: number;
  riskProfile: "Conservative" | "Moderate" | "Aggressive";
  holdings: Holding[];
  securities: Security[];
  goals: Goal[];
  recentTransactions: Transaction[];
  connectedAccounts: ConnectedAccount[];
  netWorthHistory: NetWorthPoint[];
  spendingByCategory: SpendingCategoryTotal[];
};

export function getHealthStatus(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Attention";
}

// ---------------------------------------------------------------------------
// Peter Williams — 34, Manchester. Everything below is hand-built to
// reconcile: account balances sum to net worth, security values sum to
// their parent accounts' balances, Emergency Fund progress equals what's
// actually sitting in the two savings pots, and income/spending are
// computed from the transaction list below rather than stated separately.
// ---------------------------------------------------------------------------

const PROFILE: Profile = { name: "Peter Williams", location: "Manchester, UK" };

// Crypto is deliberately modelled as one allocation table (which wallet
// holds how much of which coin) rather than separate "account balance" and
// "coin total" numbers authored by hand — those two used to drift out of
// sync with each other. Account balances and coin totals below are both
// *derived* from this table, so they can't disagree.
export type CryptoAllocationRow = { accountId: string; symbol: string; value: number; network: string };

// avgBuyPriceGBP is a static cost-basis-per-unit figure (what Peter actually
// paid, on average, across his purchases) — independent of today's live
// price, so P&L can be computed honestly as (live price - avg buy) × qty
// rather than fabricated separately.
const CRYPTO_COIN_INFO: Record<
  string,
  { name: string; changePct: number; color: string; avgBuyPriceGBP: number; cmcId: number }
> = {
  BTC: { name: "Bitcoin", changePct: 4.8, color: "#f79414", avgBuyPriceGBP: 38000, cmcId: 1 },
  ETH: { name: "Ethereum", changePct: 3.1, color: "#8a92b2", avgBuyPriceGBP: 1350, cmcId: 1027 },
  SOL: { name: "Solana", changePct: 7.9, color: "#00ffbd", avgBuyPriceGBP: 48, cmcId: 5426 },
  LINK: { name: "Chainlink", changePct: 5.2, color: "#2a5ada", avgBuyPriceGBP: 9.2, cmcId: 1975 },
};

// `network` is which chain that specific holding actually sits on — real
// enough to back the network chips shown on each wallet card. A wallet's
// card and its holdings popup both read from this same table, so they can
// never show a network the popup doesn't actually back (e.g. MetaMask's
// card used to advertise "Base" as a chip with nothing behind it).
const CRYPTO_ALLOCATIONS: CryptoAllocationRow[] = [
  { accountId: "ledger", symbol: "BTC", value: 14000, network: "Bitcoin" },
  { accountId: "ledger", symbol: "ETH", value: 2000, network: "Ethereum" },
  { accountId: "coinbase", symbol: "BTC", value: 6000, network: "Bitcoin" },
  { accountId: "coinbase", symbol: "ETH", value: 2500, network: "Ethereum" },
  { accountId: "metamask", symbol: "ETH", value: 6500, network: "Ethereum" },
  { accountId: "metamask", symbol: "LINK", value: 2000, network: "Base" },
  { accountId: "rabby-wallet", symbol: "ETH", value: 2000, network: "Ethereum" },
  { accountId: "rabby-wallet", symbol: "LINK", value: 500, network: "Arbitrum" },
  { accountId: "kraken", symbol: "SOL", value: 5500, network: "Solana" },
  { accountId: "kraken", symbol: "BTC", value: 2200, network: "Bitcoin" },
];

const getNetworksForAccount = (accountId: string): string[] =>
  Array.from(new Set(CRYPTO_ALLOCATIONS.filter((row) => row.accountId === accountId).map((row) => row.network)));

const sumCryptoByAccount = (accountId: string) =>
  CRYPTO_ALLOCATIONS.filter((row) => row.accountId === accountId).reduce((sum, row) => sum + row.value, 0);

const sumCryptoBySymbol = (symbol: string) =>
  CRYPTO_ALLOCATIONS.filter((row) => row.symbol === symbol).reduce((sum, row) => sum + row.value, 0);

const ACCOUNTS: ConnectedAccount[] = [
  { id: "barclays-current", name: "Barclays Current Account", provider: "barclays", category: "bank", balance: 2140, status: "connected", logo: "/icons/platforms/barclays.png" },
  { id: "barclays-savings", name: "Barclays Savings Account", provider: "barclays", category: "bank", balance: 3500, status: "connected", logo: "/icons/platforms/barclays.png" },
  { id: "monzo-current", name: "Monzo Current Account", provider: "monzo", category: "bank", balance: 860, status: "connected", logo: "/icons/platforms/monzo.png" },
  { id: "monzo-savings", name: "Monzo Savings Pot", provider: "monzo", category: "bank", balance: 3500, status: "connected", logo: "/icons/platforms/monzo.png" },
  { id: "trading212-isa", name: "Trading 212 Stocks & Shares ISA", provider: "trading212", category: "broker", balance: 58000, status: "connected", logo: "/icons/platforms/trading212.png" },
  { id: "trading212-gia", name: "Trading 212 Invest", provider: "trading212", category: "broker", balance: 9400, status: "connected", logo: "/icons/platforms/trading212.png" },
  { id: "metamask", name: "MetaMask", provider: "metamask", category: "crypto", balance: sumCryptoByAccount("metamask"), status: "connected", logo: "/icons/platforms/metamask.png", networks: getNetworksForAccount("metamask") },
  { id: "ledger", name: "Ledger", provider: "ledger", category: "crypto", balance: sumCryptoByAccount("ledger"), status: "connected", logo: "/icons/platforms/ledger.svg", networks: getNetworksForAccount("ledger") },
  { id: "rabby-wallet", name: "Rabby Wallet", provider: "rabby", category: "crypto", balance: sumCryptoByAccount("rabby-wallet"), status: "connected", networks: getNetworksForAccount("rabby-wallet") },
  { id: "coinbase", name: "Coinbase", provider: "coinbase", category: "crypto", balance: sumCryptoByAccount("coinbase"), status: "connected", logo: "/icons/platforms/coinbase.png", networks: getNetworksForAccount("coinbase") },
  { id: "kraken", name: "Kraken", provider: "kraken", category: "crypto", balance: sumCryptoByAccount("kraken"), status: "connected", logo: "/icons/platforms/kraken.png", networks: getNetworksForAccount("kraken") },
  { id: "aviva-pension", name: "Aviva Workplace Pension", provider: "aviva", category: "pension", balance: 62000, status: "connected" },
  { id: "paypal", name: "PayPal", provider: "paypal", category: "payments", balance: 180, status: "syncing" },
];

const SECURITIES: Security[] = [
  { id: "vusa", name: "Vanguard S&P 500 ETF", symbol: "VUSA", logoSymbol: null, category: "ETFs", accountId: "trading212-isa", value: 22000, changePct: 2.1, color: "var(--accent)" },
  { id: "vwrp", name: "Vanguard FTSE All-World ETF", symbol: "VWRP", logoSymbol: null, category: "ETFs", accountId: "trading212-isa", value: 15000, changePct: 1.8, color: "#38bdf8" },
  { id: "aapl", name: "Apple", symbol: "AAPL", logoSymbol: "AAPL", category: "Stocks", accountId: "trading212-isa", value: 8500, changePct: 3.4, color: "#a1a1aa" },
  { id: "msft", name: "Microsoft", symbol: "MSFT", logoSymbol: "MSFT", category: "Stocks", accountId: "trading212-isa", value: 7400, changePct: 2.9, color: "#7aaa6c" },
  { id: "isf", name: "iShares Core FTSE 100 ETF", symbol: "ISF", logoSymbol: null, category: "ETFs", accountId: "trading212-isa", value: 5100, changePct: 1.2, color: "#c084fc" },
  { id: "nvda", name: "Nvidia", symbol: "NVDA", logoSymbol: "NVDA", category: "Stocks", accountId: "trading212-gia", value: 9400, changePct: 6.8, color: "#78ba00" },
  ...Object.entries(CRYPTO_COIN_INFO).map(([symbol, info]) => ({
    id: symbol.toLowerCase(),
    name: info.name,
    symbol,
    logoSymbol: null,
    category: "Crypto" as const,
    accountId:
      [...CRYPTO_ALLOCATIONS].filter((row) => row.symbol === symbol).sort((a, b) => b.value - a.value)[0]
        ?.accountId ?? "",
    value: sumCryptoBySymbol(symbol),
    changePct: info.changePct,
    color: info.color,
    avgBuyPriceGBP: info.avgBuyPriceGBP,
    cmcId: info.cmcId,
  })),
];

const GOALS: Goal[] = [
  { id: "emergency-fund", name: "Emergency Fund", targetAmount: 10000, currentAmount: 7000, monthlyContribution: 100, targetDate: "2027-06-01", keywords: ["emergency"] },
  { id: "house-deposit", name: "House Deposit", targetAmount: 40000, currentAmount: 18500, monthlyContribution: 400, targetDate: "2029-01-01", keywords: ["house", "deposit", "mortgage"] },
  { id: "new-car", name: "New Car", targetAmount: 12000, currentAmount: 4200, monthlyContribution: 150, targetDate: "2027-12-01", keywords: ["car", "vehicle"] },
  { id: "wedding-fund", name: "Wedding Fund", targetAmount: 15000, currentAmount: 6000, monthlyContribution: 250, targetDate: "2028-03-01", keywords: ["wedding", "marriage"] },
];

// --- Transactions: fixed recurring items applied across 3 months, plus a
// hand-authored variable list per month for realism. Nothing here is random
// — the same recurring template produces the same transactions every month,
// and June/July/August only differ in the variable, hand-picked entries.

type RecurringItem = {
  day: number;
  description: string;
  merchant: string;
  category: string;
  amount: number;
  accountId: string;
};

const RECURRING_ITEMS: RecurringItem[] = [
  { day: 1, description: "Monthly rent", merchant: "Manchester Lettings", category: "Housing", amount: -950, accountId: "barclays-current" },
  { day: 3, description: "Council tax", merchant: "Manchester City Council", category: "Housing", amount: -165, accountId: "barclays-current" },
  { day: 5, description: "Energy bill", merchant: "Octopus Energy", category: "Bills & Utilities", amount: -140, accountId: "monzo-current" },
  { day: 5, description: "Water bill", merchant: "United Utilities", category: "Bills & Utilities", amount: -38, accountId: "monzo-current" },
  { day: 7, description: "Broadband", merchant: "Virgin Media", category: "Bills & Utilities", amount: -45, accountId: "barclays-current" },
  { day: 7, description: "Mobile plan", merchant: "EE", category: "Bills & Utilities", amount: -32, accountId: "monzo-current" },
  { day: 10, description: "Streaming", merchant: "Netflix", category: "Subscriptions", amount: -16.99, accountId: "monzo-current" },
  { day: 10, description: "Music streaming", merchant: "Spotify", category: "Subscriptions", amount: -11.99, accountId: "monzo-current" },
  { day: 12, description: "Gym membership", merchant: "PureGym", category: "Health & Fitness", amount: -24.99, accountId: "monzo-current" },
  { day: 15, description: "Home insurance", merchant: "Aviva Home Insurance", category: "Bills & Utilities", amount: -28, accountId: "barclays-current" },
  { day: 20, description: "Dividend received", merchant: "Trading 212", category: "Investing Income", amount: 22, accountId: "trading212-isa" },
  { day: 28, description: "Salary", merchant: "Northbridge Digital Ltd", category: "Income", amount: 3800, accountId: "barclays-current" },
  { day: 29, description: "ISA contribution", merchant: "Trading 212", category: "Investing", amount: -400, accountId: "barclays-current" },
];

type VariableItem = Omit<RecurringItem, "day"> & { day: number };

const JUNE_VARIABLE: VariableItem[] = [
  { day: 2, description: "Weekly shop", merchant: "Tesco", category: "Groceries", amount: -71.30, accountId: "monzo-current" },
  { day: 6, description: "Top-up shop", merchant: "Aldi", category: "Groceries", amount: -38.90, accountId: "monzo-current" },
  { day: 8, description: "Home essentials", merchant: "Amazon", category: "Shopping", amount: -54.60, accountId: "monzo-current" },
  { day: 9, description: "Fuel", merchant: "Shell", category: "Transport", amount: -58.00, accountId: "monzo-current" },
  { day: 11, description: "Dinner delivery", merchant: "Deliveroo", category: "Dining & Takeaway", amount: -27.40, accountId: "monzo-current" },
  { day: 13, description: "Coffee", merchant: "Costa Coffee", category: "Dining & Takeaway", amount: -4.65, accountId: "monzo-current" },
  { day: 16, description: "Train ticket", merchant: "Trainline", category: "Transport", amount: -41.20, accountId: "monzo-current" },
  { day: 18, description: "Freelance project payment", merchant: "PayPal", category: "Freelance Income", amount: 380.00, accountId: "paypal" },
  { day: 21, description: "New trainers", merchant: "JD Sports", category: "Shopping", amount: -64.99, accountId: "monzo-current" },
  { day: 24, description: "Weekly shop", merchant: "Tesco", category: "Groceries", amount: -66.75, accountId: "monzo-current" },
  { day: 26, description: "Ride home", merchant: "Uber", category: "Transport", amount: -12.80, accountId: "monzo-current" },
];

const JULY_VARIABLE: VariableItem[] = [
  { day: 2, description: "Weekly shop", merchant: "Tesco", category: "Groceries", amount: -68.40, accountId: "monzo-current" },
  { day: 4, description: "Weekly shop", merchant: "Tesco", category: "Groceries", amount: -54.20, accountId: "monzo-current" },
  { day: 6, description: "Top-up shop", merchant: "Aldi", category: "Groceries", amount: -41.15, accountId: "monzo-current" },
  { day: 9, description: "Online order", merchant: "Amazon", category: "Shopping", amount: -89.99, accountId: "monzo-current" },
  { day: 11, description: "Fuel", merchant: "Shell", category: "Transport", amount: -62.00, accountId: "monzo-current" },
  { day: 13, description: "Dinner delivery", merchant: "Deliveroo", category: "Dining & Takeaway", amount: -24.50, accountId: "monzo-current" },
  { day: 14, description: "Coffee", merchant: "Costa Coffee", category: "Dining & Takeaway", amount: -4.85, accountId: "monzo-current" },
  { day: 15, description: "Lunch", merchant: "Greggs", category: "Dining & Takeaway", amount: -6.20, accountId: "monzo-current" },
  { day: 17, description: "Train ticket", merchant: "Trainline", category: "Transport", amount: -38.60, accountId: "monzo-current" },
  { day: 19, description: "Ride into town", merchant: "Uber", category: "Transport", amount: -14.30, accountId: "monzo-current" },
  { day: 22, description: "New outfit", merchant: "ASOS", category: "Shopping", amount: -45.00, accountId: "monzo-current" },
  { day: 23, description: "Freelance project payment", merchant: "PayPal", category: "Freelance Income", amount: 450.00, accountId: "paypal" },
  { day: 25, description: "Running shoes", merchant: "JD Sports", category: "Shopping", amount: -69.99, accountId: "monzo-current" },
];

const AUGUST_VARIABLE: VariableItem[] = [
  { day: 3, description: "Weekly shop", merchant: "Tesco", category: "Groceries", amount: -72.10, accountId: "monzo-current" },
  { day: 5, description: "Top-up shop", merchant: "Aldi", category: "Groceries", amount: -35.60, accountId: "monzo-current" },
  { day: 7, description: "Online order", merchant: "Amazon", category: "Shopping", amount: -112.50, accountId: "monzo-current" },
  { day: 9, description: "Fuel", merchant: "Shell", category: "Transport", amount: -60.00, accountId: "monzo-current" },
  { day: 11, description: "Dinner delivery", merchant: "Deliveroo", category: "Dining & Takeaway", amount: -31.20, accountId: "monzo-current" },
  { day: 13, description: "Coffee", merchant: "Costa Coffee", category: "Dining & Takeaway", amount: -4.85, accountId: "monzo-current" },
  { day: 16, description: "Train ticket", merchant: "Trainline", category: "Transport", amount: -38.60, accountId: "monzo-current" },
  { day: 18, description: "Freelance project payment", merchant: "PayPal", category: "Freelance Income", amount: 520.00, accountId: "paypal" },
  { day: 20, description: "Weekly shop", merchant: "Tesco", category: "Groceries", amount: -69.90, accountId: "monzo-current" },
  { day: 22, description: "Bought Bitcoin", merchant: "Coinbase", category: "Investing", amount: -200.00, accountId: "coinbase" },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

/** August is the current, still-in-progress month ("today" is the 24th),
 * so only recurring items that have actually happened by then are included
 * — the 28th's salary and 29th's ISA contribution haven't landed yet. */
function buildMonthTransactions(month: string, variable: VariableItem[], maxDay = 31): Transaction[] {
  const recurring = RECURRING_ITEMS.filter((item) => item.day <= maxDay).map((item, index) => ({
    id: `${month}-rec-${index}`,
    date: `${month}-${pad2(item.day)}`,
    description: item.description,
    merchant: item.merchant,
    category: item.category,
    amount: item.amount,
    accountId: item.accountId,
  }));

  const variableTx = variable.map((item, index) => ({
    id: `${month}-var-${index}`,
    date: `${month}-${pad2(item.day)}`,
    description: item.description,
    merchant: item.merchant,
    category: item.category,
    amount: item.amount,
    accountId: item.accountId,
  }));

  return [...recurring, ...variableTx].sort((a, b) => b.date.localeCompare(a.date));
}

const TRANSACTIONS: Transaction[] = [
  ...buildMonthTransactions("2026-08", AUGUST_VARIABLE, 24),
  ...buildMonthTransactions("2026-07", JULY_VARIABLE),
  ...buildMonthTransactions("2026-06", JUNE_VARIABLE),
].sort((a, b) => b.date.localeCompare(a.date));

const NET_WORTH_HISTORY: NetWorthPoint[] = [
  { date: "2026-03-01", value: 158900 },
  { date: "2026-04-01", value: 163400 },
  { date: "2026-05-01", value: 156800 },
  { date: "2026-06-01", value: 169200 },
  { date: "2026-07-01", value: 176500 },
  { date: "2026-08-01", value: 183280 },
];

function computeMonthTotals(transactions: Transaction[], monthPrefix: string) {
  const monthTx = transactions.filter((t) => t.date.startsWith(monthPrefix));
  const income = monthTx.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const spending = monthTx
    .filter((t) => t.amount < 0 && t.category !== "Investing")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return {
    income: Math.round(income * 100) / 100,
    spending: Math.round(spending * 100) / 100,
  };
}

function computeSpendingByCategory(transactions: Transaction[], monthPrefix: string): SpendingCategoryTotal[] {
  const monthTx = transactions.filter(
    (t) => t.date.startsWith(monthPrefix) && t.amount < 0 && t.category !== "Investing"
  );
  const totals = new Map<string, number>();
  for (const t of monthTx) {
    totals.set(t.category, (totals.get(t.category) ?? 0) + Math.abs(t.amount));
  }
  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 }))
    .sort((a, b) => b.amount - a.amount);
}

function buildHoldings(securities: Security[], cash: number, pension: number): Holding[] {
  const totalValue =
    securities.reduce((sum, s) => sum + s.value, 0) + cash + pension;

  const byCategory = (category: Security["category"]) =>
    securities.filter((s) => s.category === category);

  const weightedChange = (items: Security[]) => {
    const value = items.reduce((sum, s) => sum + s.value, 0);
    if (value === 0) return 0;
    const weighted = items.reduce((sum, s) => sum + s.value * s.changePct, 0);
    return Math.round((weighted / value) * 10) / 10;
  };

  const pct = (value: number) => Math.round((value / totalValue) * 1000) / 10;

  const cryptoValue = byCategory("Crypto").reduce((sum, s) => sum + s.value, 0);
  const stocksValue = byCategory("Stocks").reduce((sum, s) => sum + s.value, 0);
  const etfsValue = byCategory("ETFs").reduce((sum, s) => sum + s.value, 0);

  return [
    { id: "h-crypto", name: "Crypto", symbol: "CRYPTO", category: "Crypto", allocationPct: pct(cryptoValue), value: cryptoValue, changePct: weightedChange(byCategory("Crypto")), color: "#f79414" },
    { id: "h-stocks", name: "Stocks", symbol: "STK", category: "Stocks", allocationPct: pct(stocksValue), value: stocksValue, changePct: weightedChange(byCategory("Stocks")), color: "var(--accent)" },
    { id: "h-etfs", name: "ETFs", symbol: "ETF", category: "ETFs", allocationPct: pct(etfsValue), value: etfsValue, changePct: weightedChange(byCategory("ETFs")), color: "#38bdf8" },
    { id: "h-cash", name: "Cash", symbol: "GBP", category: "Cash", allocationPct: pct(cash), value: cash, changePct: 0, color: "#a1a1aa" },
    { id: "h-pension", name: "Pension", symbol: "PEN", category: "Pension", allocationPct: pct(pension), value: pension, changePct: 1.5, color: "#a78bfa" },
  ];
}

/**
 * Mock portfolio data passed as context with every AI Coach message — a
 * single reconciled dataset for a fictional demo user, Peter Williams.
 * Account balances sum to net worth, security values sum to their parent
 * accounts, Emergency Fund progress equals the two savings pots that back
 * it, income/spending/health-score are computed from the transaction list
 * rather than stated as separate constants. Swap this whole builder for a
 * real Supabase/API call later — every consumer (AI Coach, dashboard,
 * charts, goals) reads through this shape, not raw numbers.
 */
export type CryptoAllocationDetail = CryptoAllocationRow & { name: string; color: string; cmcId?: number };

/** Per-wallet, per-coin breakdown — e.g. "Ledger holds £14,000 of Bitcoin
 * and £2,000 of Ethereum". Only the crypto page needs this level of detail;
 * everywhere else reads the coin-total `securities` or account `balance`
 * fields, both derived from this same table so they can't disagree with it. */
export function getCryptoAllocations(): CryptoAllocationDetail[] {
  return CRYPTO_ALLOCATIONS.map((row) => ({
    ...row,
    name: CRYPTO_COIN_INFO[row.symbol]?.name ?? row.symbol,
    color: CRYPTO_COIN_INFO[row.symbol]?.color ?? "#a1a1aa",
    cmcId: CRYPTO_COIN_INFO[row.symbol]?.cmcId,
  }));
}

/** Six-month value trend for the crypto slice only — same shape as
 * `netWorthHistory`, reusable directly by `PortfolioGraph`. The last point
 * is computed from the same allocation table as everything else, so it
 * always matches the real current crypto total. */
export function getCryptoValueHistory(): NetWorthPoint[] {
  const currentTotal = Object.keys(CRYPTO_COIN_INFO).reduce((sum, symbol) => sum + sumCryptoBySymbol(symbol), 0);
  return [
    { date: "2026-03-01", value: 31000 },
    { date: "2026-04-01", value: 35200 },
    { date: "2026-05-01", value: 29800 },
    { date: "2026-06-01", value: 38100 },
    { date: "2026-07-01", value: 40900 },
    { date: "2026-08-01", value: currentTotal },
  ];
}

export function getPortfolioContext(): PortfolioContext {
  const cash = ACCOUNTS.filter((a) => a.category === "bank" || a.category === "payments").reduce(
    (sum, a) => sum + a.balance,
    0
  );
  const pension = ACCOUNTS.find((a) => a.category === "pension")?.balance ?? 0;
  const netWorth = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);

  const lastPoint = NET_WORTH_HISTORY[NET_WORTH_HISTORY.length - 1];
  const prevPoint = NET_WORTH_HISTORY[NET_WORTH_HISTORY.length - 2];
  const netWorthChangePct = Math.round(((lastPoint.value - prevPoint.value) / prevPoint.value) * 1000) / 10;
  const weeklyChangeAbs = Math.round((lastPoint.value - prevPoint.value) / 4);

  const { income: monthlyIncome, spending: monthlySpending } = computeMonthTotals(TRANSACTIONS, "2026-07");
  const spendingByCategory = computeSpendingByCategory(TRANSACTIONS, "2026-07");

  const holdings = buildHoldings(SECURITIES, cash, pension);
  const emergencyFund = GOALS.find((g) => g.id === "emergency-fund");
  const emergencyFundProgressPct = emergencyFund
    ? Math.round((emergencyFund.currentAmount / emergencyFund.targetAmount) * 100)
    : 0;

  const allocation = calculatePortfolioAllocation({
    assets: holdings.map((h) => ({ name: h.name, value: h.value })),
    targets: TARGET_ALLOCATION_BY_RISK_PROFILE.Moderate,
  });

  const savingsRatePct = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlySpending) / monthlyIncome) * 100) : 0;

  const healthScore = calculatePortfolioHealthScore({
    diversificationScore: allocation.diversificationScore,
    savingsRatePct,
    emergencyFundProgressPct,
    netWorthTrendPct: netWorthChangePct,
  });

  return {
    profile: PROFILE,
    netWorth,
    netWorthChangePct,
    weeklyChangeAbs,
    cash,
    monthlyIncome,
    monthlySpending,
    healthScore,
    riskProfile: "Moderate",
    holdings,
    securities: SECURITIES,
    goals: GOALS,
    recentTransactions: TRANSACTIONS,
    connectedAccounts: ACCOUNTS,
    netWorthHistory: NET_WORTH_HISTORY,
    spendingByCategory,
  };
}
