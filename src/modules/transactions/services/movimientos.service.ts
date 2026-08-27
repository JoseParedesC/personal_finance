import { apiFetch } from "../../../shared/services/api";
import type { Transaction, TransactionInput } from "../../../shared/types/transaction";
import type { Category } from "../../categories/types/category";
import type { CreditCard } from "../../credit-cards/types/creditCard";
import type { Pocket } from "../../pockets/types/pocket";

// Forma en la que el backend NestJS devuelve un movimiento: usa
// `categoryId` para escribir y devuelve `category` (objeto completo, vía
// `include`) para leer. El resto del frontend sigue trabajando con
// `Transaction.category` embebido, igual que antes con Firestore.
type ApiTransaction = {
  id: string;
  amount: number;
  type: Transaction["type"];
  description: string;
  date: string;
  categoryId: string | null;
  category: Category | null;
  creditCardId: string | null;
  creditCard: CreditCard | null;
  pocketId: string | null;
  pocket: Pocket | null;
  createdAt: string;
  updatedAt: string;
};

function toTransaction(api: ApiTransaction): Transaction {
  return {
    id: api.id,
    amount: api.amount,
    category: api.category,
    creditCard: api.creditCard,
    pocket: api.pocket,
    type: api.type,
    description: api.description,
    date: api.date,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export async function getMovimientos(_uid: string): Promise<Transaction[]> {
  const data = await apiFetch<ApiTransaction[]>("/transactions");
  return data.map(toTransaction);
}

export async function createMovimiento(_uid: string, input: TransactionInput): Promise<Transaction> {
  const data = await apiFetch<ApiTransaction>("/transactions", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amount,
      type: input.type,
      description: input.description,
      date: input.date,
      categoryId: input.category?.id ?? null,
      creditCardId: input.creditCard?.id ?? null,
      pocketId: input.pocket?.id ?? null,
    }),
  });
  return toTransaction(data);
}

export async function updateMovimiento(
  _uid: string,
  id: string,
  changes: Partial<TransactionInput>
): Promise<Transaction | null> {
  const data = await apiFetch<ApiTransaction>(`/transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...(changes.amount !== undefined ? { amount: changes.amount } : {}),
      ...(changes.type !== undefined ? { type: changes.type } : {}),
      ...(changes.description !== undefined ? { description: changes.description } : {}),
      ...(changes.date !== undefined ? { date: changes.date } : {}),
      ...(changes.category !== undefined ? { categoryId: changes.category?.id ?? null } : {}),
      ...(changes.creditCard !== undefined ? { creditCardId: changes.creditCard?.id ?? null } : {}),
      ...(changes.pocket !== undefined ? { pocketId: changes.pocket?.id ?? null } : {}),
    }),
  });
  return toTransaction(data);
}

export async function deleteMovimiento(_uid: string, id: string): Promise<void> {
  await apiFetch<void>(`/transactions/${id}`, { method: "DELETE" });
}

export async function clearAllMovimientos(_uid: string): Promise<void> {
  await apiFetch<void>("/transactions/all", { method: "DELETE" });
}

export async function importMovimientos(_uid: string, transactions: Transaction[]): Promise<Transaction[]> {
  if (!transactions.length) return [];

  const data = await apiFetch<ApiTransaction[]>("/transactions/import", {
    method: "POST",
    body: JSON.stringify({
      transactions: transactions.map((t) => ({
        amount: t.amount,
        type: t.type,
        description: t.description,
        date: t.date,
        categoryId: t.category?.id ?? null,
        creditCardId: t.creditCard?.id ?? null,
        pocketId: t.pocket?.id ?? null,
        createdAt: t.createdAt,
      })),
    }),
  });
  return data.map(toTransaction);
}
