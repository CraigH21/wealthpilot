/** Renders inside a card (which must be `relative`, have the `group`
 * class, and use `useEdgeGlow`'s `cardRef`/`handleMouseMove` on itself) to
 * add a cursor-following highlight along its border. Follows the raw
 * cursor 1:1 (always smooth — no edge-projection math to snap or bulge at
 * corners). Masked visible only within ~12px of any of the 4 edges via
 * four independent linear fades, one per edge, rather than a single
 * centred ellipse — an ellipse can't hug a rectangle's corners properly
 * (they sit much further from centre than the edge midpoints do), so it
 * bled into the middle of the card there; measuring per-edge pixel
 * distance instead works correctly at any aspect ratio. */
export default function EdgeGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(230px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.9), var(--accent-glow) 45%, transparent 72%)",
        maskImage:
          "linear-gradient(to bottom, black, transparent 12px), linear-gradient(to top, black, transparent 12px), linear-gradient(to right, black, transparent 12px), linear-gradient(to left, black, transparent 12px)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black, transparent 12px), linear-gradient(to top, black, transparent 12px), linear-gradient(to right, black, transparent 12px), linear-gradient(to left, black, transparent 12px)",
      }}
    />
  );
}
