import AccountGreeting from "./AccountGreeting";
import ThemeSwitcher from "./ThemeSwitcher";

const NAV_ITEMS = ["Dashboard", "Portfolio", "Goals", "AI Coach"];

export default function Navbar() {
  return (
    <header className="relative px-5 sm:px-8 lg:px-10">
      <div className="relative flex min-h-[7.5rem] items-center justify-between py-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/wealthpilot-logo.svg"
          alt="WealthPilot"
          className="h-[100px] w-auto"
        />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 sm:flex">
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

        <div className="flex items-center gap-3">
          <AccountGreeting />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
