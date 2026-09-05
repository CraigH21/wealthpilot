"use client";

import {
  ACCOUNT_SUBTYPES,
  BANK_ACCOUNT_TYPES,
  type AccountTypeId,
  type BankAccountType,
  type Provider,
} from "../../lib/mock/accountConnection";
import ProviderLogo from "./ProviderLogo";

const CURRENCIES = ["GBP", "USD", "EUR"];

const PERMISSIONS_GRANTED = ["View balances", "View transactions", "View account names", "View holdings"];
const PERMISSIONS_NEVER = ["Make payments", "Transfer money", "Change account settings"];

export default function StepConnect({
  provider,
  typeId,
  nickname,
  accountType,
  bankAccountTypes,
  currency,
  onChangeNickname,
  onChangeAccountType,
  onChangeBankAccountTypes,
  onChangeCurrency,
  onContinue,
}: {
  provider: Provider;
  typeId: AccountTypeId;
  nickname: string;
  accountType: string;
  bankAccountTypes: BankAccountType[];
  currency: string;
  onChangeNickname: (value: string) => void;
  onChangeAccountType: (value: string) => void;
  onChangeBankAccountTypes: (value: BankAccountType[]) => void;
  onChangeCurrency: (value: string) => void;
  onContinue: () => void;
}) {
  const isBank = typeId === "bank";
  const canContinue = !isBank || bankAccountTypes.length > 0;

  const toggleBankAccountType = (type: BankAccountType) => {
    onChangeBankAccountTypes(
      bankAccountTypes.includes(type)
        ? bankAccountTypes.filter((t) => t !== type)
        : [...bankAccountTypes, type]
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/5 p-4">
        <ProviderLogo name={provider.name} logo={provider.logo} />
        <div>
          <p className="text-sm font-semibold text-zinc-900">{provider.name}</p>
          <p className="text-xs text-zinc-500">Secure connection</p>
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-500">Account nickname</span>
        <input
          type="text"
          value={nickname}
          onChange={(e) => onChangeNickname(e.target.value)}
          placeholder={`${provider.name} Account`}
          className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-[var(--accent-border-strong)]"
        />
      </label>

      {isBank ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-zinc-500">Which accounts do you have here?</span>
          <div className="grid grid-cols-3 gap-2">
            {BANK_ACCOUNT_TYPES.map((type) => {
              const checked = bankAccountTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleBankAccountType(type)}
                  aria-pressed={checked}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
                    checked
                      ? "border-accent-border bg-accent-soft text-accent shadow-[0_0_16px_var(--accent-glow)]"
                      : "border-black/10 bg-black/5 text-zinc-600"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
          {bankAccountTypes.length === 0 && (
            <span className="text-xs text-red-400">Select at least one account</span>
          )}
        </div>
      ) : (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-zinc-500">Account type</span>
          <select
            value={accountType}
            onChange={(e) => onChangeAccountType(e.target.value)}
            className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--accent-border-strong)]"
          >
            <option value="">Auto-detect</option>
            {ACCOUNT_SUBTYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-500">Currency</span>
        <select
          value={currency}
          onChange={(e) => onChangeCurrency(e.target.value)}
          className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-[var(--accent-border-strong)]"
        >
          {CURRENCIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-accent"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <p className="text-sm font-semibold text-zinc-900">WealthPilot has read-only access</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-accent">Permissions granted</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {PERMISSIONS_GRANTED.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0 text-accent" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-red-500">Never allowed</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {PERMISSIONS_NEVER.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0 text-red-500" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-500">
          You&rsquo;ll never be asked for your username or password here.
        </p>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-soft px-4 py-3 text-sm font-medium text-accent shadow-[0_0_16px_var(--accent-glow)] transition-all duration-300 ease-out hover:bg-accent-border disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-accent-soft"
      >
        Continue to {provider.name}
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
