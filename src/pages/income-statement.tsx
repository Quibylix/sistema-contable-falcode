import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { checkAuthTransaction } from "../features/auth/check-auth.transaction";
import { IncomeStatement } from "../features/periods/financial-statements/income-statement.component";

export default function IncomeStatementPage() {
  useEffect(() => {
    checkAuthTransaction().catch(() => {
      location.href = "/";
    });
  }, []);

  return (
    <>
      <title>Estado de Resultados | Sistema Contable Falcode</title>
      <Container size="lg">
        <Title order={1} mt="md" mb="xl">
          Estado de Resultados
        </Title>
        <IncomeStatement />
      </Container>
    </>
  );
}
