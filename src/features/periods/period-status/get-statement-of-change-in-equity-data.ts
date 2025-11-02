import { z } from "zod";
import type { Account } from "../../accounts/account-list/account-list.component";
import { periodsSchema } from "../../journal-entries/register-journal-entry/register-journal-entry.transaction";

export function getStatementOfChangesInEquityData(
  period: z.infer<typeof periodsSchema>[number],
  accountData: Account[],
  netProfit: number,
) {
  const entries = period.entries;

  const calculateAccountBalance = (accountId: string) => {
    const totalDebit = entries
      .flatMap(({ detail }) => detail.filter((d) => d.accountId === accountId))
      .reduce((sum, d) => sum + d.debit, 0);
    const totalCredit = entries
      .flatMap(({ detail }) => detail.filter((d) => d.accountId === accountId))
      .reduce((sum, d) => sum + d.credit, 0);

    return totalCredit - totalDebit;
  };

  const utilidadRetenidaAccount = accountData.find((a) => a.id === "3.1.02");
  const reservasLegalesAccount = accountData.find((a) => a.id === "3.1.03");
  const utilidadEjercicioAccount = accountData.find((a) => a.id === "3.1.04");

  const beginningCapitalSocial = calculateAccountBalance("3.1.01");
  const beginningUtilidadRetenida = calculateAccountBalance("3.1.02");
  const beginningReservasLegales = calculateAccountBalance("3.1.03");
  const beginningUtilidadEjercicio = calculateAccountBalance("3.1.04");

  const beginningTotalEquity =
    beginningCapitalSocial +
    beginningUtilidadRetenida +
    beginningReservasLegales +
    beginningUtilidadEjercicio;

  const distributionEntry: z.infer<typeof periodsSchema>[number]["entries"][0] =
    {
      date: new Date().toISOString(),
      description: "Distribución de Utilidades del Ejercicio Anterior",
      detail: [],
      isAdjustment: true,
    };

  if (beginningUtilidadEjercicio > 0 && utilidadEjercicioAccount) {
    distributionEntry.detail.push({
      id: crypto.randomUUID(),
      accountId: utilidadEjercicioAccount.id,
      debit: beginningUtilidadEjercicio,
      credit: 0,
    });

    const currentReservasLegales = beginningReservasLegales;
    const maxReservasLegales = beginningCapitalSocial * 0.2;
    const remainingReserveNeeded = maxReservasLegales - currentReservasLegales;

    let reservaLegalAmount = 0;
    if (remainingReserveNeeded > 0) {
      const minimumReserve = beginningUtilidadEjercicio * 0.05;
      reservaLegalAmount = Math.min(minimumReserve, remainingReserveNeeded);
    }

    if (reservaLegalAmount > 0 && reservasLegalesAccount) {
      distributionEntry.detail.push({
        id: crypto.randomUUID(),
        accountId: reservasLegalesAccount.id,
        debit: 0,
        credit: reservaLegalAmount,
      });
    }

    const utilidadRetenidaAmount =
      beginningUtilidadEjercicio - reservaLegalAmount;
    if (utilidadRetenidaAmount > 0 && utilidadRetenidaAccount) {
      distributionEntry.detail.push({
        id: crypto.randomUUID(),
        accountId: utilidadRetenidaAccount.id,
        debit: 0,
        credit: utilidadRetenidaAmount,
      });
    }

    if (distributionEntry.detail.length > 0) {
      period.entries.push(distributionEntry);
    }
  }

  const endingCapitalSocial = beginningCapitalSocial;
  const endingReservasLegales =
    beginningReservasLegales +
    (distributionEntry.detail.find((d) => d.accountId === "3.1.03")?.credit ||
      0);
  const endingUtilidadRetenida =
    beginningUtilidadRetenida +
    (distributionEntry.detail.find((d) => d.accountId === "3.1.02")?.credit ||
      0);
  const endingUtilidadEjercicio = netProfit;

  const endingTotalEquity =
    endingCapitalSocial +
    endingUtilidadRetenida +
    endingReservasLegales +
    endingUtilidadEjercicio;

  return {
    beginningCapitalSocial,
    beginningUtilidadRetenida,
    beginningReservasLegales,
    beginningUtilidadEjercicio,
    beginningTotalEquity,
    reservaLegalAmount:
      distributionEntry.detail.find((d) => d.accountId === "3.1.03")?.credit ||
      0,
    utilidadRetenidaMovement:
      distributionEntry.detail.find((d) => d.accountId === "3.1.02")?.credit ||
      0,
    currentPeriodProfit: netProfit,
    endingCapitalSocial,
    endingUtilidadRetenida,
    endingReservasLegales,
    endingUtilidadEjercicio,
    endingTotalEquity,
    maxReservasLegales: beginningCapitalSocial * 0.2,
    reservasLegalesPercentage:
      beginningCapitalSocial > 0
        ? (endingReservasLegales / beginningCapitalSocial) * 100
        : 0,
  };
}
