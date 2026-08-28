import { ArrowRight } from "lucide-react";
import { formatCurrency } from "../../../shared/utils/currency";
import { formatDateLong } from "../../../shared/utils/dates";
import type { PocketTransfer } from "../types/pocket";

interface TransferHistoryProps {
  transfers: PocketTransfer[];
  isLoading: boolean;
}

export function TransferHistory({ transfers, isLoading }: TransferHistoryProps) {
  if (isLoading) return <p className="py-6 text-center text-sm text-slate">Cargando transferencias...</p>;

  if (transfers.length === 0) {
    return <p className="py-6 text-center text-sm text-slate">Todavía no hay transferencias registradas.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-line">
      {transfers.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-ink">{t.fromPocket?.name ?? "Cuenta principal"}</span>
            <ArrowRight size={14} className="shrink-0 text-slate" />
            <span className="truncate text-ink">{t.toPocket?.name ?? "Cuenta principal"}</span>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-medium text-ink">{formatCurrency(t.amount)}</p>
            <p className="text-xs text-slate">{formatDateLong(t.date)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
