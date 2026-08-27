import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "../../shared/components/Modal";
import { Button } from "../../shared/components/Button";
import { useDebts } from "./hooks/useDebts";
import { DebtForm } from "./components/DebtForm";
import { DebtCard } from "./components/DebtCard";
import type { DebtInput } from "./types/debt";

export function Debts() {
  const {
    debts,
    isLoading,
    error,
    clearError,
    createDebt,
    updateDebt,
    deleteDebt,
    payInstallment,
    unpayInstallment,
  } = useDebts();
  const [isFormOpen, setIsFormOpen] = useState(false);

  async function handleCreate(input: DebtInput) {
    await createDebt(input);
    setIsFormOpen(false);
  }

  async function handleDelete(debtId: string, debtName: string) {
    if (!confirm(`¿Eliminar la deuda "${debtName}"?`)) return;
    try {
      await deleteDebt(debtId);
    } catch (deleteError) {
      alert(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la deuda.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Deudas por cuotas</h2>
          <p className="text-sm text-slate">Cada cuota pagada genera automáticamente un movimiento.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={15} />
          Nueva deuda
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg bg-clay-light px-4 py-3 text-sm text-clay">
          <span>{error}</span>
          <button onClick={clearError} className="text-xs underline">
            Cerrar
          </button>
        </div>
      )}

      {isLoading && <p className="py-10 text-center text-sm text-slate">Cargando...</p>}

      {!isLoading && debts.length === 0 && (
        <div className="rounded-xl2 border border-dashed border-line bg-mist/40 px-6 py-16 text-center">
          <p className="font-display text-lg font-medium text-ink">Todavía no hay deudas registradas</p>
          <p className="mt-1 text-sm text-slate">Crea la primera con el botón &quot;Nueva deuda&quot;.</p>
        </div>
      )}

      {!isLoading && debts.length > 0 && (
        <div className="flex flex-col gap-4">
          {debts.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              onPayInstallment={(installmentId) => payInstallment(debt.id, installmentId).then(() => undefined)}
              onUnpayInstallment={(installmentId) => unpayInstallment(debt.id, installmentId).then(() => undefined)}
              onToggleActive={() => void updateDebt(debt.id, { active: !debt.active })}
              onDelete={() => void handleDelete(debt.id, debt.name)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Nueva deuda">
        <DebtForm onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
