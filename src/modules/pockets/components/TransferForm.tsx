import { useMemo, useState, type FormEvent } from "react";
import { Field } from "../../../shared/components/Field";
import { Button } from "../../../shared/components/Button";
import { todayISO } from "../../../shared/utils/dates";
import { formatCurrency } from "../../../shared/utils/currency";
import type { GeneralAccount, Pocket, TransferInput } from "../types/pocket";

const MAIN_ACCOUNT_VALUE = "__general__";

interface TransferFormProps {
  pockets: Pocket[];
  general: GeneralAccount | null;
  /** Si se abre desde un bolsillo puntual (ej: botón "Cargar"), preselecciona destino y origen=cuenta principal. */
  defaultToPocketId?: string;
  onSubmit: (input: TransferInput) => Promise<void>;
  onCancel: () => void;
}

function accountLabel(id: string, pockets: Pocket[]): string {
  if (id === MAIN_ACCOUNT_VALUE) return "Cuenta principal";
  return pockets.find((p) => p.id === id)?.name ?? "—";
}

function availableBalance(id: string, pockets: Pocket[], general: GeneralAccount | null): number {
  if (id === MAIN_ACCOUNT_VALUE) return general?.balance ?? 0;
  return pockets.find((p) => p.id === id)?.balance ?? 0;
}

export function TransferForm({ pockets, general, defaultToPocketId, onSubmit, onCancel }: TransferFormProps) {
  const [fromId, setFromId] = useState<string>(MAIN_ACCOUNT_VALUE);
  const [toId, setToId] = useState<string>(defaultToPocketId ?? "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePockets = useMemo(() => pockets.filter((p) => p.active), [pockets]);
  const fromBalance = availableBalance(fromId, activePockets, general);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!fromId) return setError("Elige el origen.");
    if (!toId) return setError("Elige el destino.");
    if (fromId === toId) return setError("El origen y el destino no pueden ser la misma cuenta.");
    if (!parsedAmount || parsedAmount <= 0) return setError("El monto debe ser mayor a 0.");
    if (parsedAmount > fromBalance) {
      return setError(
        `Saldo insuficiente en "${accountLabel(fromId, activePockets)}": disponible ${formatCurrency(fromBalance)}.`
      );
    }
    if (!date) return setError("La fecha es obligatoria.");

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: parsedAmount,
        date,
        description: description.trim() || undefined,
        fromPocketId: fromId === MAIN_ACCOUNT_VALUE ? null : fromId,
        toPocketId: toId === MAIN_ACCOUNT_VALUE ? null : toId,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo registrar la transferencia.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Origen">
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          >
            <option value={MAIN_ACCOUNT_VALUE}>Cuenta principal</option>
            {activePockets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Destino">
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          >
            <option value="">Elige un destino...</option>
            <option value={MAIN_ACCOUNT_VALUE}>Cuenta principal</option>
            {activePockets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <p className="text-xs text-slate">
        Disponible en {accountLabel(fromId, activePockets)}:{" "}
        <span className="font-medium text-ink">{formatCurrency(fromBalance)}</span>
      </p>

      <Field label="Monto a transferir">
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Ahorro mensual"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
        />
      </Field>

      {error && <p className="text-xs text-clay">{error}</p>}

      <div className="mt-1 flex gap-3">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Transfiriendo..." : "Transferir"}
        </Button>
      </div>
    </form>
  );
}
