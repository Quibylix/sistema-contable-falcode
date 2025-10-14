export async function checkAuthTransaction() {
  try {
    const s = JSON.parse(localStorage.getItem("session") ?? "{}");
    return s?.token === "tok_demo" && s?.user === "admin";
  } catch {
    throw new Error("No session found");
  }
}
