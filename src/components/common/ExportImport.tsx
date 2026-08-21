import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import type { Transaction } from "../../types/transaction";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";

interface ExportImportProps {
  transactions: Transaction[];
  onImport: (data: Transaction[]) => void;
}

export function ExportImport({ transactions, onImport }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<Transaction[] | null>(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finanzas-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) {
          setPendingImport(parsed as Transaction[]);
        }
      } catch {
        // archivo inválido: se ignora silenciosamente
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" onClick={handleExport}>
        <Download size={15} />
        Exportar datos
      </Button>
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
        <Upload size={15} />
        Importar datos
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      <ConfirmDialog
        isOpen={pendingImport !== null}
        title="¿Sobrescribir datos actuales?"
        message="Importar este archivo reemplazará todos tus movimientos actuales. Esta acción no se puede deshacer."
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
