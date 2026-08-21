import { BalanceCards } from "../components/Dashboard/BalanceCards";
import { DailySummary } from "../components/Summary/DailySummary";
import { FlowChart } from "../components/Charts/FlowChart";
import { TransactionList } from "../components/TransactionList/TransactionList";
import { useTransactionManager } from "../components/TransactionManager/TransactionManager";

export function Dashboard() {
  const { transactions, balance, income, expenses, dailySummary } =
    useTransactionManager();

  const recent = [...transactions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <BalanceCards
          balance={balance}
          income={income}
          expenses={expenses}
          count={transactions.length}
        />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">
          Movimientos recientes
        </h2>
        <TransactionList transactions={recent} hasAnyTransactions={transactions.length > 0} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">
          Resumen diario
        </h2>
        <DailySummary days={dailySummary} limit={6} />
      </section>

      <section>
        <FlowChart transactions={transactions} />
      </section>
    </div>
  );
}
