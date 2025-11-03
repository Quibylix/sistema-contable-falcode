import { useState, useMemo } from "react";
import {
  Container,
  Title,
  Paper,
  NumberInput,
  Table,
  Text,
  Group,
  Badge,
  Stack,
  Divider,
  Button,
  ActionIcon,
  Card,
  Grid,
  Collapse,
} from "@mantine/core";
import { IconTrash, IconPlus, IconCalculator } from "@tabler/icons-react";

const ProjectCostCalculator = () => {
  const [storyPoints, setStoryPoints] = useState(100);
  const [hoursPorPoint, setHoursPorPoint] = useState(4);

  // Datos salariales
  const [salarioMensual, setSalarioMensual] = useState(800);
  const [diasVacaciones, setDiasVacaciones] = useState(15);
  const [showCalculator, setShowCalculator] = useState(false);

  const [costosDirectos, setCostosDirectos] = useState([
    {
      cuenta: "5.1.01",
      nombre: "Costo de Desarrollo de Software",
      porcentaje: 60,
    },
    {
      cuenta: "5.1.02",
      nombre: "Subcontratación de Servicios Técnicos",
      porcentaje: 15,
    },
    {
      cuenta: "5.1.03",
      nombre: "Licencias de Terceros Usadas en Proyectos",
      porcentaje: 5,
    },
  ]);

  const [gastosOperativos, setGastosOperativos] = useState([
    { cuenta: "5.2.01", nombre: "Salarios", porcentaje: 45 },
    { cuenta: "5.2.04", nombre: "Seguridad Social (ISSS)", porcentaje: 7.5 },
    { cuenta: "5.2.05", nombre: "Fondo de Pensiones (AFP)", porcentaje: 8.75 },
    {
      cuenta: "5.4.05",
      nombre: "Servicios en la Nube (Hosting, API, etc.)",
      porcentaje: 10,
    },
    { cuenta: "5.5.02", nombre: "Depreciación y Amortización", porcentaje: 5 },
  ]);

  // Cálculo de tarifa por hora según normativa salvadoreña
  const calcularTarifaPorHora = useMemo(() => {
    // Datos base
    const diasLaboralesAnio = 365 - 52 * 2 - diasVacaciones;
    const horasLaboralesDia = 8;
    const horasMensuales = (diasLaboralesAnio / 12) * horasLaboralesDia;

    // Prestaciones laborales (El Salvador)
    const aguinaldo = salarioMensual / 12;
    const vacaciones = (salarioMensual / 30) * (diasVacaciones / 12) * 1.3;
    const isssPatronal = salarioMensual * 0.075;
    const afpPatronal = salarioMensual * 0.0875;

    // Costo total mensual del empleado
    const costoTotalMensual =
      salarioMensual + aguinaldo + vacaciones + isssPatronal + afpPatronal;

    // Tarifa por hora
    const tarifaPorHora = costoTotalMensual / horasMensuales;

    return {
      tarifaPorHora,
      costoTotalMensual,
      horasMensuales,
      aguinaldo,
      vacaciones,
      isssPatronal,
      afpPatronal,
      diasLaboralesAnio,
    };
  }, [salarioMensual, diasVacaciones]);

  const tarifaPorHora = calcularTarifaPorHora.tarifaPorHora;

  const calculos = useMemo(() => {
    const horasTotales = storyPoints * hoursPorPoint;
    const costoBase = horasTotales * tarifaPorHora;

    const totalDirectos = costosDirectos.reduce(
      (sum, item) => sum + (costoBase * item.porcentaje) / 100,
      0,
    );

    const totalOperativos = gastosOperativos.reduce(
      (sum, item) => sum + (costoBase * item.porcentaje) / 100,
      0,
    );

    const costoTotal = costoBase + totalDirectos + totalOperativos;
    const margenSugerido = costoTotal * 0.3;
    const precioSugerido = costoTotal + margenSugerido;

    return {
      horasTotales,
      costoBase,
      totalDirectos,
      totalOperativos,
      costoTotal,
      margenSugerido,
      precioSugerido,
    };
  }, [
    storyPoints,
    hoursPorPoint,
    tarifaPorHora,
    costosDirectos,
    gastosOperativos,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-SV", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const actualizarPorcentaje = (
    tipo: "directos" | "operativos",
    index: number,
    valor: number,
  ) => {
    if (tipo === "directos") {
      const nuevos = [...costosDirectos];
      nuevos[index].porcentaje = valor || 0;
      setCostosDirectos(nuevos);
    } else {
      const nuevos = [...gastosOperativos];
      nuevos[index].porcentaje = valor || 0;
      setGastosOperativos(nuevos);
    }
  };

  const eliminarCosto = (tipo: "directos" | "operativos", index: number) => {
    if (tipo === "directos") {
      setCostosDirectos(costosDirectos.filter((_, i) => i !== index));
    } else {
      setGastosOperativos(gastosOperativos.filter((_, i) => i !== index));
    }
  };

  const agregarCosto = (tipo: "directos" | "operativos") => {
    const nuevo = { cuenta: "5.1.01", nombre: "Nueva cuenta", porcentaje: 0 };
    if (tipo === "directos") {
      setCostosDirectos([...costosDirectos, nuevo]);
    } else {
      setGastosOperativos([...gastosOperativos, nuevo]);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center" c="blue">
        Calculadora de Costos de Proyecto
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        Metodología Ágil - Story Points
      </Text>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="lg" withBorder>
            <Title order={3} size="h4" mb="md">
              Parámetros del Proyecto
            </Title>
            <Stack gap="md">
              <NumberInput
                label="Story Points Totales"
                value={storyPoints}
                onChange={(val) => setStoryPoints(Number(val))}
                min={1}
                step={1}
                description="Puntos de historia estimados"
              />
              <NumberInput
                label="Horas por Story Point"
                value={hoursPorPoint}
                onChange={(val) => setHoursPorPoint(Number(val))}
                min={0.5}
                step={0.5}
                description="Promedio de horas por punto"
              />

              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>
                    Tarifa por Hora (USD)
                  </Text>
                  <Button
                    size="xs"
                    leftSection={<IconCalculator size={14} />}
                    onClick={() => setShowCalculator(!showCalculator)}
                    variant="light"
                  >
                    {showCalculator ? "Ocultar" : "Calcular"}
                  </Button>
                </Group>
                <NumberInput
                  value={tarifaPorHora}
                  readOnly
                  prefix="$"
                  decimalScale={2}
                  description="Calculada automáticamente"
                  styles={{ input: { backgroundColor: "#f9fafb" } }}
                />
              </div>
            </Stack>
          </Paper>

          {/* Calculadora de Tarifa */}
          <Collapse in={showCalculator}>
            <Paper shadow="sm" p="lg" mt="lg" withBorder bg="yellow.0">
              <Title order={4} size="h5" mb="md" c="yellow.9">
                Calculadora de Tarifa por Hora
              </Title>

              <Stack gap="md">
                <NumberInput
                  label="Salario Mensual (USD)"
                  value={salarioMensual}
                  onChange={(val) => setSalarioMensual(Number(val))}
                  min={0}
                  step={10}
                  prefix="$"
                />

                <NumberInput
                  label="Días de Vacaciones al Año"
                  value={diasVacaciones}
                  onChange={(val) => setDiasVacaciones(Number(val))}
                  min={0}
                  step={1}
                  description="Según antigüedad (15-30 días)"
                />

                <Paper p="md" bg="white" radius="md">
                  <Text size="sm" fw={600} mb="sm">
                    Desglose del Costo:
                  </Text>

                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="xs">Salario Base:</Text>
                      <Text size="xs" fw={500}>
                        {formatCurrency(salarioMensual)}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="xs">Aguinaldo (8.33%):</Text>
                      <Text size="xs" fw={500}>
                        {formatCurrency(calcularTarifaPorHora.aguinaldo)}
                      </Text>
                    </Group>

                    <Group justify="space-between" wrap="nowrap">
                      <Text size="xs">
                        Vacaciones ({diasVacaciones} días + 30% del salario
                        base):
                      </Text>
                      <Text size="xs" fw={500}>
                        {formatCurrency(calcularTarifaPorHora.vacaciones)}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="xs">ISSS Patronal (7.5%):</Text>
                      <Text size="xs" fw={500}>
                        {formatCurrency(calcularTarifaPorHora.isssPatronal)}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="xs">AFP Patronal (8.75%):</Text>
                      <Text size="xs" fw={500}>
                        {formatCurrency(calcularTarifaPorHora.afpPatronal)}
                      </Text>
                    </Group>

                    <Divider my="xs" />

                    <Group justify="space-between">
                      <Text size="sm" fw={600}>
                        Costo Total Mensual:
                      </Text>
                      <Text size="sm" fw={700} c="blue">
                        {formatCurrency(
                          calcularTarifaPorHora.costoTotalMensual,
                        )}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="xs">Horas Mensuales:</Text>
                      <Text size="xs" fw={500}>
                        {calcularTarifaPorHora.horasMensuales.toFixed(0)} hrs
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text size="xs">Días Laborales/Año:</Text>
                      <Text size="xs" fw={500}>
                        {calcularTarifaPorHora.diasLaboralesAnio} días
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              </Stack>
            </Paper>
          </Collapse>

          <Card mt="lg" shadow="sm" p="lg" withBorder bg="blue.0">
            <Title order={4} size="h5" mb="md">
              Resumen Ejecutivo
            </Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  Horas Totales:
                </Text>
                <Badge size="lg" color="gray">
                  {calculos.horasTotales} hrs
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  Costo Base:
                </Text>
                <Text fw={600}>{formatCurrency(calculos.costoBase)}</Text>
              </Group>
              <Divider my="xs" />
              <Group justify="space-between">
                <Text size="sm" fw={700}>
                  Costo Total:
                </Text>
                <Text size="lg" fw={700} c="blue">
                  {formatCurrency(calculos.costoTotal)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="green">
                  Margen 30%:
                </Text>
                <Text c="green" fw={600}>
                  {formatCurrency(calculos.margenSugerido)}
                </Text>
              </Group>
              <Divider my="xs" />
              <Group justify="space-between">
                <Text fw={700}>Precio Sugerido:</Text>
                <Text size="xl" fw={700} c="green">
                  {formatCurrency(calculos.precioSugerido)}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg" style={{ overflow: "hidden" }}>
            <Paper shadow="sm" p="lg" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={4} size="h5">
                  Costos Directos del Proyecto
                </Title>
                <Button
                  size="xs"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => agregarCosto("directos")}
                >
                  Agregar
                </Button>
              </Group>
              <Container style={{ overflowX: "auto" }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Cuenta</Table.Th>
                      <Table.Th>Nombre</Table.Th>
                      <Table.Th>%</Table.Th>
                      <Table.Th>Monto</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {costosDirectos.map((item, idx) => {
                      const monto =
                        (calculos.costoBase * item.porcentaje) / 100;
                      return (
                        <Table.Tr key={idx}>
                          <Table.Td>
                            <Text size="sm" fw={500}>
                              {item.cuenta}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{item.nombre}</Text>
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              value={item.porcentaje}
                              onChange={(val) =>
                                actualizarPorcentaje(
                                  "directos",
                                  idx,
                                  Number(val),
                                )
                              }
                              min={0}
                              max={100}
                              step={0.5}
                              suffix="%"
                              size="xs"
                              w={80}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={500}>
                              {formatCurrency(monto)}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() => eliminarCosto("directos", idx)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                    <Table.Tr>
                      <Table.Td colSpan={3}>
                        <Text fw={700}>Subtotal Costos Directos</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} c="blue">
                          {formatCurrency(calculos.totalDirectos)}
                        </Text>
                      </Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Container>
            </Paper>

            <Paper shadow="sm" p="lg" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={4} size="h5">
                  Gastos Operativos Asignados
                </Title>
                <Button
                  size="xs"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => agregarCosto("operativos")}
                >
                  Agregar
                </Button>
              </Group>
              <Container style={{ overflowX: "auto" }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Cuenta</Table.Th>
                      <Table.Th>Nombre</Table.Th>
                      <Table.Th>%</Table.Th>
                      <Table.Th>Monto</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {gastosOperativos.map((item, idx) => {
                      const monto =
                        (calculos.costoBase * item.porcentaje) / 100;
                      return (
                        <Table.Tr key={idx}>
                          <Table.Td>
                            <Text size="sm" fw={500}>
                              {item.cuenta}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{item.nombre}</Text>
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              value={item.porcentaje}
                              onChange={(val) =>
                                actualizarPorcentaje(
                                  "operativos",
                                  idx,
                                  Number(val),
                                )
                              }
                              min={0}
                              max={100}
                              step={0.5}
                              suffix="%"
                              size="xs"
                              w={80}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={500}>
                              {formatCurrency(monto)}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() => eliminarCosto("operativos", idx)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                    <Table.Tr>
                      <Table.Td colSpan={3}>
                        <Text fw={700}>Subtotal Gastos Operativos</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} c="blue">
                          {formatCurrency(calculos.totalOperativos)}
                        </Text>
                      </Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Container>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProjectCostCalculator;
