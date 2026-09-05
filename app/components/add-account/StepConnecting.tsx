"use client";

import { useEffect, useState } from "react";
import type { Provider } from "../../lib/mock/accountConnection";
import ProviderLogo from "./ProviderLogo";

const MESSAGES = ["Verifying account...", "Importing balances...", "Importing transactions..."];

export default function StepConnecting({ provider }: { provider: Provider }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-accent-border border-t-accent" />
        <ProviderLogo name={provider.name} logo={provider.logo} size={52} />
      </div>

      <div>
        <p className="text-base font-semibold text-zinc-900">Connecting securely...</p>
        <p className="mt-1 text-sm text-zinc-500">{MESSAGES[messageIndex]}</p>
      </div>

      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-black/10">
        <div className="h-full origin-left animate-[grow_2.4s_ease-out_forwards] rounded-full bg-accent" />
      </div>

      <style>{`
        @keyframes grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
