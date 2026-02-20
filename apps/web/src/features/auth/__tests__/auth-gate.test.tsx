import { strict as assert } from "node:assert";
import test from "node:test";
import { AuthGate } from "../AuthGate";

test("AuthGate redirects unauthenticated state", () => {
  const output = AuthGate({
    state: { status: "unauthenticated", user: null },
    redirectTo: "/login",
    children: "Protected page"
  });
  assert.equal(output, "Redirect:/login");
});

test("AuthGate renders children when authenticated", () => {
  const output = AuthGate({
    state: { status: "authenticated", user: { id: "u1", email: "a@b.com", name: "A" } },
    redirectTo: "/login",
    children: "Protected page"
  });
  assert.equal(output, "Protected page");
});
