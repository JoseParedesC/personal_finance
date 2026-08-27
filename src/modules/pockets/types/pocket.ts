export interface Pocket {
  id: string;
  name: string;
  description?: string | null;
  affectsBudget: boolean;
  active: boolean;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  movementsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type PocketInput = {
  name: string;
  description?: string;
  affectsBudget?: boolean;
};

export type PocketUpdateInput = Partial<PocketInput> & { active?: boolean };
