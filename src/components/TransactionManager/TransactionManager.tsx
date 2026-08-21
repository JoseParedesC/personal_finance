import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Transaction,
  TransactionFilters,
  TransactionInput,
} from "../../types/transaction";
import { EMPTY_FILTERS } from "../../types/transaction";
import { useTransactions } from "../../hooks/useTransactions";
import {
  calculateBalance,
  calculateDailySummary,
  calculateExpenses,
  calculateIncome,
} from "../../utils/calculations";
import { ConfirmDialog } from "../common/ConfirmDialog";

/**
 * TransactionManager
 * ───────────────────
 * Este componente es el "caparazón" (shell) de la aplicación: es el único
 * lugar del árbol de UI donde las operaciones CRUD sobre movimientos
 * ocurren de verdad. Internamente decide CÓMO se agregan, editan o
 * eliminan movimientos (incluyendo la confirmación antes de borrar), pero
 * hacia afuera solo expone un contrato estable a través de contexto
 * (`useTransactionManager`).
 *
 * Ningún componente hijo importa `useTransactions` ni `services/storage`
 * directamente: todos consumen este shell. Esto permite, por ejemplo,
 * cambiar la fuente de datos (localStorage -> IndexedDB -> API) o añadir
 * reglas de negocio (validaciones, confirmaciones, límites) sin tocar
 * ninguna pantalla ni componente de presentación.
 */

interface TransactionManagerContextValue {
  // datos
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  isLoading: boolean;

  // derivados
  balance: number;
  income: number;
  expenses: number;
  dailySummary: ReturnType<typeof calculateDailySummary>;

  // filtros
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  resetFilters: () => void;

  // CRUD controlado internamente
  add: (input: TransactionInput) => void;
  requestEdit: (id: string) => void;
  cancelEdit: () => void;
  confirmEdit: (id: string, changes: TransactionInput) => void;
  editingTransaction: Transaction | null;
  requestDelete: (id: string) => void;
  clearAll: () => void;
  importTransactions: (data: Transaction[]) => void;
}

const TransactionManagerContext =
  createContext<TransactionManagerContextValue | null>(null);

function applyFilters(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  return transactions.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.from && t.date < filters.from) return false;
    if (filters.to && t.date > filters.to) return false;
    if (
      filters.search.trim() &&
      !t.description.toLowerCase().includes(filters.search.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

export function TransactionManager({ children }: { children: ReactNode }) {
  const {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAll: clearAllInternal,
    importTransactions: importInternal,
  } = useTransactions();

  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredTransactions = useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters]
  );

  const sortedByDateDesc = useMemo(
    () =>
      [...filteredTransactions].sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.createdAt.localeCompare(a.createdAt);
      }),
    [filteredTransactions]
  );

  const editingTransaction = useMemo(
    () => transactions.find((t) => t.id === editingId) ?? null,
    [transactions, editingId]
  );

  const value: TransactionManagerContextValue = {
    transactions,
    filteredTransactions: sortedByDateDesc,
    isLoading,

    balance: calculateBalance(transactions),
    income: calculateIncome(transactions),
    expenses: calculateExpenses(transactions),
    dailySummary: calculateDailySummary(transactions),

    filters,
    setFilters,
    resetFilters: () => setFilters(EMPTY_FILTERS),

    add: (input) => addTransaction(input),

    requestEdit: (id) => setEditingId(id),
    cancelEdit: () => setEditingId(null),
    confirmEdit: (id, changes) => {
      updateTransaction(id, changes);
      setEditingId(null);
    },
    editingTransaction,

    requestDelete: (id) => setPendingDeleteId(id),
    clearAll: () => clearAllInternal(),
    importTransactions: (data) => importInternal(data),
  };

  return (
    <TransactionManagerContext.Provider value={value}>
      {children}

      {/* El shell posee la confirmación de borrado: ningún componente
          hijo necesita implementar su propio diálogo de confirmación. */}
      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        title="¿Deseas eliminar este movimiento?"
        message="Esta acción no se puede deshacer."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteTransaction(pendingDeleteId);
          setPendingDeleteId(null);
        }}
      />
    </TransactionManagerContext.Provider>
  );
}

export function useTransactionManager(): TransactionManagerContextValue {
  const ctx = useContext(TransactionManagerContext);
  if (!ctx) {
    throw new Error(
      "useTransactionManager debe usarse dentro de <TransactionManager>"
    );
  }
  return ctx;
}
