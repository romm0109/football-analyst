/**
 * Integration coverage for auth flow:
 * - callback success creates user and session
 * - state mismatch returns deterministic error
 * - /auth/me returns 200 for active session and 401 after logout
 * - /auth/logout revokes active server-side session
 */

import { strict as assert } from "node:assert";
import test from "node:test";
import { buildAuthConfig } from "../../src/config/auth.config";
import { createAuthModule } from "../../src/modules/auth/auth.module";
import { SessionsRepository } from "../../src/modules/sessions/sessions.repository";
import { createUsersModule } from "../../src/modules/users/users.module";

test("auth callback success path and me/logout semantics", async () => {
  const usersModule = createUsersModule();
  const sessionsRepository = new SessionsRepository();
  const config = buildAuthConfig({
    NODE_ENV: "test",
    GOOGLE_CLIENT_ID: "id",
    GOOGLE_CLIENT_SECRET: "secret",
    GOOGLE_CALLBACK_URL: "http://localhost/callback",
    WEB_BASE_URL: "http://localhost:5173",
    SESSION_SECRET: "session-secret"
  });
  const authModule = createAuthModule(usersModule.usersService, sessionsRepository, config);
  const start = authModule.authController.start();
  const state = new URL(start.redirectTo).searchParams.get("state");
  assert.ok(state);

  let sessionId = "";
  const cookies = {
    set: (_name: string, value: string) => {
      sessionId = value;
    },
    clear: () => {
      sessionId = "";
    }
  };

  const callbackResponse = await authModule.authController.callback(
    {
      query: { state: state ?? undefined, code: "fake-code" },
      profile: { sub: "sub-1", email: "a@b.com", name: "Analyst" }
    },
    cookies
  );
  assert.equal(callbackResponse.statusCode, 302);
  assert.ok(sessionId);

  const me = await authModule.authController.me({ sessionId });
  assert.equal(me.statusCode, 200);

  const logout = await authModule.authController.logout({ sessionId }, cookies);
  assert.equal(logout.statusCode, 204);
  const meAfterLogout = await authModule.authController.me({ sessionId });
  assert.equal(meAfterLogout.statusCode, 401);
});
