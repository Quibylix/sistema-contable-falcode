import z from "zod";
import { checkAuthTransaction } from "../../auth/check-auth.transaction";
import defaultAccounts from "./accounts.json";

const accountsSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.record(
      z.string(),
      z.object({
        name: z.string(),
        type: z.string(),
        enabled: z.boolean(),
      }),
    ),
  ),
);

export async function getAccountsTransaction() {
  await checkAuthTransaction();

  let accounts: z.infer<typeof accountsSchema>;
  try {
    accounts = accountsSchema.parse(
      JSON.parse(localStorage.getItem("accounts") || "null"),
    );
  } catch {
    localStorage.setItem("accounts", JSON.stringify(defaultAccounts));
    accounts = defaultAccounts;
  }

  return { accounts };
}
