import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "../../shared/components/Modal";
import { monthLabel } from "../../shared/utils/dates";
import { useBudgets } from "./hooks/useBudgets";
import { BudgetForm } from "./components/BudgetForm";
import { BudgetSection } from "./components/BudgetSection";
import type { BudgetInput, BudgetType } from "./types/budget";

function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function Budgets() {
  const { month, setMonth, summary, isLoading, error, clearError, createBudget, updateBudget, deleteBudget } =
    useBudgets();
  const [formType, setFormType] = useState<BudgetType | null>(null);

  const [year, m] = month.split("-").map(Number);

  async function handleCreate(input: BudgetInput) {
    await createBudget(input);
    setFormType(null);
  }

  async function handleDelete(id: string, categoryName: string) {
    if (!confirm(`¿Eliminar "${categoryName}"?`)) return;
    await deleteBudget(id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Presupuesto mensual</h2>
          <p className="text-sm text-slate">Metas de ingreso y topes de gasto por categoría.</p>
        </div>
        <div className="flex items-center justify-center gap-3 rounded-full border border-line bg-surface px-4 py-2">
          <button onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Mes anterior" className="rounded-full p-1 hover:bg-mist">
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[9rem] text-center text-sm font-medium text-ink">
            {monthLabel(m)} {year}
          </span>
          <button onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Mes siguiente" className="rounded-full p-1 hover:bg-mist">
            <ChevronRight size={16} />
          </button>
        </div>
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
          <BudgetSection
            type="income"
            data={summary.income}
            onAdd={() => setFormType("income")}
            onUpdateLimit={updateBudget}
            onDelete={handleDelete}
          />

          <hr className="border-line" />

          <BudgetSection
            type="expense"
            data={summary.expense}
            onAdd={() => setFormType("expense")}
            onUpdateLimit={updateBudget}
            onDelete={handleDelete}
          />
        </>
      )}

      <Modal
        isOpen={formType !== null}
        onClose={() => setFormType(null)}
        title={formType === "income" ? "Nueva meta de ingreso" : "Nuevo tope de gasto"}
      >
        {formType && (
          <BudgetForm month={month} defaultType={formType} onSubmit={handleCreate} onCancel={() => setFormType(null)} />
        )}
      </Modal>
    </div>
  );
}
