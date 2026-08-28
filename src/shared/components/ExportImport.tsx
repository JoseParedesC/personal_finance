import { useRef, useState, type ChangeEvent } from "react";
import { ChevronDown, Download, Upload } from "lucide-react";
import type { Transaction } from "../types/transaction";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";

interface ExportImportProps {
  transactions: Transaction[];
  onImport: (data: Transaction[]) => void;
}

const CSV_HEADERS = [
  "id",
  "amount",
  "type",
  "description",
  "date",
  "categoryId",
  "creditCardId",
  "pocketId",
  "createdAt",
  "updatedAt",
] as const;

type CsvHeader = (typeof CSV_HEADERS)[number];

function csvEscape(value: unknown): string {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function transactionToCsvRow(transaction: Transaction): string[] {
  return [
    transaction.id,
    transaction.amount,
    transaction.type,
    transaction.description,
    transaction.date,
    transaction.category?.id ?? "",
    transaction.creditCard?.id ?? "",
    transaction.pocket?.id ?? "",
    transaction.createdAt,
    transaction.updatedAt ?? "",
  ].map(csvEscape);
}

function transactionsToCsv(transactions: Transaction[]): string {
  const rows = [CSV_HEADERS.map(csvEscape).join(",")];
  rows.push(...transactions.map((transaction) => transactionToCsvRow(transaction).join(",")));
  // BOM improves UTF-8 detection in Excel and other spreadsheet applications.
  return `\uFEFF${rows.join("\r\n")}`;
}

/** RFC 4180-compatible parser. Also accepts semicolon-delimited files. */
function parseCsv(text: string): string[][] {
  const normalized = text.replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(normalized);
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];

    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"' && field.length === 0) {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // CRLF is completed by the following LF; standalone CR is also accepted.
      if (normalized[i + 1] !== "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      }
    } else {
      field += char;
    }
  }

  if (inQuotes) throw new Error("El CSV contiene comillas sin cerrar.");

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((value) => value.trim() !== ""));
}

function detectDelimiter(text: string): "," | ";" {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  let commas = 0;
  let semicolons = 0;
  let inQuotes = false;

  for (let i = 0; i < firstLine.length; i += 1) {
    const char = firstLine[i];
    if (char === '"') {
      if (inQuotes && firstLine[i + 1] === '"') i += 1;
      else inQuotes = !inQuotes;
    } else if (!inQuotes && char === ",") commas += 1;
    else if (!inQuotes && char === ";") semicolons += 1;
  }

  return semicolons > commas ? ";" : ",";
}

function normalizeHeader(value: string): string {
  return value.trim().replace(/^\uFEFF/, "");
}

function parseCsvTransactions(text: string): Transaction[] {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error("El CSV no contiene movimientos para importar.");

  const headers = rows[0].map(normalizeHeader);
  const indexes = new Map<string, number>();
  headers.forEach((header, index) => indexes.set(header, index));

  const required: CsvHeader[] = ["amount", "type", "description", "date"];
  const missing = required.filter((header) => !indexes.has(header));
  if (missing.length) {
    throw new Error(`Faltan columnas obligatorias: ${missing.join(", ")}.`);
  }

  const valueAt = (row: string[], header: CsvHeader): string => {
    const index = indexes.get(header);
    return index === undefined ? "" : (row[index] ?? "").trim();
  };

  return rows.slice(1).map((row, rowIndex) => {
    const line = rowIndex + 2;
    const amountText = valueAt(row, "amount").replace(/\s/g, "");
    const amount = Number(amountText.replace(/,(?=\d{1,2}$)/, "."));
    const type = valueAt(row, "type");
    const description = valueAt(row, "description");
    const date = valueAt(row, "date");

    if (!Number.isFinite(amount)) throw new Error(`Fila ${line}: amount no es un número válido.`);
    if (type !== "income" && type !== "expense") {
      throw new Error(`Fila ${line}: type debe ser "income" o "expense".`);
    }
    if (!description) throw new Error(`Fila ${line}: description está vacío.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Fila ${line}: date debe tener formato YYYY-MM-DD.`);
    }

    const id = valueAt(row, "id") || crypto.randomUUID();
    const createdAt = valueAt(row, "createdAt") || new Date().toISOString();
    const updatedAt = valueAt(row, "updatedAt") || undefined;
    const categoryId = valueAt(row, "categoryId") || null;
    const creditCardId = valueAt(row, "creditCardId") || null;
    const pocketId = valueAt(row, "pocketId") || null;

    return {
      id,
      amount,
      type,
      description,
      date,
      category: categoryId ? ({ id: categoryId } as Transaction["category"]) : null,
      creditCard: creditCardId ? ({ id: creditCardId } as NonNullable<Transaction["creditCard"]>) : null,
      pocket: pocketId ? ({ id: pocketId } as NonNullable<Transaction["pocket"]>) : null,
      createdAt,
      updatedAt,
    };
  });
}

export function ExportImport({ transactions, onImport }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<Transaction[] | null>(null);
  const [importFormat, setImportFormat] = useState<"JSON" | "CSV">("JSON");
  const [error, setError] = useState<string | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function handleExportJson() {
    downloadFile(
      JSON.stringify(transactions, null, 2),
      "finanzas-backup.json",
      "application/json;charset=utf-8"
    );
  }

  function handleExportCsv() {
    downloadFile(transactionsToCsv(transactions), "finanzas-backup.csv", "text/csv;charset=utf-8");
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    const format = file.name.toLowerCase().endsWith(".csv") ? "CSV" : "JSON";
    setImportFormat(format);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = String(reader.result ?? "");
        let parsed: unknown;

        if (format === "CSV") {
          parsed = parseCsvTransactions(content);
        } else {
          parsed = JSON.parse(content);
        }

        if (!Array.isArray(parsed)) throw new Error("El archivo debe contener una lista de movimientos.");
        if (parsed.length === 0) throw new Error("El archivo no contiene movimientos para importar.");

        setPendingImport(parsed as Transaction[]);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : "No se pudo leer el archivo.";
        setError(`No se pudo importar ${format}: ${message}`);
      }
    };
    reader.onerror = () => setError(`No se pudo leer el archivo ${format}.`);
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <div className="relative">
          <Button
            variant="secondary"
            onClick={() => setShowExportOptions((current) => !current)}
            aria-expanded={showExportOptions}
            aria-haspopup="menu"
          >
            <Download size={15} />
            Exportar
            <ChevronDown size={15} className={showExportOptions ? "rotate-180 transition-transform" : "transition-transform"} />
          </Button>

          {showExportOptions && (
            <div
              className="absolute right-0 z-20 mt-2 min-w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={() => {
                  handleExportJson();
                  setShowExportOptions(false);
                }}
              >
                <Download size={14} />
                JSON
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={() => {
                  handleExportCsv();
                  setShowExportOptions(false);
                }}
              >
                <Download size={14} />
                CSV
              </button>
            </div>
          )}
        </div>

        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={15} />
          Importar
        </Button>
      </div>

      {error && (
        <p className="max-w-xl text-right text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv,application/json,text/csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <ConfirmDialog
        isOpen={pendingImport !== null}
        title={`¿Importar ${importFormat}?`}
        message={`Se importarán ${pendingImport?.length ?? 0} movimientos. Los movimientos existentes no se eliminan.`}
        confirmLabel="Importar"
        onCancel={() => setPendingImport(null)}
        onConfirm={() => {
          if (pendingImport) onImport(pendingImport);
          setPendingImport(null);
        }}
      />
    </div>
  );
}
