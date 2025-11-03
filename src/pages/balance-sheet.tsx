import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { checkAuthTransaction } from "../features/auth/check-auth.transaction";
import { BalanceSheet } from "../features/periods/financial-statements/balance-sheet.component";

export default function BalanceSheetPage() {
  useEffect(() => {
    checkAuthTransaction().catch(() => {
      location.href = "/";
    });
  }, []);

  return (
    <>
      <title>Balance General | Sistema Contable Falcode</title>
      <Container size="lg">
        <Title order={1} mt="md" mb="xl">
          Balance General
        </Title>
        <BalanceSheet />
      </Container>
    </>
  );
}
