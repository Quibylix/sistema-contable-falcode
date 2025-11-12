import type z from "zod";
import { checkAuthTransaction } from "../../auth/check-auth.transaction";
import {
  getPeriodsTransaction,
  periodsSchema,
} from "../../journal-entries/register-journal-entry/register-journal-entry.transaction";
import type { Account } from "../../accounts/account-list/account-list.component";
import { getAccountsTransaction } from "../../accounts/account-list/get-accounts.transaction";
import { getStatementOfChangesInEquityData } from "./get-statement-of-change-in-equity-data";
import { getBalanceSheet } from "./get-balance-sheet";

export async function changePeriodStatus(newPeriodName?: string) {
  await checkAuthTransaction();

  const { periods } = await getPeriodsTransaction();

  const activePeriod = periods.find((period) => period.endDate === null);
  const isActivePeriodInAdjustmentMode = activePeriod?.isAdjustmentPeriod;

  if (!activePeriod) return;

  if (!isActivePeriodInAdjustmentMode) {
    activePeriod.isAdjustmentPeriod = true;
  } else if (!newPeriodName) {
    return;
  } else {
    const { accounts: accountData } = await getAccountsTransaction();
    const accounts: Account[] = [];

    Object.entries(accountData).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(
        ([subcategory, accountsInSubcategory]) => {
          Object.entries(accountsInSubcategory).forEach(([id, account]) => {
            accounts.push({
              id,
              category,
              subcategory,
              name: account.name,
              type: account.type,
              enabled: account.enabled,
            });
          });
        },
      );
    });

    const incomeStatementData = getIncomeStatementData(activePeriod, accounts);
    activePeriod.incomeStatement = incomeStatementData;

    const statementsOfChangesInEquity = getStatementOfChangesInEquityData(
      activePeriod,
      accounts,
      incomeStatementData.netProfit,
    );
    activePeriod.statementOfChangesInEquity = statementsOfChangesInEquity;

    const balanceSheet = getBalanceSheet(accounts, activePeriod.entries);
    activePeriod.balanceSheet = balanceSheet;

    activePeriod.endDate = new Date().toISOString();

    const newPeriod = {
      name: newPeriodName,
      startDate: new Date().toISOString(),
      endDate: null,
      isAdjustmentPeriod: false,
      entries: [],
    };

    makeInitialEntry(newPeriod, activePeriod);

    periods.push(newPeriod);
  }

  localStorage.setItem("periods", JSON.stringify(periods));
}

function getIncomeStatementData(
  period: z.infer<typeof periodsSchema>[number],
  accountData: Account[],
) {
  const entries = period.entries;

  const incomeEntry: z.infer<typeof periodsSchema>[number]["entries"][0] = {
    date: new Date().toISOString(),
    description: "Estado de Resultados",
    detail: [],
    isAdjustment: true,
  };
  const netProfitAccount = accountData.find(
    (account) => account.id === "3.1.04",
  );

  const calculateAccountBalance = (accountId: string) => {
    const totalDebit = entries
      .flatMap(({ detail }) => detail.filter((d) => d.accountId === accountId))
      .reduce((sum, d) => sum + d.debit, 0);
    const totalCredit = entries
      .flatMap(({ detail }) => detail.filter((d) => d.accountId === accountId))
      .reduce((sum, d) => sum + d.credit, 0);

    const account = accountData.find((a) => a.id === accountId);
    if (account?.type === "income") {
      return totalCredit - totalDebit;
    } else {
      return totalDebit - totalCredit;
    }
  };

  const salesAccounts = accountData
    .filter((account) => account.id.startsWith("4.1."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);
  const totalSales = salesAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  salesAccounts.forEach((acc) => {
    acc.balance !== 0 &&
      incomeEntry.detail.push({
        id: crypto.randomUUID(),
        accountId: acc.id,
        debit: acc.balance > 0 ? acc.balance : 0,
        credit: acc.balance < 0 ? -acc.balance : 0,
      });
  });

  const salesCostAccounts = accountData
    .filter((account) => account.id.startsWith("5.1."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);
  const totalSalesCost = salesCostAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  salesCostAccounts.forEach((acc) => {
    acc.balance !== 0 &&
      incomeEntry.detail.push({
        id: crypto.randomUUID(),
        accountId: acc.id,
        debit: acc.balance < 0 ? -acc.balance : 0,
        credit: acc.balance > 0 ? acc.balance : 0,
      });
  });

  const grossProfit = totalSales - totalSalesCost;

  const operatingExpensesAccounts = accountData
    .filter(
      (account) =>
        account.id.startsWith("5.2.") ||
        account.id.startsWith("5.3.") ||
        account.id.startsWith("5.4."),
    )
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);
  const totalOperatingExpenses = operatingExpensesAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  operatingExpensesAccounts.forEach((acc) => {
    acc.balance !== 0 &&
      incomeEntry.detail.push({
        id: crypto.randomUUID(),
        accountId: acc.id,
        debit: acc.balance < 0 ? -acc.balance : 0,
        credit: acc.balance > 0 ? acc.balance : 0,
      });
  });

  const operatingProfit = grossProfit - totalOperatingExpenses;

  const financialExpensesAccounts = accountData
    .filter((account) => account.id.startsWith("5.5."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);
  const totalFinancialExpenses = financialExpensesAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  financialExpensesAccounts.forEach((acc) => {
    acc.balance !== 0 &&
      incomeEntry.detail.push({
        id: crypto.randomUUID(),
        accountId: acc.id,
        debit: acc.balance < 0 ? -acc.balance : 0,
        credit: acc.balance > 0 ? acc.balance : 0,
      });
  });

  const otherIncomeAccounts = accountData
    .filter((account) => account.id === "4.1.04")
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);
  const totalOtherIncome = otherIncomeAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  otherIncomeAccounts.forEach((acc) => {
    acc.balance !== 0 &&
      incomeEntry.detail.push({
        id: crypto.randomUUID(),
        accountId: acc.id,
        debit: acc.balance > 0 ? acc.balance : 0,
        credit: acc.balance < 0 ? -acc.balance : 0,
      });
  });

  const netProfit = operatingProfit - totalFinancialExpenses + totalOtherIncome;

  if (netProfitAccount) {
    incomeEntry.detail.push({
      id: crypto.randomUUID(),
      accountId: netProfitAccount.id,
      debit: netProfit < 0 ? -netProfit : 0,
      credit: netProfit > 0 ? netProfit : 0,
    });
  }

  period.entries.push(incomeEntry);

  return {
    salesAccounts,
    totalSales,
    salesCostAccounts,
    totalSalesCost,
    grossProfit,
    operatingExpensesAccounts,
    totalOperatingExpenses,
    operatingProfit,
    financialExpensesAccounts,
    totalFinancialExpenses,
    otherIncomeAccounts,
    totalOtherIncome,
    netProfit,
  };
}

function makeInitialEntry(
  period: z.infer<typeof periodsSchema>[number],
  lastPeriod?: z.infer<typeof periodsSchema>[number],
) {
  const entry = {
    date: new Date().toISOString(),
    description: "Asiento Inicial",
    detail: [] as {
      id: string;
      accountId: string;
      debit: number;
      credit: number;
    }[],
    isAdjustment: false,
  };

  if (!lastPeriod || !lastPeriod.balanceSheet) {
    entry.detail.push({
      id: crypto.randomUUID(),
      accountId: "3.1.01",
      debit: 0,
      credit: 0,
    });
    period.entries.push(entry);
    return;
  }

  const balanceSheet = lastPeriod.balanceSheet;
  const {
    currentAssetAccounts,
    nonCurrentAssetAccounts,
    currentLiabilityAccounts,
    nonCurrentLiabilityAccounts,
    equityAccounts,
  } = balanceSheet;

  [...currentAssetAccounts, ...nonCurrentAssetAccounts].forEach((acc) => {
    if (acc.balance > 0) {
      entry.detail.push({
        id: crypto.randomUUID(),
        accountId: acc.id,
        debit: acc.balance,
        credit: 0,
      });
    }
  });

  [
    ...currentLiabilityAccounts,
    ...nonCurrentLiabilityAccounts,
    ...equityAccounts,
  ].forEach((acc) => {
    if (acc.balance > 0) {
      entry.detail.push({
        id: crypto.randomUUID(),
        accountId: acc.id,
        debit: 0,
        credit: acc.balance,
      });
    }
  });

  period.entries.push(entry);
}
