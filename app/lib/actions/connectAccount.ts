"use server";

import { revalidatePath } from "next/cache";
import { generateMockConnection, type ConnectAccountInput, type ConnectionResult } from "../mock/accountConnection";
import { addConnectedAccount } from "../mock/portfolioContext";

/**
 * Runs the mock "connect an account" flow: generates realistic demo
 * accounts/transactions for the chosen provider, stores them in the shared
 * in-memory mock store, then invalidates every page that reads portfolio
 * data so they pick up the new account on next render. Swap
 * `generateMockConnection` for a real Open Banking/provider API call later
 * — this action's shape (input in, `ConnectionResult` out) doesn't need to
 * change.
 */
export async function connectAccountAction(input: ConnectAccountInput): Promise<ConnectionResult> {
  const { accounts, transactions, summary } = generateMockConnection(input);
  addConnectedAccount(accounts, transactions);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/banks");
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard/ai-coach");
  revalidatePath("/dashboard/crypto");
  revalidatePath("/dashboard/stocks");

  return summary;
}
