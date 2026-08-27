import { useEffect, useState } from "react";
import { Modal } from "../../../shared/components/Modal";
import { Button } from "../../../shared/components/Button";
import { formatCurrency } from "../../../shared/utils/currency";
import { formatDateLong } from "../../../shared/utils/dates";
import { getCreditCardPayments } from "../services/creditCards.service";
import { CreditCardPaymentForm } from "./CreditCardPaymentForm";
import type { CreditCard, CreditCardPayment, CreditCardPaymentInput } from "../types/creditCard";

interface CreditCardPaymentsModalProps {
  card: CreditCard | null;
  onClose: () => void;
  onAddPayment: (cardId: string, input: CreditCardPaymentInput) => Promise<void>;
}

export function CreditCardPaymentsModal({ card, onClose, onAddPayment }: CreditCardPaymentsModalProps) {
  const [payments, setPayments] = useState<CreditCardPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!card) return;
    setIsLoading(true);
    getCreditCardPayments(card.id)
      .then(setPayments)
      .finally(() => setIsLoading(false));
  }, [card]);

  if (!card) return null;

  async function handleSubmit(input: CreditCardPaymentInput) {
    await onAddPayment(card!.id, input);
    setPayments(await getCreditCardPayments(card!.id));
    setIsFormOpen(false);
  }

  return (
    <Modal isOpen={card !== null} onClose={onClose} title={`Abonos - ${card.name}`}>
      {isFormOpen ? (
        <CreditCardPaymentForm onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-mist/60 p-3 text-sm">
            <p className="text-slate">
              Disponible ahora: <span className="font-medium text-ink">{formatCurrency(card.availableCredit)}</span>
            </p>
          </div>

          {isLoading && <p className="text-sm text-slate">Cargando abonos...</p>}

          {!isLoading && payments.length === 0 && (
            <p className="py-6 text-center text-sm text-slate">Todavía no hay abonos registrados.</p>
          )}

          {!isLoading && payments.length > 0 && (
            <ul className="flex flex-col divide-y divide-line">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="text-ink">{formatDateLong(p.date)}</p>
                    {p.note && <p className="text-xs text-slate">{p.note}</p>}
                  </div>
                  <span className="font-medium text-moss">{formatCurrency(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}

          <Button fullWidth onClick={() => setIsFormOpen(true)}>
            Registrar nuevo abono
          </Button>
        </div>
      )}
    </Modal>
  );
}
