import { z } from "zod";
import { TableTd, TableTr, Select, NumberInput } from "@mantine/core";
import type { Account } from "../../accounts/account-list/account-list.component";
import type { periodsSchema } from "../register-journal-entry/register-journal-entry.transaction";

export type JournalEntriesListEntryDetailProps = {
  accountData: Account[];
  detail: z.infer<
    typeof periodsSchema
  >[number]["entries"][number]["detail"][number];
};

export function JournalEntriesListEntryDetail({
  accountData,
  detail,
}: JournalEntriesListEntryDetailProps) {
  return (
    <TableTr>
      <TableTd>
        <Select
          variant="unstyled"
          data={accountData.map((a) => ({
            value: a.id,
            label: a.name,
          }))}
          readOnly
          value={detail.accountId}
          required
        />
      </TableTd>
      <TableTd>
        <NumberInput
          variant="unstyled"
          placeholder="0.00"
          value={detail.debit}
          readOnly
          min={0}
          step={0.01}
          decimalScale={2}
          fixedDecimalScale
        />
      </TableTd>
      <TableTd>
        <NumberInput
          variant="unstyled"
          placeholder="0.00"
          value={detail.credit}
          readOnly
          min={0}
          step={0.01}
          decimalScale={2}
          fixedDecimalScale
        />
      </TableTd>
    </TableTr>
  );
}
