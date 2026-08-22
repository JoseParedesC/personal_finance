import { useMemo } from "react";
import type { Transaction } from "../../../shared/types/transaction";
import { formatDateLong } from "../../../shared/utils/dates";
import { formatSignedCurrency } from "../../../shared/utils/currency";
import { groupByDate, signedValue } from "../../../shared/utils/calculations";
import { TransactionItem } from "./TransactionItem";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Card } from "../../../shared/components/Card";
import { Modal } from "../../../shared/components/Modal";
import { TransactionForm } from "./TransactionForm";
import { useTransactionManager } from "./TransactionManager";
import { SearchX } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  hasAnyTransactions: boolean;
}

export function TransactionList({ transactions, hasAnyTransactions }: TransactionListProps) {
  const { editingTransaction, cancelEdit, confirmEdit } = useTransactionManager();

  const groupedEntries = useMemo(() => {
    const groups = groupByDate(transactions);
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [transactions]);

  if (transactions.length === 0) {
    return hasAnyTransactions ? (
      <EmptyState
        icon={<SearchX size={22} />}
        title="Sin resultados"
        description="No encontramos movimientos con estos filtros."
      />
    ) : (
      <EmptyState
        title="Todavía no tienes movimientos"
        description="Agrega tu primer ingreso o gasto para comenzar."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groupedEntries.map(([date, items]) => {
        const dayTotal = items.reduce((sum, t) => sum + signedValue(t), 0);
        return (
          <div key={date}>
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                {formatDateLong(date)}
              </p>
              <p className="font-mono text-xs font-medium text-slate">
                {formatSignedCurrency(dayTotal)}
              </p>
            </div>
            <Card className="divide-y divide-line px-4">
              {items.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </Card>
          </div>
        );
      })}

      <Modal isOpen={editingTransaction !== null} onClose={cancelEdit} title="Editar movimiento">
        {editingTransaction && (
          <TransactionForm
            initial={editingTransaction}
            submitLabel="Guardar cambios"
            onCancel={cancelEdit}
            onSubmit={(changes) => confirmEdit(editingTransaction.id, changes)}
          />
        )}
      </Modal>
    </div>
  );
}
