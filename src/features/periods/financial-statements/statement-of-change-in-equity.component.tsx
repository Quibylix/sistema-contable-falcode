import { useEffect, useState } from "react";
import z from "zod";
import {
  getPeriodsTransaction,
  periodsSchema,
} from "../../journal-entries/register-journal-entry/register-journal-entry.transaction";
import {
  Container,
  Text,
  Title,
  Select,
  Stack,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
  Alert,
  Group,
  Progress,
  Paper,
} from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

export function StatementOfChangeInEquity() {
  const [periods, setPeriods] = useState<z.infer<typeof periodsSchema>>([]);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    getPeriodsTransaction()
      .then(({ periods }) => {
        const validPeriods = periods.filter(
          (p) => p.statementOfChangesInEquity,
        );

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
          Estado de Cambios en el Patrimonio
        </Title>
        <Title order={3} ta="center" mb="xl">
          No hay periodos con estado de cambios en el patrimonio disponible.
        </Title>
      </Container>
    );

  const statementOfChangesInEquity =
    periods[selectedPeriodIndex].statementOfChangesInEquity!;

  const {
    beginningCapitalSocial,
    beginningReservasLegales,
    beginningUtilidadRetenida,
    beginningUtilidadEjercicio,
    beginningTotalEquity,
    reservaLegalAmount,
    utilidadRetenidaMovement,
    reservasLegalesPercentage: reservePercentage,
    currentPeriodProfit,
    endingCapitalSocial,
    endingReservasLegales,
    endingUtilidadRetenida,
    endingUtilidadEjercicio,
    endingTotalEquity,
    maxReservasLegales,
  } = statementOfChangesInEquity;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-SV", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

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
        Estado de Cambios en el Patrimonio
      </Title>
      <Title order={3} ta="center" mb="xl">
        {periods[selectedPeriodIndex].name}
        {periods[selectedPeriodIndex].endDate === null ? "" : " (Cerrado)"}
      </Title>
      <Container size="md" mb="xl">
        <Alert
          icon={
            reservePercentage >= 20 ? (
              <IconCheck size={20} />
            ) : (
              <IconAlertCircle size={20} />
            )
          }
          title="Estado de Reserva Legal"
          color={reservePercentage >= 20 ? "green" : "yellow"}
        >
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm">Reserva Legal Actual:</Text>
              <Text size="sm" fw={600}>
                {formatCurrency(endingReservasLegales)}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Porcentaje del Capital:</Text>
              <Text size="sm" fw={600}>
                {reservePercentage.toFixed(2)}%
              </Text>
            </Group>
            <Progress
              value={Math.min((reservePercentage / 20) * 100, 100)}
              color={reservePercentage >= 20 ? "green" : "yellow"}
              size="lg"
              mt="xs"
            />
            <Text size="xs" c="dimmed" mt="xs">
              {reservePercentage >= 20
                ? "✓ Reserva legal completa (20% del capital social)"
                : `Falta ${formatCurrency(maxReservasLegales - endingReservasLegales)} para completar el 20% requerido`}
            </Text>
          </Stack>
        </Alert>
      </Container>

      <Container fluid my="lg">
        <Paper shadow="sm" p="md" withBorder>
          <Table striped highlightOnHover>
            <TableThead>
              <TableTr>
                <TableTh>Concepto</TableTh>
                <TableTh ta="right">Capital Social</TableTh>
                <TableTh ta="right">Reservas Legales</TableTh>
                <TableTh ta="right">Utilidades Retenidas</TableTh>
                <TableTh ta="right">Utilidad del Ejercicio</TableTh>
                <TableTh ta="right">Total Patrimonio</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>
              {/* SALDOS INICIALES */}
              <TableTr>
                <TableTd fw="bold" bg="blue.0">
                  SALDOS INICIALES
                </TableTd>
                <TableTd ta="right" bg="blue.0">
                  {formatCurrency(beginningCapitalSocial)}
                </TableTd>
                <TableTd ta="right" bg="blue.0">
                  {formatCurrency(beginningReservasLegales)}
                </TableTd>
                <TableTd ta="right" bg="blue.0">
                  {formatCurrency(beginningUtilidadRetenida)}
                </TableTd>
                <TableTd ta="right" bg="blue.0">
                  {formatCurrency(beginningUtilidadEjercicio)}
                </TableTd>
                <TableTd ta="right" bg="blue.0" fw="bold">
                  {formatCurrency(beginningTotalEquity)}
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd fw="bold" pt="md" colSpan={6} bg="gray.1">
                  MOVIMIENTOS DEL PERÍODO
                </TableTd>
              </TableTr>
              {beginningUtilidadEjercicio > 0 && (
                <>
                  <TableTr>
                    <TableTd pl="xl" fs="italic">
                      Aplicación Reserva Legal (5% mínimo)
                    </TableTd>
                    <TableTd ta="right">-</TableTd>
                    <TableTd
                      ta="right"
                      c={reservaLegalAmount > 0 ? "green" : undefined}
                    >
                      {reservaLegalAmount > 0
                        ? formatCurrency(reservaLegalAmount)
                        : "-"}
                    </TableTd>
                    <TableTd ta="right">-</TableTd>
                    <TableTd ta="right" c="red">
                      ({formatCurrency(reservaLegalAmount)})
                    </TableTd>
                    <TableTd ta="right">-</TableTd>
                  </TableTr>

                  <TableTr>
                    <TableTd pl="xl" fs="italic">
                      Traspaso a Utilidades Retenidas
                    </TableTd>
                    <TableTd ta="right">-</TableTd>
                    <TableTd ta="right">-</TableTd>
                    <TableTd ta="right" c="green">
                      {formatCurrency(utilidadRetenidaMovement)}
                    </TableTd>
                    <TableTd ta="right" c="red">
                      ({formatCurrency(utilidadRetenidaMovement)})
                    </TableTd>
                    <TableTd ta="right">-</TableTd>
                  </TableTr>
                </>
              )}
              <TableTr>
                <TableTd pl="xl" fs="italic">
                  Resultado del Ejercicio
                </TableTd>
                <TableTd ta="right">-</TableTd>
                <TableTd ta="right">-</TableTd>
                <TableTd ta="right">-</TableTd>
                <TableTd
                  ta="right"
                  c={currentPeriodProfit >= 0 ? "green" : "red"}
                  fw={600}
                >
                  {formatCurrency(currentPeriodProfit)}
                </TableTd>
                <TableTd
                  ta="right"
                  fw={600}
                  c={currentPeriodProfit >= 0 ? "green" : "red"}
                >
                  {formatCurrency(currentPeriodProfit)}
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd fw="bold" pt="md" bg="green.0">
                  SALDOS FINALES
                </TableTd>
                <TableTd ta="right" bg="green.0" fw="bold">
                  {formatCurrency(endingCapitalSocial)}
                </TableTd>
                <TableTd ta="right" bg="green.0" fw="bold">
                  {formatCurrency(endingReservasLegales)}
                </TableTd>
                <TableTd ta="right" bg="green.0" fw="bold">
                  {formatCurrency(endingUtilidadRetenida)}
                </TableTd>
                <TableTd ta="right" bg="green.0" fw="bold">
                  {formatCurrency(endingUtilidadEjercicio)}
                </TableTd>
                <TableTd ta="right" bg="green.0" fw="bold" fz="lg">
                  {formatCurrency(endingTotalEquity)}
                </TableTd>
              </TableTr>
            </TableTbody>
          </Table>
        </Paper>
        <Paper shadow="xs" p="md" mt="lg" bg="blue.0" withBorder>
          <Title order={5} mb="sm">
            Nota sobre Reserva Legal (Código de Comercio de El Salvador)
          </Title>
          <Stack gap="xs">
            <Text size="sm">
              • <strong>Porcentaje Anual:</strong> Mínimo 5% de las utilidades
              netas debe destinarse a la reserva legal.
            </Text>
            <Text size="sm">
              • <strong>Tope Máximo:</strong> La reserva legal debe alcanzar al
              menos el 20% del capital social.
            </Text>
            <Text size="sm">
              • <strong>Estado Actual:</strong>{" "}
              {reservePercentage >= 20
                ? "La empresa ha cumplido con el requisito legal de reserva."
                : "La empresa debe continuar destinando el 5% anual hasta alcanzar el 20% del capital social."}
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Container>
  );
}
