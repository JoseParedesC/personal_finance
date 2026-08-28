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
  TrendingUp,
  CircleHelp,
} from "lucide-react";
import { Modal } from "./Modal";
import { TransactionForm } from "../../modules/transactions/components/TransactionForm";
import { useTransactionManager } from "../../modules/transactions/components/TransactionManager";
import type { AuthUser } from "../../modules/auth/services/auth";

export type Page = "dashboard" | "transactions" | "summary" | "categories" | "debts" | "credit-cards" | "budgets" | "pockets" | "investments" | "investment-master";

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
  { id: "investments", label: "Inversiones", icon: TrendingUp },
  { id: "debts", label: "Deudas", icon: Landmark },
  { id: "credit-cards", label: "Tarjetas", icon: CreditCardIcon },
  { id: "summary", label: "Resumen", icon: PieChart },
];

const CONFIG_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "categories", label: "Categoría", icon: Settings },
  { id: "investment-master", label: "Inversiones", icon: TrendingUp },
];

const HOW_TO_USE_URL = import.meta.env.VITE_HOW_TO_USE_URL ?? "./index.html";

export function Layout({ page, onNavigate, user, onLogout, children }: LayoutProps) {
  const { add } = useTransactionManager();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (nextPage: Page) => {
    onNavigate(nextPage);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper">
              <Wallet size={16} />
            </div>
            <p className="hidden font-display text-lg font-semibold text-ink sm:block">
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

      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:pt-6">
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-left shadow-sm"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              {(() => {
                const current = [...NAV_ITEMS, ...CONFIG_ITEMS].find((item) => item.id === page);
                const CurrentIcon = current?.icon ?? LayoutDashboard;
                return <CurrentIcon size={18} className="shrink-0 text-ink" />;
              })()}
              <span className="truncate text-sm font-semibold text-ink">
                {[...NAV_ITEMS, ...CONFIG_ITEMS].find((item) => item.id === page)?.label ?? "Menú"}
              </span>
            </span>
            <span className="ml-3 shrink-0 text-xs font-medium text-slate">
              {isMobileMenuOpen ? "Cerrar" : "Abrir menú"}
            </span>
          </button>

          {isMobileMenuOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Navegación principal"
              className="mt-2 max-h-[60vh] overflow-y-auto overscroll-contain rounded-xl border border-line bg-surface p-2 shadow-card"
            >
              <div className="grid gap-1 sm:grid-cols-2">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleNavigate(id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      page === id ? "bg-ink text-paper" : "text-slate hover:bg-mist hover:text-ink"
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                ))}
                <div className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate sm:col-span-2">
                  Configuración
                </div>
                {CONFIG_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleNavigate(id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      page === id ? "bg-ink text-paper" : "text-slate hover:bg-mist hover:text-ink"
                    }`}
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                ))}
                <a
                  href={HOW_TO_USE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate hover:bg-mist hover:text-ink sm:col-span-2"
                >
                  <CircleHelp size={17} />
                  How to Use
                </a>
              </div>
            </nav>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 pb-24 pt-4 sm:px-6 lg:pb-10 lg:pt-6">
        <nav className="hidden w-48 shrink-0 lg:block">
          <ul className="sticky top-24 flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => handleNavigate(id)}
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
                  onClick={() => handleNavigate(id)}
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
            <li className="mt-1 border-t border-line pt-2">
              <a
                href={HOW_TO_USE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate transition-colors hover:bg-mist hover:text-ink"
              >
                <CircleHelp size={16} />
                How to Use
              </a>
            </li>
          </ul>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Acción flotante móvil: permite agregar movimientos desde cualquier pantalla. */}
      <button
        type="button"
        onClick={() => setIsAddOpen(true)}
        aria-label="Agregar nuevo movimiento"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-lg ring-4 ring-paper/90 transition-transform hover:scale-105 active:scale-95 sm:hidden"
      >
        <Plus size={24} strokeWidth={2.25} />
      </button>

      {/* El menú móvil sustituye la barra inferior para evitar desbordes y mantener todos los destinos accesibles. */}
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
