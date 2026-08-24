import { mockEngine } from "./mockEngine";

/**
 * The one line that decides which AI engine powers the whole app. Today it's
 * the local mock (no network, no API key, no cost). To connect a real model
 * later: write a new engine file implementing the same `AIEngine` interface
 * (e.g. `openaiEngine.ts`, calling out to OpenAI with these same
 * calculators wired up as tools), then change this one export — nothing in
 * `app/api/ai-coach/route.ts`, `coachService.ts`, or any UI component needs
 * to change.
 */
export const activeEngine = mockEngine;
