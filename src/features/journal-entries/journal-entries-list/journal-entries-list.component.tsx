import { useEffect, useState } from "react";
import z from "zod";
import {
  getPeriodsTransaction,
  periodsSchema,
} from "../register-journal-entry/register-journal-entry.transaction";
import { Container, Title, Select, Stack } from "@mantine/core";
import type { Account } from "../../accounts/account-list/account-list.component";
import { getAccountsTransaction } from "../../accounts/account-list/get-accounts.transaction";
import { JournalEntriesListEntry } from "./journal-entries-list-entry.component";

export default function JournalEntriesList() {
  const [periods, setPeriods] = useState<z.infer<typeof periodsSchema>>([]);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(
    null,
  );
  const [accountData, setAccountData] = useState<Account[]>([]);

  useEffect(() => {
    getAccountsTransaction()
      .then(({ accounts: accountData }) => {
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

        setAccountData(accounts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getPeriodsTransaction()
      .then(({ periods }) => {
        setPeriods(periods);

        setSelectedPeriodIndex(
          periods.findIndex((period) => period.endDate === null),
        );
      })
      .catch((e) => alert(e));
  }, []);

  if (selectedPeriodIndex === null) return null;

  const entries = periods[selectedPeriodIndex].entries;

  return (
    <Container fluid>
      <Stack align="center">
        <Select
          data={periods.map((period, index) => ({
            value: index.toString(),
            label: period.name,
          }))}
          defaultValue={selectedPeriodIndex.toString()}
          onChange={(newValue) => setSelectedPeriodIndex(Number(newValue))}
        />
      </Stack>
      <Title order={2}>
        {periods[selectedPeriodIndex].name}
        {periods[selectedPeriodIndex].endDate === null ? "" : " (Cerrado)"}
      </Title>
      <Stack mt="lg" gap="md">
        {entries.map((entry, index) => (
          <JournalEntriesListEntry
            key={index}
            entry={entry}
            accountData={accountData}
          />
        ))}
      </Stack>
    </Container>
  );
}
