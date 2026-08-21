import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import {
  firebaseAuth,
  googleProvider,
  isFirebaseConfigured,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "../services/firebase";
import type { AuthUser } from "../services/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(firebaseUser: User | null): AuthUser | null {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName ?? "Usuario",
    email: firebaseUser.email ?? "usuario@gmail.com",
    picture: firebaseUser.photoURL ?? undefined,
    provider: "google",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUser(null);
      setLoading(false);
      setError("Falta la configuración de Firebase. Revisa las variables VITE_FIREBASE_*");
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(toAuthUser(firebaseUser));
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured) {
      throw new Error("Firebase no está configurado");
    }

    setError(null);

    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      setUser(toAuthUser(result.user));
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "No se pudo iniciar sesión con Google";
      setError(message);
      throw caughtError;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await signOut(firebaseAuth);
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
