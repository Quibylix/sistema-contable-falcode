import { Container, Title } from "@mantine/core";
import { useEffect } from "react";
import { checkAuthTransaction } from "../features/auth/check-auth.transaction";
import { Ledger } from "../features/ledger/ledger.component";
import ProjectCostCalculator from "../features/cost/cost.component";

export default function CostsPage() {
  useEffect(() => {
    checkAuthTransaction().catch(() => {
      location.href = "/";
    });
  }, []);

  return (
    <>
      <title>Costos | Sistema Contable Falcode</title>
      <Container size="lg">
        <Title order={1} mt="md" mb="xl">
          Costos
        </Title>
        <ProjectCostCalculator />
      </Container>
    </>
  );
}
