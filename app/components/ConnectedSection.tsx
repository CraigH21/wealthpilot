"use client";

import { useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import EdgeGlow from "./EdgeGlow";
import { useEdgeGlow } from "../hooks/useEdgeGlow";

type CardId = "banks" | "investments" | "crypto" | "secure";

type Logo = { name: string; src: string };

const BANKS_LOGOS: Logo[] = [
  { name: "Barclays", src: "/icons/platforms/barclays.png" },
  { name: "Monzo", src: "/icons/platforms/monzo.png" },
  { name: "Lloyds", src: "/icons/platforms/lloyds.svg" },
  { name: "HSBC", src: "/icons/platforms/hsbc.svg" },
  { name: "Santander", src: "/icons/platforms/santander.svg" },
];

const INVESTMENT_LOGOS: Logo[] = [
  { name: "Trading 212", src: "/icons/platforms/trading212.png" },
  { name: "Vanguard", src: "/icons/platforms/vanguard.svg" },
  { name: "Freetrade", src: "/icons/platforms/freetrade.svg" },
  { name: "Interactive Brokers", src: "/icons/platforms/interactive-brokers.svg" },
];

const CRYPTO_LOGOS: Logo[] = [
  { name: "Coinbase", src: "/icons/platforms/coinbase.png" },
  { name: "Kraken", src: "/icons/platforms/kraken.png" },
  { name: "MetaMask", src: "/icons/platforms/metamask.png" },
  { name: "Ledger", src: "/icons/platforms/ledger.svg" },
];

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 17H7a5 5 0 010-10h2M15 7h2a5 5 0 010 10h-2M8 12h8" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v9M10 10v9M14 10v9M19 10v9" />
      <path d="M3 21h18" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 010 3.5H9.5m0 0h4a1.75 1.75 0 010 3.5H9.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

function WalletConnectIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12a7 7 0 0114 0" />
      <path d="M8.5 12a3.5 3.5 0 017 0" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FingerprintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4a7 7 0 00-7 7c0 3 1 5 1 5" />
      <path d="M12 4a7 7 0 017 7c0 4-1.5 6.5-3 8" />
      <path d="M9 11a3 3 0 016 0c0 4-2 6-2 8" />
      <path d="M12 11v2c0 3-1.5 5-3 6.5" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

function InfinityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 15a3.5 3.5 0 010-7c2.5 0 3.5 2.2 5 4.5s2.5 4.5 5 4.5a3.5 3.5 0 000-7c-2.5 0-3.5 2.2-5 4.5S9.5 19 7 19a3.5 3.5 0 010-7z" />
    </svg>
  );
}

function StatPill({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-4 py-2 text-sm font-medium text-accent">
      {label}
      <ChevronRight />
    </span>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const slideFrom = (dir: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: dir === "left" ? -60 : 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.35 } },
});

const orbVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: "easeOut", delay: 0 } },
};

const containerVariant: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};

const pathVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 1.3, ease: "easeInOut", delay: 0.85 } },
};

function ConnectCard({
  id,
  icon,
  iconClass,
  title,
  subtitle,
  pillLabel,
  logos,
  side,
  lift,
  floatDelay,
  hovered,
  onHoverChange,
}: {
  id: CardId;
  icon: ReactNode;
  iconClass: string;
  title: string;
  subtitle: string;
  pillLabel: string;
  logos: Logo[];
  side: "left" | "right";
  lift: number;
  floatDelay: number;
  hovered: CardId | null;
  onHoverChange: (id: CardId | null) => void;
}) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();
  const tiltY = side === "left" ? 20 : -20;

  return (
    <motion.div
      variants={slideFrom(side)}
      onMouseEnter={() => onHoverChange(id)}
      onMouseLeave={() => onHoverChange(null)}
      className="w-full"
    >
      <div style={{ transform: `perspective(1400px) rotateY(${tiltY}deg) rotate(${lift}deg)` }}>
        <div
          className="card-float transition-opacity duration-500 ease-out"
          style={{ animationDelay: `${floatDelay}s` }}
        >
          <div
            className="rounded-[32px] p-[2.5px] transition-transform duration-500 ease-out hover:-translate-y-1.5"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.9), var(--accent) 55%, var(--accent-strong) 85%, rgba(255,255,255,0.9) 100%)",
            }}
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              className="group glass-edge-card !border-0 !bg-[#050706] relative flex h-[220px] flex-col overflow-hidden rounded-[29.5px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_2px_2px_10px_rgba(255,255,255,0.1),inset_-4px_-4px_18px_var(--accent-soft)] backdrop-blur-[28px]"
            >
          <EdgeGlow />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-start gap-4">
              <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full [&>svg]:h-7 [&>svg]:w-7 ${iconClass}`}>
                {icon}
              </span>
              <div>
                <p className="text-xl font-semibold text-zinc-50">{title}</p>
                <p className="mt-1 max-w-[320px] text-sm leading-relaxed text-zinc-500">{subtitle}</p>
              </div>
            </div>
            <StatPill label={pillLabel} />
          </div>

          <div
            className="relative mt-5 grid flex-1 gap-4"
            style={{ gridTemplateColumns: `repeat(${logos.length}, minmax(0, 1fr))` }}
          >
            {logos.map((logo) => (
              <div key={logo.name} className="flex flex-col items-center gap-2 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt=""
                  className={`h-12 w-12 rounded-full bg-white/10 object-cover transition-[filter,opacity] duration-300 ease-out ${
                    hovered === id ? "opacity-100 brightness-110" : "opacity-90"
                  }`}
                />
                <span className="text-xs leading-tight text-zinc-500">{logo.name}</span>
              </div>
            ))}
          </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SecureCard({
  onHoverChange,
}: {
  onHoverChange: (id: CardId | null) => void;
}) {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLDivElement>();
  const id: CardId = "secure";

  const items = [
    { label: "Read-only\naccess", icon: <LockIcon /> },
    { label: "Open Banking", icon: <BankIcon /> },
    { label: "WalletConnect", icon: <WalletConnectIcon /> },
    { label: "Bank-level\nencryption", icon: <FingerprintIcon /> },
  ];

  return (
    <motion.div
      variants={slideFrom("right")}
      onMouseEnter={() => onHoverChange(id)}
      onMouseLeave={() => onHoverChange(null)}
      className="w-full"
    >
      <div style={{ transform: "perspective(1400px) rotateY(-20deg) rotate(-1deg)" }}>
        <div
          className="card-float transition-opacity duration-500 ease-out"
          style={{ animationDelay: "0.6s" }}
        >
          <div
            className="rounded-[32px] p-[2.5px] transition-transform duration-500 ease-out hover:-translate-y-1.5"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.9), var(--accent) 55%, var(--accent-strong) 85%, rgba(255,255,255,0.9) 100%)",
            }}
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              className="group glass-edge-card !border-0 !bg-[#050706] relative flex h-[220px] flex-col overflow-hidden rounded-[29.5px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_2px_2px_10px_rgba(255,255,255,0.1),inset_-4px_-4px_18px_var(--accent-soft)] backdrop-blur-[28px]"
            >
          <EdgeGlow />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-400 [&>svg]:h-7 [&>svg]:w-7">
                <ShieldIcon />
              </span>
              <div>
                <p className="text-xl font-semibold text-zinc-50">Secure Connections</p>
                <p className="mt-1 max-w-[320px] text-sm leading-relaxed text-zinc-500">
                  Your data is always private, read-only and encrypted.
                </p>
              </div>
            </div>
            <StatPill label="Built for trust" />
          </div>

          <div className="relative mt-5 grid flex-1 grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-border bg-accent-soft text-accent [&>svg]:h-5 [&>svg]:w-5">
                  {item.icon}
                </span>
                <span className="whitespace-pre-line text-xs leading-tight text-zinc-500">{item.label}</span>
              </div>
            ))}
          </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WealthPilotOrb() {
  return (
    <motion.div variants={orbVariant} className="relative z-10 flex items-center justify-center">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-[340px] w-[340px] rounded-full"
        style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent 72%)" }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.85, 1.3, 0.85] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute h-[300px] w-[300px] rounded-full"
        style={{ background: "radial-gradient(closest-side, #a8ffde, transparent 70%)" }}
        animate={{ opacity: [0.25, 0.65, 0.25], scale: [1, 1.12, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-[240px] w-[240px] rounded-full border-2 backdrop-blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08), rgba(5,7,6,0.85) 60%, rgba(5,7,6,0.95) 100%)",
          borderColor: "rgba(168,255,222,0.7)",
          boxShadow:
            "0 0 70px rgba(168,255,222,0.55), inset 2px 2px 16px rgba(255,255,255,0.12), inset -6px -6px 30px rgba(168,255,222,0.25)",
        }}
      />
      <div className="absolute flex h-[240px] w-[240px] flex-col items-center justify-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/wealthpilot-mark.svg" alt="" className="h-[88px] w-[88px]" />
        <p className="-mt-1 text-xl font-semibold text-zinc-50">WealthPilot</p>
        <p className="mt-1 text-[10px] leading-tight text-white">
          All your money.
          <br />
          Greater possibilities.
        </p>
      </div>
    </motion.div>
  );
}

function ConnectionLines({ hovered, active }: { hovered: CardId | null; active: boolean }) {
  const bundles: { id: CardId; ds: string[] }[] = [
    {
      id: "banks",
      ds: [
        "M480,160 C560,165 660,185 760,215",
        "M480,174 C570,178 660,200 760,225",
        "M480,188 C580,192 665,215 760,235",
      ],
    },
    {
      id: "crypto",
      ds: [
        "M480,412 C560,408 660,390 760,365",
        "M480,426 C570,422 660,400 760,375",
        "M480,440 C580,436 665,415 760,385",
      ],
    },
    {
      id: "investments",
      ds: [
        "M1120,160 C1040,165 940,185 840,215",
        "M1120,174 C1030,178 940,200 840,225",
        "M1120,188 C1020,192 935,215 840,235",
      ],
    },
    {
      id: "secure",
      ds: [
        "M1120,412 C1040,408 940,390 840,365",
        "M1120,426 C1030,422 940,400 840,375",
        "M1120,440 C1020,436 935,415 840,385",
      ],
    },
  ];

  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="pulse-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a8ffde" stopOpacity="1" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
        <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {bundles.map((bundle) => {
        const isActive = hovered === bundle.id;
        const groupBegin = { banks: 0, crypto: 0.8, investments: 1.6, secure: 2.4 }[bundle.id];
        return (
          <g key={bundle.id} filter="url(#line-glow)">
            {bundle.ds.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke={isActive ? "#a8ffde" : "var(--accent)"}
                strokeWidth={isActive ? 2.4 : 1.6}
                strokeLinecap="round"
                strokeOpacity={isActive ? 0.9 : i === 1 ? 0.55 : 0.35}
                variants={pathVariant}
                style={{ transition: "stroke-width 300ms ease, stroke-opacity 300ms ease, stroke 300ms ease" }}
              />
            ))}
            {active &&
              bundle.ds.map((d, i) => (
                <circle key={i} r={isActive ? 4.5 : 3} fill="url(#pulse-glow)">
                  <animateMotion
                    dur="3.2s"
                    begin={`${groupBegin + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              ))}
          </g>
        );
      })}
    </svg>
  );
}

function FloatingParticles() {
  const particles = [
    { top: "15%", left: "8%", delay: 0, duration: 8 },
    { top: "70%", left: "12%", delay: 1.4, duration: 9 },
    { top: "25%", left: "92%", delay: 0.6, duration: 7.5 },
    { top: "78%", left: "88%", delay: 2.1, duration: 8.5 },
    { top: "45%", left: "50%", delay: 1, duration: 10 },
    { top: "10%", left: "55%", delay: 2.6, duration: 9.5 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle-drift absolute h-1 w-1 rounded-full bg-accent blur-[1px]"
          style={{ top: p.top, left: p.left, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
        />
      ))}
    </div>
  );
}

const BOTTOM_CHIPS = [
  { label: "Read-only access", icon: <LockIcon /> },
  { label: "Bank-level encryption", icon: <ShieldIcon /> },
  { label: "Live balance updates", icon: <ZapIcon /> },
  { label: "Disconnect anytime", icon: <InfinityIcon /> },
];

export default function ConnectedSection() {
  const [hovered, setHovered] = useState<CardId | null>(null);
  const [linesActive, setLinesActive] = useState(false);

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 14%, black 92%, transparent 100%)",
        }}
      >
        <div className="h-full w-full bg-[url('/connected/connected-bg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[#050706]/35" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        onViewportEnter={() => {
          window.setTimeout(() => setLinesActive(true), 2200);
        }}
        variants={containerVariant}
        className="relative mx-auto w-[94%] max-w-[1600px]"
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent backdrop-blur-md">
            <LinkIcon />
            Everything connected
          </span>

          <h2 className="mx-auto mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            Bring every account{" "}
            <span className="bg-gradient-to-r from-accent-from to-accent-to bg-clip-text text-transparent">
              together.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Connect your banks, brokers, crypto wallets, pensions and more — all in
            one secure, AI-powered dashboard.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-16 hidden max-w-[1600px] lg:grid lg:min-h-[600px] lg:grid-cols-[525px_1fr_525px] lg:items-center lg:gap-16">
          <FloatingParticles />
          <ConnectionLines hovered={hovered} active={linesActive} />

          <div className="relative z-10 flex flex-col gap-8">
            <ConnectCard
              id="banks"
              icon={<BankIcon />}
              iconClass="bg-emerald-500/15 text-emerald-400"
              title="Banks"
              subtitle="Current accounts, savings, credit cards and more."
              pillLabel="100+ banks"
              logos={BANKS_LOGOS}
              side="left"
              lift={4}
              floatDelay={0}
              hovered={hovered}
              onHoverChange={setHovered}
            />
            <ConnectCard
              id="crypto"
              icon={<CoinIcon />}
              iconClass="bg-amber-500/15 text-amber-400"
              title="Crypto"
              subtitle="Exchanges, wallets and cold storage."
              pillLabel="50+ platforms"
              logos={CRYPTO_LOGOS}
              side="left"
              lift={1}
              floatDelay={0.4}
              hovered={hovered}
              onHoverChange={setHovered}
            />
          </div>

          <WealthPilotOrb />

          <div className="relative z-10 flex flex-col gap-8">
            <ConnectCard
              id="investments"
              icon={<TrendIcon />}
              iconClass="bg-teal-500/15 text-teal-300"
              title="Investments"
              subtitle="Brokers, ISAs, pensions and investment platforms."
              pillLabel="70+ platforms"
              logos={INVESTMENT_LOGOS}
              side="right"
              lift={-4}
              floatDelay={0.2}
              hovered={hovered}
              onHoverChange={setHovered}
            />
            <SecureCard onHoverChange={setHovered} />
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-16 flex flex-wrap items-center justify-center gap-3"
        >
          {BOTTOM_CHIPS.map((chip) => (
            <span
              key={chip.label}
              className="group inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-soft px-5 py-2.5 text-sm font-medium text-zinc-200 backdrop-blur-md transition-transform duration-300 ease-out hover:-translate-y-[3px]"
            >
              <span className="text-accent transition-[filter] duration-300 ease-out group-hover:drop-shadow-[0_0_6px_var(--accent-glow)]">
                {chip.icon}
              </span>
              {chip.label}
              <ChevronRight />
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
