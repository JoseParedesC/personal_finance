import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import * as api from "../services/pockets.service";
import type { Pocket, PocketInput, PocketUpdateInput } from "../types/pocket";

export function usePockets() {
  const { user } = useAuth();
  const [pockets, setPockets] = useState<Pocket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setPockets([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      setPockets(await api.getPockets());
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

  return {
    pockets,
    isLoading,
    error,
    clearError: () => setError(null),
    createPocket,
    updatePocket,
    deletePocket,
    reload,
  };
}
