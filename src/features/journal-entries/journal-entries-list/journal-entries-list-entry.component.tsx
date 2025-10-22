import { z } from "zod";
import {
  Container,
  Table,
  TableThead,
  TableTh,
  TableTbody,
  TableTr,
  Paper,
  Text,
  Group,
} from "@mantine/core";
import type { Account } from "../../accounts/account-list/account-list.component";
import type { periodsSchema } from "../register-journal-entry/register-journal-entry.transaction";
import { JournalEntriesListEntryDetail } from "./journal-entries-list-entry-detail.component";

export type JournalEntriesListEntryProps = {
  accountData: Account[];
  entry: z.infer<typeof periodsSchema>[number]["entries"][number];
};

export function JournalEntriesListEntry({
  accountData,
  entry,
}: JournalEntriesListEntryProps) {
  return (
    <Paper withBorder p="md">
      <Container fluid>
        <Group justify="space-between">
          <Text fs="italic">{entry.description}</Text>
          {entry.isAdjustment && <Text fw="bold">Ajuste</Text>}
          <Text>{new Date(entry.date).toLocaleDateString()}</Text>
        </Group>
        <Table mt="sm">
          <TableThead>
            <TableTr>
              <TableTh>Cuenta</TableTh>
              <TableTh>Debe</TableTh>
              <TableTh>Haber</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {entry.detail.map((detail, index) => (
              <JournalEntriesListEntryDetail
                detail={detail}
                key={index}
                accountData={accountData}
              />
            ))}
          </TableTbody>
        </Table>
      </Container>
    </Paper>
  );
}
