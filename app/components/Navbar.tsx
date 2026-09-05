import AccountGreeting from "./AccountGreeting";
import ThemeSwitcher from "./ThemeSwitcher";
import ProUpsellCard from "./ProUpsellCard";
import AppearancePill from "./AppearancePill";

export default function Navbar() {
  return (
    <header className="relative px-5 sm:px-8 lg:px-10">
      <div className="relative flex min-h-[7.5rem] items-center justify-between gap-4 py-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/wealthpilot-logo.svg"
          alt="WealthPilot"
          className="h-[100px] w-auto shrink-0"
        />

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
          <div className="pointer-events-auto">
            <ProUpsellCard />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AppearancePill />
          <AccountGreeting />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
