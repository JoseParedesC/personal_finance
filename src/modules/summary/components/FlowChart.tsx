import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { Transaction } from "../../../shared/types/transaction";
import { calculateFlowSeries } from "../../../shared/utils/calculations";
import { formatCurrency } from "../../../shared/utils/currency";
import { Card } from "../../../shared/components/Card";
import { EmptyState } from "../../../shared/components/EmptyState";

interface FlowChartProps {
  transactions: Transaction[];
}

export function FlowChart({ transactions }: FlowChartProps) {
  const data = calculateFlowSeries(transactions);

  if (data.length === 0) {
    return (
      <EmptyState
        title="Sin datos para graficar"
        description="Agrega movimientos para ver tu flujo financiero en el tiempo."
      />
    );
  }

  return (
    <Card className="p-5">
      <p className="mb-4 font-display text-lg font-semibold text-ink">
        Flujo financiero
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E5E0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#5B6570" }}
              axisLine={{ stroke: "#E2E5E0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#5B6570" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v)}
              width={90}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E5E0",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="ingresos"
              name="Ingresos"
              stroke="#1F6D5A"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="gastos"
              name="Gastos"
              stroke="#B4483A"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#10171F"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
