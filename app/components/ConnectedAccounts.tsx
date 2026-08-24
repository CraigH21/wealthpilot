import type { ConnectedAccount } from "../lib/mock/portfolioContext";

export default function ConnectedAccounts({ accounts }: { accounts: ConnectedAccount[] }) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 text-zinc-400"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
        </svg>
        <p className="text-sm font-medium text-zinc-50">Connected Accounts</p>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
          {accounts.length} Connected
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-xs font-medium text-zinc-300"
          >
            {account.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={account.logo}
                alt=""
                className="h-5 w-5 rounded-full bg-white/10 object-cover"
              />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-500/10 text-[10px] font-semibold text-zinc-300">
                {account.name[0]}
              </span>
            )}
            {account.name}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-zinc-500">Everything connected in one place.</p>
    </div>
  );
}
