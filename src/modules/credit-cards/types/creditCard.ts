export interface CreditCard {
  id: string;
  name: string;
  creditLimit: number;
  closingDay: number;
  paymentDueDay: number;
  active: boolean;
  usedAmount: number;
  availableCredit: number;
  nextClosingDate: string;
  nextPaymentDueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type CreditCardInput = {
  name: string;
  creditLimit: number;
  closingDay: number;
  paymentDueDay: number;
};

export interface CreditCardPayment {
  id: string;
  creditCardId: string;
  amount: number;
  date: string;
  note?: string | null;
  createdAt: string;
}

export type CreditCardPaymentInput = {
  amount: number;
  date: string;
  note?: string;
};
