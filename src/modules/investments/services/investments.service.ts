import { apiFetch } from '../../../shared/services/api';
import type { Investment, InvestmentOperation, InvestmentSummary, InvestmentTransfer, InvestmentValuation } from '../types/investment';

export const getInvestments = () => apiFetch<Investment[]>('/investments?status=active');
export const getPortfolio = () => apiFetch<Investment[]>('/investments/portfolio');
export const getInvestmentSummary = (id: string) => apiFetch<InvestmentSummary>(`/investments/${id}/summary`);
export const getOperations = (id: string) => apiFetch<InvestmentOperation[]>(`/investments/${id}/operations`);
export const createOperation = (id: string, input: Omit<InvestmentOperation, 'id'|'investmentId'|'createdAt'|'fees'> & { fees?: number }) => apiFetch<InvestmentOperation>(`/investments/${id}/operations`, { method: 'POST', body: JSON.stringify(input) });
export const getValuations = (id: string) => apiFetch<InvestmentValuation[]>(`/investments/${id}/valuations`);
export const createValuation = (id: string, input: Omit<InvestmentValuation, 'id'|'investmentId'|'createdAt'>) => apiFetch<InvestmentValuation>(`/investments/${id}/valuations`, { method: 'POST', body: JSON.stringify(input) });
export const getTransfers = (id: string) => apiFetch<InvestmentTransfer[]>(`/investments/${id}/transfers`);
