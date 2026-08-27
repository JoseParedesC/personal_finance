import { apiFetch } from "../../../shared/services/api";
import type {
  CreditCard,
  CreditCardInput,
  CreditCardPayment,
  CreditCardPaymentInput,
} from "../types/creditCard";

export function getCreditCards(): Promise<CreditCard[]> {
  return apiFetch<CreditCard[]>("/credit-cards");
}

export function createCreditCard(input: CreditCardInput): Promise<CreditCard> {
  return apiFetch<CreditCard>("/credit-cards", { method: "POST", body: JSON.stringify(input) });
}

export function updateCreditCard(
  id: string,
  changes: Partial<CreditCardInput> & { active?: boolean }
): Promise<CreditCard> {
  return apiFetch<CreditCard>(`/credit-cards/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
}

export function deleteCreditCard(id: string): Promise<void> {
  return apiFetch<void>(`/credit-cards/${id}`, { method: "DELETE" });
}

export function getCreditCardPayments(cardId: string): Promise<CreditCardPayment[]> {
  return apiFetch<CreditCardPayment[]>(`/credit-cards/${cardId}/payments`);
}

export function addCreditCardPayment(
  cardId: string,
  input: CreditCardPaymentInput
): Promise<CreditCard> {
  return apiFetch<CreditCard>(`/credit-cards/${cardId}/payments`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
