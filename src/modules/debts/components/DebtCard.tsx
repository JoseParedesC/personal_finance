import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { formatCurrency } from "../../../shared/utils/currency";
import { formatDateLong } from "../../../shared/utils/dates";
import type { Debt } from "../types/debt";

interface DebtCardProps {
  debt: Debt;
  onPayInstallment: (installmentId: string) => Promise<void>;
  onUnpayInstallment: (installmentId: string) => Promise<void>;
  onDelete: () => void;
  onToggleActive: () => void;
}

export function DebtCard({ debt, onPayInstallment, onUnpayInstallment, onDelete, onToggleActive }: DebtCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [busyInstallmentId, setBusyInstallmentId] = useState<string | null>(null);
  const progress = debt.totalAmount > 0 ? debt.paidAmount / debt.totalAmount : 0;

  async function handlePay(installmentId: string) {
    setBusyInstallmentId(installmentId);
    try {
      await onPayInstallment(installmentId);
    } finally {
      setBusyInstallmentId(null);
    }
  }

  async function handleUnpay(installmentId: string) {
    if (!confirm("¿Deshacer el pago de esta cuota? Se borrará el movimiento asociado.")) return;
    setBusyInstallmentId(installmentId);
    try {
      await onUnpayInstallment(installmentId);
    } finally {
      setBusyInstallmentId(null);
    }
  }

  return (
    <div className="rounded-xl2 border border-line bg-surface shadow-soft">
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-display text-base font-semibold text-ink">{debt.name}</p>
            {!debt.active && <span className="rounded-full bg-mist px-2 py-0.5 text-xs text-slate">Inactiva</span>}
          </div>
          <p className="mt-0.5 text-xs text-slate">
            {debt.paidInstallmentsCount}/{debt.installmentsCount} cuotas pagadas
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-mist">
            <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-slate">
            <span>Pagado: {formatCurrency(debt.paidAmount)}</span>
            <span>Pendiente: {formatCurrency(debt.pendingAmount)}</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <button onClick={onToggleActive} className="rounded-full px-2 py-1 text-xs text-slate hover:bg-mist">
            {debt.active ? "Desactivar" : "Activar"}
          </button>
          <button
            onClick={onDelete}
            aria-label="Eliminar"
            className="rounded-full p-1.5 text-slate hover:bg-clay-light hover:text-clay"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex w-full items-center justify-center gap-1.5 border-t border-line py-2.5 text-xs font-medium text-slate hover:bg-mist/50"
      >
        {isExpanded ? "Ocultar cuotas" : "Ver cuotas"}
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <ul className="divide-y divide-line border-t border-line">
          {debt.installments.map((installment) => (
            <li key={installment.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <div>
                <p className="text-ink">
                  Cuota {installment.number}/{debt.installmentsCount}
                </p>
                <p className="text-xs text-slate">Vence: {formatDateLong(installment.dueDate)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-ink">{formatCurrency(installment.amount)}</span>
                {installment.status === "paid" ? (
                  <button
                    onClick={() => void handleUnpay(installment.id)}
                    disabled={busyInstallmentId === installment.id}
                    className="rounded-full bg-moss-light px-3 py-1.5 text-xs font-medium text-moss hover:opacity-80 disabled:opacity-40"
                  >
                    Pagada ✓
                  </button>
                ) : (
                  <button
                    onClick={() => void handlePay(installment.id)}
                    disabled={busyInstallmentId === installment.id}
                    className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper hover:bg-ink/90 disabled:opacity-40"
                  >
                    {busyInstallmentId === installment.id ? "Pagando..." : "Pagar"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
