import type { ReactNode } from "react";

/**
 * Per-goal display metadata (icon + colour tone) — kept separate from
 * `portfolioContext.ts` because it's a UI concern, not portfolio data. Keyed
 * by `Goal.id`, so it can't drift out of sync with which goals actually
 * exist; a goal added later without an entry here just falls back to
 * `DEFAULT_GOAL_META` instead of throwing.
 */

export type GoalTone = "accent" | "sky" | "rose";

export const TONE_STYLE: Record<GoalTone, { bg: string; text: string; hex: string }> = {
  accent: { bg: "bg-accent-soft", text: "text-accent", hex: "var(--accent)" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", hex: "#38bdf8" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", hex: "#fb7185" },
};

export type GoalMeta = { icon: ReactNode; tone: GoalTone };

const ICONS = {
  shield: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />,
  home: <path d="M4 10l8-5 8 5v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z" />,
  plane: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  car: <path d="M5 17h14M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zM5 17V9l2-5h10l2 5v8" />,
  trendingUp: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="0.5" />
      <path d="M12 8v13M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      <path d="M12 8H8.5a2.5 2.5 0 010-5C11 3 12 8 12 8zM12 8h3.5a2.5 2.5 0 000-5C13 3 12 8 12 8z" />
    </>
  ),
};

export const GOAL_META: Record<string, GoalMeta> = {
  "emergency-fund": { icon: ICONS.shield, tone: "accent" },
  "house-deposit": { icon: ICONS.home, tone: "accent" },
  "holiday-fund": { icon: ICONS.plane, tone: "sky" },
  "new-car": { icon: ICONS.car, tone: "rose" },
  retirement: { icon: ICONS.trendingUp, tone: "accent" },
  "christmas-fund": { icon: ICONS.gift, tone: "rose" },
};

export const DEFAULT_GOAL_META: GoalMeta = { icon: ICONS.shield, tone: "accent" };

export function getGoalMeta(goalId: string): GoalMeta {
  return GOAL_META[goalId] ?? DEFAULT_GOAL_META;
}
