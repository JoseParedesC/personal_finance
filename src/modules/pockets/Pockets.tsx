import { useEffect, useState } from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import { Modal } from "../../shared/components/Modal";
import { Button } from "../../shared/components/Button";
import { formatCurrency } from "../../shared/utils/currency";
import { usePockets } from "./hooks/usePockets";
import { getTransfers } from "./services/pockets.service";
import { PocketForm } from "./components/PocketForm";
import { PocketTile } from "./components/PocketTile";
import { TransferForm } from "./components/TransferForm";
import { TransferHistory } from "./components/TransferHistory";
import type { Pocket, PocketInput, PocketTransfer, TransferInput } from "./types/pocket";

export function Pockets() {
  const { pockets, general, isLoading, error, clearError, createPocket, updatePocket, deletePocket, transfer } =
    usePockets();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPocket, setEditingPocket] = useState<Pocket | null>(null);
  const [transferTarget, setTransferTarget] = useState<{ toPocketId?: string } | null>(null);
  const [transfers, setTransfers] = useState<PocketTransfer[]>([]);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(true);

  async function loadTransfers() {
    setIsLoadingTransfers(true);
    try {
      setTransfers(await getTransfers());
    } finally {
      setIsLoadingTransfers(false);
    }
  }

  useEffect(() => {
    void loadTransfers();
  }, []);

  function openCreate() {
    setEditingPocket(null);
    setIsFormOpen(true);
  }

  function openEdit(pocket: Pocket) {
    setEditingPocket(pocket);
    setIsFormOpen(true);
  }

  async function handleSubmit(input: PocketInput) {
    if (editingPocket) {
      await updatePocket(editingPocket.id, input);
    } else {
      await createPocket(input);
    }
    setIsFormOpen(false);
    setEditingPocket(null);
  }

  async function handleDelete(pocket: Pocket) {
    if (!confirm(`¿Eliminar el bolsillo "${pocket.name}"?`)) return;
    try {
      await deletePocket(pocket.id);
    } catch (deleteError) {
      alert(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el bolsillo.");
    }
  }

  async function handleTransfer(input: TransferInput) {
    await transfer(input);
    setTransferTarget(null);
    await loadTransfers();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Bolsillos</h2>
          <p className="text-sm text-slate">Cuentas independientes para organizar tus movimientos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setTransferTarget({})}>
            <ArrowLeftRight size={15} />
            Transferir
          </Button>
          <Button onClick={openCreate}>
            <Plus size={15} />
            Nuevo bolsillo
          </Button>
        </div>
      </div>

      {general && (
        <div className="rounded-xl2 border border-line bg-surface p-5 shadow-soft">
          <p className="text-xs text-slate">Cuenta principal (fondos sin asignar a un bolsillo)</p>
          <p className={`mt-1 font-display text-2xl font-semibold ${general.balance < 0 ? "text-clay" : "text-ink"}`}>
            {formatCurrency(general.balance)}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-lg bg-clay-light px-4 py-3 text-sm text-clay">
          <span>{error}</span>
          <button onClick={clearError} className="text-xs underline">
            Cerrar
          </button>
        </div>
      )}

      {isLoading && <p className="py-10 text-center text-sm text-slate">Cargando...</p>}

      {!isLoading && pockets.length === 0 && (
        <div className="rounded-xl2 border border-dashed border-line bg-mist/40 px-6 py-16 text-center">
          <p className="font-display text-lg font-medium text-ink">Todavía no hay bolsillos</p>
          <p className="mt-1 text-sm text-slate">Crea el primero con el botón &quot;Nuevo bolsillo&quot;.</p>
        </div>
      )}

      {!isLoading && pockets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pockets.map((pocket) => (
            <PocketTile
              key={pocket.id}
              pocket={pocket}
              onEdit={() => openEdit(pocket)}
              onToggleActive={() => void updatePocket(pocket.id, { active: !pocket.active })}
              onDelete={() => void handleDelete(pocket)}
              onFund={() => setTransferTarget({ toPocketId: pocket.id })}
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="rounded-xl2 border border-line bg-surface p-5 shadow-soft">
          <h3 className="mb-1 font-display text-base font-semibold text-ink">Historial de transferencias</h3>
          <TransferHistory transfers={transfers} isLoading={isLoadingTransfers} />
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingPocket ? "Editar bolsillo" : "Nuevo bolsillo"}
      >
        <PocketForm initial={editingPocket} onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={transferTarget !== null} onClose={() => setTransferTarget(null)} title="Transferencia">
        <TransferForm
          pockets={pockets}
          general={general}
          defaultToPocketId={transferTarget?.toPocketId}
          onSubmit={handleTransfer}
          onCancel={() => setTransferTarget(null)}
        />
      </Modal>
    </div>
  );
}
