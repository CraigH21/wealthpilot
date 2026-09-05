import AddBankBar from "../../components/banks/AddBankBar";
import BankCTABar from "../../components/banks/BankCTABar";
import BankCashCard from "../../components/banks/BankCashCard";
import ConnectedBanks from "../../components/banks/ConnectedBanks";
import BankAccountsTable, { type BankAccountRow } from "../../components/banks/BankAccountsTable";
import TopOpportunities, { TOP_SAVINGS_AER } from "../../components/banks/TopOpportunities";
import RecentTransactionsTable from "../../components/banks/RecentTransactionsTable";
import SpendingCategoriesCard from "../../components/banks/SpendingCategoriesCard";
import AIBankingInsights from "../../components/banks/AIBankingInsights";
import AllocationDonut, { type AllocationSlice } from "../../components/crypto/AllocationDonut";
import { getPortfolioContext, getCashValueHistory } from "../../lib/mock/portfolioContext";

const monthChangeFor = (accountId: string, transactions: { accountId: string; date: string; amount: number }[]) =>
  Math.round(
    transactions
      .filter((t) => t.accountId === accountId && t.date.startsWith("2026-07"))
      .reduce((sum, t) => sum + t.amount, 0) * 100
  ) / 100;

export default function BanksPage() {
  const context = getPortfolioContext();
  const cashHistory = getCashValueHistory();

  const bankAccounts = context.connectedAccounts.filter((a) => a.category === "bank");
  const totalCash = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
  const netThisMonth = Math.round((context.monthlyIncome - context.monthlySpending) * 100) / 100;

  const bankTransactions = context.recentTransactions.filter((t) =>
    bankAccounts.some((account) => account.id === t.accountId)
  );

  const accountRows: BankAccountRow[] = bankAccounts.map((account) => ({
    id: account.id,
    bankName: account.provider.charAt(0).toUpperCase() + account.provider.slice(1),
    accountName: account.accountType ?? account.name,
    logo: account.logo,
    balance: account.balance,
    interestRateAER: account.interestRateAER ?? null,
    monthChange: monthChangeFor(account.id, context.recentTransactions),
  }));

  const ACCOUNT_TYPE_SLICES: { symbol: string; accountType: string; name: string; color: string }[] = [
    { symbol: "CUR", accountType: "Current Account", name: "Current Accounts", color: "#38bdf8" },
    { symbol: "SAV", accountType: "Savings Account", name: "Savings Accounts", color: "var(--accent)" },
    { symbol: "POT", accountType: "Savings Pot", name: "Savings Pots", color: "#c084fc" },
  ];
  const allocationSlices: AllocationSlice[] = ACCOUNT_TYPE_SLICES.map((slice) => {
    const value = bankAccounts
      .filter((a) => a.accountType === slice.accountType)
      .reduce((sum, a) => sum + a.balance, 0);
    return {
      symbol: slice.symbol,
      name: slice.name,
      color: slice.color,
      value,
      pct: totalCash > 0 ? Math.round((value / totalCash) * 1000) / 10 : 0,
    };
  })
    .filter((slice) => slice.value > 0)
    .sort((a, b) => b.value - a.value);

  const bestSavingsAER = Math.max(
    ...bankAccounts.filter((a) => a.accountType !== "Current Account").map((a) => a.interestRateAER ?? 0)
  );
  const emergencyFund = context.goals.find((g) => g.id === "emergency-fund");

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Banks</h1>
          <p className="mt-1.5 text-sm text-zinc-600">Your money, your options, greater possibilities.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <AddBankBar />
        <BankCTABar />
      </div>

      <BankCashCard
        totalCash={totalCash}
        netThisMonth={netThisMonth}
        monthlyIncome={context.monthlyIncome}
        monthlySpending={context.monthlySpending}
        history={cashHistory}
      />

      <ConnectedBanks accounts={bankAccounts} transactions={context.recentTransactions} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <BankAccountsTable accounts={accountRows} />
        </div>
        <div className="flex flex-col gap-6">
          <AllocationDonut slices={allocationSlices} total={totalCash} />
          <TopOpportunities />
        </div>
      </div>

      <RecentTransactionsTable transactions={bankTransactions} accounts={bankAccounts} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingCategoriesCard categories={context.spendingByCategory} />
        <AIBankingInsights
          bestSavingsAER={bestSavingsAER}
          topOpportunityAER={TOP_SAVINGS_AER}
          emergencyFundCurrent={emergencyFund?.currentAmount ?? 0}
          emergencyFundTarget={emergencyFund?.targetAmount ?? 1}
        />
      </div>
    </div>
  );
}
