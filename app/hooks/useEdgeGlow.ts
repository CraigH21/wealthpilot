"use client";

import { useRef, type MouseEvent } from "react";

/** Tracks the raw cursor position over an element as `--spot-x`/`--spot-y`
 * CSS custom properties, for the cursor-following border glow (see
 * `EdgeGlow`). Set directly via the DOM ref rather than React state, so
 * mousemove doesn't trigger a re-render on every pixel of movement. */
export function useEdgeGlow<T extends HTMLElement>() {
  const cardRef = useRef<T>(null);

  const handleMouseMove = (event: MouseEvent<T>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return { cardRef, handleMouseMove };
}
