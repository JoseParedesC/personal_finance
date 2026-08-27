import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import {
  clearAllMovimientos,
  createMovimiento,
  deleteMovimiento,
  getMovimientos,
  importMovimientos,
  updateMovimiento,
} from "../services/movimientos.service";
import type { Transaction, TransactionInput } from "../../../shared/types/transaction";

/**
 * Hook que expone el estado de movimientos y las operaciones CRUD para el
 * usuario autenticado actual. El usuario, no un id manual, es la fuente de verdad.
 */
export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setTransactions(await getMovimientos(user.uid));
    } catch {
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addTransaction = useCallback(
    async (input: TransactionInput) => {
      if (!user?.uid) return null;
      try {
        const transaction = await createMovimiento(user.uid, input);
        setTransactions((previous) => [transaction, ...previous]);
        return transaction;
      } catch (error) {
        console.error("Firestore rechazó la creación del movimiento", error);
        throw error;
      }
    },
    [user?.uid]
  );

  const updateTransaction = useCallback(
    async (id: string, changes: Partial<TransactionInput>) => {
      if (!user?.uid) return null;
      const updated = await updateMovimiento(user.uid, id, changes);
      if (!updated) return null;
      setTransactions((previous) =>
        previous.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    },
    [user?.uid]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      if (!user?.uid) return;
      await deleteMovimiento(user.uid, id);
      setTransactions((previous) => previous.filter((item) => item.id !== id));
    },
    [user?.uid]
  );

  const clearAll = useCallback(async () => {
    if (!user?.uid) return;
    await clearAllMovimientos(user.uid);
    setTransactions([]);
  }, [user?.uid]);

  const importTransactions = useCallback(
    async (imported: Transaction[]) => {
      if (!user?.uid) return;
      const next = await importMovimientos(user.uid, imported);
      setTransactions(next);
    },
    [user?.uid]
  );

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAll,
    importTransactions,
    reload,
  };
}
