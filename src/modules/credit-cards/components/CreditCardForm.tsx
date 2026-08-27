import { useState, type FormEvent } from "react";
import { Field } from "../../../shared/components/Field";
import { Button } from "../../../shared/components/Button";
import type { CreditCard, CreditCardInput } from "../types/creditCard";

interface CreditCardFormProps {
  initial?: CreditCard | null;
  onSubmit: (input: CreditCardInput) => void | Promise<void>;
  onCancel: () => void;
}

export function CreditCardForm({ initial = null, onSubmit, onCancel }: CreditCardFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [creditLimit, setCreditLimit] = useState(initial ? String(initial.creditLimit) : "");
  const [closingDay, setClosingDay] = useState(initial ? String(initial.closingDay) : "1");
  const [paymentDueDay, setPaymentDueDay] = useState(initial ? String(initial.paymentDueDay) : "15");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const limit = Number(creditLimit);
    const closing = Number(closingDay);
    const dueDay = Number(paymentDueDay);

    if (!name.trim()) return setError("El nombre es obligatorio.");
    if (!limit || limit <= 0) return setError("El límite de crédito debe ser mayor a 0.");
    if (!closing || closing < 1 || closing > 31) return setError("El día de corte debe estar entre 1 y 31.");
    if (!dueDay || dueDay < 1 || dueDay > 31) return setError("El día de pago debe estar entre 1 y 31.");

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), creditLimit: limit, closingDay: closing, paymentDueDay: dueDay });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo guardar la tarjeta.");
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
          placeholder="Ej: Visa Bancolombia"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <Field label="Límite de crédito">
        <input
          type="number"
          min={0}
          value={creditLimit}
          onChange={(e) => setCreditLimit(e.target.value)}
          placeholder="Ej: 5000000"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Día de corte">
          <input
            type="number"
            min={1}
            max={31}
            value={closingDay}
            onChange={(e) => setClosingDay(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
        </Field>
        <Field label="Día límite de pago">
          <input
            type="number"
            min={1}
            max={31}
            value={paymentDueDay}
            onChange={(e) => setPaymentDueDay(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
        </Field>
      </div>

      {error && <p className="text-xs text-clay">{error}</p>}

      <div className="mt-1 flex gap-3">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : initial ? "Guardar cambios" : "Crear tarjeta"}
        </Button>
      </div>
    </form>
  );
}
