import type { DailySummary as DailySummaryType } from "../../utils/calculations";
import { formatCurrency, formatSignedCurrency } from "../../utils/currency";
import { Card } from "../common/Card";
import { EmptyState } from "../common/EmptyState";

interface DailySummaryProps {
  days: DailySummaryType[];
  limit?: number;
}

export function DailySummary({ days, limit }: DailySummaryProps) {
  const visible = limit ? days.slice(0, limit) : days;

  if (visible.length === 0) {
    return (
      <EmptyState
        title="Sin movimiento diario"
        description="Cuando registres movimientos, verás aquí cuánto se movió cada día."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((day) => (
        <Card key={day.date} className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">
            {day.label}
          </p>
          <div className="mt-3 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate">Ingresos</span>
              <span className="text-moss">{formatCurrency(day.income)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate">Gastos</span>
              <span className="text-clay">{formatCurrency(day.expenses)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-1.5 font-medium">
              <span className="text-ink">Balance</span>
              <span className={day.balance >= 0 ? "text-moss" : "text-clay"}>
                {formatSignedCurrency(day.balance)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
