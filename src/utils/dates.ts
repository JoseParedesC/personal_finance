const MONTHS_SHORT = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

const MONTHS_LONG = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/** YYYY-MM-DD -> {y, m, d} sin corrimientos de zona horaria */
function parseISODate(date: string): { y: number; m: number; d: number } {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m, d };
}

/** 2026-08-21 -> "21 AGO 2026" */
export function formatDateLong(date: string): string {
  const { y, m, d } = parseISODate(date);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
}

/** 2026-08-21 -> "21 AGO" (sin año, para resúmenes diarios) */
export function formatDateShort(date: string): string {
  const { m, d } = parseISODate(date);
  return `${d} ${MONTHS_SHORT[m - 1]}`;
}

export function monthLabel(month: number): string {
  return MONTHS_LONG[month - 1];
}

/** Fecha actual en formato YYYY-MM-DD, apta para <input type="date"> */
export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function currentYearMonth(): string {
  return todayISO().slice(0, 7); // YYYY-MM
}
