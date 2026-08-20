export default function AIInsightCard() {
  return (
    <section className="flex items-start gap-4 rounded-2xl border border-accent-border bg-accent-soft p-6 shadow-lg shadow-black/20 transition-colors duration-500 ease-out">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors duration-500 ease-out">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-accent transition-colors duration-500 ease-out">
          AI Insight
        </p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-300">
          Your portfolio gained £418 this week. Nvidia and Bitcoin were your
          biggest contributors.
        </p>
      </div>
    </section>
  );
}
