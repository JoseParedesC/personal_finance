const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formatea un número como pesos colombianos: $3.700.000 */
export function formatCurrency(amount: number): string {
  return COP_FORMATTER.format(Math.round(amount));
}

/** Igual que formatCurrency pero antepone el signo +/- según sea el caso */
export function formatSignedCurrency(amount: number): string {
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${sign}${formatCurrency(Math.abs(amount))}`;
}
