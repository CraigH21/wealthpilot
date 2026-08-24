export type MarketCoin = {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  slug: string;
  priceGBP: number;
  percentChange24h: number;
  percentChange7d: number;
  marketCapGBP: number;
  volume24hGBP: number;
  tags: string[];
};

export type MarketCategory =
  | "all"
  | "top100"
  | "defi"
  | "ai"
  | "gaming"
  | "memecoins"
  | "stablecoins"
  | "layer1";

const AI_TAGS = ["ai-agents", "ai-applications", "ai-big-data", "generative-ai", "ai-agent-launchpad"];

/** Matches a coin's real CoinMarketCap tags against a filter chip. Uses an
 * exact-set match for "ai" rather than a substring test — tags like
 * "taiko-ecosystem" contain the letters "ai" but aren't AI-related. */
export function coinMatchesCategory(coin: MarketCoin, category: MarketCategory): boolean {
  switch (category) {
    case "all":
      return true;
    case "top100":
      return coin.rank <= 100;
    case "defi":
      return coin.tags.some((tag) => tag.includes("defi"));
    case "ai":
      return coin.tags.some((tag) => AI_TAGS.includes(tag));
    case "gaming":
      return coin.tags.some((tag) => tag.includes("gaming"));
    case "memecoins":
      return coin.tags.some((tag) => tag.includes("meme"));
    case "stablecoins":
      return coin.tags.some((tag) => tag.includes("stablecoin"));
    case "layer1":
      return coin.tags.includes("layer-1");
  }
}

export const coinLogoUrl = (id: number) => `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;

const CMC_KEYLESS_BASE = "https://pro-api.coinmarketcap.com/public-api/v1";

type CmcListing = {
  id: number;
  cmc_rank: number;
  name: string;
  symbol: string;
  slug: string;
  tags: string[];
  quote: {
    GBP: {
      price: number;
      percent_change_24h: number;
      percent_change_7d: number;
      market_cap: number;
      volume_24h: number;
    };
  };
};

// A small, realistic fallback in the real API's shape — used only if the
// keyless CoinMarketCap endpoint is unreachable or rate-limited (it shares
// an IP-based pool with no key, so this is a real possibility, not
// theoretical). Keeps the page working rather than breaking entirely.
const FALLBACK_LISTINGS: MarketCoin[] = [
  { id: 1, rank: 1, name: "Bitcoin", symbol: "BTC", slug: "bitcoin", priceGBP: 57200, percentChange24h: 0.8, percentChange7d: 22.9, marketCapGBP: 1149500000000, volume24hGBP: 29800000000, tags: ["layer-1"] },
  { id: 1027, rank: 2, name: "Ethereum", symbol: "ETH", slug: "ethereum", priceGBP: 1823, percentChange24h: 1.3, percentChange7d: 30.8, marketCapGBP: 220000000000, volume24hGBP: 15100000000, tags: ["layer-1", "defi"] },
  { id: 825, rank: 3, name: "Tether", symbol: "USDT", slug: "tether", priceGBP: 0.78, percentChange24h: 0.0, percentChange7d: 0.1, marketCapGBP: 112000000000, volume24hGBP: 62300000000, tags: ["stablecoin", "usd-stablecoin"] },
  { id: 1839, rank: 4, name: "BNB", symbol: "BNB", slug: "bnb", priceGBP: 484, percentChange24h: 1.8, percentChange7d: 5.2, marketCapGBP: 70600000000, volume24hGBP: 2800000000, tags: ["layer-1"] },
  { id: 5426, rank: 5, name: "Solana", symbol: "SOL", slug: "solana", priceGBP: 140, percentChange24h: 5.8, percentChange7d: 12.4, marketCapGBP: 66100000000, volume24hGBP: 6900000000, tags: ["layer-1"] },
  { id: 3408, rank: 6, name: "USDC", symbol: "USDC", slug: "usd-coin", priceGBP: 0.78, percentChange24h: 0.0, percentChange7d: 0.0, marketCapGBP: 33800000000, volume24hGBP: 9400000000, tags: ["stablecoin", "usd-stablecoin"] },
  { id: 52, rank: 7, name: "XRP", symbol: "XRP", slug: "xrp", priceGBP: 0.52, percentChange24h: 2.0, percentChange7d: 4.1, marketCapGBP: 29700000000, volume24hGBP: 2100000000, tags: [] },
  { id: 74, rank: 8, name: "Dogecoin", symbol: "DOGE", slug: "dogecoin", priceGBP: 0.14, percentChange24h: -0.8, percentChange7d: 3.2, marketCapGBP: 20400000000, volume24hGBP: 1900000000, tags: ["memes"] },
  { id: 1958, rank: 9, name: "Toncoin", symbol: "TON", slug: "toncoin", priceGBP: 5.21, percentChange24h: 4.4, percentChange7d: 8.9, marketCapGBP: 18200000000, volume24hGBP: 421000000, tags: ["layer-1"] },
  { id: 2010, rank: 10, name: "Cardano", symbol: "ADA", slug: "cardano", priceGBP: 0.41, percentChange24h: 2.1, percentChange7d: 6.7, marketCapGBP: 14600000000, volume24hGBP: 756000000, tags: ["layer-1"] },
  { id: 6210, rank: 24, name: "Chainlink", symbol: "LINK", slug: "chainlink", priceGBP: 11.20, percentChange24h: 3.1, percentChange7d: 9.4, marketCapGBP: 7600000000, volume24hGBP: 412000000, tags: ["defi", "ai-big-data"] },
];

/**
 * Fetches live listings from CoinMarketCap's keyless public API
 * (pro-api.coinmarketcap.com/public-api — no key, shared IP rate pool).
 * Falls back to a small static dataset in the same shape if that request
 * fails, so the page degrades gracefully rather than breaking.
 */
export async function getMarketListings(limit = 100): Promise<MarketCoin[]> {
  try {
    const response = await fetch(
      `${CMC_KEYLESS_BASE}/cryptocurrency/listings/latest?limit=${limit}&convert=GBP`,
      { next: { revalidate: 120 } }
    );
    if (!response.ok) {
      throw new Error(`CoinMarketCap request failed with ${response.status}`);
    }
    const json: { data: CmcListing[] } = await response.json();
    return json.data.map((coin) => ({
      id: coin.id,
      rank: coin.cmc_rank,
      name: coin.name,
      symbol: coin.symbol,
      slug: coin.slug,
      priceGBP: coin.quote.GBP.price,
      percentChange24h: coin.quote.GBP.percent_change_24h,
      percentChange7d: coin.quote.GBP.percent_change_7d,
      marketCapGBP: coin.quote.GBP.market_cap,
      volume24hGBP: coin.quote.GBP.volume_24h,
      tags: coin.tags ?? [],
    }));
  } catch (error) {
    console.error("CoinMarketCap keyless API unavailable, using fallback listings:", error);
    return FALLBACK_LISTINGS;
  }
}

export type GlobalMarketCap = { totalMarketCapGBP: number; percentChange24h: number };

const FALLBACK_GLOBAL_MARKET_CAP: GlobalMarketCap = { totalMarketCapGBP: 1950000000000, percentChange24h: 0.9 };

export async function getGlobalMarketCap(): Promise<GlobalMarketCap> {
  try {
    const response = await fetch(`${CMC_KEYLESS_BASE}/global-metrics/quotes/latest?convert=GBP`, {
      next: { revalidate: 120 },
    });
    if (!response.ok) {
      throw new Error(`CoinMarketCap global metrics request failed with ${response.status}`);
    }
    const json = await response.json();
    const quote = json.data.quote.GBP;
    return {
      totalMarketCapGBP: quote.total_market_cap,
      percentChange24h: quote.total_market_cap_yesterday_percentage_change,
    };
  } catch (error) {
    console.error("CoinMarketCap global metrics unavailable, using fallback:", error);
    return FALLBACK_GLOBAL_MARKET_CAP;
  }
}
