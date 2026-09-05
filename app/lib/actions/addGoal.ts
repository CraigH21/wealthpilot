"use server";

import { revalidatePath } from "next/cache";
import { addGoal, type Goal } from "../mock/portfolioContext";

export type AddGoalInput = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  priority: Goal["priority"];
};

/** Adds a new savings goal to the mock store, then invalidates every page
 * that reads portfolio data so they pick up the new goal on next render.
 * Mirrors `connectAccountAction`. */
export async function addGoalAction(input: AddGoalInput): Promise<Goal> {
  const goal: Goal = {
    id: `goal-${Date.now()}`,
    name: input.name,
    targetAmount: input.targetAmount,
    currentAmount: input.currentAmount,
    monthlyContribution: input.monthlyContribution,
    targetDate: input.targetDate,
    priority: input.priority,
    keywords: [],
  };

  addGoal(goal);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard/ai-coach");

  return goal;
}
