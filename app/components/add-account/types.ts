import type { Provider, AccountTypeId, BankAccountType, SyncFrequency, ConnectionResult } from "../../lib/mock/accountConnection";

export type WizardStep = "type" | "provider" | "connect" | "connecting" | "success";

export type WizardState = {
  step: WizardStep;
  typeId: AccountTypeId | null;
  provider: Provider | null;
  nickname: string;
  accountType: string;
  bankAccountTypes: BankAccountType[];
  currency: string;
  syncFrequency: SyncFrequency;
  result: ConnectionResult | null;
};

export const INITIAL_WIZARD_STATE: WizardState = {
  step: "type",
  typeId: null,
  provider: null,
  nickname: "",
  accountType: "",
  bankAccountTypes: ["Current"],
  currency: "GBP",
  syncFrequency: "Live",
  result: null,
};
