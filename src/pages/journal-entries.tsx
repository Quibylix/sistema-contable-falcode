import { Button, Container, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { checkAuthTransaction } from "../features/auth/check-auth.transaction";
import { RegisterJournalEntryForm } from "../features/journal-entries/register-journal-entry/register-journal-entry-form.component";
import { Modal } from "@mantine/core";
import JournalEntriesList from "../features/journal-entries/journal-entries-list/journal-entries-list.component";

export default function JournalEntriesPage() {
  const [modalOpened, setModalOpened] = useState(false);

  function openModal() {
    setModalOpened(true);
  }

  function closeModal() {
    setModalOpened(false);
  }

  useEffect(() => {
    checkAuthTransaction().catch(() => {
      location.href = "/";
    });
  }, []);

  return (
    <>
      <title>Registrar transacción | Sistema Contable Falcode</title>
      <Container size="lg">
        <Button display="block" mx="auto" onClick={openModal}>
          Registrar nueva transacción
        </Button>
        <Modal opened={modalOpened} onClose={closeModal} size="xl" mah="80vh">
          <Container fluid>
            <Title order={2} mb="md">
              Registrar nueva transacción
            </Title>
            <RegisterJournalEntryForm />
          </Container>
        </Modal>
        <Title order={1} mt="md" mb="xl">
          Transacciones
        </Title>
        <JournalEntriesList />
      </Container>
    </>
  );
}
