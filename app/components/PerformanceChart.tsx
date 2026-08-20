const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export default function PerformanceChart() {
  return (
    <section className="rounded-3xl border border-white/5 bg-zinc-900/40 p-6 shadow-xl shadow-black/30 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-50">
          Portfolio Performance
        </h2>
        <span className="text-xs font-medium text-zinc-500">Last 6 months</span>
      </div>

      <svg
        viewBox="0 0 400 160"
        className="h-40 w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopOpacity="0.35"
              className="[stop-color:var(--accent)] transition-[stop-color] duration-500 ease-out"
            />
            <stop
              offset="100%"
              stopOpacity="0"
              className="[stop-color:var(--accent)] transition-[stop-color] duration-500 ease-out"
            />
          </linearGradient>
        </defs>
        <path
          d="M0,120 L40,110 L80,125 L120,90 L160,100 L200,60 L240,75 L280,45 L320,55 L360,20 L400,30 L400,160 L0,160 Z"
          fill="url(#perfFill)"
        />
        <path
          d="M0,120 L40,110 L80,125 L120,90 L160,100 L200,60 L240,75 L280,45 L320,55 L360,20 L400,30"
          fill="none"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-accent transition-[stroke] duration-500 ease-out"
        />
      </svg>

      <div className="mt-4 flex justify-between text-xs text-zinc-500">
        {MONTHS.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </section>
  );
}
