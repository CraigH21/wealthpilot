import { getMarketListings } from "../crypto/market";

export type MarketPulseItem = {
  label: string;
  value: string;
  changePercent: number;
};

export type MarketPulseSnapshot = {
  ftse: MarketPulseItem;
  sp500: MarketPulseItem;
  gold: MarketPulseItem;
  bitcoin: MarketPulseItem;
};

const YAHOO_CHART_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

type YahooChartResponse = {
  chart: {
    // Indices and futures (^FTSE, ^GSPC, GC=F) never carry `previousClose`
    // — only equities/ETFs do. Every instrument type does carry Yahoo's own
    // pre-computed `regularMarketChangePercent`, so use that directly rather
    // than deriving it (deriving it from a field that's sometimes absent is
    // exactly what produced a silent NaN for FTSE here before this fix).
    result: Array<{ meta: { regularMarketPrice: number; regularMarketChangePercent: number } }> | null;
  };
};

/**
 * Yahoo Finance's unofficial chart endpoint — same "no key, undocumented,
 * used because it just works" tradeoff as the keyless CoinMarketCap
 * endpoint `getMarketListings` already relies on. Alpha Vantage (used
 * elsewhere in this app) has no free endpoint for raw index/commodity
 * values — GLOBAL_QUOTE only covers individual equities/ETFs, so getting
 * FTSE 100 or gold spot price for real would mean pricing an ETF proxy
 * and guessing a conversion factor. This gets the real number directly.
 */
async function fetchYahooQuote(symbol: string): Promise<{ price: number; changePercent: number } | null> {
  try {
    const response = await fetch(
      `${YAHOO_CHART_BASE}/${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      { next: { revalidate: 300 }, headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!response.ok) {
      throw new Error(`Yahoo Finance request failed with ${response.status}`);
    }
    const json: YahooChartResponse = await response.json();
    const meta = json.chart.result?.[0]?.meta;
    if (!meta) {
      throw new Error("Yahoo Finance returned no data");
    }
    return {
      price: meta.regularMarketPrice,
      changePercent: meta.regularMarketChangePercent,
    };
  } catch (error) {
    console.error(`Yahoo Finance unavailable for ${symbol}, using fallback:`, error);
    return null;
  }
}

// Used only if Yahoo's endpoint is unreachable — keeps the card working
// rather than breaking entirely, same philosophy as the rest of the app's
// live-data integrations.
const FALLBACK = {
  ftse: { price: 8368, changePercent: 0.8 },
  sp500: { price: 5446, changePercent: 1.2 },
  gold: { price: 2650, changePercent: 0.4 }, // USD/oz — gold trades in USD, not GBP
};

const formatIndex = (value: number) => value.toLocaleString("en-GB", { maximumFractionDigits: 0 });

export async function getMarketPulseSnapshot(): Promise<MarketPulseSnapshot> {
  const [ftseQuote, spQuote, goldQuote, coins] = await Promise.all([
    fetchYahooQuote("^FTSE"),
    fetchYahooQuote("^GSPC"),
    fetchYahooQuote("GC=F"),
    getMarketListings(5),
  ]);

  const ftse = ftseQuote ?? FALLBACK.ftse;
  const sp500 = spQuote ?? FALLBACK.sp500;
  const gold = goldQuote ?? FALLBACK.gold;
  const btc = coins.find((coin) => coin.id === 1);

  return {
    ftse: { label: "FTSE 100", value: formatIndex(ftse.price), changePercent: ftse.changePercent },
    sp500: { label: "S&P 500", value: formatIndex(sp500.price), changePercent: sp500.changePercent },
    gold: { label: "Gold", value: `$${formatIndex(gold.price)}`, changePercent: gold.changePercent },
    bitcoin: btc
      ? { label: "Bitcoin", value: `£${formatIndex(btc.priceGBP)}`, changePercent: btc.percentChange24h }
      : { label: "Bitcoin", value: "£22,200", changePercent: 4.8 },
  };
}
