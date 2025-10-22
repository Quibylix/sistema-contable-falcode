import z from "zod";
import { checkAuthTransaction } from "../../auth/check-auth.transaction";
import defaultPeriods from "../periods.json";

type EntryDetail = {
  id: number;
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
    entries: z.array(
      z.object({
        isAdjustment: z.boolean().optional(),
        date: z.iso.datetime(),
        description: z.string(),
        detail: z.array(
          z.object({
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
  } catch {
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
        accountId,
        debit,
        credit,
      })),
  };

  currentPeriod.entries.push(newEntry);

  localStorage.setItem("periods", JSON.stringify(periods));

  console.log("Journal entry registered successfully:", newEntry);
}
