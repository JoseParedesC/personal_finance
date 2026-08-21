import { storage } from "../services/storage";
import { MOCK_TRANSACTIONS } from "./mockData";

/**
 * Carga datos de prueba únicamente en desarrollo (`npm run dev`) y solo
 * si todavía no hay movimientos guardados. Nunca se ejecuta en build de
 * producción porque `import.meta.env.DEV` es `false` en ese caso.
 */
export function seedDevData(): void {
  if (!import.meta.env.DEV) return;
  if (storage.getAll().length > 0) return;
  storage.saveAll(MOCK_TRANSACTIONS);
}
