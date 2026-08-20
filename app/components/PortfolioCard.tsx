type PortfolioCardProps = {
  name: string;
  symbol: string;
  value: string;
  change: string;
  positive: boolean;
  accent: string;
};

export default function PortfolioCard({
  name,
  symbol,
  value,
  change,
  positive,
  accent,
}: PortfolioCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 shadow-lg shadow-black/30 transition-colors hover:border-white/10">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold transition-colors duration-500 ease-out ${accent}`}
        >
          {symbol}
        </span>
        <div>
          <p className="text-sm font-medium text-zinc-50">{name}</p>
          <p className="text-xs text-zinc-500">{symbol}</p>
        </div>
      </div>

      <p className="mt-4 text-2xl font-semibold text-zinc-50">{value}</p>
      <p
        className={`mt-1 text-sm font-medium transition-colors duration-500 ease-out ${
          positive ? "text-accent" : "text-red-400"
        }`}
      >
        {change}
      </p>
    </div>
  );
}
