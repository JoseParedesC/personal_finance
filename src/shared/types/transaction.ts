import { Category } from '../../../src/modules/categories/types/category';
import type { CreditCard } from '../../modules/credit-cards/types/creditCard';

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number; // siempre positivo; el signo lo determina `type`
  category: Category | null,
  creditCard?: CreditCard | null;
  type: TransactionType;
  description: string;
  date: string; // formato YYYY-MM-DD
  createdAt: string; // ISO timestamp de creación
  updatedAt?: string; // ISO timestamp de última edición
}

/** Datos que el usuario ingresa en el formulario, antes de generar id/createdAt */
export type TransactionInput = {
  amount: number;
  category: Category | null,
  creditCard?: CreditCard | null;
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
