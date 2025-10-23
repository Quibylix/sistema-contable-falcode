import type z from "zod";
import {
  getPeriodsTransaction,
  type periodsSchema,
} from "../../journal-entries/register-journal-entry/register-journal-entry.transaction";
import { useEffect, useState } from "react";
import { Button, Container, Modal, Paper, TextInput } from "@mantine/core";
import { changePeriodStatus } from "./change-period-status.transaction";
import { useNavigate } from "react-router";

export function ChangePeriodStatus() {
  const [periods, setPeriods] = useState<z.infer<typeof periodsSchema>>([]);
  const [openModal, setModal] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getPeriodsTransaction()
      .then(({ periods }) => {
        setPeriods(periods);
      })
      .catch(() => {});
  }, []);

  const activePeriod = periods.find((period) => period.endDate === null);
  const isActivePeriodInAdjustmentMode = activePeriod?.isAdjustmentPeriod;

  async function clickHandler() {
    setModal(true);
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!activePeriod) return;

    if (!isActivePeriodInAdjustmentMode) {
      await changePeriodStatus();
      navigate(0);
    }

    if (!newPeriodName.trim()) return;

    await changePeriodStatus(newPeriodName);
    navigate(0);
  }

  return (
    <>
      <Button variant="outline" color="red" onClick={clickHandler}>
        {isActivePeriodInAdjustmentMode
          ? "Cerrar periodo"
          : "Entrar en modo de ajuste"}
      </Button>
      <Modal
        opened={openModal}
        onClose={() => setModal(false)}
        title={
          isActivePeriodInAdjustmentMode
            ? "Cerrar periodo"
            : "Entrar en modo de ajuste"
        }
      >
        <Paper
          withBorder={isActivePeriodInAdjustmentMode}
          component="form"
          onSubmit={submitHandler}
        >
          <Container p="md">
            {isActivePeriodInAdjustmentMode && (
              <TextInput
                label="Nombre del nuevo periodo"
                value={newPeriodName}
                required
                onChange={(e) => setNewPeriodName(e.currentTarget.value)}
              />
            )}
            <Button color="red" type="submit" mt="md" fullWidth>
              {isActivePeriodInAdjustmentMode
                ? "Cerrar periodo"
                : "Entrar en modo de ajuste"}
            </Button>
          </Container>
        </Paper>
      </Modal>
    </>
  );
}
