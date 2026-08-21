import { useMemo, useState } from "react";
import type { Transaction } from "../../types/transaction";
import { calculateMonthlySummary } from "../../utils/calculations";
import { formatCurrency, formatSignedCurrency } from "../../utils/currency";
import { formatDateLong, currentYearMonth, monthLabel } from "../../utils/dates";
import { Card } from "../common/Card";

interface MonthlySummaryProps {
  transactions: Transaction[];
}

export function MonthlySummary({ transactions }: MonthlySummaryProps) {
  const [yearMonth, setYearMonth] = useState(currentYearMonth());
  const summary = useMemo(
    () => calculateMonthlySummary(transactions, yearMonth),
    [transactions, yearMonth]
  );

  const [year, month] = yearMonth.split("-").map(Number);

  return (
    <Card className="p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-semibold text-ink">
          {monthLabel(month)} {year}
        </p>
        <input
          type="month"
          value={yearMonth}
          onChange={(e) => setYearMonth(e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink outline-none focus:border-ink"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 border-b border-line pb-5 font-mono">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate">Ingresos</p>
          <p className="mt-1 text-lg font-semibold text-moss">
            {formatCurrency(summary.income)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate">Gastos</p>
          <p className="mt-1 text-lg font-semibold text-clay">
            {formatCurrency(summary.expenses)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate">Balance</p>
          <p
            className={`mt-1 text-lg font-semibold ${
              summary.balance >= 0 ? "text-moss" : "text-clay"
            }`}
          >
            {formatSignedCurrency(summary.balance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-5 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate">Cant. ingresos</p>
          <p className="font-medium text-ink">{summary.incomeCount}</p>
        </div>
        <div>
          <p className="text-xs text-slate">Cant. gastos</p>
          <p className="font-medium text-ink">{summary.expenseCount}</p>
        </div>
        <div>
          <p className="text-xs text-slate">Promedio gasto/día</p>
          <p className="font-medium text-ink">
            {formatCurrency(summary.averageDailyExpense)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate">Día mayor gasto</p>
          <p className="font-medium text-ink">
            {summary.highestExpenseDay
              ? `${formatDateLong(summary.highestExpenseDay.date)}`
              : "—"}
          </p>
        </div>
      </div>
    </Card>
  );
}
