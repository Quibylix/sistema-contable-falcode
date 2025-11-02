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

export function IncomeStatement() {
  const [periods, setPeriods] = useState<z.infer<typeof periodsSchema>>([]);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    getPeriodsTransaction()
      .then(({ periods }) => {
        const validPeriods = periods.filter((p) => p.incomeStatement);

        setPeriods(validPeriods);

        if (validPeriods.length > 0) {
          setSelectedPeriodIndex(0);
        }
      })
      .catch((e) => alert(e));
  }, []);

  if (selectedPeriodIndex === null)
    return (
      <Container fluid>
        <Title order={2} ta="center" my="lg">
          Estado de Resultados
        </Title>
        <Title order={3} ta="center" mb="xl">
          No hay periodos con estado de resultados disponible.
        </Title>
      </Container>
    );

  const incomeStatement = periods[selectedPeriodIndex].incomeStatement!;

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
            {incomeStatement.salesAccounts.map((data) => (
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
                ${incomeStatement.totalSales.toFixed(2)}
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd fw="bold" colSpan={2} pt="md">
                COSTO DE VENTA
              </TableTd>
            </TableTr>
            {incomeStatement.salesCostAccounts.map((data) => (
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
                ${incomeStatement.totalSalesCost.toFixed(2)}
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd fw="bold">UTILIDAD BRUTA</TableTd>
              <TableTd fw="bold" ta="right">
                ${incomeStatement.grossProfit.toFixed(2)}
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd fw="bold" colSpan={2} pt="md">
                GASTOS OPERATIVOS
              </TableTd>
            </TableTr>
            {incomeStatement.operatingExpensesAccounts.map((data) => (
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
                ${incomeStatement.totalOperatingExpenses.toFixed(2)}
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd fw="bold">UTILIDAD OPERATIVA</TableTd>
              <TableTd fw="bold" ta="right">
                ${incomeStatement.operatingProfit.toFixed(2)}
              </TableTd>
            </TableTr>
            {incomeStatement.financialExpensesAccounts.length > 0 && (
              <>
                <TableTr>
                  <TableTd fw="bold" colSpan={2} pt="md">
                    GASTOS FINANCIEROS
                  </TableTd>
                </TableTr>
                {incomeStatement.financialExpensesAccounts.map((data) => (
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
                    ${incomeStatement.totalFinancialExpenses.toFixed(2)}
                  </TableTd>
                </TableTr>
              </>
            )}
            {incomeStatement.otherIncomeAccounts.length > 0 && (
              <>
                <TableTr>
                  <TableTd fw="bold" colSpan={2} pt="md">
                    OTROS INGRESOS
                  </TableTd>
                </TableTr>
                {incomeStatement.otherIncomeAccounts.map((data) => (
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
                    ${incomeStatement.totalOtherIncome.toFixed(2)}
                  </TableTd>
                </TableTr>
              </>
            )}
            <TableTr>
              <TableTd fw="bold" pt="lg">
                UTILIDAD NETA
              </TableTd>
              <TableTd fw="bold" ta="right" pt="lg">
                ${incomeStatement.netProfit.toFixed(2)}
              </TableTd>
            </TableTr>
          </TableTbody>
        </Table>
      </Container>
    </Container>
  );
}
