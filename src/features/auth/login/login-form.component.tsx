import { Button, Paper, PasswordInput, TextInput } from "@mantine/core";
import { loginTransaction } from "./login.transaction";

export default function LoginForm() {
  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.target as typeof e.target & {
      user: { value: string };
      pass: { value: string };
    };

    try {
      await loginTransaction({
        username: f.user.value,
        password: f.pass.value,
      });
    } catch (error) {
      alert("Credenciales inválidas");
      console.error(error);
      return;
    }

    location.href = "/accounts";
  }

  return (
    <Paper component="form" withBorder p="md" onSubmit={submitHandler}>
      <TextInput name="user" label="Usuario" defaultValue="admin" required />
      <PasswordInput
        mt="sm"
        name="pass"
        label="Contraseña"
        defaultValue="1234"
        required
      />
      <Button mt="xl" type="submit" fullWidth>
        Iniciar sesión
      </Button>
    </Paper>
  );
}
