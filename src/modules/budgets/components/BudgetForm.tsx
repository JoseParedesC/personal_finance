import { useMemo, useState, type FormEvent } from "react";
import { Field } from "../../../shared/components/Field";
import { Button } from "../../../shared/components/Button";
import { MasterSelector } from "@joseparedesc/master-components";
import type { Category } from "../../categories/types/category";
import { createMasterSelectorService } from "../../../shared/services/master-selector";
import { useAuth } from "../../auth/context/AuthContext";
import type { BudgetInput, BudgetType } from "../types/budget";

interface BudgetFormProps {
  month: string;
  /** Tipo preseleccionado (ej: al abrir desde la sección de Ingresos). Igual se puede cambiar en el formulario. */
  defaultType?: BudgetType;
  onSubmit: (input: BudgetInput) => void | Promise<void>;
  onCancel: () => void;
}

export function BudgetForm({ month, defaultType = "expense", onSubmit, onCancel }: BudgetFormProps) {
  const { user } = useAuth();
  const [type, setType] = useState<BudgetType>(defaultType);
  const [category, setCategory] = useState<Category | null>(null);
  const [limitAmount, setLimitAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cambiar de tipo invalida la categoría elegida, porque el maestro de
  // categorías distingue por movementType (income/expense).
  function handleTypeChange(next: BudgetType) {
    setType(next);
    setCategory(null);
  }

  const searchCategories = useMemo(
    () => (user ? createMasterSelectorService<Category>(user.uid, (c) => c.movementType === type) : null),
    [user, type]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const limit = Number(limitAmount);
    if (!category) return setError("Elige una categoría.");
    if (!limit || limit <= 0) return setError("El monto debe ser mayor a 0.");

    setIsSubmitting(true);
    try {
      await onSubmit({ categoryId: category.id, month, type, limitAmount: limit });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear el presupuesto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Tipo">
        <div className="flex rounded-full bg-mist p-1 text-sm">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex-1 rounded-full py-1.5 font-medium transition-colors ${
              type === "expense" ? "bg-surface text-ink shadow-soft" : "text-slate hover:text-ink"
            }`}
          >
            Gasto
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex-1 rounded-full py-1.5 font-medium transition-colors ${
              type === "income" ? "bg-surface text-ink shadow-soft" : "text-slate hover:text-ink"
            }`}
          >
            Ingreso
          </button>
        </div>
      </Field>

      <Field label="Categoría">
        {searchCategories && (
          <MasterSelector<Category>
            key={type}
            entity="categories"
            value={category}
            onChange={setCategory}
            search={searchCategories}
            minSearchLength={3}
            getOptionLabel={(c) => `${c.code} - ${c.name}`}
            getOptionValue={(c) => c.id}
            placeholder="Buscar categoría..."
          />
        )}
      </Field>

      <Field label={type === "income" ? `Meta de ingreso para ${month}` : `Tope de gasto para ${month}`}>
        <input
          type="number"
          min={0}
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          placeholder="Ej: 500000"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      {error && <p className="text-xs text-clay">{error}</p>}

      <div className="mt-1 flex gap-3">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : type === "income" ? "Crear meta" : "Crear tope"}
        </Button>
      </div>
    </form>
  );
}
