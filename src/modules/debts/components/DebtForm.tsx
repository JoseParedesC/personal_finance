import { useMemo, useState, type FormEvent } from "react";
import { Field } from "../../../shared/components/Field";
import { Button } from "../../../shared/components/Button";
import { todayISO } from "../../../shared/utils/dates";
import { MasterSelector } from "@joseparedesc/master-components";
import type { Category } from "../../categories/types/category";
import { createMasterSelectorService } from "../../../shared/services/master-selector";
import { useAuth } from "../../auth/context/AuthContext";
import type { DebtInput } from "../types/debt";

interface DebtFormProps {
  onSubmit: (input: DebtInput) => void | Promise<void>;
  onCancel: () => void;
}

export function DebtForm({ onSubmit, onCancel }: DebtFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [installmentsCount, setInstallmentsCount] = useState("12");
  const [startDate, setStartDate] = useState(todayISO());
  const [category, setCategory] = useState<Category | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchCategories = useMemo(
    () => (user ? createMasterSelectorService<Category>(user.uid, (c) => c.movementType === "expense") : null),
    [user]
  );

  const installmentPreview =
    Number(totalAmount) > 0 && Number(installmentsCount) > 0
      ? (Number(totalAmount) / Number(installmentsCount)).toLocaleString("es-CO", { maximumFractionDigits: 0 })
      : null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const amount = Number(totalAmount);
    const count = Number(installmentsCount);

    if (!name.trim()) return setError("El nombre es obligatorio.");
    if (!amount || amount <= 0) return setError("El monto total debe ser mayor a 0.");
    if (!count || count <= 0) return setError("El número de cuotas debe ser mayor a 0.");
    if (!startDate) return setError("La fecha de la primera cuota es obligatoria.");

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        totalAmount: amount,
        installmentsCount: count,
        startDate,
        categoryId: category?.id ?? null,
        notes: notes.trim() || undefined,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear la deuda.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Nombre">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Préstamo del carro"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <Field label="Monto total de la deuda">
        <input
          type="number"
          min={0}
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Ej: 12000000"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Número de cuotas">
          <input
            type="number"
            min={1}
            value={installmentsCount}
            onChange={(e) => setInstallmentsCount(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
        </Field>
        <Field label="Fecha primera cuota">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
        </Field>
      </div>

      {installmentPreview && (
        <p className="text-xs text-slate">
          Cada cuota será aproximadamente <span className="font-medium text-ink">${installmentPreview}</span> (la
          última ajusta el redondeo).
        </p>
      )}

      <Field label="Categoría para clasificar el gasto (opcional)">
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

      <Field label="Notas (opcional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      {error && <p className="text-xs text-clay">{error}</p>}

      <div className="mt-1 flex gap-3">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear deuda"}
        </Button>
      </div>
    </form>
  );
}
