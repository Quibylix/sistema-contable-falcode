import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { Route, Routes } from "react-router";
import HomePage from "./pages/home";
import { MantineProvider } from "@mantine/core";
import AccountsPage from "./pages/accounts";
import { AppShell } from "./features/ui/app-shell/app-shell.component";
import { Notifications } from "@mantine/notifications";
import JournalEntriesPage from "./pages/journal-entries";
import LedgerPage from "./pages/ledger";
import IncomeStatementPage from "./pages/income-statement";
import CostsPage from "./pages/costs";
import StatementOfChangesInEquityPage from "./pages/statement-of-changes-in-equity";

export default function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/journal-entries" element={<JournalEntriesPage />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/income-statement" element={<IncomeStatementPage />} />
          <Route
            path="/statement-of-changes-in-equity"
            element={<StatementOfChangesInEquityPage />}
          />
          <Route path="/costs" element={<CostsPage />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}
