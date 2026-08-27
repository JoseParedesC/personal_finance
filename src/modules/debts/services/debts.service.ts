import { apiFetch } from "../../../shared/services/api";
import type { Debt, DebtInput, DebtUpdateInput } from "../types/debt";

export function getDebts(): Promise<Debt[]> {
  return apiFetch<Debt[]>("/debts");
}

export function getDebt(id: string): Promise<Debt> {
  return apiFetch<Debt>(`/debts/${id}`);
}

export function createDebt(input: DebtInput): Promise<Debt> {
  return apiFetch<Debt>("/debts", { method: "POST", body: JSON.stringify(input) });
}

export function updateDebt(id: string, changes: DebtUpdateInput): Promise<Debt> {
  return apiFetch<Debt>(`/debts/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
}

export function deleteDebt(id: string): Promise<void> {
  return apiFetch<void>(`/debts/${id}`, { method: "DELETE" });
}

export function payInstallment(debtId: string, installmentId: string, date?: string): Promise<Debt> {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  return apiFetch<Debt>(`/debts/${debtId}/installments/${installmentId}/pay${query}`, { method: "POST" });
}

export function unpayInstallment(debtId: string, installmentId: string): Promise<Debt> {
  return apiFetch<Debt>(`/debts/${debtId}/installments/${installmentId}/unpay`, { method: "POST" });
}
