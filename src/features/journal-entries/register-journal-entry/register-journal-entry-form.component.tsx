import { IconPlus } from "@tabler/icons-react";
import {
  Button,
  Paper,
  Table,
  TextInput,
  TableTbody,
  TableThead,
  TableTh,
  TableTr,
} from "@mantine/core";
import { useRegisterJournalEntryForm } from "./use-register-journal-entry-form.hook";
import { RegisterJournalEntryFormEntry } from "./register-journal-entry-form-row.component";

export function RegisterJournalEntryForm() {
  const {
    accounts,
    entries,
    insertNewEntry,
    deleteEntry,
    updateDebit,
    updateCredit,
    updateAccount,
    description,
    updateDescription,
    submitHandler,
  } = useRegisterJournalEntryForm();

  return (
    <Paper component="form" withBorder p="md" onSubmit={submitHandler}>
      <TextInput
        name="description"
        label="Descripción de la transacción"
        placeholder="Compra de materiales"
        value={description}
        onChange={(e) => updateDescription(e.target.value)}
        required
      />
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Cuenta</TableTh>
            <TableTh>Debe</TableTh>
            <TableTh>Haber</TableTh>
            <TableTh ta="center">Acciones</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {entries.map((entry) => (
            <RegisterJournalEntryFormEntry
              key={entry.id}
              id={entry.id}
              accountId={entry.accountId}
              debit={entry.debit}
              credit={entry.credit}
              accounts={accounts}
              updateAccount={updateAccount}
              updateDebit={updateDebit}
              updateCredit={updateCredit}
              deleteEntry={deleteEntry}
            />
          ))}
        </TableTbody>
      </Table>
      <Button
        p="xs"
        size="sm"
        display="block"
        mx="auto"
        onClick={insertNewEntry}
      >
        <IconPlus width="1em" />
      </Button>
      <Button mt="xl" type="submit" fullWidth>
        Registrar transacción
      </Button>
    </Paper>
  );
}
