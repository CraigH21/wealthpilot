import Navbar from "../components/Navbar";
import SidebarNav from "../components/SidebarNav";
import { getPortfolioContext } from "../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const context = getPortfolioContext();
  const bestPerformer = context.securities.reduce((best, security) =>
    security.changePct > best.changePct ? security : best
  );
  const emergencyFund = context.goals.find((goal) => goal.id === "emergency-fund");
  const goalProgress = emergencyFund
    ? Math.round((emergencyFund.currentAmount / emergencyFund.targetAmount) * 100)
    : 0;

  const snapshot = {
    netWorthChange: `+${formatGBP(context.weeklyChangeAbs)}`,
    bestPerformerLabel: bestPerformer.symbol,
    bestPerformerChange: `+${bestPerformer.changePct}%`,
    riskLevel: context.riskProfile,
    goalProgress,
  };

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
              <SidebarNav snapshot={snapshot} />
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
