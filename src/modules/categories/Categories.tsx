import { useMemo } from "react";
import { MasterCrud, createRestAdapter } from "@joseparedesc/master-crud";
import type { Category } from "./types/category";
import { categoryConfig } from "./config/category.config";
import { API_BASE_URL, authHeaders } from "../../shared/services/api";
import { useAuth } from "../auth/context/AuthContext";

export function Categories() {
  const { user } = useAuth();

  // El adaptador es lo único que sabe que "categories" vive detrás de una
  // API REST en `API_BASE_URL`. category.config.ts no cambió en nada: es
  // el mismo objeto que antes usaba Firestore.
  const adapter = useMemo(
    () =>
      createRestAdapter<Category>(categoryConfig, {
        baseUrl: API_BASE_URL,
        getHeaders: authHeaders,
      }),
    []
  );

  if (!user) return null;

  return <MasterCrud adapter={adapter} config={categoryConfig} currentUser={user} />;
}
