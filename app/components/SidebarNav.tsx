import TodaysSnapshot from "./TodaysSnapshot";

const NAV_ITEMS = [
  {
    label: "Overview",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    label: "Crypto",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    label: "Stocks",
    icon: (
      <>
        <rect x="4" y="14" width="3" height="6" />
        <rect x="10.5" y="9" width="3" height="11" />
        <rect x="17" y="4" width="3" height="16" />
      </>
    ),
  },
  {
    label: "Banks",
    icon: (
      <>
        <path d="M4 10l8-5 8 5" />
        <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
        <path d="M4 20h16" />
      </>
    ),
  },
  {
    label: "Goals",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "AI Coach",
    icon: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />,
  },
];

export default function SidebarNav() {
  return (
    <div className="flex h-full flex-col gap-6">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item, index) => {
          const active = index === 0;
          return (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 ease-out ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-zinc-400 hover:text-accent"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4.5 w-4.5"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-auto">
        <TodaysSnapshot />
      </div>
    </div>
  );
}
