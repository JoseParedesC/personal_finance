import { useMemo } from 'react';
import { MasterCrud, createRestAdapter } from '@joseparedesc/master-crud';
import { useAuth } from '../../auth/context/AuthContext';
import { API_BASE_URL, authHeaders } from '../../../shared/services/api';
import { investmentConfig } from '../config/investment.config';
import type { Investment } from '../types/investment';

/** Maestro de inversiones. El CRUD es gestionado completamente por master-crud. */
export function InvestmentMaster() {
  const { user } = useAuth();
  const adapter = useMemo(
    () =>
      createRestAdapter<Investment>(investmentConfig, {
        baseUrl: API_BASE_URL,
        resource: 'investments',
        getHeaders: authHeaders,
      }),
    [],
  );

  if (!user) return null;
  return <MasterCrud adapter={adapter} config={investmentConfig} currentUser={user} />;
}
