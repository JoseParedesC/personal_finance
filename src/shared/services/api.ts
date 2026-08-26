// Reemplaza a `firebaseDb`/`firebaseAuth`: aquí vive la URL base del
// backend propio y el manejo del JWT que emite tras el login con Google.

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const TOKEN_STORAGE_KEY = "accessToken";

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export async function authHeaders(): Promise<Record<string, string>> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Helper genérico de fetch autenticado, usado por movimientos y el selector de categorías. */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = {
    Accept: "application/json",
    ...(init.body ? { "Content-Type": "application/json" } : {}),
    ...(await authHeaders()),
    ...(init.headers ?? {}),
  };

  console.log("API_BASE_URL:", API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Error de red (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
