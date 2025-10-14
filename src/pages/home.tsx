import { Container, Image, Text, Title } from "@mantine/core";
import { useEffect } from "react";
import { checkAuthTransaction } from "../features/auth/check-auth.transaction";
import LoginForm from "../features/auth/login/login-form.component";

export default function HomePage() {
  useEffect(() => {
    checkAuthTransaction()
      .then(() => {
        location.href = "/accounts";
      })
      .catch(() => {
        console.log("No session found");
      });
  }, []);

  return (
    <Container size="xs">
      <Image
        src="/falcode.jpeg"
        radius="md"
        alt="Logo Falcode"
        w={150}
        mb="md"
        mt="xl"
        mx="auto"
      />
      <Title order={1} ta="center" mt="md" mb="xl">
        Sistema Contable para Falcode
      </Title>
      <LoginForm />
      <Text mt={10} ta="center">
        Usuario demo: <b>admin</b> / Contraseña: <b>1234</b>
      </Text>
    </Container>
  );
}
