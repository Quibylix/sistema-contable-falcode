import { useEffect, useState } from "react";
import z from "zod";
import {
  getPeriodsTransaction,
  periodsSchema,
} from "../../journal-entries/register-journal-entry/register-journal-entry.transaction";
import {
  Container,
  Title,
  Select,
  Stack,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
} from "@mantine/core";
import type { Account } from "../../accounts/account-list/account-list.component";
import { getAccountsTransaction } from "../../accounts/account-list/get-accounts.transaction";

export function IncomeStatement() {
  const [periods, setPeriods] = useState<z.infer<typeof periodsSchema>>([]);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(
    null,
  );
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

  const calculateAccountBalance = (accountId: string) => {
    const totalDebit = entries
      .flatMap(({ detail }) => detail.filter((d) => d.accountId === accountId))
      .reduce((sum, d) => sum + d.debit, 0);
    const totalCredit = entries
      .flatMap(({ detail }) => detail.filter((d) => d.accountId === accountId))
      .reduce((sum, d) => sum + d.credit, 0);

    const account = accountData.find((a) => a.id === accountId);
    if (account?.type === "income") {
      return totalCredit - totalDebit;
    } else {
      return totalDebit - totalCredit;
    }
  };

  const ventasAccounts = accountData
    .filter((account) => account.id.startsWith("4.1."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalVentas = ventasAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const costoVentaAccounts = accountData
    .filter((account) => account.id.startsWith("5.1."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalCostoVenta = costoVentaAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  const utilidadBruta = totalVentas - totalCostoVenta;

  const gastosOperativosAccounts = accountData
    .filter(
      (account) =>
        account.id.startsWith("5.2.") ||
        account.id.startsWith("5.3.") ||
        account.id.startsWith("5.4."),
    )
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalGastosOperativos = gastosOperativosAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  const utilidadOperativa = utilidadBruta - totalGastosOperativos;

  const gastosFinancierosAccounts = accountData
    .filter((account) => account.id.startsWith("5.5."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalGastosFinancieros = gastosFinancierosAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  const otrosIngresosAccounts = accountData
    .filter((account) => account.id === "4.1.04")
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalOtrosIngresos = otrosIngresosAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  const utilidadNeta =
    utilidadOperativa - totalGastosFinancieros + totalOtrosIngresos;

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
      <Title order={2} ta="center" my="lg">
        Estado de Resultados
      </Title>
      <Title order={3} ta="center" mb="xl">
        {periods[selectedPeriodIndex].name}
        {periods[selectedPeriodIndex].endDate === null ? "" : " (Cerrado)"}
      </Title>

      <Container fluid my="lg">
        <Table>
          <TableThead>
            <TableTr>
              <TableTh>Concepto</TableTh>
              <TableTh ta="right">Monto</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            <TableTr>
              <TableTd fw="bold" colSpan={2}>
                VENTAS / INGRESOS
              </TableTd>
            </TableTr>
            {ventasAccounts.map((data) => (
              <TableTr key={data.id}>
                <TableTd pl="xl">{data.name}</TableTd>
                <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
              </TableTr>
            ))}
            <TableTr>
              <TableTd fw="bold" pl="xl">
                Total Ventas
              </TableTd>
              <TableTd fw="bold" ta="right">
                ${totalVentas.toFixed(2)}
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd fw="bold" colSpan={2} pt="md">
                COSTO DE VENTA
              </TableTd>
            </TableTr>
            {costoVentaAccounts.map((data) => (
              <TableTr key={data.id}>
                <TableTd pl="xl">{data.name}</TableTd>
                <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
              </TableTr>
            ))}
            <TableTr>
              <TableTd fw="bold" pl="xl">
                Total Costo de Venta
              </TableTd>
              <TableTd fw="bold" ta="right">
                ${totalCostoVenta.toFixed(2)}
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd fw="bold">UTILIDAD BRUTA</TableTd>
              <TableTd fw="bold" ta="right">
                ${utilidadBruta.toFixed(2)}
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd fw="bold" colSpan={2} pt="md">
                GASTOS OPERATIVOS
              </TableTd>
            </TableTr>
            {gastosOperativosAccounts.map((data) => (
              <TableTr key={data.id}>
                <TableTd pl="xl">{data.name}</TableTd>
                <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
              </TableTr>
            ))}
            <TableTr>
              <TableTd fw="bold" pl="xl">
                Total Gastos Operativos
              </TableTd>
              <TableTd fw="bold" ta="right">
                ${totalGastosOperativos.toFixed(2)}
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd fw="bold">UTILIDAD OPERATIVA</TableTd>
              <TableTd fw="bold" ta="right">
                ${utilidadOperativa.toFixed(2)}
              </TableTd>
            </TableTr>
            {gastosFinancierosAccounts.length > 0 && (
              <>
                <TableTr>
                  <TableTd fw="bold" colSpan={2} pt="md">
                    GASTOS FINANCIEROS
                  </TableTd>
                </TableTr>
                {gastosFinancierosAccounts.map((data) => (
                  <TableTr key={data.id}>
                    <TableTd pl="xl">{data.name}</TableTd>
                    <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
                  </TableTr>
                ))}
                <TableTr>
                  <TableTd fw="bold" pl="xl">
                    Total Gastos Financieros
                  </TableTd>
                  <TableTd fw="bold" ta="right">
                    ${totalGastosFinancieros.toFixed(2)}
                  </TableTd>
                </TableTr>
              </>
            )}
            {otrosIngresosAccounts.length > 0 && (
              <>
                <TableTr>
                  <TableTd fw="bold" colSpan={2} pt="md">
                    OTROS INGRESOS
                  </TableTd>
                </TableTr>
                {otrosIngresosAccounts.map((data) => (
                  <TableTr key={data.id}>
                    <TableTd pl="xl">{data.name}</TableTd>
                    <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
                  </TableTr>
                ))}
                <TableTr>
                  <TableTd fw="bold" pl="xl">
                    Total Otros Ingresos
                  </TableTd>
                  <TableTd fw="bold" ta="right">
                    ${totalOtrosIngresos.toFixed(2)}
                  </TableTd>
                </TableTr>
              </>
            )}
            <TableTr>
              <TableTd fw="bold" pt="lg">
                UTILIDAD NETA
              </TableTd>
              <TableTd fw="bold" ta="right" pt="lg">
                ${utilidadNeta.toFixed(2)}
              </TableTd>
            </TableTr>
          </TableTbody>
        </Table>
      </Container>
    </Container>
  );
}
