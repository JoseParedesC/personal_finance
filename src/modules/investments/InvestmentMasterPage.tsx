import { useMemo } from "react";
import { MasterCrud, createRestAdapter } from "@joseparedesc/master-crud";
import { useAuth } from "../auth/context/AuthContext";
import { API_BASE_URL, authHeaders } from "../../shared/services/api";
import { investmentConfig } from "./config/investment.config";
import type { Investment } from "./types/investment";

/** Maestro independiente de inversiones, dentro de Configuración. */
export function InvestmentMasterPage() {
  const { user } = useAuth();
  const adapter = useMemo(
    () => createRestAdapter<Investment>(investmentConfig, {
      baseUrl: API_BASE_URL,
      getHeaders: authHeaders,
    }),
    [],
  );

  if (!user) return null;
  return <MasterCrud adapter={adapter} config={investmentConfig} currentUser={user} />;
}
