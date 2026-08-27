export type InstallmentStatus = "pending" | "paid";

export interface DebtInstallment {
  id: string;
  number: number;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  paidAt: string | null;
  transactionId: string | null;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  installmentsCount: number;
  installmentAmount: number;
  startDate: string;
  active: boolean;
  notes?: string | null;
  categoryId: string | null;
  installments: DebtInstallment[];
  paidInstallmentsCount: number;
  pendingInstallmentsCount: number;
  paidAmount: number;
  pendingAmount: number;
  createdAt: string;
  updatedAt: string;
}

export type DebtInput = {
  name: string;
  totalAmount: number;
  installmentsCount: number;
  startDate: string;
  categoryId?: string | null;
  notes?: string;
};

export type DebtUpdateInput = {
  name?: string;
  notes?: string;
  active?: boolean;
  categoryId?: string | null;
};
