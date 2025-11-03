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
  Grid,
  Paper,
} from "@mantine/core";

export function BalanceSheet() {
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
          Balance General
        </Title>
        <Title order={3} ta="center" mb="xl">
          No hay periodos con balance general disponible.
        </Title>
      </Container>
    );

  const balanceSheet = periods[selectedPeriodIndex].balanceSheet!;
  const {
    currentAssetAccounts,
    totalCurrentAssets,
    nonCurrentAssetAccounts,
    totalNonCurrentAssets,
    totalAssets,
    currentLiabilityAccounts,
    totalCurrentLiabilities,
    nonCurrentLiabilityAccounts,
    totalNonCurrentLiabilities,
    totalLiabilities,
    equityAccounts,
    totalEquity,
    totalLiabilitiesEquity,
    difference,
  } = balanceSheet;

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
        Balance General
      </Title>
      <Title order={3} ta="center" mb="xl">
        {periods[selectedPeriodIndex].name}
        {periods[selectedPeriodIndex].endDate === null ? "" : " (Cerrado)"}
      </Title>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="md" withBorder>
            <Table striped highlightOnHover>
              <TableThead>
                <TableTr>
                  <TableTh colSpan={2}>
                    <Title order={3} c="blue">
                      ACTIVO
                    </Title>
                  </TableTh>
                </TableTr>
              </TableThead>
              <TableTbody>
                {/* CURRENT ASSETS */}
                <TableTr>
                  <TableTd fw="bold" fz="md" colSpan={2} bg="blue.0">
                    ACTIVO CORRIENTE
                  </TableTd>
                </TableTr>
                {currentAssetAccounts.map((data) => (
                  <TableTr key={data.id}>
                    <TableTd pl="xl">{data.name}</TableTd>
                    <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
                  </TableTr>
                ))}
                <TableTr>
                  <TableTd fw="bold" pl="xl">
                    Total Activo Corriente
                  </TableTd>
                  <TableTd fw="bold" ta="right" bg="gray.1">
                    ${totalCurrentAssets.toFixed(2)}
                  </TableTd>
                </TableTr>

                {/* NON-CURRENT ASSETS */}
                <TableTr>
                  <TableTd fw="bold" fz="md" colSpan={2} bg="blue.0" pt="md">
                    ACTIVO NO CORRIENTE
                  </TableTd>
                </TableTr>
                {nonCurrentAssetAccounts.map((data) => (
                  <TableTr key={data.id}>
                    <TableTd pl="xl">{data.name}</TableTd>
                    <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
                  </TableTr>
                ))}
                <TableTr>
                  <TableTd fw="bold" pl="xl">
                    Total Activo No Corriente
                  </TableTd>
                  <TableTd fw="bold" ta="right" bg="gray.1">
                    ${totalNonCurrentAssets.toFixed(2)}
                  </TableTd>
                </TableTr>

                {/* TOTAL ASSETS */}
                <TableTr>
                  <TableTd fw="bold" fz="lg" pt="lg">
                    TOTAL ACTIVO
                  </TableTd>
                  <TableTd fw="bold" fz="lg" ta="right" pt="lg" bg="blue.2">
                    ${totalAssets.toFixed(2)}
                  </TableTd>
                </TableTr>
              </TableTbody>
            </Table>
          </Paper>
        </Grid.Col>

        {/* LIABILITIES AND EQUITY */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="md" withBorder>
            <Table striped highlightOnHover>
              <TableThead>
                <TableTr>
                  <TableTh colSpan={2}>
                    <Title order={3} c="orange">
                      PASIVO Y PATRIMONIO
                    </Title>
                  </TableTh>
                </TableTr>
              </TableThead>
              <TableTbody>
                {/* CURRENT LIABILITIES */}
                <TableTr>
                  <TableTd fw="bold" fz="md" colSpan={2} bg="orange.0">
                    PASIVO CORRIENTE
                  </TableTd>
                </TableTr>
                {currentLiabilityAccounts.map((data) => (
                  <TableTr key={data.id}>
                    <TableTd pl="xl">{data.name}</TableTd>
                    <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
                  </TableTr>
                ))}
                <TableTr>
                  <TableTd fw="bold" pl="xl">
                    Total Pasivo Corriente
                  </TableTd>
                  <TableTd fw="bold" ta="right" bg="gray.1">
                    ${totalCurrentLiabilities.toFixed(2)}
                  </TableTd>
                </TableTr>

                {/* NON-CURRENT LIABILITIES */}
                {nonCurrentLiabilityAccounts.length > 0 && (
                  <>
                    <TableTr>
                      <TableTd
                        fw="bold"
                        fz="md"
                        colSpan={2}
                        bg="orange.0"
                        pt="md"
                      >
                        PASIVO NO CORRIENTE
                      </TableTd>
                    </TableTr>
                    {nonCurrentLiabilityAccounts.map((data) => (
                      <TableTr key={data.id}>
                        <TableTd pl="xl">{data.name}</TableTd>
                        <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
                      </TableTr>
                    ))}
                    <TableTr>
                      <TableTd fw="bold" pl="xl">
                        Total Pasivo No Corriente
                      </TableTd>
                      <TableTd fw="bold" ta="right" bg="gray.1">
                        ${totalNonCurrentLiabilities.toFixed(2)}
                      </TableTd>
                    </TableTr>
                  </>
                )}

                {/* TOTAL LIABILITIES */}
                <TableTr>
                  <TableTd fw="bold" fz="md" pt="md">
                    TOTAL PASIVO
                  </TableTd>
                  <TableTd fw="bold" fz="md" ta="right" pt="md" bg="orange.1">
                    ${totalLiabilities.toFixed(2)}
                  </TableTd>
                </TableTr>

                {/* EQUITY */}
                <TableTr>
                  <TableTd fw="bold" fz="md" colSpan={2} bg="green.0" pt="md">
                    PATRIMONIO
                  </TableTd>
                </TableTr>
                {equityAccounts.map((data) => (
                  <TableTr key={data.id}>
                    <TableTd pl="xl">{data.name}</TableTd>
                    <TableTd ta="right">${data.balance.toFixed(2)}</TableTd>
                  </TableTr>
                ))}
                <TableTr>
                  <TableTd fw="bold" pl="xl">
                    Total Patrimonio
                  </TableTd>
                  <TableTd fw="bold" ta="right" bg="gray.1">
                    ${totalEquity.toFixed(2)}
                  </TableTd>
                </TableTr>

                {/* TOTAL LIABILITIES + EQUITY */}
                <TableTr>
                  <TableTd fw="bold" fz="lg" pt="lg">
                    TOTAL PASIVO + PATRIMONIO
                  </TableTd>
                  <TableTd fw="bold" fz="lg" ta="right" pt="lg" bg="green.2">
                    ${totalLiabilitiesEquity.toFixed(2)}
                  </TableTd>
                </TableTr>
              </TableTbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Balance Verification */}
      {Math.abs(difference) > 0.01 && (
        <Container mt="xl">
          <Paper p="md" bg="red.1" withBorder>
            <Title order={4} c="red" ta="center">
              ⚠️ Advertencia: El balance no cuadra
            </Title>
            <Title order={5} ta="center" mt="sm">
              Diferencia: ${difference.toFixed(2)}
            </Title>
          </Paper>
        </Container>
      )}

      {Math.abs(difference) <= 0.01 && (
        <Container mt="xl">
          <Paper p="md" bg="green.1" withBorder>
            <Title order={4} c="green" ta="center">
              ✓ Balance cuadrado: Activo = Pasivo + Patrimonio
            </Title>
          </Paper>
        </Container>
      )}
    </Container>
  );
}
