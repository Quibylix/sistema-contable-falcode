import z from "zod";
import { checkAuthTransaction } from "../../auth/check-auth.transaction";
import defaultPeriods from "../periods.json";

type EntryDetail = {
  id: string;
  accountId: string | null;
  debit: number;
  credit: number;
};

export const periodsSchema = z.array(
  z.object({
    name: z.string(),
    isAdjustmentPeriod: z.boolean(),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime().nullable(),
    balanceSheet: z
      .object({
        currentAssetAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalCurrentAssets: z.number(),
        nonCurrentAssetAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalNonCurrentAssets: z.number(),
        totalAssets: z.number(),
        currentLiabilityAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalCurrentLiabilities: z.number(),
        nonCurrentLiabilityAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalNonCurrentLiabilities: z.number(),
        totalLiabilities: z.number(),
        equityAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalEquity: z.number(),
        totalLiabilitiesEquity: z.number(),
        difference: z.number(),
      })
      .optional(),
    statementOfChangesInEquity: z
      .object({
        beginningCapitalSocial: z.number(),
        beginningUtilidadRetenida: z.number(),
        beginningReservasLegales: z.number(),
        beginningUtilidadEjercicio: z.number(),
        beginningTotalEquity: z.number(),
        reservaLegalAmount: z.number(),
        utilidadRetenidaMovement: z.number(),
        currentPeriodProfit: z.number(),
        endingCapitalSocial: z.number(),
        endingUtilidadRetenida: z.number(),
        endingReservasLegales: z.number(),
        endingUtilidadEjercicio: z.number(),
        endingTotalEquity: z.number(),
        maxReservasLegales: z.number(),
        reservasLegalesPercentage: z.number(),
      })
      .optional(),
    incomeStatement: z
      .object({
        salesAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalSales: z.number(),
        salesCostAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalSalesCost: z.number(),
        grossProfit: z.number(),
        operatingExpensesAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalOperatingExpenses: z.number(),
        operatingProfit: z.number(),
        financialExpensesAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalFinancialExpenses: z.number(),
        otherIncomeAccounts: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            balance: z.number(),
          }),
        ),
        totalOtherIncome: z.number(),
        netProfit: z.number(),
      })
      .optional(),
    entries: z.array(
      z.object({
        isAdjustment: z.boolean().optional(),
        date: z.iso.datetime(),
        description: z.string(),
        detail: z.array(
          z.object({
            id: z.string(),
            accountId: z.string().nullable(),
            debit: z.number().nonnegative(),
            credit: z.number().nonnegative(),
          }),
        ),
      }),
    ),
  }),
);

export async function getPeriodsTransaction() {
  await checkAuthTransaction();

  let periods: z.infer<typeof periodsSchema>;
  try {
    periods = periodsSchema.parse(
      JSON.parse(localStorage.getItem("periods") || "null"),
    );
  } catch (e) {
    console.error(e);
    localStorage.setItem("periods", JSON.stringify(defaultPeriods));
    periods = defaultPeriods;
  }

  return { periods };
}

export async function registerJournalEntry({
  description,
  entries,
}: {
  description: string;
  entries: EntryDetail[];
}) {
  const { periods } = await getPeriodsTransaction();

  const currentPeriod = periods.find((period) => period.endDate === null);

  if (!currentPeriod) {
    throw new Error("No active accounting period found.");
  }

  const newEntry = {
    date: new Date().toISOString(),
    isAdjustement: currentPeriod.isAdjustmentPeriod,
    description,
    detail: entries
      .filter(({ debit, credit }) => debit > 0 || credit > 0)
      .map(({ accountId, debit, credit }) => ({
        id: crypto.randomUUID(),
        accountId,
        debit,
        credit,
      })),
  };

  currentPeriod.entries.push(newEntry);

  localStorage.setItem("periods", JSON.stringify(periods));

  console.log("Journal entry registered successfully:", newEntry);
}
