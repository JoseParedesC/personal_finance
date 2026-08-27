import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import * as api from "../services/creditCards.service";
import type { CreditCard, CreditCardInput, CreditCardPaymentInput } from "../types/creditCard";

export function useCreditCards() {
  const { user } = useAuth();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setCards([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setCards(await api.getCreditCards());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar tarjetas");
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createCard = useCallback(async (input: CreditCardInput) => {
    const card = await api.createCreditCard(input);
    setCards((prev) => [...prev, card]);
    return card;
  }, []);

  const updateCard = useCallback(
    async (id: string, changes: Partial<CreditCardInput> & { active?: boolean }) => {
      const updated = await api.updateCreditCard(id, changes);
      setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    },
    []
  );

  const deleteCard = useCallback(async (id: string) => {
    await api.deleteCreditCard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addPayment = useCallback(async (cardId: string, input: CreditCardPaymentInput) => {
    const updated = await api.addCreditCardPayment(cardId, input);
    setCards((prev) => prev.map((c) => (c.id === cardId ? updated : c)));
    return updated;
  }, []);

  return {
    cards,
    isLoading,
    error,
    clearError: () => setError(null),
    createCard,
    updateCard,
    deleteCard,
    addPayment,
    reload,
  };
}
