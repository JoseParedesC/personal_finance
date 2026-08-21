import { Search, X } from "lucide-react";
import type { TransactionFilters } from "../../types/transaction";

interface FiltersProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  onReset: () => void;
}

const TYPE_OPTIONS: { value: TransactionFilters["type"]; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "income", label: "Ingresos" },
  { value: "expense", label: "Gastos" },
];

export function Filters({ filters, onChange, onReset }: FiltersProps) {
  const hasActiveFilters =
    filters.type !== "all" || filters.from || filters.to || filters.search;

  return (
    <div className="flex flex-col gap-3 rounded-xl2 border border-line bg-surface p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full bg-mist p-1">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, type: opt.value })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filters.type === opt.value
                  ? "bg-surface text-ink shadow-soft"
                  : "text-slate hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.from ?? ""}
            onChange={(e) => onChange({ ...filters, from: e.target.value || null })}
            className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink outline-none focus:border-ink"
            aria-label="Desde"
          />
          <span className="text-xs text-slate">→</span>
          <input
            type="date"
            value={filters.to ?? ""}
            onChange={(e) => onChange({ ...filters, to: e.target.value || null })}
            className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink outline-none focus:border-ink"
            aria-label="Hasta"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Buscar descripción..."
            className="w-full rounded-full border border-line bg-surface py-1.5 pl-8 pr-3 text-xs text-ink outline-none focus:border-ink sm:w-48"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-slate hover:bg-mist"
          >
            <X size={13} />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
