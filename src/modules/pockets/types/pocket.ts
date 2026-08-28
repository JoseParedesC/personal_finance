export interface Pocket {
  id: string;
  name: string;
  description?: string | null;
  affectsBudget: boolean;
  active: boolean;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transfersIn: number;
  transfersOut: number;
  movementsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralAccount {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  transfersOut: number;
  transfersIn: number;
}

export interface PocketTransfer {
  id: string;
  amount: number;
  date: string;
  description?: string | null;
  fromPocketId: string | null;
  fromPocket: Pocket | null;
  toPocketId: string | null;
  toPocket: Pocket | null;
  createdAt: string;
}

export type TransferInput = {
  amount: number;
  date: string;
  description?: string;
  /** null = cuenta principal */
  fromPocketId: string | null;
  /** null = cuenta principal */
  toPocketId: string | null;
};

export type PocketInput = {
  name: string;
  description?: string;
  affectsBudget?: boolean;
};

export type PocketUpdateInput = Partial<PocketInput> & { active?: boolean };
