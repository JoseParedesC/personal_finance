import { Modal } from "./Modal";
import { Button } from "./Button";

interface SelectDataTypeProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SelectDataType({
  isOpen,
  title,
  message,
  confirmLabel = "Eliminar",
  onConfirm,
  onCancel,
}: SelectDataTypeProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-sm text-slate leading-relaxed">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="success" onClick={onCancel}>
          Excel (CSV)
        </Button>
        <Button variant="option" onClick={onCancel}>
          JSON
        </Button>
        <hr></hr>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
