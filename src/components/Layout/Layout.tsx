import { useState, type ReactNode } from "react";
import { LayoutDashboard, ArrowLeftRight, PieChart, Plus, Wallet } from "lucide-react";
import { Modal } from "../common/Modal";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { useTransactionManager } from "../TransactionManager/TransactionManager";

export type Page = "dashboard" | "transactions" | "summary";

interface LayoutProps {
  page: Page;
  onNavigate: (page: Page) => void;
  children: ReactNode;
}

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Movimientos", icon: ArrowLeftRight },
  { id: "summary", label: "Resumen", icon: PieChart },
];

export function Layout({ page, onNavigate, children }: LayoutProps) {
  const { add } = useTransactionManager();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
              <Wallet size={16} />
            </div>
            <p className="font-display text-lg font-semibold text-ink">
              Finanzas personales
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90 sm:inline-flex"
          >
            <Plus size={15} />
            Nuevo movimiento
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
        <nav className="hidden w-48 shrink-0 lg:block">
          <ul className="sticky top-24 flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => onNavigate(id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    page === id
                      ? "bg-ink text-paper"
                      : "text-slate hover:bg-mist hover:text-ink"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Navegación inferior para móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-line bg-surface py-2 lg:hidden">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-1 px-4 py-1 text-xs font-medium ${
              page === id ? "text-ink" : "text-slate"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
        <button
          onClick={() => setIsAddOpen(true)}
          aria-label="Nuevo movimiento"
          className="flex h-11 w-11 -translate-y-4 items-center justify-center rounded-full bg-ink text-paper shadow-card"
        >
          <Plus size={20} />
        </button>
      </nav>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Nuevo movimiento">
        <TransactionForm
          onCancel={() => setIsAddOpen(false)}
          onSubmit={(input) => {
            add(input);
            setIsAddOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
