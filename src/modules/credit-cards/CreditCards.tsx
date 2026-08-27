import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "../../shared/components/Modal";
import { Button } from "../../shared/components/Button";
import { useCreditCards } from "./hooks/useCreditCards";
import { CreditCardForm } from "./components/CreditCardForm";
import { CreditCardTile } from "./components/CreditCardTile";
import { CreditCardPaymentsModal } from "./components/CreditCardPaymentsModal";
import type { CreditCard, CreditCardInput } from "./types/creditCard";

export function CreditCards() {
  const { cards, isLoading, error, clearError, createCard, updateCard, deleteCard, addPayment } = useCreditCards();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [paymentsCardId, setPaymentsCardId] = useState<string | null>(null);
  const paymentsCard = cards.find((c) => c.id === paymentsCardId) ?? null;

  function openCreate() {
    setEditingCard(null);
    setIsFormOpen(true);
  }

  function openEdit(card: CreditCard) {
    setEditingCard(card);
    setIsFormOpen(true);
  }

  async function handleSubmit(input: CreditCardInput) {
    if (editingCard) {
      await updateCard(editingCard.id, input);
    } else {
      await createCard(input);
    }
    setIsFormOpen(false);
    setEditingCard(null);
  }

  async function handleDelete(card: CreditCard) {
    if (!confirm(`¿Eliminar la tarjeta "${card.name}"?`)) return;
    try {
      await deleteCard(card.id);
    } catch (deleteError) {
      alert(deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la tarjeta.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Tarjetas de crédito</h2>
          <p className="text-sm text-slate">Cupo, fechas de corte y abonos de cada tarjeta.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={15} />
          Nueva tarjeta
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

      {!isLoading && cards.length === 0 && (
        <div className="rounded-xl2 border border-dashed border-line bg-mist/40 px-6 py-16 text-center">
          <p className="font-display text-lg font-medium text-ink">Todavía no hay tarjetas</p>
          <p className="mt-1 text-sm text-slate">Crea la primera con el botón &quot;Nueva tarjeta&quot;.</p>
        </div>
      )}

      {!isLoading && cards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CreditCardTile
              key={card.id}
              card={card}
              onEdit={() => openEdit(card)}
              onToggleActive={() => void updateCard(card.id, { active: !card.active })}
              onDelete={() => void handleDelete(card)}
              onOpenPayments={() => setPaymentsCardId(card.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCard ? "Editar tarjeta" : "Nueva tarjeta"}
      >
        <CreditCardForm initial={editingCard} onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <CreditCardPaymentsModal
        card={paymentsCard}
        onClose={() => setPaymentsCardId(null)}
        onAddPayment={async (cardId, input) => {
          await addPayment(cardId, input);
        }}
      />
    </div>
  );
}
