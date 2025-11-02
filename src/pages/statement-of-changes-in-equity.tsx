import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { checkAuthTransaction } from "../features/auth/check-auth.transaction";
import { StatementOfChangeInEquity } from "../features/periods/financial-statements/statement-of-change-in-equity.component";

export default function StatementOfChangesInEquityPage() {
  useEffect(() => {
    checkAuthTransaction().catch(() => {
      location.href = "/";
    });
  }, []);

  return (
    <>
      <title>
        Estado de Cambios en el Patrimonio | Sistema Contable Falcode
      </title>
      <Container size="lg">
        <Title order={1} mt="md" mb="xl">
          Estado de Cambios en el Patrimonio
        </Title>
        <StatementOfChangeInEquity />
      </Container>
    </>
  );
}
