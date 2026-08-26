import { API_BASE_URL, authHeaders, setAccessToken } from "../../../shared/services/api";

export type AuthUser = {
  uid: string;
  name: string;
  email: string;
  picture?: string | null;
  provider: "google";
};

type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `Error de autenticación (${response.status})`);
  }
  return response.json() as Promise<T>;
}

/** Envía el idToken de Google al backend, que lo valida y devuelve un JWT propio. */
export async function loginWithGoogleIdToken(idToken: string): Promise<AuthUser> {

  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = await handle<AuthResponse>(response);
  console.log(data);
  setAccessToken(data.accessToken);
  return data.user;
}

/** Recupera el usuario actual a partir del JWT guardado (para restaurar sesión al recargar). */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const headers = await authHeaders();
  if (!headers.Authorization) return null;

  const response = await fetch(`${API_BASE_URL}/auth/me`, { headers });
  if (response.status === 401) {
    setAccessToken(null);
    return null;
  }
  return handle<AuthUser>(response);
}

export function logout(): void {
  setAccessToken(null);
}
