import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import * as api from "../services/budgets.service";
import type { BudgetInput, BudgetSummary } from "../types/budget";
import { currentYearMonth } from "../../../shared/utils/dates";

export function useBudgets(initialMonth: string = currentYearMonth()) {
  const { user } = useAuth();
  const [month, setMonth] = useState(initialMonth);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setSummary(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setSummary(await api.getBudgetSummary(month));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el presupuesto");
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, month]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createBudget = useCallback(
    async (input: BudgetInput) => {
      await api.createBudget(input);
      await reload();
    },
    [reload]
  );

  const updateBudget = useCallback(
    async (id: string, limitAmount: number) => {
      await api.updateBudget(id, limitAmount);
      await reload();
    },
    [reload]
  );

  const deleteBudget = useCallback(
    async (id: string) => {
      await api.deleteBudget(id);
      await reload();
    },
    [reload]
  );

  return {
    month,
    setMonth,
    summary,
    isLoading,
    error,
    clearError: () => setError(null),
    createBudget,
    updateBudget,
    deleteBudget,
    reload,
  };
}
