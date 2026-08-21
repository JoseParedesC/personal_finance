import { Pencil, Trash2, ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Transaction } from "../../types/transaction";
import { formatSignedCurrency } from "../../utils/currency";
import { useTransactionManager } from "../TransactionManager/TransactionManager";

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { requestEdit, requestDelete } = useTransactionManager();
  const isIncome = transaction.type === "income";
  const signed = isIncome ? transaction.amount : -transaction.amount;

  return (
    <div className="group flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isIncome ? "bg-moss-light text-moss" : "bg-clay-light text-clay"
          }`}
        >
          {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
        <p className="truncate text-sm font-medium text-ink">
          {transaction.description}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span
          className={`font-mono text-sm font-medium tabular-nums ${
            isIncome ? "text-moss" : "text-clay"
          }`}
        >
          {formatSignedCurrency(signed)}
        </span>
        <button
          onClick={() => requestEdit(transaction.id)}
          aria-label="Editar movimiento"
          className="rounded-full p-1.5 text-slate opacity-0 transition-opacity hover:bg-mist group-hover:opacity-100"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => requestDelete(transaction.id)}
          aria-label="Eliminar movimiento"
          className="rounded-full p-1.5 text-slate opacity-0 transition-opacity hover:bg-clay-light hover:text-clay group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
