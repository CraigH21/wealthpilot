import Navbar from "./components/Navbar";
import NetWorthCard from "./components/NetWorthCard";
import PortfolioCard from "./components/PortfolioCard";
import AIInsightCard from "./components/AIInsightCard";

const PORTFOLIO = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    value: "£52,340",
    change: "+4.8%",
    positive: true,
    accent: "bg-orange-500/10 text-orange-400",
  },
  {
    name: "Nvidia",
    symbol: "NVDA",
    value: "£38,120",
    change: "+6.1%",
    positive: true,
    accent: "bg-accent-soft text-accent",
  },
  {
    name: "S&P 500 ETF",
    symbol: "SPY",
    value: "£71,200",
    change: "+1.2%",
    positive: true,
    accent: "bg-sky-500/10 text-sky-400",
  },
  {
    name: "Cash",
    symbol: "GBP",
    value: "£22,660",
    change: "0.0%",
    positive: true,
    accent: "bg-zinc-500/10 text-zinc-300",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <NetWorthCard />

        <div>
          <h2 className="mb-4 text-base font-semibold text-zinc-50">
            Your Portfolio
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PORTFOLIO.map((item) => (
              <PortfolioCard key={item.symbol} {...item} />
            ))}
          </div>
        </div>

        <AIInsightCard />
      </main>
    </div>
  );
}
