import { apiFetch } from "../../../shared/services/api";
import type { Budget, BudgetInput, BudgetSummary, BudgetType } from "../types/budget";

export function getBudgets(month?: string, type?: BudgetType): Promise<Budget[]> {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  if (type) params.set("type", type);
  const query = params.toString() ? `?${params.toString()}` : "";
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
