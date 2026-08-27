import { useMemo, useState, type FormEvent } from "react";
import { Field } from "../../../shared/components/Field";
import { Button } from "../../../shared/components/Button";
import { MasterSelector } from "@joseparedesc/master-components";
import type { Category } from "../../categories/types/category";
import { createMasterSelectorService } from "../../../shared/services/master-selector";
import { useAuth } from "../../auth/context/AuthContext";
import type { BudgetInput } from "../types/budget";

interface BudgetFormProps {
  month: string;
  onSubmit: (input: BudgetInput) => void | Promise<void>;
  onCancel: () => void;
}

export function BudgetForm({ month, onSubmit, onCancel }: BudgetFormProps) {
  const { user } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [limitAmount, setLimitAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchCategories = useMemo(
    () => (user ? createMasterSelectorService<Category>(user.uid, (c) => c.movementType === "expense") : null),
    [user]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const limit = Number(limitAmount);
    if (!category) return setError("Elige una categoría.");
    if (!limit || limit <= 0) return setError("El monto tope debe ser mayor a 0.");

    setIsSubmitting(true);
    try {
      await onSubmit({ categoryId: category.id, month, limitAmount: limit });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear el presupuesto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Categoría">
        {searchCategories && (
          <MasterSelector<Category>
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

      <Field label={`Tope de gasto para ${month}`}>
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
          {isSubmitting ? "Guardando..." : "Crear tope"}
        </Button>
      </div>
    </form>
  );
}
