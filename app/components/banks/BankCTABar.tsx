"use client";

import Link from "next/link";
import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";

export default function BankCTABar() {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLAnchorElement>();

  return (
    <Link
      ref={cardRef}
      onMouseMove={handleMouseMove}
      href="/dashboard/ai-coach"
      className="group glass-edge-card relative flex flex-1 items-center justify-between gap-3 overflow-hidden rounded-full px-5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[2px]"
    >
      <EdgeGlow />
      <span className="relative text-sm text-zinc-500">
        Connect your accounts, explore better options and let AI find opportunities
      </span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="relative h-4 w-4 shrink-0 text-accent"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
