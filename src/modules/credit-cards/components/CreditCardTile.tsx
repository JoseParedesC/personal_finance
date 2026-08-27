import { CreditCard as CardIcon, Pencil, Power, Trash2, Wallet } from "lucide-react";
import { formatCurrency } from "../../../shared/utils/currency";
import { formatDateLong } from "../../../shared/utils/dates";
import type { CreditCard } from "../types/creditCard";

interface CreditCardTileProps {
  card: CreditCard;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  onOpenPayments: () => void;
}

export function CreditCardTile({ card, onEdit, onToggleActive, onDelete, onOpenPayments }: CreditCardTileProps) {
  const usedRatio = card.creditLimit > 0 ? Math.min(1, card.usedAmount / card.creditLimit) : 0;
  const isNearLimit = usedRatio >= 0.8;

  return (
    <div className="flex flex-col gap-4 rounded-xl2 border border-line bg-surface p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
            <CardIcon size={16} />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-ink">{card.name}</p>
            <p className="text-xs text-slate">{card.active ? "Activa" : "Inactiva"}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} aria-label="Editar" className="rounded-full p-1.5 text-slate hover:bg-mist">
            <Pencil size={14} />
          </button>
          <button onClick={onToggleActive} aria-label="Activar/Desactivar" className="rounded-full p-1.5 text-slate hover:bg-mist">
            <Power size={14} />
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

      <div>
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="text-slate">Usado: {formatCurrency(card.usedAmount)}</span>
          <span className="font-medium text-ink">Cupo: {formatCurrency(card.creditLimit)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
          <div
            className={`h-full rounded-full transition-all ${isNearLimit ? "bg-clay" : "bg-ink"}`}
            style={{ width: `${usedRatio * 100}%` }}
          />
        </div>
        <p className={`mt-1.5 text-xs ${isNearLimit ? "text-clay" : "text-slate"}`}>
          Disponible: {formatCurrency(card.availableCredit)}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate">
        <span>Corte: {formatDateLong(card.nextClosingDate)}</span>
        <span>Pago límite: {formatDateLong(card.nextPaymentDueDate)}</span>
      </div>

      <button
        onClick={onOpenPayments}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-mist px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-line"
      >
        <Wallet size={14} />
        Ver abonos / registrar pago
      </button>
    </div>
  );
}
