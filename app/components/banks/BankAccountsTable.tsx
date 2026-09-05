export type BankAccountRow = {
  id: string;
  bankName: string;
  accountName: string;
  logo?: string;
  balance: number;
  interestRateAER: number | null;
  monthChange: number;
};

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);

export default function BankAccountsTable({ accounts }: { accounts: BankAccountRow[] }) {
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalMonthChange = accounts.reduce((sum, a) => sum + a.monthChange, 0);
  const totalChangePositive = totalMonthChange >= 0;

  return (
    <div className="glass-edge-card relative overflow-hidden rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_3px_3px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_var(--accent-soft)] backdrop-blur-[32px] sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">My Bank Accounts</h2>
          <p className="mt-1 text-sm text-zinc-600">Your balances, interest rates and performance</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-zinc-600">
              <th className="pb-3 pr-2 font-medium">#</th>
              <th className="pb-3 pr-2 font-medium">Bank</th>
              <th className="pb-3 pr-2 font-medium">Account Name</th>
              <th className="pb-3 pr-2 text-right font-medium">Balance</th>
              <th className="pb-3 pr-2 text-right font-medium">Interest Rate</th>
              <th className="pb-3 pl-2 text-right font-medium">This Month</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {accounts.map((account, index) => {
              const changePositive = account.monthChange >= 0;
              return (
                <tr key={account.id} className="transition-colors duration-300 ease-out hover:bg-black/5">
                  <td className="py-3 pr-2 text-zinc-600">{index + 1}</td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      {account.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={account.logo} alt="" className="h-7 w-7 shrink-0 rounded-full bg-black/10 object-cover" />
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
                          {account.bankName[0]}
                        </span>
                      )}
                      <span className="font-medium text-zinc-900">{account.bankName}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-2 text-zinc-500">{account.accountName}</td>
                  <td className="py-3 pr-2 text-right font-medium text-zinc-900">{formatGBP(account.balance)}</td>
                  <td className="py-3 pr-2 text-right text-zinc-600">
                    {account.interestRateAER != null ? `${account.interestRateAER}%` : "—"}
                  </td>
                  <td className={`py-3 pl-2 text-right font-medium ${changePositive ? "text-accent" : "text-red-400"}`}>
                    {changePositive ? "+" : ""}
                    {formatGBP(account.monthChange)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-black/10 text-sm font-semibold text-zinc-900">
              <td className="py-3 pr-2" colSpan={3}>
                TOTAL
              </td>
              <td className="py-3 pr-2 text-right">{formatGBP(totalBalance)}</td>
              <td className="py-3 pr-2 text-right">—</td>
              <td className={`py-3 pl-2 text-right ${totalChangePositive ? "text-accent" : "text-red-400"}`}>
                {totalChangePositive ? "+" : ""}
                {formatGBP(totalMonthChange)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
