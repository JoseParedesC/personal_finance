import { useState, type FormEvent } from "react";
import type { Transaction, TransactionInput, TransactionType } from "../../types/transaction";
import { todayISO } from "../../utils/dates";
import { Field } from "../common/Field";
import { Button } from "../common/Button";

interface TransactionFormProps {
  initial?: Transaction | null;
  onSubmit: (input: TransactionInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
}

export function TransactionForm({
  initial = null,
  onSubmit,
  onCancel,
  submitLabel = "Agregar movimiento",
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? "expense");
  const [amount, setAmount] = useState<string>(
    initial ? String(initial.amount) : ""
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const next: FormErrors = {};
    const numeric = Number(amount);
    if (!amount || Number.isNaN(numeric) || numeric <= 0) {
      next.amount = "Ingresa un valor mayor que 0.";
    }
    if (!description.trim()) {
      next.description = "La descripción es obligatoria.";
    }
    if (!date) {
      next.date = "La fecha es obligatoria.";
    }
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    onSubmit({
      type,
      amount: Math.abs(Number(amount)),
      description: description.trim(),
      date,
    });

    if (!initial) {
      setAmount("");
      setDescription("");
      setDate(todayISO());
      setType("expense");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Tipo">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              type === "income"
                ? "border-moss bg-moss-light text-moss"
                : "border-line bg-surface text-slate hover:bg-mist"
            }`}
          >
            Ingreso
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              type === "expense"
                ? "border-clay bg-clay-light text-clay"
                : "border-line bg-surface text-slate hover:bg-mist"
            }`}
          >
            Gasto
          </button>
        </div>
      </Field>

      <Field label="Valor" error={errors.amount} htmlFor="amount">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate">
            $
          </span>
          <input
            id="amount"
            type="number"
            min={0}
            step="1"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-line bg-surface py-2.5 pl-7 pr-3 font-mono text-sm text-ink outline-none focus:border-ink"
          />
        </div>
      </Field>

      <Field label="Detalle" error={errors.description} htmlFor="description">
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Salario, Mercado, Netflix"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <Field label="Fecha" error={errors.date} htmlFor="date">
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      <div className="mt-2 flex gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" fullWidth>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
