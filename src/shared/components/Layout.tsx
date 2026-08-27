import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Plus,
  Wallet,
  LogOut,
  Settings,
  Landmark,
  CreditCard as CreditCardIcon,
  Target,
} from "lucide-react";
import { Modal } from "./Modal";
import { TransactionForm } from "../../modules/transactions/components/TransactionForm";
import { useTransactionManager } from "../../modules/transactions/components/TransactionManager";
import type { AuthUser } from "../../modules/auth/services/auth";

export type Page = "dashboard" | "transactions" | "summary" | "categories" | "debts" | "credit-cards" | "budgets" | "pockets";

interface LayoutProps {
  page: Page;
  onNavigate: (page: Page) => void;
  user: AuthUser;
  onLogout: () => void;
  children: ReactNode;
}

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Movimientos", icon: ArrowLeftRight },
  { id: "budgets", label: "Presupuesto", icon: Target },
  { id: "pockets", label: "Bolsillos", icon: Wallet },
  { id: "debts", label: "Deudas", icon: Landmark },
  { id: "credit-cards", label: "Tarjetas", icon: CreditCardIcon },
  { id: "summary", label: "Resumen", icon: PieChart },
];

const CONFIG_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "categories", label: "Categoría", icon: Settings },
];

export function Layout({ page, onNavigate, user, onLogout, children }: LayoutProps) {
  const { add } = useTransactionManager();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
              <Wallet size={16} />
            </div>
            <p className="font-display text-lg font-semibold text-ink">
              Finanzas personales
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-line bg-mist px-3 py-1.5 sm:flex">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-paper">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left leading-tight">
                <p className="text-xs font-medium text-ink">{user.name}</p>
                <p className="text-[10px] text-slate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90 sm:inline-flex"
            >
              <Plus size={15} />
              Nuevo movimiento
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-slate transition-colors hover:bg-mist"
              aria-label="Cerrar sesión"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
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
            <li className="px-3 pb-1 pt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate">
              Configuración
            </li>
            {CONFIG_ITEMS.map(({ id, label, icon: Icon }) => (
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
        {CONFIG_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium ${
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
          onSubmit={async (input) => {
            await add(input);
            setIsAddOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
