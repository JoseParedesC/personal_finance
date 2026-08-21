import { Filters } from "../components/Filters/Filters";
import { TransactionList } from "../components/TransactionList/TransactionList";
import { ExportImport } from "../components/common/ExportImport";
import { useTransactionManager } from "../components/TransactionManager/TransactionManager";

export function Transactions() {
  const {
    transactions,
    filteredTransactions,
    filters,
    setFilters,
    resetFilters,
    importTransactions,
  } = useTransactionManager();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Movimientos</h1>
        <ExportImport transactions={transactions} onImport={importTransactions} />
      </div>

      <Filters filters={filters} onChange={setFilters} onReset={resetFilters} />

      <TransactionList
        transactions={filteredTransactions}
        hasAnyTransactions={transactions.length > 0}
      />
    </div>
  );
}
