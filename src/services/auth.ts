export type AuthUser = {
  uid: string;
  name: string;
  email: string;
  picture?: string;
  provider: "google";
};

const AUTH_KEY = "finanzas:auth";

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export function readStoredUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed || typeof parsed.email !== "string" || typeof parsed.name !== "string" || typeof parsed.uid !== "string") {
      return null;
    }

    return {
      uid: parsed.uid,
      name: parsed.name,
      email: parsed.email,
      picture: parsed.picture,
      provider: "google",
    };
  } catch {
    return null;
  }
}

export function saveStoredUser(user: AuthUser): void {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  window.localStorage.removeItem(AUTH_KEY);
}
