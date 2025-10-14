import {
  Button,
  Container,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { getAccountsTransaction } from "./get-accounts.transaction";
import { updateAccountEnabledStatusTransaction } from "../update-account-enabled-status.transaction";
import { notifications } from "@mantine/notifications";

export type Account = {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  type: string;
  enabled: boolean;
};

export function AccountList() {
  const [accountData, setAccountData] = useState<Account[]>([]);

  useEffect(() => {
    getAccountsTransaction()
      .then(({ accounts: accountData }) => {
        const accounts: Account[] = [];

        Object.entries(accountData).forEach(([category, subcategories]) => {
          Object.entries(subcategories).forEach(
            ([subcategory, accountsInSubcategory]) => {
              Object.entries(accountsInSubcategory).forEach(([id, account]) => {
                accounts.push({
                  id,
                  category,
                  subcategory,
                  name: account.name,
                  type: account.type,
                  enabled: account.enabled,
                });
              });
            },
          );
        });

        setAccountData(accounts);
      })
      .catch(() => {});
  }, []);

  function getClickHandler(accountId: string, enabled: boolean) {
    return () => {
      setAccountData((current) =>
        current.map((account) =>
          account.id === accountId
            ? { ...account, enabled: !enabled }
            : account,
        ),
      );

      updateAccountEnabledStatusTransaction(accountId, !enabled)
        .then(() => {
          notifications.show({
            title: "Cuenta actualizada",
            message: `Cuenta ${
              !enabled ? "habilitada" : "deshabilitada"
            } correctamente`,
            color: "green",
            autoClose: 1200,
          });
        })
        .catch(() => {
          setAccountData((current) =>
            current.map((account) =>
              account.id === accountId
                ? { ...account, enabled: enabled }
                : account,
            ),
          );

          notifications.show({
            title: "Error",
            message: `No se ha podido ${
              !enabled ? "habilitar" : "deshabilitar"
            } la cuenta`,
            color: "red",
            autoClose: 1200,
          });
        });
    };
  }

  return (
    <Container fluid my="lg">
      <Title order={2} mb="lg">
        Listado de Cuentas
      </Title>
      <Table stickyHeader>
        <TableThead>
          <TableTr>
            <TableTh>Id</TableTh>
            <TableTh>Nombre</TableTh>
            <TableTh ta="center">Categoria</TableTh>
            <TableTh ta="center">Estado</TableTh>
            <TableTh ta="center">Acciones</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {accountData.map((account) => (
            <TableTr key={account.id}>
              <TableTd>{account.id}</TableTd>
              <TableTd>{account.name}</TableTd>
              <TableTd ta="center">{account.category}</TableTd>
              <TableTd ta="center">
                <Text
                  fz="inherit"
                  component="span"
                  c={account.enabled ? "green" : "red"}
                >
                  {account.enabled ? "Habilitada" : "Deshabilitada"}
                </Text>
              </TableTd>
              <TableTd ta="center">
                <Button
                  onClick={getClickHandler(account.id, account.enabled)}
                  variant="subtle"
                  size="xs"
                >
                  {account.enabled ? "Deshabilitar" : "Habilitar"}
                </Button>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </Container>
  );
}
