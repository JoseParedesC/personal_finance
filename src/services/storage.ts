import type { Transaction } from "../types/transaction";

/**
 * Capa de persistencia. Es la ÚNICA parte de la aplicación que sabe que
 * los datos viven en `localStorage`. El resto del sistema (hooks,
 * componentes) solo conoce esta interfaz, así que cambiar el motor de
 * almacenamiento en el futuro (IndexedDB, un backend, etc.) implicaría
 * reescribir únicamente este archivo.
 */

const STORAGE_KEY = "finanzas:transactions";

function readRaw(): Transaction[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Datos corruptos o localStorage no disponible: no tumbar la app.
    return [];
  }
}

function writeRaw(transactions: Transaction[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export const storage = {
  getAll(): Transaction[] {
    return readRaw();
  },

  saveAll(transactions: Transaction[]): void {
    writeRaw(transactions);
  },

  add(transaction: Transaction): Transaction[] {
    const all = readRaw();
    const next = [...all, transaction];
    writeRaw(next);
    return next;
  },

  update(id: string, changes: Partial<Omit<Transaction, "id" | "createdAt">>): Transaction[] {
    const all = readRaw();
    const next = all.map((t) => (t.id === id ? { ...t, ...changes } : t));
    writeRaw(next);
    return next;
  },

  remove(id: string): Transaction[] {
    const all = readRaw();
    const next = all.filter((t) => t.id !== id);
    writeRaw(next);
    return next;
  },

  clear(): void {
    window.localStorage.removeItem(STORAGE_KEY);
  },
};

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
