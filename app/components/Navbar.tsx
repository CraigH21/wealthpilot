import AccountGreeting from "./AccountGreeting";
import ThemeSwitcher from "./ThemeSwitcher";

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

        <div className="flex items-center gap-3">
          <AccountGreeting />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
