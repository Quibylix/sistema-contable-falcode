import { Container, Title } from "@mantine/core";
import { AccountList } from "../features/accounts/account-list/account-list.component";

export default function AccountsPage() {
  return (
    <>
      <title>Cuentas | Sistema Contable Falcode</title>
      <Container size="lg" my="md">
        <Title>Gestión de Cuentas</Title>
        <AccountList />
      </Container>
    </>
  );
}
