import { useState, type FormEvent } from "react";
import { Field } from "../../../shared/components/Field";
import { Button } from "../../../shared/components/Button";
import type { Pocket, PocketInput } from "../types/pocket";

interface PocketFormProps {
  initial?: Pocket | null;
  onSubmit: (input: PocketInput) => void | Promise<void>;
  onCancel: () => void;
}

export function PocketForm({ initial = null, onSubmit, onCancel }: PocketFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [affectsBudget, setAffectsBudget] = useState(initial?.affectsBudget ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("El nombre es obligatorio.");

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined, affectsBudget });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo guardar el bolsillo.");
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
          placeholder="Ej: Ahorros, Mercado, Viaje..."
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <Field label="Descripción (opcional)">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <label className="flex items-start gap-2.5 rounded-lg bg-mist/50 p-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={affectsBudget}
          onChange={(e) => setAffectsBudget(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-line"
        />
        <span>
          Los movimientos de este bolsillo afectan el presupuesto
          <span className="block text-xs text-slate">
            Si lo desmarcas (ej: un bolsillo de ahorros), sus gastos no contarán contra los topes mensuales.
          </span>
        </span>
      </label>

      {error && <p className="text-xs text-clay">{error}</p>}

      <div className="mt-1 flex gap-3">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : initial ? "Guardar cambios" : "Crear bolsillo"}
        </Button>
      </div>
    </form>
  );
}
