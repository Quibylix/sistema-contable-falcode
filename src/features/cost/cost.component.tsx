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
  TextInput,
} from "@mantine/core";
import { IconTrash, IconPlus, IconCalculator } from "@tabler/icons-react";

const ProjectCostCalculator = () => {
  const [storyPoints, setStoryPoints] = useState(100);
  const [hoursPorPoint, setHoursPorPoint] = useState(4);
  const [salarioMensual, setSalarioMensual] = useState(800);
  const [diasVacaciones, setDiasVacaciones] = useState(15);
  const [showCalculator, setShowCalculator] = useState(false);

  const [costosDirectos, setCostosDirectos] = useState<
    {
      nombre: string;
      monto: number;
    }[]
  >([]);

  const [costosIndirectos, setCostosIndirectos] = useState([
    { nombre: "QA Testing (proporción)", tasaPorHora: 3.5 },
    { nombre: "DevOps/Infraestructura (proporción)", tasaPorHora: 2.0 },
    { nombre: "Servidores Cloud del Proyecto", tasaPorHora: 1.5 },
    { nombre: "Depreciación de Equipos", tasaPorHora: 0.8 },
    { nombre: "Licencias Compartidas (IDE, etc.)", tasaPorHora: 0.5 },
    { nombre: "Mantenimiento de Equipos", tasaPorHora: 0.3 },
  ]);

  const [gastosAdministracion, setGastosAdministracion] = useState([
    { nombre: "Salarios Personal Administrativo", monto: 300 },
    { nombre: "Renta de Oficinas", monto: 150 },
    { nombre: "Servicios Públicos", monto: 80 },
    { nombre: "Papelería y Suministros", monto: 40 },
  ]);

  const [gastosVenta, setGastosVenta] = useState([
    { nombre: "Comisiones de Venta", monto: 200 },
    { nombre: "Marketing y Publicidad", monto: 150 },
    { nombre: "Viáticos del Equipo Comercial", monto: 100 },
  ]);

  const calcularTarifaPorHora = useMemo(() => {
    const diasLaboralesAnio = 365 - 52 * 2 - diasVacaciones;
    const horasLaboralesDia = 8;
    const horasMensuales = (diasLaboralesAnio / 12) * horasLaboralesDia;

    const aguinaldo = salarioMensual / 12;
    const vacaciones = (salarioMensual / 30) * (diasVacaciones / 12) * 1.3;
    const isssPatronal = salarioMensual * 0.075;
    const afpPatronal = salarioMensual * 0.0875;

    const costoTotalMensual =
      salarioMensual + aguinaldo + vacaciones + isssPatronal + afpPatronal;

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

  const tarifaMOD = calcularTarifaPorHora.tarifaPorHora;

  const calculos = useMemo(() => {
    const horasTotales = storyPoints * hoursPorPoint;
    const costoMOD = horasTotales * tarifaMOD;
    const totalMaterialesDirectos = costosDirectos.reduce(
      (sum, item) => sum + item.monto,
      0,
    );
    const costosPrimos = costoMOD + totalMaterialesDirectos;
    const totalCIF = costosIndirectos.reduce(
      (sum, item) => sum + horasTotales * item.tasaPorHora,
      0,
    );
    const costoTotalProduccion = costosPrimos + totalCIF;
    const totalGastosAdministracion = gastosAdministracion.reduce(
      (sum, item) => sum + item.monto,
      0,
    );
    const totalGastosVenta = gastosVenta.reduce(
      (sum, item) => sum + item.monto,
      0,
    );
    const costoTotalProyecto =
      costoTotalProduccion + totalGastosAdministracion + totalGastosVenta;
    const margenPorcentaje = 30;
    const margenUtilidad = costoTotalProyecto * (margenPorcentaje / 100);
    const precioVenta = costoTotalProyecto + margenUtilidad;

    return {
      horasTotales,
      costoMOD,
      totalMaterialesDirectos,
      costosPrimos,
      totalCIF,
      costoTotalProduccion,
      totalGastosAdministracion,
      totalGastosVenta,
      costoTotalProyecto,
      margenPorcentaje,
      margenUtilidad,
      precioVenta,
    };
  }, [
    storyPoints,
    hoursPorPoint,
    tarifaMOD,
    costosDirectos,
    costosIndirectos,
    gastosAdministracion,
    gastosVenta,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-SV", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const actualizarCostoDirecto = (index: number, campo: string, valor: any) => {
    const nuevos = [...costosDirectos];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setCostosDirectos(nuevos);
  };

  const eliminarCostoDirecto = (index: number) => {
    setCostosDirectos(costosDirectos.filter((_, i) => i !== index));
  };

  const agregarCostoDirecto = () => {
    setCostosDirectos([...costosDirectos, { nombre: "Nuevo costo", monto: 0 }]);
  };

  const actualizarCIF = (index: number, campo: string, valor: any) => {
    const nuevos = [...costosIndirectos];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setCostosIndirectos(nuevos);
  };

  const eliminarCIF = (index: number) => {
    setCostosIndirectos(costosIndirectos.filter((_, i) => i !== index));
  };

  const agregarCIF = () => {
    setCostosIndirectos([
      ...costosIndirectos,
      { nombre: "Nuevo CIF", tasaPorHora: 0 },
    ]);
  };

  const actualizarGastoAdmin = (index: number, campo: string, valor: any) => {
    const nuevos = [...gastosAdministracion];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setGastosAdministracion(nuevos);
  };

  const eliminarGastoAdmin = (index: number) => {
    setGastosAdministracion(gastosAdministracion.filter((_, i) => i !== index));
  };

  const agregarGastoAdmin = () => {
    setGastosAdministracion([
      ...gastosAdministracion,
      { nombre: "Nuevo gasto", monto: 0 },
    ]);
  };

  const actualizarGastoVenta = (index: number, campo: string, valor: any) => {
    const nuevos = [...gastosVenta];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setGastosVenta(nuevos);
  };

  const eliminarGastoVenta = (index: number) => {
    setGastosVenta(gastosVenta.filter((_, i) => i !== index));
  };

  const agregarGastoVenta = () => {
    setGastosVenta([...gastosVenta, { nombre: "Nuevo gasto", monto: 0 }]);
  };

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl" ta="center" c="blue">
        Calculadora de Costos de Proyecto
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        Sistema de Costeo por Órdenes de Producción
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
                    Tarifa MOD por Hora
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
                  value={tarifaMOD}
                  readOnly
                  prefix="$"
                  decimalScale={2}
                  description="Mano de Obra Directa"
                  styles={{ input: { backgroundColor: "#f9fafb" } }}
                />
              </div>
            </Stack>
          </Paper>

          <Collapse in={showCalculator}>
            <Paper shadow="sm" p="lg" mt="lg" withBorder bg="yellow.0">
              <Title order={4} size="h5" mb="md" c="yellow.9">
                Cálculo de Tarifa MOD
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
                        Vacaciones ({diasVacaciones} días + 30%):
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
              Resumen de Costos
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

              <Divider label="Costos Primos" labelPosition="center" my="sm" />

              <Group justify="space-between">
                <Text size="sm">Mano de Obra Directa:</Text>
                <Text fw={600}>{formatCurrency(calculos.costoMOD)}</Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm">Materiales Directos:</Text>
                <Text fw={600}>
                  {formatCurrency(calculos.totalMaterialesDirectos)}
                </Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm" fw={600}>
                  Costos Primos:
                </Text>
                <Text fw={700} c="blue">
                  {formatCurrency(calculos.costosPrimos)}
                </Text>
              </Group>

              <Divider my="xs" />

              <Group justify="space-between">
                <Text size="sm">CIF Aplicados:</Text>
                <Text fw={600}>{formatCurrency(calculos.totalCIF)}</Text>
              </Group>

              <Divider my="xs" />

              <Group justify="space-between">
                <Text size="sm" fw={700}>
                  Costo Total Producción:
                </Text>
                <Text size="lg" fw={700} c="blue">
                  {formatCurrency(calculos.costoTotalProduccion)}
                </Text>
              </Group>

              <Divider
                label="Gastos del Período"
                labelPosition="center"
                my="sm"
              />

              <Group justify="space-between">
                <Text size="sm">Gastos de Administración:</Text>
                <Text fw={600}>
                  {formatCurrency(calculos.totalGastosAdministracion)}
                </Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm">Gastos de Venta:</Text>
                <Text fw={600}>
                  {formatCurrency(calculos.totalGastosVenta)}
                </Text>
              </Group>

              <Divider my="xs" />

              <Group justify="space-between">
                <Text size="sm" fw={700}>
                  Costo Total del Proyecto:
                </Text>
                <Text size="lg" fw={700} c="indigo">
                  {formatCurrency(calculos.costoTotalProyecto)}
                </Text>
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="green">
                  Margen {calculos.margenPorcentaje}%:
                </Text>
                <Text c="green" fw={600}>
                  {formatCurrency(calculos.margenUtilidad)}
                </Text>
              </Group>

              <Divider my="xs" />

              <Group justify="space-between">
                <Text fw={700}>Precio de Venta:</Text>
                <Text size="xl" fw={700} c="green">
                  {formatCurrency(calculos.precioVenta)}
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Paper shadow="sm" p="lg" withBorder>
              <Group justify="space-between" mb="md">
                <div>
                  <Title order={4} size="h5">
                    Materiales y Servicios Directos
                  </Title>
                  <Text size="xs" c="dimmed">
                    Costos directamente atribuibles al proyecto
                  </Text>
                </div>
                <Button
                  size="xs"
                  leftSection={<IconPlus size={16} />}
                  onClick={agregarCostoDirecto}
                >
                  Agregar
                </Button>
              </Group>
              <Container fluid maw="100%" style={{ overflowX: "auto" }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Concepto</Table.Th>
                      <Table.Th>Monto (USD)</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {costosDirectos.map((item, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td>
                          <TextInput
                            value={item.nombre}
                            onChange={(e) =>
                              actualizarCostoDirecto(
                                idx,
                                "nombre",
                                e.target.value,
                              )
                            }
                            size="xs"
                            variant="unstyled"
                          />
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            value={item.monto}
                            onChange={(val) =>
                              actualizarCostoDirecto(idx, "monto", Number(val))
                            }
                            min={0}
                            step={10}
                            prefix="$"
                            size="xs"
                            w={120}
                          />
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => eliminarCostoDirecto(idx)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    <Table.Tr>
                      <Table.Td>
                        <Text fw={700}>Total Materiales Directos</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} c="blue">
                          {formatCurrency(calculos.totalMaterialesDirectos)}
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
                <div>
                  <Title order={4} size="h5">
                    Costos Indirectos de Fabricación (CIF)
                  </Title>
                  <Text size="xs" c="dimmed">
                    Se aplican por hora trabajada del proyecto
                  </Text>
                </div>
                <Button
                  size="xs"
                  leftSection={<IconPlus size={16} />}
                  onClick={agregarCIF}
                >
                  Agregar
                </Button>
              </Group>
              <Container fluid maw="100%" style={{ overflowX: "auto" }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Concepto</Table.Th>
                      <Table.Th>Tasa/Hora</Table.Th>
                      <Table.Th>Monto Total</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {costosIndirectos.map((item, idx) => {
                      const montoTotal =
                        calculos.horasTotales * item.tasaPorHora;
                      return (
                        <Table.Tr key={idx}>
                          <Table.Td>
                            <TextInput
                              value={item.nombre}
                              onChange={(e) =>
                                actualizarCIF(idx, "nombre", e.target.value)
                              }
                              size="xs"
                              variant="unstyled"
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              value={item.tasaPorHora}
                              onChange={(val) =>
                                actualizarCIF(idx, "tasaPorHora", Number(val))
                              }
                              min={0}
                              step={0.1}
                              prefix="$"
                              decimalScale={2}
                              size="xs"
                              w={100}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={500}>
                              {formatCurrency(montoTotal)}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() => eliminarCIF(idx)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                    <Table.Tr>
                      <Table.Td colSpan={2}>
                        <Text fw={700}>Total CIF Aplicados</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} c="blue">
                          {formatCurrency(calculos.totalCIF)}
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
                <div>
                  <Title order={4} size="h5">
                    Gastos de Administración
                  </Title>
                  <Text size="xs" c="dimmed">
                    Gastos generales del período no relacionados con producción
                  </Text>
                </div>
                <Button
                  size="xs"
                  leftSection={<IconPlus size={16} />}
                  onClick={agregarGastoAdmin}
                >
                  Agregar
                </Button>
              </Group>
              <Container fluid maw="100%" style={{ overflowX: "auto" }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Concepto</Table.Th>
                      <Table.Th>Monto (USD)</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {gastosAdministracion.map((item, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td>
                          <TextInput
                            value={item.nombre}
                            onChange={(e) =>
                              actualizarGastoAdmin(
                                idx,
                                "nombre",
                                e.target.value,
                              )
                            }
                            size="xs"
                            variant="unstyled"
                          />
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            value={item.monto}
                            onChange={(val) =>
                              actualizarGastoAdmin(idx, "monto", Number(val))
                            }
                            min={0}
                            step={10}
                            prefix="$"
                            size="xs"
                            w={120}
                          />
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => eliminarGastoAdmin(idx)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    <Table.Tr>
                      <Table.Td>
                        <Text fw={700}>Total Gastos de Administración</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} c="orange">
                          {formatCurrency(calculos.totalGastosAdministracion)}
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
                <div>
                  <Title order={4} size="h5">
                    Gastos de Venta
                  </Title>
                  <Text size="xs" c="dimmed">
                    Costos de comercialización y distribución
                  </Text>
                </div>
                <Button
                  size="xs"
                  leftSection={<IconPlus size={16} />}
                  onClick={agregarGastoVenta}
                >
                  Agregar
                </Button>
              </Group>
              <Container fluid maw="100%" style={{ overflowX: "auto" }}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Concepto</Table.Th>
                      <Table.Th>Monto (USD)</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {gastosVenta.map((item, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td>
                          <TextInput
                            value={item.nombre}
                            onChange={(e) =>
                              actualizarGastoVenta(
                                idx,
                                "nombre",
                                e.target.value,
                              )
                            }
                            size="xs"
                            variant="unstyled"
                          />
                        </Table.Td>
                        <Table.Td>
                          <NumberInput
                            value={item.monto}
                            onChange={(val) =>
                              actualizarGastoVenta(idx, "monto", Number(val))
                            }
                            min={0}
                            step={10}
                            prefix="$"
                            size="xs"
                            w={120}
                          />
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => eliminarGastoVenta(idx)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                    <Table.Tr>
                      <Table.Td>
                        <Text fw={700}>Total Gastos de Venta</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} c="grape">
                          {formatCurrency(calculos.totalGastosVenta)}
                        </Text>
                      </Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Container>
            </Paper>

            <Paper shadow="xs" p="md" bg="gray.0" withBorder>
              <Title order={5} size="h6" mb="sm">
                💡 Estructura de Costos
              </Title>
              <Stack gap="xs">
                <Text size="sm">
                  <strong>Costos Primos:</strong> MOD + Materiales Directos
                  (costos directamente atribuibles al proyecto)
                </Text>
                <Text size="sm">
                  <strong>CIF:</strong> Costos indirectos de fabricación que se
                  asignan al proyecto basados en horas trabajadas
                </Text>
                <Text size="sm">
                  <strong>Costo de Producción:</strong> Costos Primos + CIF
                  Aplicados
                </Text>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProjectCostCalculator;
