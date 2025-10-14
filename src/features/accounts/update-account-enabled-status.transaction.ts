import { checkAuthTransaction } from "../auth/check-auth.transaction";
import { getAccountsTransaction } from "./account-list/get-accounts.transaction";

export async function updateAccountEnabledStatusTransaction(
  accountId: string,
  enabled: boolean,
) {
  await checkAuthTransaction();

  const { accounts } = await getAccountsTransaction();

  for (const accountType in accounts) {
    for (const accountCategory in accounts[
      accountType as keyof typeof accounts
    ]) {
      if (accounts[accountType][accountCategory][accountId]) {
        accounts[accountType][accountCategory][accountId].enabled = enabled;
      }
    }
  }

  localStorage.setItem("accounts", JSON.stringify(accounts));
}

