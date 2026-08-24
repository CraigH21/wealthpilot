import EdgeGlow from "../EdgeGlow";
import { coinLogoUrl } from "../../lib/crypto/market";

export type CryptoHoldingRow = {
  symbol: string;
  name: string;
  color: string;
  cmcId?: number;
  quantity: number | null;
  avgBuyPriceGBP: number | null;
  currentPriceGBP: number | null;
  value: number;
  changePct: number;
  totalPL: number | null;
  allocationPct: number;
};

const formatGBP = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits,
  }).format(value);

export default function CryptoHoldings({ holdings }: { holdings: CryptoHoldingRow[] }) {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalPL = holdings.reduce((sum, h) => sum + (h.totalPL ?? 0), 0);
  const totalPLPositive = totalPL >= 0;
  const overallChangePct =
    totalValue > 0 ? Math.round((holdings.reduce((sum, h) => sum + h.value * h.changePct, 0) / totalValue) * 10) / 10 : 0;
  const overallChangePositive = overallChangePct >= 0;

  return (
    <div className="glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <EdgeGlow />

      <div className="relative flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-50">My Crypto Holdings</h2>
          <p className="mt-1 text-sm text-zinc-500">Your complete holdings, performance and value</p>
        </div>
        <p className="text-sm text-zinc-500">
          Total holdings value <span className="font-medium text-zinc-50">{formatGBP(totalValue)}</span>
        </p>
      </div>

      {/* Capped to roughly 4 rows tall — thead/tfoot stay pinned via sticky
          positioning so column labels and the total stay visible while any
          extra holdings beyond that scroll underneath them. */}
      <div className="relative mt-5 max-h-[340px] overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="text-xs uppercase tracking-wide text-zinc-500">
              <th className="pb-3 pr-2 font-medium">#</th>
              <th className="pb-3 pr-2 font-medium">Coin</th>
              <th className="pb-3 pr-2 font-medium">Symbol</th>
              <th className="pb-3 pr-2 text-right font-medium">Holdings</th>
              <th className="pb-3 pr-2 text-right font-medium">Avg. Buy Price</th>
              <th className="pb-3 pr-2 text-right font-medium">Current Price</th>
              <th className="pb-3 pr-2 text-right font-medium">Value (GBP)</th>
              <th className="pb-3 pr-2 text-right font-medium">24h %</th>
              <th className="pb-3 pr-2 text-right font-medium">Total P&amp;L</th>
              <th className="pb-3 pl-2 text-right font-medium">% of Portfolio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {holdings.map((holding, index) => {
              const positive24h = holding.changePct >= 0;
              const plPositive = (holding.totalPL ?? 0) >= 0;
              return (
                <tr key={holding.symbol} className="transition-colors duration-300 ease-out hover:bg-white/5">
                  <td className="py-3 pr-2 text-zinc-500">{index + 1}</td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      {holding.cmcId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coinLogoUrl(holding.cmcId)}
                          alt=""
                          className="h-7 w-7 shrink-0 rounded-full bg-white/10 object-cover"
                        />
                      ) : (
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                          style={{ backgroundColor: `${holding.color}1a`, color: holding.color }}
                        >
                          {holding.symbol.slice(0, 3)}
                        </span>
                      )}
                      <span className="font-medium text-zinc-50">{holding.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2 text-zinc-400">{holding.symbol}</td>
                  <td className="py-3 pr-2 text-right text-zinc-300">
                    {holding.quantity !== null ? `${holding.quantity.toFixed(4)} ${holding.symbol}` : "—"}
                  </td>
                  <td className="py-3 pr-2 text-right text-zinc-300">
                    {holding.avgBuyPriceGBP !== null ? formatGBP(holding.avgBuyPriceGBP, 2) : "—"}
                  </td>
                  <td className="py-3 pr-2 text-right text-zinc-300">
                    {holding.currentPriceGBP !== null ? formatGBP(holding.currentPriceGBP, 2) : "—"}
                  </td>
                  <td className="py-3 pr-2 text-right font-medium text-zinc-50">{formatGBP(holding.value)}</td>
                  <td className={`py-3 pr-2 text-right font-medium ${positive24h ? "text-accent" : "text-red-400"}`}>
                    {positive24h ? "+" : ""}
                    {holding.changePct}%
                  </td>
                  <td className={`py-3 pr-2 text-right font-medium ${plPositive ? "text-accent" : "text-red-400"}`}>
                    {holding.totalPL !== null ? `${plPositive ? "+" : ""}${formatGBP(holding.totalPL)}` : "—"}
                  </td>
                  <td className="py-3 pl-2 text-right text-zinc-300">{holding.allocationPct}%</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 z-10">
            <tr className="border-t border-white/10 text-sm font-semibold text-zinc-50">
              <td className="py-3 pr-2" colSpan={6}>
                TOTAL
              </td>
              <td className="py-3 pr-2 text-right">{formatGBP(totalValue)}</td>
              <td className={`py-3 pr-2 text-right ${overallChangePositive ? "text-accent" : "text-red-400"}`}>
                {overallChangePositive ? "+" : ""}
                {overallChangePct}%
              </td>
              <td className={`py-3 pr-2 text-right ${totalPLPositive ? "text-accent" : "text-red-400"}`}>
                {totalPLPositive ? "+" : ""}
                {formatGBP(totalPL)}
              </td>
              <td className="py-3 pl-2 text-right">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
