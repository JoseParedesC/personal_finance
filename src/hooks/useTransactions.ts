import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  clearAllMovimientos,
  createMovimiento,
  deleteMovimiento,
  getMovimientos,
  importMovimientos,
  updateMovimiento,
} from "../services/movimientos.service";
import type { Transaction, TransactionInput } from "../types/transaction";

/**
 * Hook que expone el estado de movimientos y las operaciones CRUD para el
 * usuario autenticado actual. El usuario, no un id manual, es la fuente de verdad.
 */
export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    if (!user?.uid) {
      setTransactions([]);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    setIsLoading(true);

    getMovimientos(user.uid)
      .then((data) => {
        if (isActive) {
          setTransactions(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isActive) {
          setTransactions([]);
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [user?.uid]);

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
  };
}
