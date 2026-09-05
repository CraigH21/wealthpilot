"use client";

import { useState } from "react";
import { stockLogoUrl } from "../../lib/stocks/market";

export default function StockTickerLogo({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        style={{ height: size, width: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-black/5 text-[9px] font-semibold text-zinc-600"
      >
        {symbol.slice(0, 3)}
      </span>
    );
  }

  return (
    <span
      style={{ height: size, width: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-black/5 p-1"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={stockLogoUrl(symbol)}
        alt=""
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
