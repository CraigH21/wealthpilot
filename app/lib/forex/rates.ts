export type ForexPair = {
  base: string;
  quote: string;
  rate: number;
  changePct: number;
};

const FRANKFURTER_BASE = "https://api.frankfurter.dev/v1";

// Used only if Frankfurter is unreachable — keeps the card working rather
// than breaking entirely, same philosophy as the rest of the app's live
// data integrations.
const FALLBACK: ForexPair[] = [
  { base: "GBP", quote: "USD", rate: 1.27, changePct: 0.3 },
  { base: "GBP", quote: "EUR", rate: 1.16, changePct: 0.2 },
  { base: "USD", quote: "EUR", rate: 0.91, changePct: -0.1 },
  { base: "GBP", quote: "JPY", rate: 188.42, changePct: 0.4 },
];

function isoDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

/**
 * Frankfurter (ECB reference rates) — free, no API key, no rate-limit
 * headaches. `date` is either "latest" or an ISO date for a historical
 * lookup, used here to compute a week-over-week % change since ECB rates
 * only publish on business days (a 1-day lookback risks landing on a
 * weekend with no new rate at all).
 */
async function fetchRates(base: string, targets: string[], date: string): Promise<Record<string, number> | null> {
  try {
    const response = await fetch(`${FRANKFURTER_BASE}/${date}?from=${base}&to=${targets.join(",")}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error(`Frankfurter request failed with ${response.status}`);
    }
    const json: { rates?: Record<string, number> } = await response.json();
    return json.rates ?? null;
  } catch (error) {
    console.error(`Frankfurter unavailable for ${base}->${targets.join(",")}, using fallback:`, error);
    return null;
  }
}

export async function getForexSnapshot(): Promise<ForexPair[]> {
  const weekAgo = isoDateDaysAgo(7);

  const [gbpLatest, gbpPast, usdLatest, usdPast] = await Promise.all([
    fetchRates("GBP", ["USD", "EUR", "JPY"], "latest"),
    fetchRates("GBP", ["USD", "EUR", "JPY"], weekAgo),
    fetchRates("USD", ["EUR"], "latest"),
    fetchRates("USD", ["EUR"], weekAgo),
  ]);

  if (!gbpLatest || !gbpPast || !usdLatest || !usdPast) {
    return FALLBACK;
  }

  const changePct = (latest: number, past: number) => ((latest - past) / past) * 100;

  return [
    { base: "GBP", quote: "USD", rate: gbpLatest.USD, changePct: changePct(gbpLatest.USD, gbpPast.USD) },
    { base: "GBP", quote: "EUR", rate: gbpLatest.EUR, changePct: changePct(gbpLatest.EUR, gbpPast.EUR) },
    { base: "USD", quote: "EUR", rate: usdLatest.EUR, changePct: changePct(usdLatest.EUR, usdPast.EUR) },
    { base: "GBP", quote: "JPY", rate: gbpLatest.JPY, changePct: changePct(gbpLatest.JPY, gbpPast.JPY) },
  ];
}
