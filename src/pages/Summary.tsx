import { MonthlySummary } from "../components/Summary/MonthlySummary";
import { DailySummary } from "../components/Summary/DailySummary";
import { FlowChart } from "../components/Charts/FlowChart";
import { useTransactionManager } from "../components/TransactionManager/TransactionManager";

export function Summary() {
  const { transactions, dailySummary } = useTransactionManager();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Resumen</h1>

      <MonthlySummary transactions={transactions} />

      <FlowChart transactions={transactions} />

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">
          Resumen por día
        </h2>
        <DailySummary days={dailySummary} />
      </section>
    </div>
  );
}
