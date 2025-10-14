export async function checkAuthTransaction() {
  const s = JSON.parse(localStorage.getItem("session") ?? "");
  if (s.token !== "tok_demo" || s.user !== "admin") {
    throw new Error("Invalid session");
  }

  return;
}
