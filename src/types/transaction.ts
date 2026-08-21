export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number; // siempre positivo; el signo lo determina `type`
  type: TransactionType;
  description: string;
  date: string; // formato YYYY-MM-DD
  createdAt: string; // ISO timestamp de creación
}

/** Datos que el usuario ingresa en el formulario, antes de generar id/createdAt */
export type TransactionInput = {
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
};

export interface TransactionFilters {
  type: "all" | TransactionType;
  from: string | null;
  to: string | null;
  search: string;
}

export const EMPTY_FILTERS: TransactionFilters = {
  type: "all",
  from: null,
  to: null,
  search: "",
};
