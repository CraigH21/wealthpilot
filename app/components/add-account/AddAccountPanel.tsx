"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { connectAccountAction } from "../../lib/actions/connectAccount";
import type { AccountTypeId, Provider } from "../../lib/mock/accountConnection";
import { INITIAL_WIZARD_STATE, type WizardState } from "./types";
import StepAccountType from "./StepAccountType";
import StepProvider from "./StepProvider";
import StepConnect from "./StepConnect";
import StepConnecting from "./StepConnecting";
import StepSuccess from "./StepSuccess";

const STEP_TITLES: Record<WizardState["step"], string> = {
  type: "Add Account",
  provider: "Choose Provider",
  connect: "Connect Securely",
  connecting: "Connecting",
  success: "Connected",
};

// Real-world Open Banking type -> the page that shows that kind of account.
const VIEW_ACCOUNT_ROUTE: Record<AccountTypeId, string> = {
  bank: "/dashboard/banks",
  crypto: "/dashboard/crypto",
  investment: "/dashboard/stocks",
  pension: "/dashboard",
  other: "/dashboard",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AddAccountPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      // Mount closed, then flip open a frame later so the translate
      // transition actually plays instead of starting already-open.
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    setMounted(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => {
      onClose();
      setState(INITIAL_WIZARD_STATE);
    }, 300);
  };

  const selectType = (typeId: AccountTypeId) =>
    setState((s) => ({
      ...s,
      typeId,
      step: "provider",
      // Pension's "Account type" dropdown has no blank option (every
      // pension needs a type for risk scoring), so seed a sensible default
      // rather than leaving the select showing one option while state
      // silently holds an empty string.
      accountType: typeId === "pension" ? "Balanced Pension Fund" : "",
    }));

  const selectProvider = (provider: Provider) =>
    setState((s) => ({ ...s, provider, step: "connect", nickname: "" }));

  const goBack = () => {
    setState((s) => {
      if (s.step === "provider") return { ...s, step: "type" };
      if (s.step === "connect") return { ...s, step: "provider" };
      return s;
    });
  };

  const handleContinue = async () => {
    if (!state.provider || !state.typeId) return;
    if (state.typeId === "bank" && state.bankAccountTypes.length === 0) return;
    setState((s) => ({ ...s, step: "connecting" }));

    const [result] = await Promise.all([
      connectAccountAction({
        provider: state.provider,
        typeId: state.typeId,
        nickname: state.nickname,
        accountType: state.accountType,
        bankAccountTypes: state.bankAccountTypes,
        currency: state.currency,
        syncFrequency: state.syncFrequency,
      }),
      delay(2400),
    ]);

    router.refresh();
    setState((s) => ({ ...s, step: "success", result }));
  };

  const handleViewAccount = () => {
    const route = state.typeId ? VIEW_ACCOUNT_ROUTE[state.typeId] : "/dashboard";
    handleClose();
    router.push(route);
  };

  const canGoBack = state.step === "provider" || state.step === "connect";

  // Portal to <body> — several ancestor cards use `backdrop-blur`, which
  // creates a new containing block for `fixed`-positioned descendants, so
  // without this the panel gets trapped inside the card's own box instead
  // of covering the viewport.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="wp-dark-scope fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add account"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--background)] shadow-[-20px_0_60px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out ${
          mounted ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-black/10 px-6 py-5">
          {canGoBack && state.step !== "connecting" && state.step !== "success" && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-zinc-600 hover:text-zinc-900"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <p className="flex-1 text-sm font-semibold text-zinc-900">{STEP_TITLES[state.step]}</p>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-zinc-500 hover:text-zinc-900"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {state.step === "type" && <StepAccountType onSelect={selectType} />}

          {state.step === "provider" && state.typeId && (
            <StepProvider typeId={state.typeId} onSelect={selectProvider} />
          )}

          {state.step === "connect" && state.provider && state.typeId && (
            <StepConnect
              provider={state.provider}
              typeId={state.typeId}
              nickname={state.nickname}
              accountType={state.accountType}
              bankAccountTypes={state.bankAccountTypes}
              currency={state.currency}
              onChangeNickname={(nickname) => setState((s) => ({ ...s, nickname }))}
              onChangeAccountType={(accountType) => setState((s) => ({ ...s, accountType }))}
              onChangeBankAccountTypes={(bankAccountTypes) => setState((s) => ({ ...s, bankAccountTypes }))}
              onChangeCurrency={(currency) => setState((s) => ({ ...s, currency }))}
              onContinue={handleContinue}
            />
          )}

          {state.step === "connecting" && state.provider && <StepConnecting provider={state.provider} />}

          {state.step === "success" && state.result && (
            <StepSuccess result={state.result} onViewAccount={handleViewAccount} onDone={handleClose} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
