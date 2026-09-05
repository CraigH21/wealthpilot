import type { AccountCategory, ConnectedAccount, Transaction } from "./portfolioContext";

export type AccountTypeId = "bank" | "crypto" | "investment" | "pension" | "other";

export type AccountTypeOption = {
  id: AccountTypeId;
  label: string;
  description: string;
  icon: string;
  accountCategory: AccountCategory;
};

export const ACCOUNT_TYPES: AccountTypeOption[] = [
  { id: "bank", label: "Bank", description: "Current accounts, savings & credit cards", icon: "🏦", accountCategory: "bank" },
  { id: "crypto", label: "Crypto Wallet", description: "Exchanges & self-custody wallets", icon: "₿", accountCategory: "crypto" },
  { id: "investment", label: "Investment Platform", description: "ISAs, general accounts & brokers", icon: "📈", accountCategory: "broker" },
  { id: "pension", label: "Pension", description: "Workplace & personal pensions", icon: "💼", accountCategory: "pension" },
  { id: "other", label: "Other Account", description: "Anything else worth tracking", icon: "💳", accountCategory: "payments" },
];

export type Provider = {
  id: string;
  name: string;
  typeId: AccountTypeId;
  logo?: string;
};

export const PROVIDERS: Provider[] = [
  // Banks
  { id: "barclays", name: "Barclays", typeId: "bank", logo: "/icons/platforms/barclays.png" },
  { id: "monzo", name: "Monzo", typeId: "bank", logo: "/icons/platforms/monzo.png" },
  { id: "chase", name: "Chase", typeId: "bank" },
  { id: "lloyds", name: "Lloyds", typeId: "bank", logo: "/icons/platforms/lloyds.svg" },
  { id: "hsbc", name: "HSBC", typeId: "bank", logo: "/icons/platforms/hsbc.svg" },
  { id: "santander", name: "Santander", typeId: "bank", logo: "/icons/platforms/santander.svg" },
  { id: "starling", name: "Starling", typeId: "bank" },
  { id: "halifax", name: "Halifax", typeId: "bank" },
  { id: "nationwide", name: "Nationwide", typeId: "bank" },
  // Investment platforms
  { id: "trading212", name: "Trading 212", typeId: "investment", logo: "/icons/platforms/trading212.png" },
  { id: "vanguard", name: "Vanguard", typeId: "investment", logo: "/icons/platforms/vanguard.svg" },
  { id: "freetrade", name: "Freetrade", typeId: "investment", logo: "/icons/platforms/freetrade.svg" },
  { id: "interactive-brokers", name: "Interactive Brokers", typeId: "investment", logo: "/icons/platforms/interactive-brokers.svg" },
  // Crypto wallets
  { id: "metamask", name: "MetaMask", typeId: "crypto", logo: "/icons/platforms/metamask.png" },
  { id: "ledger", name: "Ledger", typeId: "crypto", logo: "/icons/platforms/ledger.svg" },
  { id: "rabby", name: "Rabby Wallet", typeId: "crypto", logo: "/icons/platforms/rabby.svg" },
  { id: "coinbase", name: "Coinbase", typeId: "crypto", logo: "/icons/platforms/coinbase.png" },
  { id: "kraken", name: "Kraken", typeId: "crypto", logo: "/icons/platforms/kraken.png" },
  // Pension providers
  { id: "aviva", name: "Aviva", typeId: "pension", logo: "/icons/platforms/aviva.svg" },
  { id: "nest", name: "Nest", typeId: "pension" },
  { id: "scottish-widows", name: "Scottish Widows", typeId: "pension" },
  { id: "pensionbee", name: "PensionBee", typeId: "pension" },
];

export function getProvidersForType(typeId: AccountTypeId): Provider[] {
  return PROVIDERS.filter((provider) => provider.typeId === typeId);
}

export const ACCOUNT_SUBTYPES = ["Current", "Savings", "ISA", "Credit Card", "Wallet", "Other"];
export const SYNC_FREQUENCIES = ["Live", "Hourly", "Daily"] as const;
export type SyncFrequency = (typeof SYNC_FREQUENCIES)[number];

// Which of these a bank connection actually has — the person picks only
// the ones they hold at that bank, so only those accounts get created.
export const BANK_ACCOUNT_TYPES = ["Current", "Savings", "ISA"] as const;
export type BankAccountType = (typeof BANK_ACCOUNT_TYPES)[number];

export type ConnectAccountInput = {
  provider: Provider;
  typeId: AccountTypeId;
  nickname: string;
  accountType: string;
  bankAccountTypes: BankAccountType[];
  currency: string;
  syncFrequency: SyncFrequency;
};

export type ConnectionResult = {
  providerName: string;
  providerLogo?: string;
  accounts: { name: string; balance: number }[];
  transactionCount: number;
};

// The mock dataset's own internal "today" — Peter Williams' transaction
// history and net-worth anchors all end on 2026-08-24, independent of the
// real wall-clock date. New accounts generate relative to this so they
// stay on the same timeline as the rest of the demo data.
const MOCK_TODAY = new Date("2026-08-24");

let connectionSequence = 0;

function nextId(prefix: string): string {
  connectionSequence += 1;
  return `${prefix}-${connectionSequence}`;
}

function isoDateDaysAgo(daysAgo: number): string {
  const date = new Date(MOCK_TODAY);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function randBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

type MerchantTemplate = { merchant: string; description: string; category: string; amountRange: [number, number] };

// Config per selectable bank sub-account — only the types the user actually
// ticks in the connect step get generated, rather than always creating a
// current + savings pair regardless of what they said they hold.
const BANK_ACCOUNT_CONFIG: Record<
  BankAccountType,
  { defaultName: (provider: Provider) => string; balanceRange: [number, number]; interestRange: [number, number]; accountType: string }
> = {
  Current: {
    defaultName: (provider) => `${provider.name} Current Account`,
    balanceRange: [600, 4200],
    interestRange: [0.5, 1.5],
    accountType: "Current Account",
  },
  Savings: {
    defaultName: (provider) => `${provider.name} Savings Account`,
    balanceRange: [1200, 11000],
    interestRange: [3.5, 4.5],
    accountType: "Savings Account",
  },
  ISA: {
    defaultName: (provider) => `${provider.name} ISA`,
    balanceRange: [3000, 20000],
    interestRange: [4.0, 5.0],
    accountType: "ISA",
  },
};

function generateBankConnection(input: ConnectAccountInput) {
  const { provider, nickname } = input;
  const selectedTypes: BankAccountType[] =
    input.bankAccountTypes && input.bankAccountTypes.length > 0 ? input.bankAccountTypes : ["Current"];

  const accountIds = new Map<BankAccountType, string>();
  const accounts: ConnectedAccount[] = selectedTypes.map((type) => {
    const config = BANK_ACCOUNT_CONFIG[type];
    const id = nextId(`${provider.id}-${type.toLowerCase()}`);
    accountIds.set(type, id);
    return {
      id,
      name: type === "Current" && nickname ? nickname : config.defaultName(provider),
      provider: provider.id,
      category: "bank",
      balance: round2(randBetween(...config.balanceRange)),
      status: "connected",
      logo: provider.logo,
      accountType: config.accountType,
      interestRateAER: round2(randBetween(...config.interestRange)),
    };
  });

  // Recurring transactions always need somewhere to post — prefer the
  // current account since that's where day-to-day money actually moves,
  // falling back to whichever account the user did select.
  const currentId = accountIds.get("Current") ?? accountIds.get("Savings") ?? accountIds.get("ISA")!;
  const hasSavings = accountIds.has("Savings");

  const standingOrders: MerchantTemplate[] = [
    { merchant: "Manchester Lettings", description: "Rent", category: "Housing", amountRange: [-1150, -750] },
    { merchant: "Manchester City Council", description: "Council tax", category: "Housing", amountRange: [-180, -140] },
  ];
  const bills: MerchantTemplate[] = [
    { merchant: "Octopus Energy", description: "Energy bill", category: "Bills & Utilities", amountRange: [-165, -95] },
    { merchant: "Virgin Media", description: "Broadband", category: "Bills & Utilities", amountRange: [-50, -35] },
    { merchant: "EE", description: "Mobile plan", category: "Bills & Utilities", amountRange: [-38, -22] },
  ];
  const subscriptions: MerchantTemplate[] = [
    { merchant: "Netflix", description: "Streaming", category: "Subscriptions", amountRange: [-16.99, -16.99] },
    { merchant: "Spotify", description: "Music streaming", category: "Subscriptions", amountRange: [-11.99, -11.99] },
  ];
  const shopping: MerchantTemplate[] = [
    { merchant: "Amazon", description: "Online order", category: "Shopping", amountRange: [-90, -20] },
    { merchant: "Tesco", description: "Weekly shop", category: "Groceries", amountRange: [-75, -40] },
    { merchant: "ASOS", description: "New outfit", category: "Shopping", amountRange: [-70, -25] },
    { merchant: "Deliveroo", description: "Dinner delivery", category: "Dining & Takeaway", amountRange: [-32, -18] },
  ];
  const transfers: MerchantTemplate[] = [
    { merchant: `${provider.name} Savings Account`, description: "Transfer to savings", category: "Transfers", amountRange: [-350, -100] },
  ];
  const salary: MerchantTemplate = {
    merchant: "Northbridge Digital Ltd",
    description: "Salary",
    category: "Income",
    amountRange: [2800, 4200],
  };

  const transactions: Transaction[] = [];
  let txIndex = 0;
  const pushTx = (daysAgo: number, accountId: string, template: MerchantTemplate) => {
    txIndex += 1;
    transactions.push({
      id: `${currentId}-tx-${txIndex}`,
      date: isoDateDaysAgo(daysAgo),
      description: template.description,
      merchant: template.merchant,
      category: template.category,
      amount: round2(randBetween(template.amountRange[0], template.amountRange[1])),
      accountId,
    });
  };

  // Three months of recurring items — salary, standing orders, bills, subscriptions, a savings transfer.
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const base = monthOffset * 30;
    pushTx(base + 4, currentId, salary);
    standingOrders.forEach((template, i) => pushTx(base + 1 + i, currentId, template));
    bills.forEach((template, i) => pushTx(base + 6 + i * 2, currentId, template));
    subscriptions.forEach((template, i) => pushTx(base + 12 + i, currentId, template));
    if (hasSavings) pushTx(base + 16, currentId, transfers[0]);
  }

  // Variable day-to-day shopping spread across the 90-day window.
  for (let i = 0; i < 14; i++) {
    pushTx(Math.floor(randBetween(0, 89)), currentId, shopping[i % shopping.length]);
  }

  transactions.sort((a, b) => b.date.localeCompare(a.date));

  return {
    accounts,
    transactions,
    summary: {
      providerName: provider.name,
      providerLogo: provider.logo,
      accounts: accounts.map((account) => ({ name: account.name, balance: account.balance })),
      transactionCount: transactions.length,
    },
  };
}

function generateSimpleConnection(
  input: ConnectAccountInput,
  category: AccountCategory,
  defaultName: string,
  balanceRange: [number, number],
  templates: MerchantTemplate[]
) {
  const { provider, nickname } = input;
  const id = nextId(provider.id);
  const balance = round2(randBetween(balanceRange[0], balanceRange[1]));

  const accounts: ConnectedAccount[] = [
    {
      id,
      name: nickname || defaultName,
      provider: provider.id,
      category,
      balance,
      status: "connected",
      logo: provider.logo,
      accountType: input.accountType || undefined,
    },
  ];

  const count = 8 + Math.floor(randBetween(0, 6));
  const transactions: Transaction[] = Array.from({ length: count }, (_, i) => {
    const template = templates[i % templates.length];
    return {
      id: `${id}-tx-${i + 1}`,
      date: isoDateDaysAgo(Math.floor(randBetween(0, 89))),
      description: template.description,
      merchant: template.merchant,
      category: template.category,
      amount: round2(randBetween(template.amountRange[0], template.amountRange[1])),
      accountId: id,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  return {
    accounts,
    transactions,
    summary: {
      providerName: provider.name,
      providerLogo: provider.logo,
      accounts: accounts.map((account) => ({ name: account.name, balance: account.balance })),
      transactionCount: transactions.length,
    },
  };
}

export function generateMockConnection(
  input: ConnectAccountInput
): { accounts: ConnectedAccount[]; transactions: Transaction[]; summary: ConnectionResult } {
  if (input.typeId === "bank") return generateBankConnection(input);

  if (input.typeId === "crypto") {
    return generateSimpleConnection(input, "crypto", input.provider.name, [800, 15000], [
      { merchant: input.provider.name, description: "Bought Bitcoin", category: "Investing", amountRange: [-500, -50] },
      { merchant: input.provider.name, description: "Bought Ethereum", category: "Investing", amountRange: [-300, -40] },
      { merchant: input.provider.name, description: "Received transfer", category: "Transfers", amountRange: [50, 400] },
      { merchant: input.provider.name, description: "Sold Solana", category: "Investing", amountRange: [80, 350] },
    ]);
  }

  if (input.typeId === "investment") {
    return generateSimpleConnection(input, "broker", `${input.provider.name} Account`, [2000, 40000], [
      { merchant: input.provider.name, description: "Dividend received", category: "Investing Income", amountRange: [8, 60] },
      { merchant: input.provider.name, description: "Contribution", category: "Investing", amountRange: [-500, -100] },
      { merchant: input.provider.name, description: "Buy order", category: "Investing", amountRange: [-800, -150] },
    ]);
  }

  if (input.typeId === "pension") {
    return generateSimpleConnection(input, "pension", `${input.provider.name} Pension`, [15000, 90000], [
      { merchant: "Northbridge Digital Ltd", description: "Employer contribution", category: "Pension", amountRange: [150, 400] },
      { merchant: input.provider.name, description: "Personal contribution", category: "Pension", amountRange: [50, 200] },
    ]);
  }

  return generateSimpleConnection(input, "payments", input.provider.name, [50, 2000], [
    { merchant: input.provider.name, description: "Payment received", category: "Other", amountRange: [20, 300] },
    { merchant: input.provider.name, description: "Payment sent", category: "Other", amountRange: [-200, -20] },
  ]);
}
