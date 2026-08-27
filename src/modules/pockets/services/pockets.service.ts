import { apiFetch } from "../../../shared/services/api";
import type { Pocket, PocketInput, PocketUpdateInput } from "../types/pocket";

export function getPockets(): Promise<Pocket[]> {
  return apiFetch<Pocket[]>("/pockets");
}

export function createPocket(input: PocketInput): Promise<Pocket> {
  return apiFetch<Pocket>("/pockets", { method: "POST", body: JSON.stringify(input) });
}

export function updatePocket(id: string, changes: PocketUpdateInput): Promise<Pocket> {
  return apiFetch<Pocket>(`/pockets/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
}

export function deletePocket(id: string): Promise<void> {
  return apiFetch<void>(`/pockets/${id}`, { method: "DELETE" });
}
