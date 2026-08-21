import { useEffect, useState } from "react";
import { TransactionManager } from "./components/TransactionManager/TransactionManager";
import { Layout, type Page } from "./components/Layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Summary } from "./pages/Summary";
import { LoginPage } from "./pages/LoginPage";
import { clearStoredUser, readStoredUser, saveStoredUser, type AuthUser } from "./services/auth";

const PAGES: Record<Page, () => JSX.Element> = {
  dashboard: Dashboard,
  transactions: Transactions,
  summary: Summary,
};

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const PageComponent = PAGES[page];

  useEffect(() => {
    const storedUser = readStoredUser();
    setUser(storedUser);
    setIsHydrated(true);
  }, []);

  const handleLogin = (nextUser: AuthUser) => {
    saveStoredUser(nextUser);
    setUser(nextUser);
  };

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    setPage("dashboard");
  };

  if (!isHydrated) {
    return null;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <TransactionManager>
      <Layout page={page} onNavigate={setPage} user={user} onLogout={handleLogout}>
        <PageComponent />
      </Layout>
    </TransactionManager>
  );
}
