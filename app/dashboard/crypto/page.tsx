import AddWalletBar from "../../components/crypto/AddWalletBar";
import AllocationDonut, { type AllocationSlice } from "../../components/crypto/AllocationDonut";
import ConnectedWallets from "../../components/crypto/ConnectedWallets";
import CryptoHoldings, { type CryptoHoldingRow } from "../../components/crypto/CryptoHoldings";
import CryptoPortfolioCard from "../../components/crypto/CryptoPortfolioCard";
import MarketTable from "../../components/crypto/MarketTable";
import TopMovers from "../../components/crypto/TopMovers";
import { getGlobalMarketCap, getMarketListings } from "../../lib/crypto/market";
import { getCryptoAllocations, getCryptoValueHistory, getPortfolioContext } from "../../lib/mock/portfolioContext";

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

export default async function CryptoPage() {
  const context = getPortfolioContext();
  const [marketCoins, globalMarketCap] = await Promise.all([getMarketListings(100), getGlobalMarketCap()]);
  const cryptoHistory = getCryptoValueHistory();

  const cryptoSecurities = context.securities.filter((s) => s.category === "Crypto");
  const cryptoAccounts = context.connectedAccounts.filter((a) => a.category === "crypto");
  const totalValue = cryptoSecurities.reduce((sum, s) => sum + s.value, 0);

  const marketBySymbol = new Map(marketCoins.map((coin) => [coin.symbol, coin]));

  const holdings: CryptoHoldingRow[] = cryptoSecurities.map((security) => {
    const live = marketBySymbol.get(security.symbol);
    const currentPriceGBP = live?.priceGBP ?? null;
    const quantity = currentPriceGBP && currentPriceGBP > 0 ? security.value / currentPriceGBP : null;
    const totalPL =
      security.avgBuyPriceGBP != null && quantity !== null
        ? (currentPriceGBP! - security.avgBuyPriceGBP) * quantity
        : null;

    return {
      symbol: security.symbol,
      name: security.name,
      color: security.color,
      cmcId: security.cmcId,
      quantity,
      avgBuyPriceGBP: security.avgBuyPriceGBP ?? null,
      currentPriceGBP,
      value: security.value,
      changePct: live ? Math.round(live.percentChange24h * 10) / 10 : security.changePct,
      totalPL,
      allocationPct: totalValue > 0 ? Math.round((security.value / totalValue) * 1000) / 10 : 0,
    };
  });

  // "Today's" change is genuinely computed: each of Peter's coins' live 24h
  // move applied to how much of that coin he actually holds, then summed —
  // not a flat portfolio-wide percentage.
  const changeToday = holdings.reduce((sum, h) => sum + h.value * (h.changePct / 100), 0);
  const changePct = totalValue > 0 ? Math.round((changeToday / totalValue) * 1000) / 10 : 0;
  const totalProfit = holdings.reduce((sum, h) => sum + (h.totalPL ?? 0), 0);
  const bestPerformer = [...holdings].sort((a, b) => b.changePct - a.changePct)[0];

  const allocationSlices: AllocationSlice[] = cryptoSecurities
    .map((security) => ({
      symbol: security.symbol,
      name: security.name,
      value: security.value,
      pct: totalValue > 0 ? Math.round((security.value / totalValue) * 1000) / 10 : 0,
      color: security.color,
    }))
    .sort((a, b) => b.value - a.value);

  const globalMarketCapPositive = globalMarketCap.percentChange24h >= 0;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">Crypto</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Track your crypto portfolio and the live crypto market.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <AddWalletBar />

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Global Market Cap
          </span>
          <span className="text-sm font-semibold text-zinc-50">{formatGBP(globalMarketCap.totalMarketCapGBP)}</span>
          <span
            className={`text-xs font-medium ${globalMarketCapPositive ? "text-accent" : "text-red-400"}`}
          >
            {globalMarketCapPositive ? "+" : ""}
            {Math.round(globalMarketCap.percentChange24h * 100) / 100}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CryptoPortfolioCard
            totalValue={totalValue}
            changeToday={changeToday}
            changePct={changePct}
            totalProfit={totalProfit}
            bestPerformerSymbol={bestPerformer?.symbol ?? ""}
            bestPerformerChangePct={bestPerformer?.changePct ?? 0}
            history={cryptoHistory}
          />
        </div>
        <div className="flex flex-col gap-6">
          <AllocationDonut slices={allocationSlices} total={totalValue} />
          <TopMovers coins={marketCoins} />
        </div>
      </div>

      <CryptoHoldings holdings={holdings} />

      <ConnectedWallets accounts={cryptoAccounts} allocations={getCryptoAllocations()} />

      <MarketTable coins={marketCoins} />
    </div>
  );
}
