import PortfolioGraph from "./PortfolioGraph";

export default function NetWorthCard() {
  return (
    <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-8 shadow-2xl shadow-black/40 sm:p-10">
      <p className="text-sm font-medium text-zinc-400">Total Net Worth</p>

      <div className="mt-3 flex flex-wrap items-end gap-4">
        <h1 className="text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
          £184,320
        </h1>

        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent transition-colors duration-500 ease-out">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
          +3.2% this month
        </span>
      </div>

      <p className="mt-2 text-sm text-zinc-500">Across all connected accounts</p>

      <PortfolioGraph />
    </section>
  );
}
