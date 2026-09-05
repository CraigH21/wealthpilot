"use client";

import { ACCOUNT_TYPES, type AccountTypeId } from "../../lib/mock/accountConnection";

export default function StepAccountType({ onSelect }: { onSelect: (typeId: AccountTypeId) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-zinc-600">What kind of account do you want to connect?</p>

      {ACCOUNT_TYPES.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onSelect(type.id)}
          className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-black/5 p-4 text-left transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-accent-border hover:bg-accent-soft hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out group-hover:scale-110">
            {type.icon}
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-zinc-900">{type.label}</span>
            <span className="block text-xs text-zinc-500">{type.description}</span>
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-accent"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      ))}
    </div>
  );
}
