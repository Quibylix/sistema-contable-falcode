import { useEffect, useState } from "react";
import z from "zod";
import {
  getPeriodsTransaction,
  periodsSchema,
} from "../journal-entries/register-journal-entry/register-journal-entry.transaction";
import {
  Container,
  Title,
  Select,
  Stack,
  SimpleGrid,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
  TableTfoot,
  Checkbox,
} from "@mantine/core";
import type { Account } from "../accounts/account-list/account-list.component";
import { getAccountsTransaction } from "../accounts/account-list/get-accounts.transaction";

export function Ledger() {
  const [periods, setPeriods] = useState<z.infer<typeof periodsSchema>>([]);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(
    null,
  );
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [displayAllAccounts, setDisplayAllAccounts] = useState(false);

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

  useEffect(() => {
    getPeriodsTransaction()
      .then(({ periods }) => {
        setPeriods(periods);

        setSelectedPeriodIndex(
          periods.findIndex((period) => period.endDate === null),
        );
      })
      .catch((e) => alert(e));
  }, []);

  if (selectedPeriodIndex === null) return null;

  const entries = periods[selectedPeriodIndex].entries;

  return (
    <Container fluid>
      <Stack align="center">
        <Select
          data={periods.map((period, index) => ({
            value: index.toString(),
            label: period.name,
          }))}
          defaultValue={selectedPeriodIndex.toString()}
          onChange={(newValue) => setSelectedPeriodIndex(Number(newValue))}
        />
      </Stack>
      <Title order={2}>
        {periods[selectedPeriodIndex].name}
        {periods[selectedPeriodIndex].endDate === null ? "" : " (Cerrado)"}
      </Title>
      <Container fluid my="lg">
        <Checkbox
          label="Mostrar solo cuentas con movimientos"
          checked={!displayAllAccounts}
          onChange={(event) =>
            setDisplayAllAccounts(!event.currentTarget.checked)
          }
        />
      </Container>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {accountData
          .filter((account) => {
            if (displayAllAccounts) return true;
            return entries.some(({ detail }) =>
              detail.some((d) => d.accountId === account.id),
            );
          })
          .map((account) => (
            <Container w="100%" fluid key={account.id}>
              <Title lineClamp={1} order={3} title={account.name}>
                {account.name}
              </Title>
              <Table>
                <TableThead>
                  <TableTr>
                    <TableTh>Identificador</TableTh>
                    <TableTh>Deber</TableTh>
                    <TableTh>Haber</TableTh>
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {entries
                    .map(({ detail }, index) =>
                      detail
                        .filter((d) => d.accountId === account.id)
                        .map((d) => (
                          <TableTr key={d.id}>
                            <TableTd>
                              {index === 0 ? "i)" : index + ")"}
                            </TableTd>
                            <TableTd>{d.debit.toFixed(2)}</TableTd>
                            <TableTd>{d.credit.toFixed(2)}</TableTd>
                          </TableTr>
                        )),
                    )
                    .flat()}
                  <TableTr fw="bold">
                    <TableTd>Total</TableTd>
                    <TableTd>
                      {entries
                        .flatMap(({ detail }) =>
                          detail.filter((d) => d.accountId === account.id),
                        )
                        .reduce((sum, d) => sum + d.debit, 0)
                        .toFixed(2)}
                    </TableTd>
                    <TableTd>
                      {entries
                        .flatMap(({ detail }) =>
                          detail.filter((d) => d.accountId === account.id),
                        )
                        .reduce((sum, d) => sum + d.credit, 0)
                        .toFixed(2)}
                    </TableTd>
                  </TableTr>
                </TableTbody>
                <TableTfoot>
                  <TableTr fw="bold" fs="italic">
                    <TableTd>Saldo</TableTd>
                    <TableTd>
                      {(() => {
                        const totalDebit = entries
                          .flatMap(({ detail }) =>
                            detail.filter((d) => d.accountId === account.id),
                          )
                          .reduce((sum, d) => sum + d.debit, 0);
                        const totalCredit = entries
                          .flatMap(({ detail }) =>
                            detail.filter((d) => d.accountId === account.id),
                          )
                          .reduce((sum, d) => sum + d.credit, 0);
                        return totalDebit > totalCredit
                          ? (totalDebit - totalCredit).toFixed(2)
                          : "";
                      })()}
                    </TableTd>
                    <TableTd>
                      {(() => {
                        const totalDebit = entries
                          .flatMap(({ detail }) =>
                            detail.filter((d) => d.accountId === account.id),
                          )
                          .reduce((sum, d) => sum + d.debit, 0);
                        const totalCredit = entries
                          .flatMap(({ detail }) =>
                            detail.filter((d) => d.accountId === account.id),
                          )
                          .reduce((sum, d) => sum + d.credit, 0);
                        return totalCredit > totalDebit
                          ? (totalCredit - totalDebit).toFixed(2)
                          : "";
                      })()}
                    </TableTd>
                  </TableTr>
                </TableTfoot>
              </Table>
            </Container>
          ))}
      </SimpleGrid>
    </Container>
  );
}
