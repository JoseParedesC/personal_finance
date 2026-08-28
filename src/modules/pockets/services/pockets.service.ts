import { apiFetch } from "../../../shared/services/api";
import type { GeneralAccount, Pocket, PocketInput, PocketTransfer, PocketUpdateInput, TransferInput } from "../types/pocket";

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

export function getGeneralAccount(): Promise<GeneralAccount> {
  return apiFetch<GeneralAccount>("/pockets/general");
}

export function getTransfers(pocketId?: string): Promise<PocketTransfer[]> {
  const query = pocketId ? `?pocketId=${encodeURIComponent(pocketId)}` : "";
  return apiFetch<PocketTransfer[]>(`/pockets/transfers${query}`);
}

export interface TransferResult {
  general: GeneralAccount;
  fromPocket: Pocket | null;
  toPocket: Pocket | null;
}

export function createTransfer(input: TransferInput): Promise<TransferResult> {
  return apiFetch<TransferResult>("/pockets/transfers", { method: "POST", body: JSON.stringify(input) });
}
