import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import * as api from "../services/debts.service";
import type { Debt, DebtInput, DebtUpdateInput } from "../types/debt";

export function useDebts() {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setDebts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setDebts(await api.getDebts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar deudas");
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createDebt = useCallback(async (input: DebtInput) => {
    const debt = await api.createDebt(input);
    setDebts((prev) => [debt, ...prev]);
    return debt;
  }, []);

  const updateDebt = useCallback(async (id: string, changes: DebtUpdateInput) => {
    const updated = await api.updateDebt(id, changes);
    setDebts((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  }, []);

  const deleteDebt = useCallback(async (id: string) => {
    await api.deleteDebt(id);
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const payInstallment = useCallback(async (debtId: string, installmentId: string) => {
    const updated = await api.payInstallment(debtId, installmentId);
    setDebts((prev) => prev.map((d) => (d.id === debtId ? updated : d)));
    return updated;
  }, []);

  const unpayInstallment = useCallback(async (debtId: string, installmentId: string) => {
    const updated = await api.unpayInstallment(debtId, installmentId);
    setDebts((prev) => prev.map((d) => (d.id === debtId ? updated : d)));
    return updated;
  }, []);

  return {
    debts,
    isLoading,
    error,
    clearError: () => setError(null),
    createDebt,
    updateDebt,
    deleteDebt,
    payInstallment,
    unpayInstallment,
    reload,
  };
}
