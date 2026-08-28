import { Wallet, Pencil, Power, Trash2, ShieldOff, ArrowDownToLine } from "lucide-react";
import { formatCurrency } from "../../../shared/utils/currency";
import type { Pocket } from "../types/pocket";

interface PocketTileProps {
  pocket: Pocket;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  onFund: () => void;
}

export function PocketTile({ pocket, onEdit, onToggleActive, onDelete, onFund }: PocketTileProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl2 border border-line bg-surface p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
            <Wallet size={16} />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-ink">{pocket.name}</p>
            {pocket.description && <p className="text-xs text-slate">{pocket.description}</p>}
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
        <p className="text-xs text-slate">Saldo</p>
        <p className={`font-display text-2xl font-semibold ${pocket.balance < 0 ? "text-clay" : "text-ink"}`}>
          {formatCurrency(pocket.balance)}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate">
        <span>{pocket.movementsCount} movimientos</span>
        {!pocket.affectsBudget && (
          <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5">
            <ShieldOff size={11} />
            No afecta presupuesto
          </span>
        )}
      </div>

      {!pocket.active && <span className="w-fit rounded-full bg-mist px-2 py-0.5 text-xs text-slate">Inactivo</span>}

      <button
        onClick={onFund}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-mist px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-line"
      >
        <ArrowDownToLine size={14} />
        Cargar bolsillo
      </button>
    </div>
  );
}
