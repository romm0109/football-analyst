import { strict as assert } from "node:assert";
import test from "node:test";
import { AuthGate } from "../../web/src/features/auth/AuthGate";

test("unauthenticated user is redirected to login", () => {
  const view = AuthGate({
    state: { status: "unauthenticated", user: null },
    redirectTo: "/login",
    children: "Protected analysis app"
  });
  assert.equal(view, "Redirect:/login");
});

test("authenticated user can access protected app and logout blocks access", () => {
  const beforeLogout = AuthGate({
    state: { status: "authenticated", user: { id: "u1", email: "user@mail.com", name: "User" } },
    redirectTo: "/login",
    children: "Protected analysis app"
  });
  assert.equal(beforeLogout, "Protected analysis app");

  const afterLogout = AuthGate({
    state: { status: "unauthenticated", user: null },
    redirectTo: "/login",
    children: "Protected analysis app"
  });
  assert.equal(afterLogout, "Redirect:/login");
});
