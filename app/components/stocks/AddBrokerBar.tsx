"use client";

import EdgeGlow from "../EdgeGlow";
import { useEdgeGlow } from "../../hooks/useEdgeGlow";

export default function AddBrokerBar() {
  const { cardRef, handleMouseMove } = useEdgeGlow<HTMLButtonElement>();

  return (
    <button
      ref={cardRef}
      onMouseMove={handleMouseMove}
      type="button"
      className="group glass-edge-card relative inline-flex w-fit items-center gap-2.5 overflow-hidden rounded-full px-4 py-2.5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] transition-transform duration-300 ease-out hover:-translate-y-[2px]"
    >
      <EdgeGlow />
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-3.5 w-3.5"
          stroke="currentColor"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className="whitespace-nowrap text-sm font-semibold text-zinc-900">Add Broker / Account</span>
    </button>
  );
}
