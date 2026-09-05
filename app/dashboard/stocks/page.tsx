import AddBrokerBar from "../../components/stocks/AddBrokerBar";
import ConnectedBrokers from "../../components/stocks/ConnectedBrokers";
import StockHoldings, { type StockHoldingRow } from "../../components/stocks/StockHoldings";
import StockMarketTable from "../../components/stocks/StockMarketTable";
import StockPortfolioCard from "../../components/stocks/StockPortfolioCard";
import StockTopMovers from "../../components/stocks/StockTopMovers";
import AllocationDonut, { type AllocationSlice } from "../../components/crypto/AllocationDonut";
import { getStockMarketSnapshot } from "../../lib/stocks/market";
import { getPortfolioContext, getStockValueHistory } from "../../lib/mock/portfolioContext";

export default async function StocksPage() {
  const context = getPortfolioContext();
  const snapshot = await getStockMarketSnapshot();
  const stockHistory = getStockValueHistory();

  const stockSecurities = context.securities.filter((s) => s.category === "Stocks" || s.category === "ETFs");
  const stockAccounts = context.connectedAccounts.filter((a) => a.category === "broker");
  const totalValue = stockSecurities.reduce((sum, s) => sum + s.value, 0);

  const holdings: StockHoldingRow[] = stockSecurities.map((security) => {
    const currentPriceGBP = security.currentPriceGBP ?? null;
    const quantity = currentPriceGBP && currentPriceGBP > 0 ? security.value / currentPriceGBP : null;
    const totalPL =
      security.avgBuyPriceGBP != null && quantity !== null
        ? (currentPriceGBP! - security.avgBuyPriceGBP) * quantity
        : null;

    return {
      symbol: security.symbol,
      name: security.name,
      color: security.color,
      logoSymbol: security.logoSymbol,
      quantity,
      avgBuyPriceGBP: security.avgBuyPriceGBP ?? null,
      currentPriceGBP,
      value: security.value,
      changePct: security.changePct,
      totalPL,
      allocationPct: totalValue > 0 ? Math.round((security.value / totalValue) * 1000) / 10 : 0,
    };
  });

  // Same as the crypto page: "today's" change is each holding's own move
  // applied to how much of it is actually held, then summed.
  const changeToday = holdings.reduce((sum, h) => sum + h.value * (h.changePct / 100), 0);
  const changePct = totalValue > 0 ? Math.round((changeToday / totalValue) * 1000) / 10 : 0;
  const totalProfit = holdings.reduce((sum, h) => sum + (h.totalPL ?? 0), 0);
  const bestPerformer = [...holdings].sort((a, b) => b.changePct - a.changePct)[0];

  const allocationSlices: AllocationSlice[] = stockSecurities
    .map((security) => ({
      symbol: security.symbol,
      name: security.name,
      value: security.value,
      pct: totalValue > 0 ? Math.round((security.value / totalValue) * 1000) / 10 : 0,
      color: security.color,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Stocks</h1>
          <p className="mt-1.5 text-sm text-zinc-600">
            Track your stocks and ETFs, and the live US stock market.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <AddBrokerBar />

        <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/5 px-4 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
            Market Data
          </span>
          <span className="text-sm font-semibold text-zinc-900">Alpha Vantage</span>
          <span className="text-xs font-medium text-accent">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StockPortfolioCard
            totalValue={totalValue}
            changeToday={changeToday}
            changePct={changePct}
            totalProfit={totalProfit}
            bestPerformerSymbol={bestPerformer?.symbol ?? ""}
            bestPerformerChangePct={bestPerformer?.changePct ?? 0}
            history={stockHistory}
          />
        </div>
        <div className="flex flex-col gap-6">
          <AllocationDonut slices={allocationSlices} total={totalValue} />
          <StockTopMovers snapshot={snapshot} />
        </div>
      </div>

      <StockHoldings holdings={holdings} />

      <ConnectedBrokers accounts={stockAccounts} securities={stockSecurities} />

      <StockMarketTable snapshot={snapshot} />
    </div>
  );
}
