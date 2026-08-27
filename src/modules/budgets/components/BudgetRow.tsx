import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { formatCurrency } from "../../../shared/utils/currency";
import type { Budget } from "../types/budget";

interface BudgetRowProps {
  budget: Budget;
  onUpdateLimit: (limitAmount: number) => Promise<void>;
  onDelete: () => void;
}

export function BudgetRow({ budget, onUpdateLimit, onDelete }: BudgetRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftLimit, setDraftLimit] = useState(String(budget.limitAmount));
  const [isSaving, setIsSaving] = useState(false);

  const progress = Math.min(1, budget.percentageUsed / 100);
  const barColor = budget.isOverBudget ? "bg-clay" : budget.percentageUsed >= 80 ? "bg-amber-500" : "bg-ink";

  async function handleSave() {
    const value = Number(draftLimit);
    if (!value || value <= 0) return;
    setIsSaving(true);
    try {
      await onUpdateLimit(value);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-xl2 border border-line bg-surface p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: budget.category.color }} />
          <p className="font-medium text-ink">{budget.category.name}</p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                type="number"
                min={0}
                autoFocus
                value={draftLimit}
                onChange={(e) => setDraftLimit(e.target.value)}
                className="w-28 rounded-lg border border-line bg-surface px-2 py-1 text-right text-sm text-ink outline-none focus:border-ink"
              />
              <button
                onClick={() => void handleSave()}
                disabled={isSaving}
                aria-label="Guardar"
                className="rounded-full p-1.5 text-moss hover:bg-moss-light"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                aria-label="Cancelar"
                className="rounded-full p-1.5 text-slate hover:bg-mist"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-slate">Tope: {formatCurrency(budget.limitAmount)}</span>
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Editar tope"
                className="rounded-full p-1.5 text-slate hover:bg-mist"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={onDelete}
                aria-label="Eliminar"
                className="rounded-full p-1.5 text-slate hover:bg-clay-light hover:text-clay"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-mist">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-slate">
        <span className={budget.isOverBudget ? "font-medium text-clay" : ""}>
          Gastado: {formatCurrency(budget.spent)} ({budget.percentageUsed.toFixed(0)}%)
        </span>
        <span>
          {budget.isOverBudget ? "Excedido en " : "Restante: "}
          {formatCurrency(Math.abs(budget.remaining))}
        </span>
      </div>
    </div>
  );
}
