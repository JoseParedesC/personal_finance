import { apiFetch } from "../../../shared/services/api";
import type { Budget, BudgetInput, BudgetSummary } from "../types/budget";

export function getBudgets(month?: string): Promise<Budget[]> {
  const query = month ? `?month=${encodeURIComponent(month)}` : "";
  return apiFetch<Budget[]>(`/budgets${query}`);
}

export function getBudgetSummary(month?: string): Promise<BudgetSummary> {
  const query = month ? `?month=${encodeURIComponent(month)}` : "";
  return apiFetch<BudgetSummary>(`/budgets/summary${query}`);
}

export function createBudget(input: BudgetInput): Promise<Budget> {
  return apiFetch<Budget>("/budgets", { method: "POST", body: JSON.stringify(input) });
}

export function updateBudget(id: string, limitAmount: number): Promise<Budget> {
  return apiFetch<Budget>(`/budgets/${id}`, { method: "PATCH", body: JSON.stringify({ limitAmount }) });
}

export function deleteBudget(id: string): Promise<void> {
  return apiFetch<void>(`/budgets/${id}`, { method: "DELETE" });
}
