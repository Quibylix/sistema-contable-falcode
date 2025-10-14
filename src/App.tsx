import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { Route, Routes } from "react-router";
import HomePage from "./pages/home";
import { MantineProvider } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </MantineProvider>
  );
}
