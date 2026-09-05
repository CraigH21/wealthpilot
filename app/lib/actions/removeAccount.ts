"use server";

import { revalidatePath } from "next/cache";
import { removeConnectedAccount } from "../mock/portfolioContext";

/** Removes a connected account (and its transactions) from the mock store,
 * then invalidates every page that reads portfolio data. Mirrors
 * `connectAccountAction` — swap the mock removal for a real "revoke access"
 * API call later without changing the caller. */
export async function removeAccountAction(accountId: string): Promise<void> {
  removeConnectedAccount(accountId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/banks");
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard/ai-coach");
  revalidatePath("/dashboard/crypto");
  revalidatePath("/dashboard/stocks");
}
