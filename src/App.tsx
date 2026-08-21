import { useState } from "react";
import { TransactionManager } from "./components/TransactionManager/TransactionManager";
import { Layout, type Page } from "./components/Layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Summary } from "./pages/Summary";

const PAGES: Record<Page, () => JSX.Element> = {
  dashboard: Dashboard,
  transactions: Transactions,
  summary: Summary,
};

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const PageComponent = PAGES[page];

  return (
    <TransactionManager>
      <Layout page={page} onNavigate={setPage}>
        <PageComponent />
      </Layout>
    </TransactionManager>
  );
}
