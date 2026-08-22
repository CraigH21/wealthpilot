import Navbar from "../components/Navbar";
import SidebarNav from "../components/SidebarNav";
import ProUpsellCard from "../components/ProUpsellCard";
import NetWorthCard from "../components/NetWorthCard";
import AICoachCard from "../components/AICoachCard";
import QuickActionsCard from "../components/QuickActionsCard";
import PortfolioCard from "../components/PortfolioCard";
import RecentActivity from "../components/RecentActivity";

const PORTFOLIO = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    logoSymbol: "BTCUSD",
    value: "£52,340",
    change: "+4.8%",
    positive: true,
    accent: "bg-orange-500/10 text-orange-400",
    sparkline: "#f79414",
    sparklinePoints: "0,28 10,24 20,26 30,18 40,20 50,14 60,17 70,10 80,12 90,6 100,4",
  },
  {
    name: "Nvidia",
    symbol: "NVDA",
    logoSymbol: "NVDA",
    value: "£38,120",
    change: "+6.1%",
    positive: true,
    accent: "bg-accent-soft text-accent",
    sparkline: "#78ba00",
    sparklinePoints: "0,30 10,26 20,28 30,20 40,16 50,18 60,10 70,13 80,8 90,10 100,3",
  },
  {
    name: "S&P 500 ETF",
    symbol: "SPY",
    logoSymbol: "SPY",
    value: "£71,200",
    change: "+1.2%",
    positive: true,
    accent: "bg-sky-500/10 text-sky-400",
    sparkline: "#7aaa6c",
    sparklinePoints: "0,26 10,24 20,25 30,20 40,18 50,19 60,14 70,15 80,10 90,11 100,6",
  },
  {
    name: "Cash",
    symbol: "GBP",
    logoSymbol: null,
    value: "£22,660",
    change: "0.0%",
    positive: true,
    accent: "bg-zinc-500/10 text-zinc-300",
    sparkline: "#a1a1aa",
    sparklinePoints: "0,20 20,19 40,20 60,19 80,20 100,19",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen text-zinc-50">
      <main className="mx-auto w-[94%] max-w-[1600px] py-6 sm:py-10">
        <div className="glass-edge-shell relative overflow-hidden rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.55),inset_4px_4px_10px_rgba(255,255,255,0.14),inset_-3px_-3px_8px_var(--accent-soft)] backdrop-blur-[24px] sm:rounded-[32px]">
          {/* theme-matched ambient wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,var(--accent-soft),transparent_60%),radial-gradient(55%_45%_at_100%_100%,var(--accent-soft),transparent_60%)]"
          />

          {/* very subtle white reflection across the top of the shell */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.08] to-transparent"
          />

          <div className="relative">
            <Navbar />

            <div className="grid grid-cols-1 gap-6 px-5 pb-5 pt-1 sm:px-8 sm:pb-8 sm:pt-2 lg:grid-cols-[15rem_1fr] lg:px-10 lg:pb-10 lg:pt-3">
              <SidebarNav />

              <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <NetWorthCard />
                </div>
                <div className="flex flex-col gap-6">
                  <AICoachCard />
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
                    {PORTFOLIO.map((item) => (
                      <PortfolioCard key={item.symbol} {...item} />
                    ))}
                  </div>
                </div>

                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
