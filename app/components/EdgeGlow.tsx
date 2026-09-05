import type { CSSProperties } from "react";

/** Renders inside a card (which must be `relative`, have the `group`
 * class, and use `useEdgeGlow`'s `cardRef`/`handleMouseMove` on itself) to
 * add a cursor-following highlight along its border. Follows the raw
 * cursor 1:1 (always smooth — no edge-projection math to snap or bulge at
 * corners). Visible only within a ~12px ring around the card, built via
 * the content-box/border-box XOR mask trick rather than four independent
 * per-edge linear fades — a per-edge fade produces a square inner cutout
 * that ignores the card's rounded corners (leaving chunky square corners
 * in the ring), while masking against `content-box` (inset by the ring's
 * own padding) against `border-box` lets the browser shrink the inner
 * rounded-rect by the correct radius at each corner automatically. */
export default function EdgeGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] p-[6px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(230px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.9), var(--accent-glow) 45%, transparent 72%)",
        WebkitMaskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
        WebkitMaskClip: "content-box, border-box",
        WebkitMaskComposite: "xor",
        maskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)",
        maskClip: "content-box, border-box",
        maskComposite: "exclude",
      } as CSSProperties}
    />
  );
}
