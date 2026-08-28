import { Plus } from "lucide-react";
import { Button } from "../../../shared/components/Button";
import { formatCurrency } from "../../../shared/utils/currency";
import { BudgetRow } from "./BudgetRow";
import type { BudgetTypeSummary, BudgetType } from "../types/budget";

interface BudgetSectionProps {
  type: BudgetType;
  data: BudgetTypeSummary;
  onAdd: () => void;
  onUpdateLimit: (id: string, limitAmount: number) => Promise<void>;
  onDelete: (id: string, categoryName: string) => void;
}

const LABELS: Record<BudgetType, { title: string; subtitle: string; budgeted: string; actual: string; remaining: string; empty: string; cta: string }> = {
  expense: {
    title: "Presupuesto de gastos",
    subtitle: "Topes de gasto planeados por categoría.",
    budgeted: "Presupuestado",
    actual: "Gastado",
    remaining: "Restante",
    empty: "Sin topes de gasto definidos para este mes.",
    cta: "Nuevo tope",
  },
  income: {
    title: "Presupuesto de ingresos",
    subtitle: "Metas de ingreso planeadas por categoría.",
    budgeted: "Meta",
    actual: "Real",
    remaining: "Faltante",
    empty: "Sin metas de ingreso definidas para este mes.",
    cta: "Nueva meta",
  },
};

export function BudgetSection({ type, data, onAdd, onUpdateLimit, onDelete }: BudgetSectionProps) {
  const labels = LABELS[type];
  const remaining = type === "income" ? Math.max(0, data.totalRemaining) : data.totalRemaining;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{labels.title}</h3>
          <p className="text-sm text-slate">{labels.subtitle}</p>
        </div>
        <Button variant="secondary" onClick={onAdd}>
          <Plus size={15} />
          {labels.cta}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl2 border border-line bg-surface p-4 shadow-soft">
          <p className="text-xs text-slate">{labels.budgeted}</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">{formatCurrency(data.totalBudgeted)}</p>
        </div>
        <div className="rounded-xl2 border border-line bg-surface p-4 shadow-soft">
          <p className="text-xs text-slate">{labels.actual}</p>
          <p className="mt-1 font-display text-lg font-semibold text-ink">{formatCurrency(data.totalActual)}</p>
        </div>
        <div className="rounded-xl2 border border-line bg-surface p-4 shadow-soft">
          <p className="text-xs text-slate">{labels.remaining}</p>
          <p
            className={`mt-1 font-display text-lg font-semibold ${
              type === "expense" && data.totalRemaining < 0 ? "text-clay" : "text-ink"
            }`}
          >
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      {data.budgets.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-line bg-mist/40 px-6 py-10 text-center">
          <p className="text-sm text-slate">{labels.empty}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.budgets.map((budget) => (
            <BudgetRow
              key={budget.id}
              budget={budget}
              onUpdateLimit={(limitAmount) => onUpdateLimit(budget.id, limitAmount)}
              onDelete={() => onDelete(budget.id, budget.category.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
