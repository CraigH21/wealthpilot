export type StockMover = {
  symbol: string;
  price: number;
  changeAmount: number;
  changePercent: number;
  volume: number;
};

export type StockMarketSnapshot = {
  gainers: StockMover[];
  losers: StockMover[];
  mostActive: StockMover[];
  lastUpdated: string;
};

const ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query";

/** Same logo CDN `PortfolioCard.tsx` already uses for stock logos. */
export const stockLogoUrl = (symbol: string) => `https://financialmodelingprep.com/image-stock/${symbol}.png`;

type RawMover = {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
};

function mapMovers(raw: RawMover[] | undefined): StockMover[] {
  return (raw ?? []).map((item) => ({
    symbol: item.ticker,
    price: parseFloat(item.price),
    changeAmount: parseFloat(item.change_amount),
    changePercent: parseFloat(item.change_percentage.replace("%", "")),
    volume: parseInt(item.volume, 10),
  }));
}

// A small static fallback in the real shape — used if the key is missing,
// the free tier's 25-requests/day cap is hit, or the request otherwise
// fails, so the page degrades gracefully rather than breaking.
const FALLBACK_SNAPSHOT: StockMarketSnapshot = {
  gainers: [
    { symbol: "NVDA", price: 145.2, changeAmount: 9.8, changePercent: 7.2, volume: 42_000_000 },
    { symbol: "AMD", price: 118.4, changeAmount: 6.1, changePercent: 5.4, volume: 31_000_000 },
    { symbol: "TSLA", price: 210.6, changeAmount: 8.9, changePercent: 4.4, volume: 55_000_000 },
  ],
  losers: [
    { symbol: "INTC", price: 22.1, changeAmount: -1.3, changePercent: -5.6, volume: 28_000_000 },
    { symbol: "PYPL", price: 58.3, changeAmount: -2.4, changePercent: -4.0, volume: 12_000_000 },
    { symbol: "SNAP", price: 9.8, changeAmount: -0.3, changePercent: -3.0, volume: 18_000_000 },
  ],
  mostActive: [
    { symbol: "AAPL", price: 248.3, changeAmount: 3.1, changePercent: 1.3, volume: 62_000_000 },
    { symbol: "MSFT", price: 380.5, changeAmount: 4.2, changePercent: 1.1, volume: 24_000_000 },
    { symbol: "NVDA", price: 145.2, changeAmount: 9.8, changePercent: 7.2, volume: 42_000_000 },
  ],
  lastUpdated: "Live data unavailable — showing recent snapshot",
};

/**
 * Fetches gainers/losers/most-active from Alpha Vantage's TOP_GAINERS_LOSERS
 * endpoint — one request covers all three, which matters a lot given the
 * free tier caps at 25 requests/day (plus a 1-req/second burst limit).
 * Cached for 2 hours server-side to stay well under that budget.
 */
export async function getStockMarketSnapshot(): Promise<StockMarketSnapshot> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.error("ALPHA_VANTAGE_API_KEY is not set — using fallback stock market data.");
    return FALLBACK_SNAPSHOT;
  }

  try {
    const response = await fetch(`${ALPHA_VANTAGE_BASE}?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`, {
      next: { revalidate: 7200 },
    });
    if (!response.ok) {
      throw new Error(`Alpha Vantage request failed with ${response.status}`);
    }
    const json = await response.json();

    // Throttled/error responses come back as HTTP 200 with an
    // "Information"/"Note" field instead of the real payload — a naive
    // `response.ok` check alone would treat this as success.
    if (!json.top_gainers) {
      throw new Error(json.Information ?? json.Note ?? "Alpha Vantage returned no market data");
    }

    return {
      gainers: mapMovers(json.top_gainers),
      losers: mapMovers(json.top_losers),
      mostActive: mapMovers(json.most_actively_traded),
      lastUpdated: json.last_updated ?? "just now",
    };
  } catch (error) {
    console.error("Alpha Vantage unavailable, using fallback stock market data:", error);
    return FALLBACK_SNAPSHOT;
  }
}
