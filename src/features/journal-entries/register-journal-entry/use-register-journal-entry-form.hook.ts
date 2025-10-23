import { useCallback, useEffect, useReducer, useState } from "react";
import { getAccountsTransaction } from "../../accounts/account-list/get-accounts.transaction";
import { registerJournalEntry } from "./register-journal-entry.transaction";
import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";

type AccountDetail = {
  id: string;
  name: string;
};

type EntryDetail = {
  id: string;
  accountId: string | null;
  debit: number;
  credit: number;
};

type ReducerAction =
  | { type: "clear-entries" }
  | { type: "new-entry"; entryId: string }
  | { type: "delete-entry"; entryId: string }
  | { type: "update-debit"; entryId: string; debit: number }
  | { type: "update-credit"; entryId: string; credit: number }
  | {
      type: "update-account";
      entryId: string;
      accountId: string | null;
    };

function reducer(state: EntryDetail[], action: ReducerAction) {
  switch (action.type) {
    case "clear-entries":
      return [
        { id: crypto.randomUUID(), accountId: null, debit: 0, credit: 0 },
        { id: crypto.randomUUID(), accountId: null, debit: 0, credit: 0 },
      ];
    case "new-entry":
      return [
        ...state,
        {
          id: action.entryId,
          accountId: null,
          debit: 0,
          credit: 0,
        },
      ];
    case "delete-entry":
      return state.filter((entry) => entry.id !== action.entryId);
    case "update-debit": {
      return state.map((entry) =>
        entry.id === action.entryId ? { ...entry, debit: action.debit } : entry,
      );
    }
    case "update-credit": {
      return state.map((entry) =>
        entry.id === action.entryId
          ? { ...entry, credit: action.credit }
          : entry,
      );
    }
    case "update-account": {
      return state.map((entry) =>
        entry.id === action.entryId
          ? { ...entry, accountId: action.accountId }
          : entry,
      );
    }
  }
}

export function useRegisterJournalEntryForm() {
  const [entries, dispatch] = useReducer(reducer, [
    { id: crypto.randomUUID(), accountId: null, debit: 0, credit: 0 },
    { id: crypto.randomUUID(), accountId: null, debit: 0, credit: 0 },
  ]);
  const [description, setDescription] = useState("");
  const [accounts, setAccounts] = useState<AccountDetail[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAccountsTransaction().then(({ accounts }) => {
      const enabledAccounts: { id: string; name: string }[] = [];

      for (const accountType in accounts) {
        for (const accountCategory in accounts[
          accountType as keyof typeof accounts
        ]) {
          for (const accountId in accounts[
            accountType as keyof typeof accounts
          ][accountCategory]) {
            const account =
              accounts[accountType as keyof typeof accounts][accountCategory][
                accountId
              ];

            if (account.enabled) {
              enabledAccounts.push({ id: accountId, name: account.name });
            }
          }
        }
      }

      setAccounts(enabledAccounts);
    });
  }, []);

  const insertNewEntry = useCallback(() => {
    dispatch({ type: "new-entry", entryId: crypto.randomUUID() });
  }, []);

  const deleteEntry = useCallback((entryId: string) => {
    dispatch({ type: "delete-entry", entryId });
  }, []);

  const updateDebit = useCallback((entryId: string, debit: number) => {
    dispatch({ type: "update-debit", entryId, debit });
  }, []);

  const updateCredit = useCallback((entryId: string, credit: number) => {
    dispatch({ type: "update-credit", entryId, credit });
  }, []);

  const updateAccount = useCallback(
    (entryId: string, accountId: string | null) => {
      dispatch({ type: "update-account", entryId, accountId });
    },
    [],
  );

  function updateDescription(value: string) {
    setDescription(value);
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (description.trim() === "") {
      alert("La descripción de la transacción es obligatoria.");
      return;
    }

    const hasUnselectedAccount = entries.some(
      (entry) => entry.accountId === null,
    );

    if (hasUnselectedAccount) {
      alert("Todas las entradas deben tener una cuenta seleccionada.");
      return;
    }

    const isBalanced =
      entries.reduce((sum, entry) => sum + entry.debit, 0) ===
      entries.reduce((sum, entry) => sum + entry.credit, 0);

    if (!isBalanced) {
      alert("La transacción no está balanceada.");
      return;
    }

    const balanceIsZero = entries.every(
      (entry) => entry.debit === 0 && entry.credit === 0,
    );

    if (balanceIsZero) {
      alert(
        "La transacción no puede tener todos los débitos y créditos en cero.",
      );
      return;
    }

    try {
      await registerJournalEntry({ description, entries });
    } catch (error) {
      console.error("Error registering journal entry:", error);
      return;
    }

    notifications.show({
      title: "Transacción actualizada",
      message: "Transacción añadida correctamente",
      color: "green",
      autoClose: 1200,
    });
    setTimeout(() => navigate(0), 2000);
  }

  return {
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
  };
}
