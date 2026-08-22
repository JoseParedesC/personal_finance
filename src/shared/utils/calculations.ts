import type { Transaction } from "../types/transaction";
import { formatDateShort } from "./dates";

/** Convierte un movimiento a su valor con signo (+ingreso / -gasto) */
export function signedValue(t: Transaction): number {
  return t.type === "income" ? t.amount : -t.amount;
}

export function calculateIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateBalance(transactions: Transaction[]): number {
  return calculateIncome(transactions) - calculateExpenses(transactions);
}

export interface DailySummary {
  date: string;
  label: string;
  income: number;
  expenses: number;
  balance: number;
}

/** Agrupa movimientos por fecha, ordenados descendentemente */
export function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  for (const t of transactions) {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  }
  return groups;
}

export function calculateDailySummary(transactions: Transaction[]): DailySummary[] {
  const groups = groupByDate(transactions);
  return Object.entries(groups)
    .map(([date, items]) => {
      const income = calculateIncome(items);
      const expenses = calculateExpenses(items);
      return {
        date,
        label: formatDateShort(date),
        income,
        expenses,
        balance: income - expenses,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
  averageDailyExpense: number;
  highestExpenseDay: { date: string; amount: number } | null;
}

/** yearMonth en formato "YYYY-MM" */
export function calculateMonthlySummary(
  transactions: Transaction[],
  yearMonth: string
): MonthlySummary {
  const monthTx = transactions.filter((t) => t.date.startsWith(yearMonth));
  const income = calculateIncome(monthTx);
  const expenses = calculateExpenses(monthTx);
  const incomeCount = monthTx.filter((t) => t.type === "income").length;
  const expenseCount = monthTx.filter((t) => t.type === "expense").length;

  const daily = calculateDailySummary(monthTx);
  const daysWithExpense = daily.filter((d) => d.expenses > 0);
  const averageDailyExpense =
    daysWithExpense.length > 0
      ? daysWithExpense.reduce((sum, d) => sum + d.expenses, 0) / daysWithExpense.length
      : 0;

  const highestExpenseDay = daysWithExpense.reduce<{ date: string; amount: number } | null>(
    (max, d) => (!max || d.expenses > max.amount ? { date: d.date, amount: d.expenses } : max),
    null
  );

  return {
    income,
    expenses,
    balance: income - expenses,
    incomeCount,
    expenseCount,
    averageDailyExpense,
    highestExpenseDay,
  };
}

export interface FlowPoint {
  date: string;
  label: string;
  ingresos: number;
  gastos: number;
  balance: number;
}

/** Serie temporal acumulada para la gráfica de flujo financiero */
export function calculateFlowSeries(transactions: Transaction[]): FlowPoint[] {
  const daily = [...calculateDailySummary(transactions)].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  let running = 0;
  return daily.map((d) => {
    running += d.balance;
    return {
      date: d.date,
      label: d.label,
      ingresos: d.income,
      gastos: d.expenses,
      balance: running,
    };
  });
}
