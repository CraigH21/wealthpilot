import ThemeSwitcher from "./ThemeSwitcher";

const NAV_ITEMS = ["Dashboard", "Portfolio", "Goals", "AI Coach"];

export default function Navbar() {
  return (
    <header className="relative border-b border-white/10 px-5 sm:px-8 lg:px-10">
      <div className="flex h-16 items-center justify-between">
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

        <ThemeSwitcher />
      </div>
    </header>
  );
}
