import { useCallback, useEffect, useState } from "react";
import type { Transaction, TransactionInput } from "../types/transaction";
import { storage, generateId } from "../services/storage";

/**
 * Hook que expone el estado de movimientos y las operaciones CRUD.
 * Es la frontera entre la capa de persistencia (services/storage) y la UI:
 * ningún componente debe importar `storage` directamente, solo este hook
 * (o el shell que lo consume, ver components/TransactionManager).
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTransactions(storage.getAll());
    setIsLoading(false);
  }, []);

  const addTransaction = useCallback((input: TransactionInput) => {
    const transaction: Transaction = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(storage.add(transaction));
    return transaction;
  }, []);

  const updateTransaction = useCallback(
    (id: string, changes: Partial<TransactionInput>) => {
      setTransactions(storage.update(id, changes));
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(storage.remove(id));
  }, []);

  const clearAll = useCallback(() => {
    storage.clear();
    setTransactions([]);
  }, []);

  const importTransactions = useCallback((imported: Transaction[]) => {
    storage.saveAll(imported);
    setTransactions(imported);
  }, []);

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAll,
    importTransactions,
  };
}
