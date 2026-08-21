import { Wallet, TrendingUp, TrendingDown, ListChecks } from "lucide-react";
import { Card } from "../common/Card";
import { formatCurrency } from "../../utils/currency";

interface BalanceCardsProps {
  balance: number;
  income: number;
  expenses: number;
  count: number;
}

export function BalanceCards({ balance, income, expenses, count }: BalanceCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card className="p-5">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper">
          <Wallet size={16} />
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate">
          Saldo actual
        </p>
        <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink">
          {formatCurrency(balance)}
        </p>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-moss-light text-moss">
          <TrendingUp size={16} />
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate">
          Ingresos
        </p>
        <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-moss">
          {formatCurrency(income)}
        </p>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-clay-light text-clay">
          <TrendingDown size={16} />
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate">
          Gastos
        </p>
        <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-clay">
          {formatCurrency(expenses)}
        </p>
      </Card>

      <Card className="p-5">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-mist text-slate">
          <ListChecks size={16} />
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate">
          Movimientos
        </p>
        <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink">
          {count}
        </p>
      </Card>
    </div>
  );
}
