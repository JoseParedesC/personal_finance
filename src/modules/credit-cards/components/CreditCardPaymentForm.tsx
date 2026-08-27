import { useState, type FormEvent } from "react";
import { Field } from "../../../shared/components/Field";
import { Button } from "../../../shared/components/Button";
import { todayISO } from "../../../shared/utils/dates";
import type { CreditCardPaymentInput } from "../types/creditCard";

interface CreditCardPaymentFormProps {
  onSubmit: (input: CreditCardPaymentInput) => void | Promise<void>;
  onCancel: () => void;
}

export function CreditCardPaymentForm({ onSubmit, onCancel }: CreditCardPaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) return setError("El monto debe ser mayor a 0.");
    if (!date) return setError("La fecha es obligatoria.");

    setIsSubmitting(true);
    try {
      await onSubmit({ amount: parsedAmount, date, note: note.trim() || undefined });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo registrar el abono.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Monto del abono">
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ej: 200000"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <Field label="Fecha">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <Field label="Nota (opcional)">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej: Pago mínimo de agosto"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      {error && <p className="text-xs text-clay">{error}</p>}

      <div className="mt-1 flex gap-3">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Registrar abono"}
        </Button>
      </div>
    </form>
  );
}
