import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { checkAuthTransaction } from "../features/auth/check-auth.transaction";
import { Ledger } from "../features/ledger/ledger.component";

export default function LedgerPage() {
  useEffect(() => {
    checkAuthTransaction().catch(() => {
      location.href = "/";
    });
  }, []);

  return (
    <>
      <title>Libro mayor | Sistema Contable Falcode</title>
      <Container size="lg">
        <Title order={1} mt="md" mb="xl">
          Libro Mayor
        </Title>
        <Ledger />
      </Container>
    </>
  );
}
