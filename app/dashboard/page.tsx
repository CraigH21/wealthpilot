import ProUpsellCard from "../components/ProUpsellCard";
import NetWorthCard from "../components/NetWorthCard";
import AICoachCard from "../components/AICoachCard";
import QuickActionsCard from "../components/QuickActionsCard";
import PortfolioCard from "../components/PortfolioCard";
import RecentActivity, { type ActivityItem } from "../components/RecentActivity";
import { generateCoachInsight } from "../lib/ai/coachService";
import { coinLogoUrl } from "../lib/crypto/market";
import { getPortfolioContext, type Security, type Transaction } from "../lib/mock/portfolioContext";

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
    badgeClass: positive ? "bg-accent-soft text-accent" : "bg-zinc-500/15 text-zinc-300",
    logo: MERCHANT_LOGOS[transaction.merchant],
  };
}

export default async function DashboardPage() {
  const context = getPortfolioContext();
  const coachInsight = await generateCoachInsight({ context });

  const portfolioCards = [...context.securities]
    .sort((a, b) => b.value - a.value)
    .map(toPortfolioCardProps);
  const recentActivity = context.recentTransactions.slice(0, 6).map(toActivityItem);

  return (
    <>
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NetWorthCard
            netWorth={context.netWorth}
            netWorthChangePct={context.netWorthChangePct}
            history={context.netWorthHistory}
            accounts={context.connectedAccounts}
          />
        </div>
        <div className="flex flex-col gap-6">
          <AICoachCard
            healthScore={coachInsight.healthScore}
            healthStatus={coachInsight.healthStatus}
            mainInsight={coachInsight.mainInsight}
            recommendation={coachInsight.recommendation}
            riskAlert={coachInsight.riskAlert}
          />
          <QuickActionsCard />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mt-auto">
          <ProUpsellCard />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <div>
          <h2 className="mb-4 text-base font-semibold text-zinc-50">
            Your Portfolio
          </h2>
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
