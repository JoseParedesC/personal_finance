import type { Category } from "../../categories/types/category";

export type BudgetType = "income" | "expense";

export interface Budget {
  id: string;
  month: string; // YYYY-MM
  type: BudgetType;
  limitAmount: number;
  categoryId: string;
  category: Category;
  /** Ejecutado real: ingresos recibidos (type=income) o gastado (type=expense). */
  actual: number;
  /** Alias de compatibilidad con `actual` (nombre usado previamente cuando solo existían gastos). */
  spent: number;
  remaining: number;
  percentageUsed: number;
  /** Para gastos: se pasó del tope (malo). Para ingresos: se alcanzó/superó la meta (bueno). */
  isOverBudget: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BudgetInput = {
  categoryId: string;
  month: string;
  type?: BudgetType;
  limitAmount: number;
};

export interface BudgetTypeSummary {
  totalBudgeted: number;
  totalActual: number;
  totalRemaining: number;
  budgets: Budget[];
}

export interface BudgetSummary {
  month: string;
  expense: BudgetTypeSummary;
  income: BudgetTypeSummary;
  // Compatibilidad con la respuesta anterior (solo gastos).
  totalBudgeted: number;
  totalActual: number;
  totalSpent: number;
  totalRemaining: number;
  budgets: Budget[];
}
