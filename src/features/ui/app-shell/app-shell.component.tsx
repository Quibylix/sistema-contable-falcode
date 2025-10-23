import { useDisclosure } from "@mantine/hooks";
import classes from "./app-shell.module.css";
import {
  AppShell as MantineAppShell,
  Group,
  Burger,
  Anchor,
  Image,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { checkAuthTransaction } from "../../auth/check-auth.transaction";
import { Outlet } from "react-router";
import { ChangePeriodStatus } from "../../periods/period-status/change-period-status.component";

export function AppShell() {
  const [authenticated, setAuthenticated] = useState(false);
  const [links, setLinks] = useState<{ label: string; href: string }[]>([]);

  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    checkAuthTransaction()
      .then(() => {
        setAuthenticated(true);
        setLinks([
          { label: "Cuentas", href: "/accounts" },
          { label: "Transacciones", href: "/journal-entries" },
          { label: "Libro mayor", href: "/ledger" },
        ]);
      })
      .catch(() => {
        setAuthenticated(false);
        setLinks([{ label: "Login", href: "/" }]);
      });
  }, []);

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image src="/falcode.jpeg" alt="Logo Falcode" w={45} radius="md" />
          <Group>
            <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
              {links.map((link) => (
                <Anchor
                  key={link.label}
                  className={classes.link}
                  href={link.href}
                >
                  {link.label}
                </Anchor>
              ))}
            </Group>
            {authenticated && <ChangePeriodStatus />}
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar py="md" px={4}>
        {links.map((link) => (
          <Anchor
            key={link.label}
            className={classes.link}
            href={link.href}
            mb={4}
          >
            {link.label}
          </Anchor>
        ))}
        {authenticated && <ChangePeriodStatus />}
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
