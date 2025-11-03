import type z from "zod";
import type { Account } from "../../accounts/account-list/account-list.component";
import type { periodsSchema } from "../../journal-entries/register-journal-entry/register-journal-entry.transaction";

export function getBalanceSheet(
  accountData: Account[],
  entries: z.infer<typeof periodsSchema>[number]["entries"],
) {
  const calculateAccountBalance = (accountId: string) => {
    const totalDebit = entries
      .flatMap(({ detail }) => detail.filter((d) => d.accountId === accountId))
      .reduce((sum, d) => sum + d.debit, 0);
    const totalCredit = entries
      .flatMap(({ detail }) => detail.filter((d) => d.accountId === accountId))
      .reduce((sum, d) => sum + d.credit, 0);

    const account = accountData.find((a) => a.id === accountId);

    // Assets: Debit - Credit
    if (account?.category === "Activo") {
      return totalDebit - totalCredit;
    }
    // Liabilities and Equity: Credit - Debit
    else if (
      account?.category === "Pasivo" ||
      account?.category === "Patrimonio"
    ) {
      return totalCredit - totalDebit;
    }

    return 0;
  };

  // CURRENT ASSETS (1.1.x)
  const currentAssetAccounts = accountData
    .filter((account) => account.id.startsWith("1.1."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalCurrentAssets = currentAssetAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  // NON-CURRENT ASSETS (1.2.x)
  const nonCurrentAssetAccounts = accountData
    .filter((account) => account.id.startsWith("1.2."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalNonCurrentAssets = nonCurrentAssetAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  // TOTAL ASSETS
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  // CURRENT LIABILITIES (2.1.x)
  const currentLiabilityAccounts = accountData
    .filter((account) => account.id.startsWith("2.1."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalCurrentLiabilities = currentLiabilityAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  // NON-CURRENT LIABILITIES (2.2.x)
  const nonCurrentLiabilityAccounts = accountData
    .filter((account) => account.id.startsWith("2.2."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalNonCurrentLiabilities = nonCurrentLiabilityAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  // TOTAL LIABILITIES
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  // EQUITY (3.1.x)
  const equityAccounts = accountData
    .filter((account) => account.id.startsWith("3.1."))
    .map((account) => ({
      id: account.id,
      name: account.name,
      balance: calculateAccountBalance(account.id),
    }))
    .filter((data) => data.balance !== 0);

  const totalEquity = equityAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // TOTAL LIABILITIES + EQUITY
  const totalLiabilitiesEquity = totalLiabilities + totalEquity;

  // Difference (should be 0 in a balanced sheet)
  const difference = totalAssets - totalLiabilitiesEquity;

  return {
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
  };
}
