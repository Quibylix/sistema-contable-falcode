import { checkAuthTransaction } from "../../auth/check-auth.transaction";
import { getPeriodsTransaction } from "../../journal-entries/register-journal-entry/register-journal-entry.transaction";

export async function changePeriodStatus(newPeriodName?: string) {
  await checkAuthTransaction();

  const { periods } = await getPeriodsTransaction();

  const activePeriod = periods.find((period) => period.endDate === null);
  const isActivePeriodInAdjustmentMode = activePeriod?.isAdjustmentPeriod;

  const updatedPeriods = periods.map((period) => {
    if (period === activePeriod) {
      if (isActivePeriodInAdjustmentMode) {
        return {
          ...period,
          endDate: new Date().toISOString(),
        };
      } else {
        return {
          ...period,
          isAdjustmentPeriod: true,
        };
      }
    }
    return period;
  });

  if (isActivePeriodInAdjustmentMode && newPeriodName) {
    updatedPeriods.push({
      name: newPeriodName,
      startDate: new Date().toISOString(),
      endDate: null,
      isAdjustmentPeriod: false,
      entries: [],
    });
  }

  localStorage.setItem("periods", JSON.stringify(updatedPeriods));
}
