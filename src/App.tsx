import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { Route, Routes } from "react-router";
import HomePage from "./pages/home";
import { MantineProvider } from "@mantine/core";
import { AppShell } from "./features/ui/app-shell/app-shell.component";

export default function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}
