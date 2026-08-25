import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { requestGoogleIdToken } from "../../../shared/services/googleIdentity";
import { fetchCurrentUser, loginWithGoogleIdToken, logout as logoutRequest } from "../services/auth";
import type { AuthUser } from "../services/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Al montar, si ya había un JWT guardado (de una sesión anterior), lo
  // valida contra el backend y restaura la sesión sin pedir login de nuevo.
  useEffect(() => {
    let active = true;
    fetchCurrentUser()
      .then((restoredUser) => {
        if (active) setUser(restoredUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const idToken = await requestGoogleIdToken();
      const loggedInUser = await loginWithGoogleIdToken(idToken);
      setUser(loggedInUser);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "No se pudo iniciar sesión con Google";
      setError(message);
      throw caughtError;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, loginWithGoogle, logout }),
    [user, loading, error, loginWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return ctx;
}
