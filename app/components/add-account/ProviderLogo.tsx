"use client";

import { useState } from "react";

export default function ProviderLogo({
  name,
  logo,
  size = 44,
}: {
  name: string;
  logo?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!logo || failed) {
    return (
      <span
        style={{ height: size, width: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      style={{ height: size, width: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-black/5 p-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt=""
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
