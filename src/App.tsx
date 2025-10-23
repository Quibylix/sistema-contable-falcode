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
        </Route>
      </Routes>
    </MantineProvider>
  );
}
