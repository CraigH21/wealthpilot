import Link from "next/link";
import ConnectedAccountsCard from "../components/ConnectedAccountsCard";
import NetWorthCard from "../components/NetWorthCard";
import AICoachCard from "../components/AICoachCard";
import PortfolioCard from "../components/PortfolioCard";
import RecentActivity, { type ActivityItem } from "../components/RecentActivity";
import TodaysSnapshot from "../components/TodaysSnapshot";
import ForexRatesCard from "../components/ForexRatesCard";
import MarketPulseCard from "../components/MarketPulseCard";
import GoalsSummaryCard from "../components/GoalsSummaryCard";
import { generateCoachInsight } from "../lib/ai/coachService";
import { coinLogoUrl } from "../lib/crypto/market";
import { getPortfolioContext, type Security, type Transaction } from "../lib/mock/portfolioContext";
import { planGoal } from "../lib/goals/planning";
import { getMarketPulseSnapshot } from "../lib/market/pulse";
import { getForexSnapshot } from "../lib/forex/rates";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

const SPARKLINE_UP = "0,28 10,24 20,26 30,18 40,20 50,14 60,17 70,10 80,12 90,6 100,4";
const SPARKLINE_DOWN = "0,6 10,10 20,8 30,14 40,12 50,18 60,15 70,20 80,18 90,24 100,22";

const CATEGORY_ACCENT: Record<Security["category"], string> = {
  Crypto: "bg-orange-500/10 text-orange-400",
  Stocks: "bg-accent-soft text-accent",
  ETFs: "bg-sky-500/10 text-sky-400",
};

function toPortfolioCardProps(security: Security) {
  const positive = security.changePct >= 0;
  return {
    name: security.name,
    symbol: security.symbol,
    logoSymbol: security.logoSymbol,
    logoUrl: security.cmcId ? coinLogoUrl(security.cmcId) : null,
    value: formatGBP(security.value),
    change: `${positive ? "+" : ""}${security.changePct}%`,
    positive,
    accent: CATEGORY_ACCENT[security.category],
    sparkline: security.color,
    sparklinePoints: positive ? SPARKLINE_UP : SPARKLINE_DOWN,
  };
}

const MERCHANT_LOGOS: Record<string, string> = {
  "Trading 212": "/icons/platforms/trading212.png",
  Coinbase: "/icons/platforms/coinbase.png",
};

function toActivityItem(transaction: Transaction): ActivityItem {
  const positive = transaction.amount > 0;
  return {
    time: new Date(transaction.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    merchant: transaction.merchant,
    description: transaction.description,
    amount: `${positive ? "+" : "-"}£${Math.abs(transaction.amount).toFixed(2)}`,
    positive,
    initials: transaction.merchant.slice(0, 2).toUpperCase(),
    badgeClass: positive ? "bg-accent-soft text-accent" : "bg-zinc-500/15 text-zinc-600",
    logo: MERCHANT_LOGOS[transaction.merchant],
  };
}

export default async function DashboardPage() {
  const context = getPortfolioContext();
  const coachInsight = await generateCoachInsight({ context });
  const marketPulse = await getMarketPulseSnapshot();
  const forexRates = await getForexSnapshot();

  const portfolioCards = [...context.securities]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
    .map(toPortfolioCardProps);
  const recentActivity = context.recentTransactions.slice(0, 6).map(toActivityItem);

  const bestPerformer = context.securities.reduce((best, security) =>
    security.changePct > best.changePct ? security : best
  );
  // Matches the Goals page's headline number exactly: each goal's percentage
  // is rounded individually before averaging (same order as planGoal there),
  // not averaged as raw fractions, or the two pages round to different values.
  const overallGoalProgress = Math.round(
    context.goals.reduce((sum, goal) => sum + Math.round((goal.currentAmount / goal.targetAmount) * 100), 0) /
      (context.goals.length || 1)
  );
  const onTargetPct = Math.round(
    (context.goals.filter((goal) => planGoal(goal).status !== "Slightly behind").length /
      (context.goals.length || 1)) *
      100
  );
  // How much you're actually contributing to goals each month vs. what
  // every goal would need to hit its own deadline on time.
  const savingsCoverage = context.goals.reduce(
    (totals, goal) => {
      const { monthsUntilDeadline } = planGoal(goal);
      const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
      const neededMonthly = monthsUntilDeadline > 0 ? remaining / monthsUntilDeadline : remaining;
      return {
        contribution: totals.contribution + goal.monthlyContribution,
        needed: totals.needed + neededMonthly,
      };
    },
    { contribution: 0, needed: 0 }
  );
  const savingsCoveragePct =
    savingsCoverage.needed > 0 ? Math.round((savingsCoverage.contribution / savingsCoverage.needed) * 100) : 100;
  const snapshot = {
    netWorthChange: `+${formatGBP(context.weeklyChangeAbs)}`,
    bestPerformerLabel: bestPerformer.symbol,
    bestPerformerChange: `+${bestPerformer.changePct}%`,
    riskLevel: context.riskProfile,
    goalProgress: overallGoalProgress,
  };

  return (
    <>
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NetWorthCard
            netWorth={context.netWorth}
            netWorthChangePct={context.netWorthChangePct}
            history={context.netWorthHistory}
          />
        </div>
        <AICoachCard
          healthScore={coachInsight.healthScore}
          healthStatus={coachInsight.healthStatus}
          mainInsight={coachInsight.mainInsight}
          recommendation={coachInsight.recommendation}
          riskAlert={coachInsight.riskAlert}
        />

        <div className="lg:col-span-2">
          <ConnectedAccountsCard accounts={context.connectedAccounts} transactions={context.recentTransactions} />
        </div>
        <GoalsSummaryCard
          progressPct={overallGoalProgress}
          onTargetPct={onTargetPct}
          savingsCoveragePct={savingsCoveragePct}
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:-ml-[16.5rem] lg:w-[calc(100%+16.5rem)] lg:grid-cols-3">
        <TodaysSnapshot {...snapshot} />
        <ForexRatesCard rates={forexRates} />
        <MarketPulseCard snapshot={marketPulse} />
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:-ml-[16.5rem] lg:w-[calc(100%+16.5rem)]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-zinc-900">
              Your Portfolio
            </h2>
            <Link
              href="/dashboard/portfolio"
              className="text-sm font-medium text-accent transition-colors duration-300 ease-out hover:text-zinc-900"
            >
              View full portfolio →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioCards.map((item) => (
              <PortfolioCard key={item.symbol} {...item} />
            ))}
          </div>
        </div>

        <RecentActivity activities={recentActivity} period="Recent" />
      </div>
    </>
  );
}
