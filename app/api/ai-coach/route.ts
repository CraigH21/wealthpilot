import { NextResponse } from "next/server";
import { generateCoachInsight } from "../../lib/ai/coachService";
import type { CoachHistoryTurn } from "../../lib/ai/types";
import { getPortfolioContext } from "../../lib/mock/portfolioContext";

type RequestBody = {
  message?: unknown;
  history?: unknown;
};

function isHistoryTurn(value: unknown): value is CoachHistoryTurn {
  if (!value || typeof value !== "object") return false;
  const turn = value as Record<string, unknown>;
  return (
    (turn.role === "user" || turn.role === "assistant") &&
    typeof turn.text === "string" &&
    (turn.topic === undefined || typeof turn.topic === "string")
  );
}

/**
 * The stable AI Coach boundary — this is the interface the client always
 * talks to, regardless of what's generating answers behind it. Portfolio
 * context is built server-side from the current user's own data, never
 * trusted from the request body, the same way a real backend would.
 */
export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.message !== undefined && typeof body.message !== "string") {
    return NextResponse.json({ error: "`message` must be a string if provided." }, { status: 400 });
  }

  const history = Array.isArray(body.history) ? body.history.filter(isHistoryTurn) : [];
  const context = getPortfolioContext();

  const insight = await generateCoachInsight({
    message: body.message as string | undefined,
    context,
    history,
  });

  return NextResponse.json(insight);
}
