"use client";

import { useRef, useState } from "react";

const CONNECTED_ACCOUNTS = [
  { name: "Trading 212", logo: "/icons/platforms/trading212.png" },
  { name: "Coinbase", logo: "/icons/platforms/coinbase.png" },
  { name: "Kraken", logo: "/icons/platforms/kraken.png" },
  { name: "Barclays", logo: "/icons/platforms/barclays.png" },
  { name: "Monzo", logo: "/icons/platforms/monzo.png" },
  { name: "MetaMask", logo: "/icons/platforms/metamask.png" },
];

const BARS = [28, 40, 52, 66, 78, 94];

const SIDEBAR_ITEMS = [
  "Dashboard",
  "Portfolio",
  "Accounts",
  "AI Coach",
  "Goals",
  "Analytics",
  "Settings",
];

const ALLOCATION = [
  { label: "Crypto", pct: 42, color: "#34d399" },
  { label: "Stocks", pct: 28, color: "#38bdf8" },
  { label: "Cash", pct: 18, color: "#a78bfa" },
  { label: "Other", pct: 12, color: "#71717a" },
];

const AI_STATS = [
  { label: "Diversification", value: "Good" },
  { label: "Risk", value: "Low" },
  { label: "Growth", value: "Strong" },
];

const GOALS = [
  { name: "Emergency Fund", amount: "£10,000 target", pct: 70 },
  { name: "House Deposit", amount: "£40,000 target", pct: 35 },
  { name: "Retirement", amount: "£250,000 target", pct: 18 },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

function DonutChart() {
  const size = 84;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-16 w-16 shrink-0 -rotate-90">
      {ALLOCATION.map((slice) => {
        const dash = (slice.pct / 100) * circumference;
        const el = (
          <circle
            key={slice.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

function ConnectedAccountsContent() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p className="text-sm font-semibold text-zinc-50">Connected Accounts</p>
          <p className="text-[11px] text-zinc-500">
            6 accounts linked across banks, brokers &amp; wallets
          </p>
        </div>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-medium text-accent">
          All synced
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {CONNECTED_ACCOUNTS.map((account) => (
          <div key={account.name} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={account.logo}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full bg-white/10 object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-zinc-200">{account.name}</p>
              <p className="text-[10px] text-accent">Connected</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2.5 text-xs font-medium text-accent">
        <CheckIcon />
        All your accounts, one secure place
      </div>
    </div>
  );
}

function PortfolioPerformanceContent() {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-50">Portfolio Performance</p>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-4xl font-semibold text-accent">+12.4%</p>
          <p className="text-xs text-zinc-500">vs. last month</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">6-month trend</p>
          <p className="text-sm font-medium text-zinc-200">Consistently up</p>
        </div>
      </div>
      <div className="mt-5 flex h-32 items-end gap-3">
        {BARS.map((height, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-sm ${index === BARS.length - 1 ? "bg-accent" : "bg-accent-soft"}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-zinc-600">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2.5 text-xs font-medium text-accent">
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M15 7h6v6" />
        </svg>
        Your portfolio is outperforming the market
      </div>
    </div>
  );
}

function MainDashboardContent() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-xs font-bold text-accent">
            W
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-50">Good morning, Alex 👋</p>
            <p className="text-[11px] text-zinc-500">Here&apos;s your financial snapshot for today.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-zinc-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-zinc-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 01-3.4 0" />
            </svg>
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-from to-accent-to text-[11px] font-semibold text-zinc-950">
            A
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <nav className="hidden w-28 shrink-0 flex-col gap-0.5 sm:flex">
          {SIDEBAR_ITEMS.map((item, index) => (
            <span
              key={item}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${index === 0 ? "bg-accent-soft text-accent" : "text-zinc-500"}`}
            >
              {item}
            </span>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <p className="text-[10px] text-zinc-500">Total Net Worth</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-semibold text-zinc-50">£184,320</span>
                <span className="text-[10px] font-medium text-accent">+3.2%</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <p className="text-[10px] text-zinc-500">Best Performer</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-50">Bitcoin</span>
                <span className="text-[10px] font-medium text-accent">+8.4%</span>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <p className="text-[10px] text-zinc-500">Portfolio Risk</p>
              <p className="mt-1 text-sm font-semibold text-zinc-50">Low</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <p className="text-[10px] text-zinc-500">Active Goal</p>
              <p className="mt-1 text-sm font-semibold text-zinc-50">£10,000</p>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[70%] rounded-full bg-accent" />
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px]">
            <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] text-zinc-500">Portfolio Value</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-semibold text-zinc-50">£184,320</span>
                <span className="text-[10px] font-medium text-accent">+3.2%</span>
              </div>
              <svg viewBox="0 0 300 70" className="mt-2 h-14 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hero-main-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,50 30,46 60,40 90,42 120,30 150,32 180,18 210,22 240,10 270,14 300,4 300,70 0,70"
                  fill="url(#hero-main-fill)"
                />
                <polyline
                  points="0,50 30,46 60,40 90,42 120,30 150,32 180,18 210,22 240,10 270,14 300,4"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 sm:flex">
              <DonutChart />
              <div className="flex flex-col gap-1">
                {ALLOCATION.map((slice) => (
                  <div key={slice.label} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: slice.color }} />
                    {slice.label}
                    <span className="text-zinc-500">{slice.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AICoachContent() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-zinc-50">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-accent" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
          </svg>
          AI Coach
        </p>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold text-accent">BETA</span>
      </div>

      <p className="mt-4 text-[11px] text-zinc-500">Your Wealth Health Score</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-4xl font-semibold text-zinc-50">92</span>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">Excellent</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {AI_STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-2.5">
            <p className="text-[9px] text-zinc-500">{stat.label}</p>
            <p className="mt-0.5 text-xs font-semibold text-zinc-50">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-zinc-400">
        Your portfolio is well diversified and on track to reach your goals.
        Consider increasing your monthly investment by £50 to accelerate
        growth.
      </p>

      <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-accent-soft px-4 py-3 text-sm font-medium text-accent">
        Ask AI Coach
        <ChevronIcon direction="right" />
      </div>
    </div>
  );
}

function InvestmentGoalsContent() {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-50">Investment Goals</p>
      <p className="text-[11px] text-zinc-500">3 goals in progress</p>

      <div className="mt-4 flex flex-col gap-2.5">
        {GOALS.map((goal) => (
          <div key={goal.name} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-200">{goal.name}</p>
              <p className="text-xs font-semibold text-accent">{goal.pct}%</p>
            </div>
            <p className="text-[10px] text-zinc-500">{goal.amount}</p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent" style={{ width: `${goal.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2.5 text-xs font-medium text-accent">
        <CheckIcon />
        Auto-invest is keeping every goal on track
      </div>
    </div>
  );
}

const CARDS = [
  { label: "Connected Accounts", render: ConnectedAccountsContent },
  { label: "Portfolio Performance", render: PortfolioPerformanceContent },
  { label: "Dashboard Overview", render: MainDashboardContent },
  { label: "AI Coach", render: AICoachContent },
  { label: "Investment Goals", render: InvestmentGoalsContent },
];

const SLOTS = [
  { x: -480, rotate: -14, tiltY: 26, scale: 0.55, z: 10, opacity: 0.85 },
  { x: -300, rotate: -8, tiltY: 16, scale: 0.65, z: 20, opacity: 0.85 },
  { x: 0, rotate: 0, tiltY: 0, scale: 0.78, z: 50, opacity: 1 },
  { x: 300, rotate: 8, tiltY: -16, scale: 0.65, z: 20, opacity: 0.85 },
  { x: 480, rotate: 14, tiltY: -26, scale: 0.55, z: 10, opacity: 0.85 },
];

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function HeroDashboardStack() {
  const [active, setActiveState] = useState(2);
  const [wrap, setWrap] = useState<{ index: number; phase: "out" | "in" } | null>(null);
  const activeRef = useRef(2);
  const busyRef = useRef(false);

  function setActive(value: number) {
    activeRef.current = value;
    setActiveState(value);
  }

  async function step(dir: 1 | -1) {
    const current = activeRef.current;
    const targetSlot = dir === 1 ? 0 : 4;
    const wrappingIndex = CARDS.findIndex(
      (_, i) => (i - current + 2 + 5) % 5 === targetSlot
    );

    setWrap({ index: wrappingIndex, phase: "out" });
    await sleep(260);
    setActive((current + dir + 5) % 5);
    setWrap({ index: wrappingIndex, phase: "in" });
    await sleep(320);
    setWrap(null);
  }

  async function goTo(target: number) {
    if (busyRef.current || target === activeRef.current) return;
    busyRef.current = true;
    const from = activeRef.current;
    const forward = (target - from + 5) % 5;
    const backward = (from - target + 5) % 5;
    const dir: 1 | -1 = forward <= backward ? 1 : -1;
    const steps = Math.min(forward, backward);
    for (let i = 0; i < steps; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await step(dir);
    }
    busyRef.current = false;
  }

  return (
    <div className="-mt-8">
      {/* mobile: just the main dashboard mockup, no carousel */}
      <div className="mx-auto max-w-xl px-4 lg:hidden">
        <div
          className="rounded-3xl p-[1.5px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), var(--accent) 55%, var(--accent-strong) 100%)",
          }}
        >
          <div className="glass-edge-card !border-0 !bg-[#050706] rounded-[22px] p-4 shadow-[0_0_30px_rgba(255,255,255,0.15),0_0_60px_var(--accent-glow),0_40px_100px_rgba(0,0,0,0.65),inset_3px_3px_12px_rgba(255,255,255,0.18),inset_-6px_-6px_26px_var(--accent-glow)] backdrop-blur-[32px]">
            <MainDashboardContent />
          </div>
        </div>
      </div>

      {/* desktop: rotating fanned card carousel */}
      <div className="relative mx-auto hidden max-w-none px-16 lg:block">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => goTo((activeRef.current + 4) % 5)}
          className="absolute left-0 top-1/2 z-[60] flex h-[60px] w-[60px] -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-zinc-300 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-150 ease-out hover:border-accent-border hover:bg-accent-soft hover:text-accent active:scale-90 active:border-accent-border active:bg-accent-soft active:text-accent active:shadow-[0_0_18px_var(--accent-glow),inset_0_2px_6px_rgba(0,0,0,0.6)]"
        >
          <span className="[&>svg]:h-6 [&>svg]:w-6">
            <ChevronIcon direction="left" />
          </span>
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => goTo((activeRef.current + 1) % 5)}
          className="absolute right-0 top-1/2 z-[60] flex h-[60px] w-[60px] -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-zinc-300 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-150 ease-out hover:border-accent-border hover:bg-accent-soft hover:text-accent active:scale-90 active:border-accent-border active:bg-accent-soft active:text-accent active:shadow-[0_0_18px_var(--accent-glow),inset_0_2px_6px_rgba(0,0,0,0.6)]"
        >
          <span className="[&>svg]:h-6 [&>svg]:w-6">
            <ChevronIcon direction="right" />
          </span>
        </button>

        <div className="relative h-[380px] [perspective:1600px]">
          {/* reflective floor beneath the cards */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
          >
            <div className="h-16 w-[70%] max-w-3xl rounded-[100%] bg-black/50 blur-2xl" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
          >
            <div className="h-10 w-[46%] max-w-xl rounded-[100%] bg-[radial-gradient(closest-side,var(--accent),transparent_70%)] opacity-90 blur-xl" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
          >
            <div className="h-3 w-[30%] max-w-sm rounded-[100%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.5),transparent_70%)] blur-md" />
          </div>

          {CARDS.map((card, index) => {
            const slotIndex = (index - active + 2 + 5) % 5;
            const slot = SLOTS[slotIndex];
            const isFocused = slotIndex === 2;
            const isWrapping = wrap?.index === index;
            const opacity = isWrapping && wrap.phase === "out" ? 0 : slot.opacity;
            const Content = card.render;

            return (
              <div
                key={card.label}
                className="absolute left-1/2 bottom-10 w-[600px] origin-bottom"
                style={{
                  transform: `translate(calc(-50% + ${slot.x}px), 0) rotateY(${slot.tiltY}deg) rotate(${slot.rotate}deg) scale(${slot.scale})`,
                  zIndex: slot.z,
                  opacity,
                  transitionProperty: isWrapping ? "opacity" : "transform, opacity",
                  transitionDuration: isWrapping ? "260ms" : "700ms",
                  transitionTimingFunction: "ease-out",
                  pointerEvents: isFocused ? "auto" : "none",
                }}
              >
                <div
                  className="rounded-3xl p-[1.5px]"
                  style={{
                    background: isFocused
                      ? "linear-gradient(135deg, rgba(255,255,255,0.9), var(--accent) 55%, var(--accent-strong) 85%, rgba(255,255,255,0.9) 100%)"
                      : "linear-gradient(135deg, rgba(255,255,255,0.55), var(--accent) 60%, var(--accent-strong) 100%)",
                  }}
                >
                  <div
                    className={`glass-edge-card !border-0 rounded-[22px] p-4 backdrop-blur-[32px] ${
                      isFocused
                        ? "!bg-[#050706] shadow-[0_0_43px_rgba(255,255,255,0.2),0_0_85px_var(--accent-glow),0_30px_80px_rgba(0,0,0,0.65),inset_2px_2px_10px_rgba(255,255,255,0.18),inset_-5px_-5px_28px_var(--accent-glow)]"
                        : "!bg-[#050706] shadow-[0_0_18px_rgba(255,255,255,0.1),0_0_40px_var(--accent-glow),0_40px_90px_rgba(0,0,0,0.45),inset_2px_2px_10px_rgba(255,255,255,0.1),inset_-5px_-5px_20px_var(--accent-glow)]"
                    }`}
                  >
                    <Content />
                  </div>
                </div>

                {isFocused && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 top-full origin-top"
                    style={{
                      transform: "scaleY(-1)",
                      opacity: 0.08,
                      filter: "blur(26px)",
                      maskImage: "linear-gradient(to bottom, black, transparent 60%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black, transparent 60%)",
                    }}
                  >
                    <div
                      className="rounded-3xl p-[1.5px]"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.9), var(--accent) 55%, var(--accent-strong) 100%)",
                      }}
                    >
                      <div className="glass-edge-card !border-0 !bg-[#050706] h-[320px] rounded-[22px]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-0 flex items-center justify-center gap-2">
          {CARDS.map((card, index) => (
            <button
              key={card.label}
              type="button"
              aria-label={`Show ${card.label}`}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                index === active ? "w-6 bg-accent" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
