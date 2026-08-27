import type { Category } from "../../categories/types/category";

export interface Budget {
  id: string;
  month: string; // YYYY-MM
  limitAmount: number;
  categoryId: string;
  category: Category;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BudgetInput = {
  categoryId: string;
  month: string;
  limitAmount: number;
};

export interface BudgetSummary {
  month: string;
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  budgets: Budget[];
}
