import { useState } from "react";
import { TransactionManager } from "./components/TransactionManager/TransactionManager";
import { Layout, type Page } from "./components/Layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Summary } from "./pages/Summary";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./contexts/AuthContext";

const PAGES: Record<Page, () => JSX.Element> = {
  dashboard: Dashboard,
  transactions: Transactions,
  summary: Summary,
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
