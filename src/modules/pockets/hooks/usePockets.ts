import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import * as api from "../services/pockets.service";
import type { GeneralAccount, Pocket, PocketInput, PocketUpdateInput, TransferInput } from "../types/pocket";

export function usePockets() {
  const { user } = useAuth();
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [general, setGeneral] = useState<GeneralAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setPockets([]);
      setGeneral(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [pocketsData, generalData] = await Promise.all([api.getPockets(), api.getGeneralAccount()]);
      setPockets(pocketsData);
      setGeneral(generalData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar bolsillos");
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const createPocket = useCallback(async (input: PocketInput) => {
    const pocket = await api.createPocket(input);
    setPockets((prev) => [...prev, pocket]);
    return pocket;
  }, []);

  const updatePocket = useCallback(async (id: string, changes: PocketUpdateInput) => {
    const updated = await api.updatePocket(id, changes);
    setPockets((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deletePocket = useCallback(async (id: string) => {
    await api.deletePocket(id);
    setPockets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  /** Crea la transferencia y refresca los saldos afectados (general + bolsillos involucrados) sin re-fetch completo. */
  const transfer = useCallback(async (input: TransferInput) => {
    const result = await api.createTransfer(input);
    setGeneral(result.general);
    setPockets((prev) =>
      prev.map((p) => {
        if (result.fromPocket && p.id === result.fromPocket.id) return result.fromPocket;
        if (result.toPocket && p.id === result.toPocket.id) return result.toPocket;
        return p;
      })
    );
    return result;
  }, []);

  return {
    pockets,
    general,
    isLoading,
    error,
    clearError: () => setError(null),
    createPocket,
    updatePocket,
    deletePocket,
    transfer,
    reload,
  };
}
