import Link from "next/link";
import HeroDashboardStack from "./components/HeroDashboardStack";

const NAV_LINKS = ["Home", "Features", "Pricing", "Security", "Resources"];

const PLATFORMS = [
  { name: "Trading 212", logo: "/icons/platforms/trading212.png" },
  { name: "Coinbase", logo: "/icons/platforms/coinbase.png" },
  { name: "Kraken", logo: "/icons/platforms/kraken.png" },
  { name: "Barclays", logo: "/icons/platforms/barclays.png" },
  { name: "Monzo", logo: "/icons/platforms/monzo.png" },
  { name: "MetaMask", logo: "/icons/platforms/metamask.png" },
];

const TRUST_ITEMS = [
  {
    label: "Bank-level security",
    icon: <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />,
  },
  {
    label: "5,000+ institutions supported",
    icon: <path d="M9 17a4 4 0 01-4-4V9a4 4 0 014-4h1M15 7a4 4 0 014 4v4a4 4 0 01-4 4h-1M8 12h8" />,
  },
  {
    label: "Live portfolio updates",
    icon: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050706] text-zinc-50">
      {/* page background — replaces the theme wallpaper on this route */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[1000px] overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
        }}
      >
        <div className="h-full w-full bg-[url('/hero/hero-bg.jpg')] bg-cover bg-top bg-no-repeat" />
      </div>

      <main className="relative mx-auto w-[94%] max-w-[1600px]">
        <header className="px-5 pt-4 sm:px-8 lg:px-10">
          <div className="relative mx-auto flex max-w-6xl items-center justify-end rounded-full border border-white/15 bg-[#0a0f0d]/85 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_1px_1px_4px_rgba(255,255,255,0.1)] backdrop-blur-xl sm:px-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/wealthpilot-logo.svg"
              alt="WealthPilot"
              className="absolute left-4 top-1/2 h-14 w-auto -translate-y-1/2 sm:left-5 sm:h-20"
            />

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
              {NAV_LINKS.map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
                    index === 0
                      ? "border-accent-border bg-accent-soft text-accent"
                      : "border-transparent text-zinc-400 hover:text-accent"
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="hidden rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-medium text-zinc-200 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.12)] transition-colors duration-300 ease-out hover:border-accent-border hover:bg-accent-soft hover:text-accent sm:inline-block"
              >
                Log in
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full bg-gradient-to-r from-accent-from to-accent-to px-3 py-1.5 text-xs font-semibold text-zinc-950 shadow-[0_0_20px_var(--accent-glow)] transition-transform duration-300 ease-out hover:scale-[1.03] sm:px-4 sm:py-2 sm:text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <section className="px-5 pb-6 pt-[24px] text-center sm:px-8 lg:px-10 lg:pb-8 lg:pt-[36px]">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5 text-accent"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
                </svg>
                Trusted by investors across crypto, stocks &amp; banking
              </div>

              <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                Everything you own.
                <br />
                <span className="bg-gradient-to-r from-accent-from to-accent-to bg-clip-text text-transparent">
                  One intelligent dashboard.
                </span>
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Track your crypto, stocks, bank accounts and investments in
                one beautiful place — powered by AI that understands your
                money.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-from to-accent-to px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_30px_var(--accent-glow)] transition-transform duration-300 ease-out hover:scale-[1.03]"
                >
                  Get Started — £9/month
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-100 backdrop-blur-md transition-colors duration-300 ease-out hover:border-accent-border hover:bg-accent-soft hover:text-accent"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  Watch Demo
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
                {TRUST_ITEMS.map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-3.5 w-3.5 text-accent"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                    {item.label}
                  </span>
                ))}
              </div>

              <HeroDashboardStack />

              <div className="mt-1">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Connects with the accounts you already use
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {PLATFORMS.map((platform) => (
                    <div
                      key={platform.name}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-xs font-medium text-zinc-300"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={platform.logo}
                        alt=""
                        className="h-5 w-5 rounded-full bg-white/10 object-cover"
                      />
                      {platform.name}
                    </div>
                  ))}
                </div>
              </div>
        </section>
      </main>
    </div>
  );
}
