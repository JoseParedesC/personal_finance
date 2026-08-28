export type InvestmentType = 'CDT' | 'FUND' | 'STOCK' | 'ETF' | 'CRYPTO' | 'BOND' | 'SAVINGS' | 'OTHER';
export type OperationType = 'CONTRIBUTION' | 'WITHDRAWAL' | 'BUY' | 'SELL' | 'INTEREST' | 'DIVIDEND' | 'FEE' | 'ADJUSTMENT';

export interface Investment {
  id: string; code: string; name: string; type: InvestmentType; institution?: string | null;
  currency: string; description?: string | null; active: boolean; createdAt: string; createdBy: string; updatedAt: string; updatedBy: string;
  contributions?: number; withdrawals?: number; income?: number; fees?: number; quantity?: number | null; costBasis?: number; currentValue?: number;
  realizedGain?: number; unrealizedGain?: number; totalGain?: number; netCapital?: number; returnPct?: number;
}
export interface InvestmentOperation { id: string; investmentId: string; type: OperationType; date: string; quantity?: number | null; unitPrice?: number | null; amount: number; fees: number; description?: string | null; createdAt: string; }
export interface InvestmentValuation { id: string; investmentId: string; date: string; unitPrice?: number | null; totalValue: number; source?: string | null; notes?: string | null; createdAt: string; }
export interface InvestmentTransfer { id: string; investmentId: string; direction: 'TO_INVESTMENT' | 'FROM_INVESTMENT'; amount: number; date: string; pocketId?: string | null; pocket?: { id: string; name: string } | null; description?: string | null; createdAt: string; }
export interface InvestmentSummary extends Investment { latestValuation?: InvestmentValuation | null; }
