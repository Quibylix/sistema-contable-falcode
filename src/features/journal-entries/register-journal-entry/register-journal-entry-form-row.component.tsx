import { Button, NumberInput, Select, TableTd, TableTr } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { memo } from "react";

export type RegisterJournalEntryFormEntryProps = {
  id: number;
  accountId: string | null;
  debit: number;
  credit: number;
  accounts: {
    id: string;
    name: string;
  }[];
  updateAccount: (id: number, accountId: string | null) => void;
  updateDebit: (id: number, debit: number) => void;
  updateCredit: (id: number, credit: number) => void;
  deleteEntry: (id: number) => void;
};

export const RegisterJournalEntryFormEntry = memo(
  function RegisterJournalEntryFormEntry({
    id,
    accountId,
    debit,
    credit,
    accounts,
    updateAccount,
    updateDebit,
    updateCredit,
    deleteEntry,
  }: RegisterJournalEntryFormEntryProps) {
    return (
      <TableTr>
        <TableTd>
          <Select
            searchable
            name={`account-${id}`}
            data={accounts.map((a) => ({
              value: a.id,
              label: a.name,
            }))}
            onChange={(value) => updateAccount(id, value)}
            value={accountId}
            placeholder="Selecciona una cuenta"
            required
          />
        </TableTd>
        <TableTd>
          <NumberInput
            name={`debit-${id}`}
            placeholder="0.00"
            value={debit}
            onChange={(value) => updateDebit(id, Number(value))}
            min={0}
            step={0.01}
            decimalScale={2}
            fixedDecimalScale
          />
        </TableTd>
        <TableTd>
          <NumberInput
            name={`credit-${id}`}
            placeholder="0.00"
            value={credit}
            onChange={(value) => updateCredit(id, Number(value))}
            min={0}
            step={0.01}
            decimalScale={2}
            fixedDecimalScale
          />
        </TableTd>
        <TableTd align="center">
          <Button
            bg="red"
            h="max-content"
            p="5px"
            size="md"
            onClick={() => deleteEntry(id)}
          >
            <IconTrash width="1em" />
          </Button>
        </TableTd>
      </TableTr>
    );
  },
);
