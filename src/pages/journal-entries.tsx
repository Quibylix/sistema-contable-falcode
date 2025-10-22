import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { checkAuthTransaction } from "../features/auth/check-auth.transaction";
import { RegisterJournalEntryForm } from "../features/journal-entries/register-journal-entry/register-journal-entry-form.component";

export default function JournalEntriesPage() {
  useEffect(() => {
    checkAuthTransaction().catch(() => {
      location.href = "/";
    });
  }, []);

  return (
    <>
      <title>Registrar transacción | Sistema Contable Falcode</title>
      <Container size="lg">
        <Title order={1} mt="md" mb="xl">
          Transacciones
        </Title>
        <Container fluid>
          <Title order={1} ta="center" mt="md" mb="xl">
            Registrar Transacción
          </Title>
          <RegisterJournalEntryForm />
        </Container>
      </Container>
    </>
  );
}
