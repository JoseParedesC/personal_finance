import type { Transaction } from "../types/transaction";

/**
 * Datos de prueba SOLO para desarrollo local. Nunca se cargan
 * automáticamente en producción (ver src/main.tsx).
 */
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "mock-1",
    amount: 3700000,
    category: null,
    type: "income",
    description: "Salario",
    date: "2026-08-20",
    createdAt: "2026-08-20T09:00:00.000Z",
  },
  {
    id: "mock-2",
    amount: 200000,
    category: null,
    type: "expense",
    description: "Almuerzos",
    date: "2026-08-21",
    createdAt: "2026-08-21T13:00:00.000Z",
  },
  {
    id: "mock-3",
    amount: 52000,
    category: null,
    type: "expense",
    description: "Gasolina",
    date: "2026-08-21",
    createdAt: "2026-08-21T08:30:00.000Z",
  },
  {
    id: "mock-4",
    amount: 50000,
    category: null,
    type: "expense",
    description: "Netflix",
    date: "2026-08-21",
    createdAt: "2026-08-21T07:00:00.000Z",
  },
  {
    id: "mock-5",
    amount: 25000,
    category: null,
    type: "expense",
    description: "Disney+",
    date: "2026-08-19",
    createdAt: "2026-08-19T07:00:00.000Z",
  },
  {
    id: "mock-6",
    amount: 150000,
    category: null,
    type: "expense",
    description: "Fútbol",
    date: "2026-08-18",
    createdAt: "2026-08-18T18:00:00.000Z",
  },
];
