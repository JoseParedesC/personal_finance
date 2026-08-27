import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Modal } from "../../shared/components/Modal";
import { Button } from "../../shared/components/Button";
import { formatCurrency } from "../../shared/utils/currency";
import { monthLabel } from "../../shared/utils/dates";
import { useBudgets } from "./hooks/useBudgets";
import { BudgetForm } from "./components/BudgetForm";
import { BudgetRow } from "./components/BudgetRow";
import type { BudgetInput } from "./types/budget";

function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function Budgets() {
  const { month, setMonth, summary, isLoading, error, clearError, createBudget, updateBudget, deleteBudget } =
    useBudgets();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [year, m] = month.split("-").map(Number);

  async function handleCreate(input: BudgetInput) {
    await createBudget(input);
    setIsFormOpen(false);
  }

  async function handleDelete(id: string, categoryName: string) {
    if (!confirm(`¿Eliminar el tope de "${categoryName}"?`)) return;
    await deleteBudget(id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Presupuesto mensual</h2>
          <p className="text-sm text-slate">Topes de gasto planeados por categoría.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={15} />
          Nuevo tope
        </Button>
      </div>

      <div className="flex items-center justify-center gap-3 rounded-full border border-line bg-surface px-4 py-2 self-start">
        <button onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Mes anterior" className="rounded-full p-1 hover:bg-mist">
          <ChevronLeft size={16} />
        </button>
        <span className="min-w-[10rem] text-center text-sm font-medium text-ink">
          {monthLabel(m)} {year}
        </span>
        <button onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Mes siguiente" className="rounded-full p-1 hover:bg-mist">
          <ChevronRight size={16} />
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg bg-clay-light px-4 py-3 text-sm text-clay">
          <span>{error}</span>
          <button onClick={clearError} className="text-xs underline">
            Cerrar
          </button>
        </div>
      )}

      {isLoading && <p className="py-10 text-center text-sm text-slate">Cargando...</p>}

      {!isLoading && summary && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl2 border border-line bg-surface p-4 shadow-soft">
              <p className="text-xs text-slate">Presupuestado</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">
                {formatCurrency(summary.totalBudgeted)}
              </p>
            </div>
            <div className="rounded-xl2 border border-line bg-surface p-4 shadow-soft">
              <p className="text-xs text-slate">Gastado</p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">{formatCurrency(summary.totalSpent)}</p>
            </div>
            <div className="rounded-xl2 border border-line bg-surface p-4 shadow-soft">
              <p className="text-xs text-slate">Restante</p>
              <p
                className={`mt-1 font-display text-lg font-semibold ${
                  summary.totalRemaining < 0 ? "text-clay" : "text-ink"
                }`}
              >
                {formatCurrency(summary.totalRemaining)}
              </p>
            </div>
          </div>

          {summary.budgets.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-line bg-mist/40 px-6 py-16 text-center">
              <p className="font-display text-lg font-medium text-ink">Sin topes definidos para este mes</p>
              <p className="mt-1 text-sm text-slate">Crea el primero con el botón &quot;Nuevo tope&quot;.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {summary.budgets.map((budget) => (
                <BudgetRow
                  key={budget.id}
                  budget={budget}
                  onUpdateLimit={(limitAmount) => updateBudget(budget.id, limitAmount)}
                  onDelete={() => void handleDelete(budget.id, budget.category.name)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Nuevo tope de presupuesto">
        <BudgetForm month={month} onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
