"use client";

import { useState } from "react";
import { getProvidersForType, type AccountTypeId, type Provider } from "../../lib/mock/accountConnection";
import ProviderLogo from "./ProviderLogo";

export default function StepProvider({
  typeId,
  onSelect,
}: {
  typeId: AccountTypeId;
  onSelect: (provider: Provider) => void;
}) {
  const [query, setQuery] = useState("");
  const providers = getProvidersForType(typeId).filter((provider) =>
    provider.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search providers..."
          className="w-full rounded-full border border-black/10 bg-black/5 py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-[var(--accent-border-strong)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => onSelect(provider)}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-black/10 bg-black/5 p-4 text-center transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent-border hover:bg-accent-soft hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            <span className="transition-transform duration-300 ease-out group-hover:scale-110">
              <ProviderLogo name={provider.name} logo={provider.logo} />
            </span>
            <span className="text-xs font-medium text-zinc-900">{provider.name}</span>
          </button>
        ))}

        {providers.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-zinc-500">
            No providers match &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
