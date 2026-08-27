import { useState } from "react";
import { TransactionManager } from "./modules/transactions/components/TransactionManager";
import { Layout, type Page } from "./shared/components/Layout";
import { Dashboard } from "./modules/dashboard/Dashboard";
import { Transactions } from "./modules/transactions/Transactions";
import { Summary } from "./modules/summary/Summary";
import { Categories } from "./modules/categories/Categories";
import { Debts } from "./modules/debts/Debts";
import { CreditCards } from "./modules/credit-cards/CreditCards";
import { Budgets } from "./modules/budgets/Budgets";
import { LoginPage } from "./modules/auth/components/LoginPage";
import { useAuth } from "./modules/auth/context/AuthContext";

const PAGES: Record<Page, () => JSX.Element | null> = {
  dashboard: Dashboard,
  transactions: Transactions,
  summary: Summary,
  categories: Categories,
  debts: Debts,
  "credit-cards": CreditCards,
  budgets: Budgets,
};

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const { user, loading, logout } = useAuth();
  const PageComponent = PAGES[page];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-ink">
        <div className="text-center">
          <p className="font-display text-2xl font-semibold">Cargando sesión...</p>
          <p className="mt-2 text-sm text-slate">Comprobando tu acceso a Mis Finanzas.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <TransactionManager>
      <Layout page={page} onNavigate={setPage} user={user} onLogout={() => void logout()}>
        <PageComponent />
      </Layout>
    </TransactionManager>
  );
}
