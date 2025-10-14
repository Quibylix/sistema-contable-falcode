export async function loginTransaction({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  if (username === "admin" && password === "1234") {
    localStorage.setItem(
      "session",
      JSON.stringify({ user: "admin", token: "tok_demo" }),
    );
    return;
  }

  throw new Error("Invalid credentials");
}
