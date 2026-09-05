"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY_NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
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
    label: "Banks",
    href: "/dashboard/banks",
    icon: (
      <>
        <path d="M4 10l8-5 8 5" />
        <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
        <path d="M4 20h16" />
      </>
    ),
  },
  {
    label: "Stocks",
    href: "/dashboard/stocks",
    icon: (
      <>
        <rect x="4" y="14" width="3" height="6" />
        <rect x="10.5" y="9" width="3" height="11" />
        <rect x="17" y="4" width="3" height="16" />
      </>
    ),
  },
  {
    label: "Crypto",
    href: "/dashboard/crypto",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    label: "Goals",
    href: "/dashboard/goals",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

const SECONDARY_NAV_ITEMS = [
  {
    label: "Portfolio",
    href: "/dashboard/portfolio",
    icon: (
      <>
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 13l9 5 9-5" />
      </>
    ),
  },
  {
    label: "Accounts",
    href: "/dashboard/accounts",
    icon: <path d="M9 17H7a5 5 0 010-10h2M15 7h2a5 5 0 010 10h-2M8 12h8" />,
  },
  {
    label: "Activity",
    href: "/dashboard/activity",
    icon: <path d="M3 12h4l3 8 4-16 3 8h4" />,
  },
  {
    label: "AI Coach",
    href: "/dashboard/ai-coach",
    icon: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />,
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  const renderItem = (item: (typeof PRIMARY_NAV_ITEMS)[number]) => {
    const active = item.href !== "#" && pathname === item.href;
    return (
      <Link
        key={item.label}
        href={item.href}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 ease-out ${
          active ? "bg-accent-soft text-accent" : "text-zinc-500 hover:text-accent"
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
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-1 pt-[90px] lg:sticky lg:top-6 lg:self-start">
      <nav className="flex flex-col gap-1">{PRIMARY_NAV_ITEMS.map(renderItem)}</nav>

      <div className="my-2 border-t border-black/10" />

      <nav className="flex flex-col gap-1">{SECONDARY_NAV_ITEMS.map(renderItem)}</nav>
    </div>
  );
}
