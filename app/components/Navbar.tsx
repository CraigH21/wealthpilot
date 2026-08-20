import ThemeSwitcher from "./ThemeSwitcher";

const NAV_ITEMS = ["Dashboard", "Portfolio", "Goals", "AI Coach"];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-[#09090B]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent transition-colors duration-500 ease-out">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M15 7h6v6" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-50">
            WealthPilot
          </span>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item}
              href="#"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
                index === 0
                  ? "bg-white/5 text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <ThemeSwitcher />
      </div>
    </header>
  );
}
